"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { splitPdf } from "@/lib/pdf/split";
import { validatePdfFile } from "@/utils/validate";
import { downloadBlob } from "@/lib/files/download";
import { RotateCcw } from "lucide-react";

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validatePdfFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setError(null);
    setDone(false);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setPageCount(null);
    }
  }, []);

  const process = async () => {
    if (!file) return;
    if (!ranges.trim()) { setError("Enter page ranges (e.g. 1-3, 5) or 'all' to split each page."); return; }
    setLoading(true);
    setError(null);
    try {
      const blobs = await splitPdf(file, ranges.trim());
      if (blobs.length === 1 && blobs[0]) {
        downloadBlob(blobs[0], `split-page.pdf`);
      } else {
        for (let i = 0; i < blobs.length; i++) {
          const blob = blobs[i];
          if (blob) downloadBlob(blob, `split-part-${i + 1}.pdf`);
        }
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Split failed. Please check the page ranges.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setRanges(""); setPageCount(null); setDone(false); setError(null); };

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

      {file && !done && (
        <div className="space-y-4">
          {pageCount && (
            <p className="text-sm text-muted-foreground">
              This PDF has <strong>{pageCount}</strong> pages.
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="page-ranges">Page ranges</Label>
            <Input
              id="page-ranges"
              placeholder={pageCount ? `e.g. 1-3, 5 (total ${pageCount} pages)` : "e.g. 1-3, 5 or all"}
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              aria-describedby="range-hint"
            />
            <p id="range-hint" className="text-xs text-muted-foreground">
              Separate ranges with commas. Type <code className="font-mono">all</code> to save each page as a separate file.
            </p>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <ProcessButton onClick={process} loading={loading} label="Split PDF" />
        </div>
      )}

      {done && (
        <div className="space-y-3">
          <div className="rounded-lg border bg-accent/5 border-accent/20 p-4">
            <p className="text-sm font-semibold text-accent">PDFs downloaded successfully!</p>
            <p className="text-xs text-muted-foreground mt-1">Check your downloads folder.</p>
          </div>
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Split another PDF
          </Button>
        </div>
      )}
    </div>
  );
}
