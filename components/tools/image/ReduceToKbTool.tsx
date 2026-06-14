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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { reduceImageToKB } from "@/lib/image/reduce-to-kb";
import { validateImageFile, validateTargetKB } from "@/utils/validate";
import { outputFilename, bytesToKB } from "@/utils/format";
import { REDUCE_TO_KB_PRESETS } from "@/utils/constants";
import type { ProcessingResult } from "@/types/tools";

export function ReduceToKbTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState("50");
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
    const kb = parseFloat(targetKB);
    const err = validateTargetKB(kb);
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    try {
      const blob = await reduceImageToKB(file, { targetKB: kb, format: "jpeg" });
      const actualKB = bytesToKB(blob.size);
      if (actualKB > kb + 0.5) {
        setError(
          `Could not reach ${kb} KB (result: ${actualKB.toFixed(1)} KB). Try a larger target or a different image.`
        );
      }
      setResult({
        blob,
        filename: outputFilename(file.name, `${kb}kb`, "jpg"),
        originalSize: file.size,
        resultSize: blob.size,
        format: "JPEG",
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
          label="Drop your photo here, or tap to select"
          hint="Supports JPG, PNG, WEBP - up to 25 MB"
        />
      ) : (
        <FilePreview file={file} onRemove={reset} />
      )}

      {file && !result && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-kb">Target size (KB)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {REDUCE_TO_KB_PRESETS.map((kb) => (
                <Button
                  key={kb}
                  type="button"
                  variant={targetKB === String(kb) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTargetKB(String(kb))}
                  className="min-w-[52px]"
                >
                  {kb} KB
                </Button>
              ))}
            </div>
            <Input
              id="target-kb"
              type="number"
              inputMode="decimal"
              min={1}
              max={10240}
              value={targetKB}
              onChange={(e) => setTargetKB(e.target.value)}
              className="w-36"
              aria-describedby="target-kb-hint"
            />
            <p id="target-kb-hint" className="text-xs text-muted-foreground">
              Output will be ≤ this size. Most exam portals need 20–50 KB.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ProcessButton onClick={process} loading={loading} label="Reduce to KB" loadingLabel="Reducing…" />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <ResultStats
            originalSize={result.originalSize}
            resultSize={result.resultSize}
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DownloadButton blob={result.blob} filename={result.filename} onReset={reset} />
        </div>
      )}
    </div>
  );
}
