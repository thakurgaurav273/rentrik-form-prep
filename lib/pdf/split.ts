export function parsePageRanges(rangeStr: string, pageCount: number): number[][] {
  const ranges: number[][] = [];
  const parts = rangeStr.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr ?? "1", 10) - 1;
      const end = parseInt(endStr ?? String(pageCount), 10) - 1;
      if (isNaN(start) || isNaN(end) || start < 0 || end >= pageCount || start > end) {
        throw new Error(`Invalid page range: "${part}". Pages are 1–${pageCount}.`);
      }
      const group: number[] = [];
      for (let i = start; i <= end; i++) group.push(i);
      ranges.push(group);
    } else {
      const page = parseInt(part, 10) - 1;
      if (isNaN(page) || page < 0 || page >= pageCount) {
        throw new Error(`Invalid page number: "${part}". Pages are 1–${pageCount}.`);
      }
      ranges.push([page]);
    }
  }

  return ranges;
}

export async function splitPdf(file: File, rangeStr: string): Promise<Blob[]> {
  const { PDFDocument } = await import("pdf-lib");

  const arrayBuffer = await file.arrayBuffer();
  let doc;
  try {
    doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch {
    throw new Error("Could not read PDF. It may be encrypted or corrupt.");
  }

  const pageCount = doc.getPageCount();
  const ranges = rangeStr.toLowerCase() === "all"
    ? doc.getPageIndices().map((i) => [i])
    : parsePageRanges(rangeStr, pageCount);

  const blobs: Blob[] = [];

  for (const pageIndices of ranges) {
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(doc, pageIndices);
    for (const page of copiedPages) newDoc.addPage(page);
    const bytes = await newDoc.save();
    blobs.push(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
  }

  return blobs;
}
