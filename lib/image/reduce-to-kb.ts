import type { ReduceToKbOptions } from "@/types/tools";
import { loadImageFromFile, drawImageOnCanvas, canvasToBlob } from "./canvas";
import { BINARY_SEARCH_MAX_ITERATIONS } from "@/utils/constants";

export async function reduceImageToKB(file: File, opts: ReduceToKbOptions): Promise<Blob> {
  const targetBytes = opts.targetKB * 1024;
  const format = opts.format ?? "jpeg";
  const img = await loadImageFromFile(file);

  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (opts.maxDimension && (w > opts.maxDimension || h > opts.maxDimension)) {
    const ratio = Math.min(opts.maxDimension / w, opts.maxDimension / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  const background = format === "jpeg" ? "#FFFFFF" : undefined;
  const canvas = drawImageOnCanvas(img, w, h, background);

  if (file.size <= targetBytes) {
    return canvasToBlob(canvas, format, 0.95);
  }

  let lo = 0.01;
  let hi = 0.95;
  let best: Blob | null = null;

  for (let i = 0; i < BINARY_SEARCH_MAX_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, format, mid);
    if (blob.size <= targetBytes) {
      best = blob;
      lo = mid;
    } else {
      hi = mid;
    }
    if (hi - lo < 0.01) break;
  }

  if (best && best.size <= targetBytes) return best;

  // Quality alone couldn't reach target - try scaling down dimensions
  let scale = 0.9;
  for (let i = 0; i < 5; i++) {
    const sw = Math.max(1, Math.round(w * scale));
    const sh = Math.max(1, Math.round(h * scale));
    const scaledCanvas = drawImageOnCanvas(img, sw, sh, background);
    const blob = await canvasToBlob(scaledCanvas, format, 0.5);
    if (blob.size <= targetBytes) return blob;
    scale *= 0.8;
  }

  // Return best effort
  const lastAttempt = await canvasToBlob(canvas, format, 0.01);
  return lastAttempt;
}
