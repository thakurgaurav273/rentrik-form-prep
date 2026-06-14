import type { ImageToPdfOptions } from "@/types/tools";

const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
} as const;

export async function imagesToPdf(files: File[], opts: ImageToPdfOptions): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const mime = file.type;

    let img;
    let natW = 0;
    let natH = 0;

    if (mime === "image/jpeg") {
      img = await pdfDoc.embedJpg(arrayBuffer);
    } else if (mime === "image/png") {
      img = await pdfDoc.embedPng(arrayBuffer);
    } else {
      // WEBP or unsupported - convert to PNG via canvas first
      const blob = await convertToPng(file);
      const pngBuffer = await blob.arrayBuffer();
      img = await pdfDoc.embedPng(pngBuffer);
    }

    natW = img.width;
    natH = img.height;

    let pageW: number;
    let pageH: number;

    if (opts.pageSize === "fit") {
      pageW = natW;
      pageH = natH;
    } else {
      const preset = PAGE_SIZES[opts.pageSize];
      pageW = opts.orientation === "portrait" ? preset.width : preset.height;
      pageH = opts.orientation === "portrait" ? preset.height : preset.width;
    }

    const margin = opts.margin;
    const availW = pageW - margin * 2;
    const availH = pageH - margin * 2;
    const scale = Math.min(availW / natW, availH / natH, 1);
    const drawW = natW * scale;
    const drawH = natH * scale;
    const x = margin + (availW - drawW) / 2;
    const y = margin + (availH - drawH) / 2;

    const page = pdfDoc.addPage([pageW, pageH]);
    page.drawImage(img, { x, y, width: drawW, height: drawH });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

async function convertToPng(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas unavailable.")); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("PNG conversion failed.")); return; }
        resolve(blob);
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed.")); };
    img.src = url;
  });
}
