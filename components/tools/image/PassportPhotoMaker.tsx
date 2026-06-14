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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { makePassportPhoto } from "@/lib/image/passport";
import { validateImageFile } from "@/utils/validate";
import { outputFilename } from "@/utils/format";
import { PASSPORT_PRESETS } from "@/utils/constants";
import type { ProcessingResult } from "@/types/tools";
import type { Area } from "react-easy-crop";

const EasyCrop = dynamic(() => import("react-easy-crop").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />,
});

export function PassportPhotoMaker() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [presetIdx, setPresetIdx] = useState(0);
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [background, setBackground] = useState<"white" | "blue" | "keep">("white");
  const [targetKB, setTargetKB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const selectedPreset = PASSPORT_PRESETS[presetIdx];
  const isCustom = presetIdx === PASSPORT_PRESETS.length;

  const widthPx = isCustom ? parseInt(customW, 10) || 200 : (selectedPreset?.widthPx ?? 200);
  const heightPx = isCustom ? parseInt(customH, 10) || 230 : (selectedPreset?.heightPx ?? 230);
  const aspect = widthPx / heightPx;

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
      const blob = await makePassportPhoto(file, {
        widthPx,
        heightPx,
        background,
        cropArea: croppedAreaPixels ?? undefined,
        targetKB: !isNaN(kb) && kb > 0 ? kb : undefined,
      });
      setResult({
        blob,
        filename: outputFilename(file.name, `passport-${widthPx}x${heightPx}`, "jpg"),
        originalSize: file.size,
        resultSize: blob.size,
        width: widthPx,
        height: heightPx,
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
          label="Drop your photo here, or tap to select"
          hint="Use a clear photo with a plain background"
        />
      ) : result ? null : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="passport-preset">Size preset</Label>
            <Select
              value={String(presetIdx)}
              onValueChange={(v) => setPresetIdx(Number(v))}
            >
              <SelectTrigger id="passport-preset">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PASSPORT_PRESETS.map((p, i) => (
                  <SelectItem key={i} value={String(i)}>{p.label}</SelectItem>
                ))}
                <SelectItem value={String(PASSPORT_PRESETS.length)}>Custom size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pp-w">Width (px)</Label>
                <Input id="pp-w" type="number" inputMode="numeric" value={customW} onChange={(e) => setCustomW(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pp-h">Height (px)</Label>
                <Input id="pp-h" type="number" inputMode="numeric" value={customH} onChange={(e) => setCustomH(e.target.value)} />
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="relative h-72 rounded-lg overflow-hidden bg-muted">
              <EasyCrop
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                rotation={0}
                aspect={aspect}
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
              <Label htmlFor="pp-bg">Background</Label>
              <Select value={background} onValueChange={(v) => setBackground(v as "white" | "blue" | "keep")}>
                <SelectTrigger id="pp-bg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White background</SelectItem>
                  <SelectItem value="blue">Blue background</SelectItem>
                  <SelectItem value="keep">Keep original</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pp-kb">Target size (KB, optional)</Label>
              <Input id="pp-kb" type="number" inputMode="numeric" placeholder="e.g. 50" value={targetKB} onChange={(e) => setTargetKB(e.target.value)} />
            </div>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="flex gap-3">
            <ProcessButton onClick={process} loading={loading} label="Make Passport Photo" />
            <button type="button" onClick={reset} className="text-sm text-muted-foreground hover:underline underline-offset-4">Change file</button>
          </div>
        </>
      )}

      {result && (
        <div className="space-y-4">
          <ResultStats originalSize={result.originalSize} resultSize={result.resultSize} width={result.width} height={result.height} />
          <DownloadButton blob={result.blob} filename={result.filename} onReset={reset} />
        </div>
      )}
    </div>
  );
}
