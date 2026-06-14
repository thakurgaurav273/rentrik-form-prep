"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { compressPdf } from "@/lib/pdf/compress";
import { validatePdfFile } from "@/utils/validate";
import type { PdfCompressOptions, ProcessingResult } from "@/types/tools";

export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<PdfCompressOptions["level"]>("medium");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validatePdfFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const blob = await compressPdf(file, { level }, (current, total) => {
        setPageCount(total);
        setProgress(Math.round((current / total) * 100));
      });
      setResult({
        blob,
        filename: "compressed.pdf",
        originalSize: file.size,
        resultSize: blob.size,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed. The PDF may be encrypted or corrupt.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); setProgress(0); };

  return (
    <div className="space-y-5">
      <PrivacyNote />

      {!file ? (
        <Dropzone
          accept="application/pdf"
          onFiles={onFile}
          label="Drop your PDF here, or tap to select"
          hint="PDF up to 50 MB"
        />
      ) : (
        <FilePreview file={file} onRemove={reset} />
      )}

      {file && !result && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="compress-level">Compression level</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as PdfCompressOptions["level"])}>
              <SelectTrigger id="compress-level" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (best quality)</SelectItem>
                <SelectItem value="medium">Medium (recommended)</SelectItem>
                <SelectItem value="high">High (smallest size)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <ProgressBar
              value={progress}
              label={`Compressing page ${Math.ceil((progress / 100) * pageCount)} of ${pageCount}…`}
            />
          )}

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <ProcessButton onClick={process} loading={loading} label="Compress PDF" loadingLabel="Compressing…" />
        </div>
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
