"use client";

import { useState, useCallback, useEffect } from "react";
import { Dropzone } from "@/components/shared/Dropzone";
import { FilePreview } from "@/components/shared/FilePreview";
import { ProcessButton } from "@/components/shared/ProcessButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { changeBackground } from "@/lib/image/background";
import { validateImageFile } from "@/utils/validate";
import { outputFilename, formatSize } from "@/utils/format";

const PRESET_COLORS = [
  { label: "White", color: "#FFFFFF" },
  { label: "Blue", color: "#4169E1" },
  { label: "Light Blue", color: "#87CEEB" },
  { label: "Red", color: "#FF0000" },
];

export function BackgroundColorChanger() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState("");
  const [color, setColor] = useState("#FFFFFF");
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
  }, [previewUrl]);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      const blob = await changeBackground(file, { color, format: "jpeg" }, setStatus);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultBlob(blob);
      setResultFilename(outputFilename(file.name, "bg-changed", "jpg"));
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
          hint="Works with any photo - person, product, or object"
        />
      ) : (
        <FilePreview file={file} onRemove={reset} />
      )}

      {file && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>New background color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(({ label, color: c }) => (
                <Button
                  key={c}
                  type="button"
                  variant={color === c ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColor(c)}
                  className="gap-2"
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: c }}
                    aria-hidden
                  />
                  {label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Label htmlFor="color-input" className="shrink-0">Custom</Label>
              <input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-12 rounded border border-border cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-28 font-mono text-sm"
                aria-label="Hex color value"
              />
            </div>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          {status && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded-full bg-primary animate-pulse shrink-0" />
              {status}
            </div>
          )}

          <ProcessButton onClick={process} loading={loading} label="Remove & Replace Background" />

          <p className="text-xs text-muted-foreground">
            AI runs entirely in your browser - first run downloads the model (~25 MB, one-time) and may take 20–30 s.
            After that it&apos;s cached and reruns are fast.
          </p>
        </div>
      )}

      {/* Before / After preview */}
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
                alt="Result with new background"
                className="w-full rounded-lg border object-contain max-h-64"
              />
              {resultBlob && (
                <p className="text-xs text-center text-muted-foreground">{formatSize(resultBlob.size)}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Not satisfied? Pick a different color and click the button again - the model stays loaded.
          </p>
        </div>
      )}

      {resultBlob && resultFilename && (
        <DownloadButton blob={resultBlob} filename={resultFilename} onReset={reset} />
      )}
    </div>
  );
}
