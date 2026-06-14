"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cropImage } from "@/lib/image/crop";
import { validateImageFile } from "@/utils/validate";
import { outputFilename } from "@/utils/format";
import { CROP_ASPECT_PRESETS } from "@/utils/constants";
import type { OutputFormat, ProcessingResult } from "@/types/tools";
import type { Area } from "react-easy-crop";

const EasyCrop = dynamic(() => import("react-easy-crop").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />,
});

export function CropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
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
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, [previewUrl]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const process = async () => {
    if (!file || !croppedAreaPixels) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await cropImage(file, {
        cropArea: {
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        },
        format,
        quality: 0.9,
      });
      setResult({
        blob,
        filename: outputFilename(file.name, "cropped", format === "jpeg" ? "jpg" : format),
        originalSize: file.size,
        resultSize: blob.size,
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
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
          label="Drop your image here, or tap to select"
          hint="Supports JPG, PNG, WEBP"
        />
      ) : result ? null : (
        <>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="space-y-1">
              <Label htmlFor="aspect-select">Aspect ratio</Label>
              <Select
                value={aspect === undefined ? "free" : String(aspect)}
                onValueChange={(v) => setAspect(v === "free" ? undefined : Number(v))}
              >
                <SelectTrigger id="aspect-select" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROP_ASPECT_PRESETS.map((p) => (
                    <SelectItem key={p.label} value={p.value === null ? "free" : String(p.value)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="crop-format">Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
                <SelectTrigger id="crop-format" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {previewUrl && (
            <div className="relative h-72 rounded-lg overflow-hidden bg-muted">
              <EasyCrop
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                rotation={0}
                aspect={aspect ?? 1}
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <ProcessButton onClick={process} loading={loading} label="Crop Image" />
            <button
              type="button"
              onClick={reset}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Change file
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="space-y-4">
          <ResultStats
            originalSize={result.originalSize}
            resultSize={result.resultSize}
            width={result.width}
            height={result.height}
          />
          <DownloadButton blob={result.blob} filename={result.filename} onReset={reset} />
        </div>
      )}
    </div>
  );
}
