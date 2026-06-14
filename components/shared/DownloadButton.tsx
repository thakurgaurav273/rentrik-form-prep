"use client";

import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/lib/files/download";

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  onReset?: () => void;
}

export function DownloadButton({ blob, filename, onReset }: DownloadButtonProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <Button
        type="button"
        size="lg"
        onClick={() => downloadBlob(blob, filename)}
        className="font-semibold gap-2 flex-1 sm:flex-none"
      >
        <Download className="h-4 w-4" aria-hidden />
        Download
      </Button>
      {onReset && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          className="gap-2 flex-1 sm:flex-none"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Process another file
        </Button>
      )}
    </div>
  );
}
