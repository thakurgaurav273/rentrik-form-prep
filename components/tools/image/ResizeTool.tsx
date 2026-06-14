"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resizeImage } from "@/lib/image/resize";
import { validateImageFile, validateDimension } from "@/utils/validate";
import { outputFilename } from "@/utils/format";
import type { OutputFormat, ProcessingResult } from "@/types/tools";

export function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setResult(null);
    setError(null);

    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }, []);

  const onWidthChange = (val: string) => {
    setWidth(val);
    if (lockAspect && imgDims && val) {
      const r = imgDims.h / imgDims.w;
      setHeight(String(Math.round(Number(val) * r)));
    }
  };

  const onHeightChange = (val: string) => {
    setHeight(val);
    if (lockAspect && imgDims && val) {
      const r = imgDims.w / imgDims.h;
      setWidth(String(Math.round(Number(val) * r)));
    }
  };

  const process = async () => {
    if (!file) return;
    const wNum = parseInt(width, 10);
    const hNum = parseInt(height, 10);
    const wErr = validateDimension(wNum, "Width");
    if (wErr) { setError(wErr); return; }
    const hErr = validateDimension(hNum, "Height");
    if (hErr) { setError(hErr); return; }

    setLoading(true);
    setError(null);
    try {
      const blob = await resizeImage(file, { width: wNum, height: hNum, format, quality: 0.9 });
      setResult({
        blob,
        filename: outputFilename(file.name, "resized", format === "jpeg" ? "jpg" : format),
        originalSize: file.size,
        resultSize: blob.size,
        width: wNum,
        height: hNum,
        format,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); setImgDims(null); };

  return (
    <div className="space-y-5">
      <PrivacyNote />

      {!file ? (
        <Dropzone
          accept="image/jpeg,image/png,image/webp"
          onFiles={onFile}
          label="Drop your image here, or tap to select"
          hint="Supports JPG, PNG, WEBP - up to 25 MB"
        />
      ) : (
        <FilePreview file={file} onRemove={reset} />
      )}

      {file && !result && (
        <div className="space-y-4">
          {imgDims && (
            <p className="text-xs text-muted-foreground">
              Original: {imgDims.w} × {imgDims.h} px
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="resize-width">Width (px)</Label>
              <Input
                id="resize-width"
                type="number"
                inputMode="numeric"
                min={1}
                max={10000}
                value={width}
                onChange={(e) => onWidthChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="resize-height">Height (px)</Label>
              <Input
                id="resize-height"
                type="number"
                inputMode="numeric"
                min={1}
                max={10000}
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="lock-aspect"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor="lock-aspect" className="cursor-pointer">Lock aspect ratio</Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="resize-format">Output format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
              <SelectTrigger id="resize-format" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ProcessButton onClick={process} loading={loading} label="Resize Image" />
        </div>
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
