import type { CropOptions } from "@/types/tools";
import { loadImageFromFile, cropImageOnCanvas, canvasToBlob } from "./canvas";

export async function cropImage(file: File, opts: CropOptions): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const format = opts.format ?? "jpeg";
  const quality = opts.quality ?? 0.9;

  const { x, y, width, height } = opts.cropArea;

  const sx = Math.max(0, Math.min(x, img.naturalWidth));
  const sy = Math.max(0, Math.min(y, img.naturalHeight));
  const sw = Math.max(1, Math.min(width, img.naturalWidth - sx));
  const sh = Math.max(1, Math.min(height, img.naturalHeight - sy));

  const canvas = cropImageOnCanvas(img, sx, sy, sw, sh, sw, sh);
  return canvasToBlob(canvas, format, quality);
}

export function computePixelCrop(
  naturalWidth: number,
  naturalHeight: number,
  percentCrop: { x: number; y: number; width: number; height: number }
): { x: number; y: number; width: number; height: number } {
  return {
    x: Math.round((percentCrop.x / 100) * naturalWidth),
    y: Math.round((percentCrop.y / 100) * naturalHeight),
    width: Math.round((percentCrop.width / 100) * naturalWidth),
    height: Math.round((percentCrop.height / 100) * naturalHeight),
  };
}
