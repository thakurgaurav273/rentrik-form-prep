import type { ConvertOptions } from "@/types/tools";
import { loadImageFromFile, drawImageOnCanvas, canvasToBlob } from "./canvas";

export async function convertImage(file: File, opts: ConvertOptions): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const format = opts.targetFormat;
  const quality = opts.quality ?? 0.9;

  const background =
    format === "jpeg"
      ? opts.background ?? "#FFFFFF"
      : undefined;

  const canvas = drawImageOnCanvas(img, img.naturalWidth, img.naturalHeight, background);
  return canvasToBlob(canvas, format, quality);
}
