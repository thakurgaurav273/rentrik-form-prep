// Module-level cache: dynamic import resolves once and is reused for every subsequent call.
// This means the ONNX session stays alive between images — 2nd+ images are ~3× faster.
let libPromise: Promise<typeof import("@imgly/background-removal")> | null = null;

function getLib() {
  if (!libPromise) {
    libPromise = import("@imgly/background-removal");
  }
  return libPromise;
}

/** Call this as soon as the user drops a file to warm up the ONNX session in the background. */
export function preloadBgRemoval(): void {
  getLib();
}

export async function removeImageBackground(
  file: File,
  onStatus?: (msg: string) => void
): Promise<Blob> {
  onStatus?.("Loading AI model… (first run ~20 s, then cached)");
  const { removeBackground } = await getLib();
  onStatus?.("Removing background…");
  return removeBackground(file, {
    model: "isnet",
    output: { format: "image/png", quality: 1 },
  });
}
