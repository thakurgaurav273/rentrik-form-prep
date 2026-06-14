import type { SignatureOptions } from "@/types/tools";
import { loadImageFromFile, canvasToBlob } from "./canvas";
import { reduceImageToKB } from "./reduce-to-kb";

function cleanSignatureBackground(
  canvas: HTMLCanvasElement,
  threshold: number,
  background: "white" | "transparent"
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const limit = 255 * threshold;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    if (luminance > limit) {
      if (background === "transparent") {
        data[i + 3] = 0;
      } else {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export async function processSignature(file: File, opts: SignatureOptions): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const threshold = opts.threshold ?? 0.85;

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

  const targetW = opts.width ?? sw;
  const targetH = opts.height ?? sh;

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable.");

  if (opts.background === "white") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);

  cleanSignatureBackground(canvas, threshold, opts.background);

  const format = opts.background === "transparent" ? "png" : "jpeg";
  const blob = await canvasToBlob(canvas, format, 0.9);

  if (opts.targetKB) {
    const signatureBlob = new File([blob], file.name, { type: blob.type });
    return reduceImageToKB(signatureBlob, { targetKB: opts.targetKB, format });
  }

  return blob;
}
