import type { ResizeOptions } from "@/types/tools";
import { loadImageFromFile, drawImageOnCanvas, canvasToBlob } from "./canvas";

export async function resizeImage(file: File, opts: ResizeOptions): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const format = opts.format ?? "jpeg";
  const quality = opts.quality ?? 0.9;

  let targetW = opts.width ?? img.naturalWidth;
  let targetH = opts.height ?? img.naturalHeight;

  if (opts.lockAspect) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (opts.width && !opts.height) {
      targetH = Math.round(opts.width / ratio);
    } else if (opts.height && !opts.width) {
      targetW = Math.round(opts.height * ratio);
    }
  }

  targetW = Math.max(1, Math.min(10000, targetW));
  targetH = Math.max(1, Math.min(10000, targetH));

  const background = format === "jpeg" ? "#FFFFFF" : undefined;
  const canvas = drawImageOnCanvas(img, targetW, targetH, background);
  return canvasToBlob(canvas, format, quality);
}
