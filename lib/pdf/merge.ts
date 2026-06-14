export async function mergePdfs(files: File[]): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");

  const merged = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let doc;
    try {
      doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    } catch {
      throw new Error(`Could not read "${file.name}". It may be encrypted or corrupt.`);
    }
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  const bytes = await merged.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
