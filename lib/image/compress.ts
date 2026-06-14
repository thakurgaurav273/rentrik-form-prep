import type { CompressOptions } from "@/types/tools";
import { loadImageFromFile, drawImageOnCanvas, canvasToBlob } from "./canvas";

export async function compressImage(file: File, opts: CompressOptions): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const format = opts.format ?? "jpeg";
  const quality = opts.quality ?? 0.75;

  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (opts.maxDimension && (w > opts.maxDimension || h > opts.maxDimension)) {
    const ratio = Math.min(opts.maxDimension / w, opts.maxDimension / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  const background = format === "jpeg" ? "#FFFFFF" : undefined;
  const canvas = drawImageOnCanvas(img, w, h, background);
  return canvasToBlob(canvas, format, quality);
}
