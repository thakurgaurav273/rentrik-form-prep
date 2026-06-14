import type { BackgroundOptions } from "@/types/tools";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r ?? 255, g ?? 255, b ?? 255];
}

// Uses @imgly/background-removal (WASM, browser-only) to remove background,
// then composites the subject onto the chosen solid color.
export async function changeBackground(
  file: File,
  opts: BackgroundOptions,
  onStatus?: (msg: string) => void
): Promise<Blob> {
  onStatus?.("Loading AI model… (first run may take ~10 s)");

  const { removeBackground } = await import("@imgly/background-removal");

  onStatus?.("Removing background…");

  // removeBackground fetches its WASM model from the library's CDN on first use,
  // then the browser caches it. No publicPath needed - let it use the default CDN.
  const transparentBlob = await removeBackground(file, {
    model: "isnet",
    output: {
      format: "image/png",
      quality: 1,
    },
  });

  onStatus?.("Applying background color…");

  // Composite onto solid color using Canvas
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(transparentBlob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas unavailable.")); return; }

      if (opts.color && opts.color !== "transparent") {
        const [r, g, b] = hexToRgb(opts.color);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const outFormat = opts.color === "transparent" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed."))),
        outFormat,
        0.92
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Result decode failed.")); };
    img.src = url;
  });
}
