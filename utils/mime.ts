import type { OutputFormat } from "@/types/tools";

export function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
  };
  return map[mime] ?? "bin";
}

export function formatToMime(format: OutputFormat): string {
  const map: Record<OutputFormat, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  return map[format];
}

export function extToMime(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export function isPdfMime(mime: string): boolean {
  return mime === "application/pdf";
}
