"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mergePdfs } from "@/lib/pdf/merge";
import { validatePdfFile } from "@/utils/validate";
import type { ProcessingResult } from "@/types/tools";
import { GripVertical } from "lucide-react";

export function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const onFiles = useCallback((newFiles: File[]) => {
    const valid: File[] = [];
    for (const f of newFiles) {
      const err = validatePdfFile(f);
      if (err) { setError(err); continue; }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid]);
    setError(null);
    setResult(null);
  }, []);

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const process = async () => {
    if (files.length < 2) { setError("Please add at least 2 PDF files to merge."); return; }
    setLoading(true);
    setError(null);
    try {
      const blob = await mergePdfs(files);
      setResult({
        blob,
        filename: "merged.pdf",
        originalSize: files.reduce((s, f) => s + f.size, 0),
        resultSize: blob.size,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Merge failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFiles([]); setResult(null); setError(null); };

  return (
    <div className="space-y-5">
      <PrivacyNote />

      {!result && (
        <>
          <Dropzone
            accept="application/pdf"
            multiple
            onFiles={onFiles}
            label="Drop PDF files here, or tap to select"
            hint="Select multiple PDFs to merge"
          />

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Files to merge (in order):</p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                  <div className="flex-1">
                    <FilePreview file={f} onRemove={() => removeFile(i)} />
                  </div>
                </div>
              ))}

              <Dropzone
                accept="application/pdf"
                multiple
                onFiles={onFiles}
                label="Add more PDFs"
                hint=""
              />
            </div>
          )}
        </>
      )}

      {files.length > 0 && !result && (
        <div className="space-y-3">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <ProcessButton onClick={process} loading={loading} label={`Merge ${files.length} PDFs`} disabled={files.length < 2} />
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
