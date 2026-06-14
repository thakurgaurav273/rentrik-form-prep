import type { PassportOptions } from "@/types/tools";
import { loadImageFromFile, canvasToBlob } from "./canvas";
import { reduceImageToKB } from "./reduce-to-kb";

export async function makePassportPhoto(file: File, opts: PassportOptions): Promise<Blob> {
  const img = await loadImageFromFile(file);

  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (opts.cropArea) {
    sx = Math.max(0, opts.cropArea.x);
    sy = Math.max(0, opts.cropArea.y);
    sw = Math.min(opts.cropArea.width, img.naturalWidth - sx);
    sh = Math.min(opts.cropArea.height, img.naturalHeight - sy);
  }

  const canvas = document.createElement("canvas");
  canvas.width = opts.widthPx;
  canvas.height = opts.heightPx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable.");

  if (opts.background === "white") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, opts.widthPx, opts.heightPx);
  } else if (opts.background === "blue") {
    ctx.fillStyle = "#4169E1";
    ctx.fillRect(0, 0, opts.widthPx, opts.heightPx);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, opts.widthPx, opts.heightPx);

  const quality = opts.quality ?? 0.9;
  const blob = await canvasToBlob(canvas, "jpeg", quality);

  if (opts.targetKB) {
    const passportBlob = new File([blob], file.name, { type: "image/jpeg" });
    return reduceImageToKB(passportBlob, { targetKB: opts.targetKB, format: "jpeg" });
  }

  return blob;
}
