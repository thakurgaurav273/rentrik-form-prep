"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { pdfToImages } from "@/lib/pdf/pdf-to-image";
import { validatePdfFile } from "@/utils/validate";
import { downloadBlob } from "@/lib/files/download";
import { RotateCcw } from "lucide-react";

export function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("all");
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validatePdfFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setError(null);
    setDone(false);
  }, []);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: 0 });
    try {
      const blobs = await pdfToImages(file, { pages, format, scale }, (current, total) => {
        setProgress({ current, total });
      });
      if (blobs.length === 1 && blobs[0]) {
        downloadBlob(blobs[0], `page-1.${format === "jpeg" ? "jpg" : "png"}`);
      } else {
        for (let i = 0; i < blobs.length; i++) {
          const blob = blobs[i];
          if (blob) downloadBlob(blob, `page-${i + 1}.${format === "jpeg" ? "jpg" : "png"}`);
        }
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed. The PDF may be encrypted.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setDone(false); setError(null); setProgress({ current: 0, total: 0 }); };

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pdf-pages">Pages</Label>
              <Input
                id="pdf-pages"
                placeholder="all or e.g. 1-3, 5"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="img-format">Output format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as "jpeg" | "png")}>
                <SelectTrigger id="img-format"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG (smaller)</SelectItem>
                  <SelectItem value="png">PNG (lossless)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Resolution (scale)</Label>
              <span className="text-sm tabular-nums text-muted-foreground">{scale}×</span>
            </div>
            <Slider
              min={0.5}
              max={3}
              step={0.5}
              value={[scale]}
              onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; if (v !== undefined) setScale(v); }}
              aria-label="Image resolution scale"
            />
            <p className="text-xs text-muted-foreground">Higher = sharper but larger files. 1.5× is good for most uses.</p>
          </div>

          {loading && progress.total > 0 && (
            <ProgressBar value={Math.round((progress.current / progress.total) * 100)} label={`Converting page ${progress.current} of ${progress.total}…`} />
          )}

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <ProcessButton onClick={process} loading={loading} label="Convert to Images" loadingLabel="Converting…" />
        </div>
      )}

      {done && (
        <div className="space-y-3">
          <div className="rounded-lg border bg-accent/5 border-accent/20 p-4">
            <p className="text-sm font-semibold text-accent">Images downloaded successfully!</p>
            <p className="text-xs text-muted-foreground mt-1">Check your downloads folder.</p>
          </div>
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Convert another PDF
          </Button>
        </div>
      )}
    </div>
  );
}
