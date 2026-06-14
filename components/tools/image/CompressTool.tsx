"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { compressImage } from "@/lib/image/compress";
import { validateImageFile } from "@/utils/validate";
import { outputFilename } from "@/utils/format";
import type { OutputFormat, ProcessingResult } from "@/types/tools";

export function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await compressImage(file, { quality: quality / 100, format });
      setResult({
        blob,
        filename: outputFilename(file.name, "compressed", format === "jpeg" ? "jpg" : format),
        originalSize: file.size,
        resultSize: blob.size,
        format,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); };

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
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality-slider">Quality</Label>
              <span className="text-sm font-semibold tabular-nums">{quality}%</span>
            </div>
            <Slider
              id="quality-slider"
              min={10}
              max={95}
              step={5}
              value={[quality]}
              onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; if (v !== undefined) setQuality(v); }}
              aria-label="Image quality"
            />
            <p className="text-xs text-muted-foreground">
              Lower quality = smaller file. 70–80% is a good balance for forms.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compress-format">Output format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
              <SelectTrigger id="compress-format" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG (smaller)</SelectItem>
                <SelectItem value="png">PNG (lossless)</SelectItem>
                <SelectItem value="webp">WEBP (best compression)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ProcessButton onClick={process} loading={loading} label="Compress Image" />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <ResultStats
            originalSize={result.originalSize}
            resultSize={result.resultSize}
          />
          <DownloadButton blob={result.blob} filename={result.filename} onReset={reset} />
        </div>
      )}
    </div>
  );
}
