import type { PdfCompressOptions } from "@/types/tools";
import { initialisePdfjsWorker } from "./pdf-utils";

const QUALITY_MAP = { low: 0.8, medium: 0.5, high: 0.25 } as const;
const SCALE_MAP = { low: 1.0, medium: 0.8, high: 0.6 } as const;

export async function compressPdf(
  file: File,
  opts: PdfCompressOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const [{ PDFDocument, rgb }, pdfjsLib] = await Promise.all([
    import("pdf-lib"),
    initialisePdfjsWorker(),
  ]);

  const quality = QUALITY_MAP[opts.level];
  const scale = SCALE_MAP[opts.level];

  const arrayBuffer = await file.arrayBuffer();

  // Load with pdfjs for rendering
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
  const pdfJsDoc = await loadingTask.promise;
  const numPages = pdfJsDoc.numPages;

  // Create output PDF
  const outDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(i, numPages);

    const page = await pdfJsDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

    const jpgBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Page encoding failed."))),
        "image/jpeg",
        quality
      );
    });

    const jpgBytes = await jpgBlob.arrayBuffer();
    const embeddedImg = await outDoc.embedJpg(jpgBytes);

    const { width: vw, height: vh } = viewport;
    const outPage = outDoc.addPage([vw, vh]);
    outPage.drawImage(embeddedImg, { x: 0, y: 0, width: vw, height: vh });
    void rgb;
  }

  const bytes = await outDoc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
