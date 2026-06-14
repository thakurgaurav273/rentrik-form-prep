"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ResultStats } from "@/components/shared/ResultStats";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { imagesToPdf } from "@/lib/pdf/image-to-pdf";
import { validateImageFile } from "@/utils/validate";
import type { ImageToPdfOptions, ProcessingResult } from "@/types/tools";

export function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<ImageToPdfOptions["pageSize"]>("A4");
  const [orientation, setOrientation] = useState<ImageToPdfOptions["orientation"]>("portrait");
  const [margin, setMargin] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const onFiles = useCallback((newFiles: File[]) => {
    const valid: File[] = [];
    for (const f of newFiles) {
      const err = validateImageFile(f);
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
    if (files.length === 0) { setError("Please add at least one image."); return; }
    setLoading(true);
    setError(null);
    try {
      const blob = await imagesToPdf(files, { pageSize, orientation, margin });
      setResult({
        blob,
        filename: "images.pdf",
        originalSize: files.reduce((s, f) => s + f.size, 0),
        resultSize: blob.size,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
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
            accept="image/jpeg,image/png,image/webp"
            multiple
            onFiles={onFiles}
            label="Drop images here, or tap to select"
            hint="JPG, PNG, WEBP - add multiple images to combine"
          />

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{files.length} image{files.length > 1 ? "s" : ""} added:</p>
              {files.map((f, i) => (
                <FilePreview key={i} file={f} onRemove={() => removeFile(i)} />
              ))}
            </div>
          )}
        </>
      )}

      {files.length > 0 && !result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="page-size">Page size</Label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as ImageToPdfOptions["pageSize"])}>
                <SelectTrigger id="page-size"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="fit">Fit to image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {pageSize !== "fit" && (
              <div className="space-y-1.5">
                <Label htmlFor="orientation">Orientation</Label>
                <Select value={orientation} onValueChange={(v) => setOrientation(v as ImageToPdfOptions["orientation"])}>
                  <SelectTrigger id="orientation"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {pageSize !== "fit" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Margin</Label>
                <span className="text-sm tabular-nums text-muted-foreground">{margin} pt</span>
              </div>
              <Slider min={0} max={60} step={5} value={[margin]} onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; if (v !== undefined) setMargin(v); }} aria-label="Page margin" />
            </div>
          )}

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <ProcessButton onClick={process} loading={loading} label={`Create PDF from ${files.length} image${files.length > 1 ? "s" : ""}`} />
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
