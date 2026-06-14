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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { convertImage } from "@/lib/image/convert";
import { validateImageFile } from "@/utils/validate";
import { outputFilename } from "@/utils/format";
import type { OutputFormat, ProcessingResult } from "@/types/tools";

interface ConvertToolProps {
  fromFormat: string;
  fromMime: string;
  toFormat: OutputFormat;
  toExt: string;
  showQuality?: boolean;
  showBackground?: boolean;
}

export function ConvertTool({ fromFormat, fromMime, toFormat, toExt, showQuality = true, showBackground = false }: ConvertToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState("#FFFFFF");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type !== fromMime) {
      setError(`Please select a ${fromFormat} file.`);
      return;
    }
    const err = validateImageFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setResult(null);
    setError(null);
  }, [fromMime, fromFormat]);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await convertImage(file, {
        targetFormat: toFormat,
        quality: quality / 100,
        background: showBackground ? background : undefined,
      });
      setResult({
        blob,
        filename: outputFilename(file.name, "converted", toExt),
        originalSize: file.size,
        resultSize: blob.size,
        format: toExt.toUpperCase(),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed. Please try again.");
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
          accept={fromMime}
          onFiles={onFile}
          label={`Drop your ${fromFormat} file here, or tap to select`}
          hint={`Only ${fromFormat} files are accepted`}
        />
      ) : (
        <FilePreview file={file} onRemove={reset} />
      )}

      {file && !result && (
        <div className="space-y-4">
          {showQuality && toFormat === "jpeg" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>JPEG quality</Label>
                <span className="text-sm tabular-nums text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                min={50}
                max={100}
                step={5}
                value={[quality]}
                onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; if (v !== undefined) setQuality(v); }}
                aria-label="JPEG quality"
              />
            </div>
          )}

          {showBackground && (
            <div className="space-y-1.5">
              <Label htmlFor="bg-color">Background color (for transparency)</Label>
              <div className="flex items-center gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-8 w-12 rounded border border-border cursor-pointer"
                />
                <span className="text-sm text-muted-foreground font-mono">{background}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Transparent areas will be filled with this color in the output.
              </p>
            </div>
          )}

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <ProcessButton onClick={process} loading={loading} label={`Convert to ${toExt.toUpperCase()}`} />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <ResultStats originalSize={result.originalSize} resultSize={result.resultSize} format={result.format} />
          <DownloadButton blob={result.blob} filename={result.filename} onReset={reset} />
        </div>
      )}
    </div>
  );
}
