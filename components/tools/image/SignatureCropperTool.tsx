"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Dropzone } from "@/components/shared/Dropzone";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processSignature } from "@/lib/image/signature";
import { validateImageFile } from "@/utils/validate";
import { outputFilename } from "@/utils/format";
import type { ProcessingResult } from "@/types/tools";
import type { Area } from "react-easy-crop";

const EasyCrop = dynamic(() => import("react-easy-crop").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />,
});

export function SignatureCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [background, setBackground] = useState<"white" | "transparent">("white");
  const [threshold, setThreshold] = useState(85);
  const [targetKB, setTargetKB] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) { setError(err); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, [previewUrl]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const kb = parseFloat(targetKB);
      const blob = await processSignature(file, {
        cropArea: croppedAreaPixels ?? undefined,
        background,
        threshold: threshold / 100,
        targetKB: isNaN(kb) || kb <= 0 ? undefined : kb,
      });
      setResult({
        blob,
        filename: outputFilename(file.name, "signature", background === "transparent" ? "png" : "jpg"),
        originalSize: file.size,
        resultSize: blob.size,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-5">
      <PrivacyNote />

      {!file ? (
        <Dropzone
          accept="image/jpeg,image/png,image/webp"
          onFiles={onFile}
          label="Drop your signature photo here, or tap to select"
          hint="Take a photo of your signature on white paper"
        />
      ) : result ? null : (
        <>
          {previewUrl && (
            <div className="relative h-64 rounded-lg overflow-hidden bg-muted">
              <EasyCrop
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                rotation={0}
                aspect={4 / 1}
                minZoom={1}
                maxZoom={3}
                cropShape="rect"
                zoomSpeed={1}
                keyboardStep={5}
                restrictPosition={true}
                style={{}}
                classes={{}}
                mediaProps={{}}
                cropperProps={{}}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sig-background">Background</Label>
              <Select value={background} onValueChange={(v) => setBackground(v as "white" | "transparent")}>
                <SelectTrigger id="sig-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White (JPG - most forms)</SelectItem>
                  <SelectItem value="transparent">Transparent (PNG)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target-kb-sig">Target size (KB, optional)</Label>
              <Input
                id="target-kb-sig"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 20"
                value={targetKB}
                onChange={(e) => setTargetKB(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Background removal sensitivity</Label>
              <span className="text-sm tabular-nums text-muted-foreground">{threshold}%</span>
            </div>
            <Slider
              min={50}
              max={99}
              step={1}
              value={[threshold]}
              onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; if (v !== undefined) setThreshold(v); }}
              aria-label="Background removal threshold"
            />
            <p className="text-xs text-muted-foreground">
              Higher = more background removed. Lower = keep more of the original.
            </p>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="flex gap-3">
            <ProcessButton onClick={process} loading={loading} label="Process Signature" />
            <button type="button" onClick={reset} className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Change file
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="space-y-4">
          <ResultStats originalSize={result.originalSize} resultSize={result.resultSize} />
          <DownloadButton blob={result.blob} filename={result.filename} onReset={reset} />
        </div>
      )}
    </div>
  );
}
