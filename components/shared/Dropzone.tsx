"use client";

import { useRef, useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
  label?: string;
  disabled?: boolean;
}

export function Dropzone({
  accept,
  multiple = false,
  onFiles,
  hint,
  label = "Drop your file here, or tap to select",
  disabled = false,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      onFiles(multiple ? files : [files[0] as File]);
    },
    [multiple, onFiles]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const isImageAccept = accept.includes("image/");

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={[
        "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4",
        "rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        dragging
          ? "border-primary bg-primary/8 scale-[1.01]"
          : "border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-muted/60",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {/* Icon */}
      <div className={[
        "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
        dragging ? "bg-primary/15" : "bg-primary/8",
      ].join(" ")}>
        <UploadCloud
          className={["h-8 w-8 transition-colors", dragging ? "text-primary" : "text-primary/70"].join(" ")}
          aria-hidden
        />
      </div>

      {/* Text */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground sm:text-base">{label}</p>
        {hint && (
          <p className="text-xs text-muted-foreground sm:text-sm">{hint}</p>
        )}
        {isImageAccept && !hint && (
          <p className="text-xs text-muted-foreground">JPG, PNG or WEBP</p>
        )}
      </div>

      {/* Tap / browse nudge */}
      <span className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
        {multiple ? "Browse files" : "Browse file"}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        capture={isImageAccept ? "environment" : undefined}
        className="sr-only"
        aria-hidden
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
