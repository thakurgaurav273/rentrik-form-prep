"use client";

import { useState, useCallback, useEffect } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { removeImageBackground, preloadBgRemoval } from "@/lib/image/remove-background";
import { validateImageFile } from "@/utils/validate";
import { outputFilename, formatSize } from "@/utils/format";

export function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const err = validateImageFile(f);
    if (err) { setError(err); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResultUrl(null);
    setResultBlob(null);
    setStatus(null);
    setError(null);
    // Start warming up the ONNX model as soon as the user drops a file,
    // so it's ready (or already downloading) by the time they click Process.
    preloadBgRemoval();
  }, [previewUrl]);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      const blob = await removeImageBackground(file, setStatus);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultBlob(blob);
      setResultFilename(outputFilename(file.name, "no-bg", "png"));
      setStatus(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setStatus(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  return (
    <div className="space-y-5">
      <PrivacyNote />

      {!file ? (
        <Dropzone
          accept="image/jpeg,image/png,image/webp"
          onFiles={onFile}
          label="Drop your photo here, or tap to select"
          hint="Best results with clear subject on any background"
        />
      ) : (
        <FilePreview file={file} onRemove={reset} />
      )}

      {file && (
        <div className="space-y-5">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          {status && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded-full bg-primary animate-pulse shrink-0" />
              {status}
            </div>
          )}

          <ProcessButton onClick={process} loading={loading} label="Remove Background" />

          <p className="text-xs text-muted-foreground">
            AI runs entirely in your browser. First image downloads the model (~25 MB, one-time) and takes 20–30 s.
            The model stays loaded — additional images process in a few seconds.
          </p>
        </div>
      )}

      {previewUrl && resultUrl && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Result preview</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground text-center">Before</p>
              <img
                src={previewUrl}
                alt="Original"
                className="w-full rounded-lg border object-contain max-h-64"
              />
              {file && (
                <p className="text-xs text-center text-muted-foreground">{formatSize(file.size)}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground text-center">After</p>
              <img
                src={resultUrl}
                alt="Result with background removed"
                className="w-full rounded-lg border object-contain max-h-64"
                style={{ backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 0 0 / 16px 16px" }}
              />
              {resultBlob && (
                <p className="text-xs text-center text-muted-foreground">{formatSize(resultBlob.size)}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Checkerboard pattern shows transparency. Use <strong>Change Background</strong> to add a color behind it.
          </p>
        </div>
      )}

      {resultBlob && resultFilename && (
        <DownloadButton blob={resultBlob} filename={resultFilename} onReset={reset} />
      )}
    </div>
  );
}
