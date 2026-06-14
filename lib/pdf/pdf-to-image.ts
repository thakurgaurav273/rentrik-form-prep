import type { PdfToImageOptions } from "@/types/tools";
import { initialisePdfjsWorker } from "./pdf-utils";

export async function pdfToImages(
  file: File,
  opts: PdfToImageOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob[]> {
  const pdfjsLib = await initialisePdfjsWorker();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const numPages = pdfDoc.numPages;
  let pageIndices: number[];

  if (opts.pages === "all") {
    pageIndices = Array.from({ length: numPages }, (_, i) => i + 1);
  } else {
    pageIndices = parsePageSelection(opts.pages, numPages);
  }

  const blobs: Blob[] = [];

  for (let i = 0; i < pageIndices.length; i++) {
    const pageNum = pageIndices[i];
    if (pageNum === undefined) continue;

    onProgress?.(i + 1, pageIndices.length);

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: opts.scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");

    if (opts.format === "jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode page."))),
        opts.format === "jpeg" ? "image/jpeg" : "image/png",
        0.9
      );
    });

    blobs.push(blob);
  }

  return blobs;
}

function parsePageSelection(selection: string, numPages: number): number[] {
  const pages: number[] = [];
  const parts = selection.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr ?? "1", 10);
      const end = parseInt(endStr ?? String(numPages), 10);
      for (let i = start; i <= Math.min(end, numPages); i++) pages.push(i);
    } else {
      const p = parseInt(part, 10);
      if (p >= 1 && p <= numPages) pages.push(p);
    }
  }

  return pages.filter((p, i, arr) => arr.indexOf(p) === i);
}
