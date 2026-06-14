// Shared helpers for pdf-lib and pdfjs-dist.
// Import this instead of duplicating worker setup across PDF engines.

let workerInitialised = false;

export async function initialisePdfjsWorker(): Promise<typeof import("pdfjs-dist")> {
  const pdfjsLib = await import("pdfjs-dist");
  if (!workerInitialised) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    workerInitialised = true;
  }
  return pdfjsLib;
}
