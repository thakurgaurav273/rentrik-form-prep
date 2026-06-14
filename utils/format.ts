export function bytesToKB(bytes: number): number {
  return bytes / 1024;
}

export function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} px`;
}

export type SizeDirection = "smaller" | "larger" | "same";

export function sizeDirection(from: number, to: number): SizeDirection {
  if (from === 0 || to === from) return "same";
  return to < from ? "smaller" : "larger";
}

export function formatPercent(from: number, to: number): string {
  if (from === 0) return "-";
  const pct = Math.abs(Math.round(((from - to) / from) * 100));
  if (pct === 0) return "Same size";
  return to < from ? `${pct}% smaller` : `${pct}% larger`;
}

export function formatFormat(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "application/pdf": "PDF",
  };
  return map[mimeType] ?? mimeType;
}

export function outputFilename(originalName: string, suffix: string, ext: string): string {
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}-${suffix}.${ext}`;
}
