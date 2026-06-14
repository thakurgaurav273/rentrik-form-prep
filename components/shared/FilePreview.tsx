"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { formatSize } from "@/utils/format";

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={file.name}
          className="h-12 w-12 rounded-md object-cover shrink-0"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted shrink-0">
          <FileText className="h-6 w-6 text-muted-foreground" aria-hidden />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
