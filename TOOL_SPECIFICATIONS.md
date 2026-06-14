# TOOL_SPECIFICATIONS.md

Specification for every MVP tool. **All processing is client-side. No file leaves the device.**

Each engine is a **pure, configurable function** (input file + options → output blob), with **no React and no network access**, located in `lib/<domain>/`. The UI widget is a Client Component in `components/tools/<domain>/`. This separation is what lets the Phase 2 Exam Toolkit reuse engines via preset configs.

**Shared conventions (apply to all tools):**
- Accept input via drag-drop, tap-to-select, and (image tools) camera capture.
- Validate type & size up front; reject with a friendly, specific message.
- Show before/after stats (size, dimensions, format) after processing.
- Offer "Download" + "Process another file".
- Run heavy work in a Web Worker; show progress.
- Revoke object URLs after use.
- Common edge cases (assume for every tool unless noted): no file selected; wrong/unsupported MIME; 0-byte/corrupt file; extremely large file (cap + warn); browser lacks a required API (graceful fallback message); user cancels mid-process; out-of-memory on low-end device (process sequentially, downscale first).

---

# IMAGE TOOLS

## 1. Resize Image
- **Purpose:** Change an image's pixel dimensions (width/height), with optional aspect-ratio lock.
- **User flow:** Upload → see current dimensions → enter target width/height (or pick a preset) → toggle "lock aspect ratio" → Resize → preview → download.
- **Input:** JPG/PNG/WEBP. Target width/height (px). Aspect lock (bool). Output format (keep/JPG/PNG/WEBP).
- **Processing logic:** Decode to image; draw onto a canvas sized to target dimensions (high-quality smoothing); `canvas.toBlob(format, quality)`. If aspect locked, compute the missing dimension.
- **Output:** Resized image blob in chosen format; shows new dimensions + size.
- **Edge cases:** Upscaling (warn about quality loss); non-integer/zero/negative dims (validate); EXIF orientation (normalize so it isn't sideways); huge dimensions (cap, warn about memory).
- **Libraries:** Canvas API. (`exifr` or canvas orientation handling for EXIF.)

## 2. Compress Image
- **Purpose:** Reduce file size while keeping acceptable quality.
- **User flow:** Upload → choose quality (slider) or "target smaller" → Compress → see before/after size → download.
- **Input:** JPG/PNG/WEBP. Quality (0–1) or compression level. Optional max dimension. Output format.
- **Processing logic:** Re-encode via `browser-image-compression` (worker) and/or canvas `toBlob` with quality; optionally downscale max dimension. PNG (lossless) → suggest converting to JPG/WEBP for real savings.
- **Output:** Compressed blob; before/after size + % saved.
- **Edge cases:** Already-tiny file (note minimal gain); PNG with transparency (warn that JPG conversion loses alpha); very large source (downscale-then-compress).
- **Libraries:** browser-image-compression, Canvas API.

## 3. Reduce Image To Exact KB  ⭐ (flagship)
- **Purpose:** Force an image to a precise target size (e.g. ≤ 50 KB) for portals with hard limits.
- **User flow:** Upload → enter target KB (presets: 20/50/100 KB) → optional "≤" vs "≈" → Process → tool iterates → shows final size → download.
- **Input:** JPG/PNG/WEBP. Target KB (number). Tolerance/mode. Optional max dimension. Output format (default JPG).
- **Processing logic:** **Binary search** on quality (and, if quality alone can't reach target, on scale): re-encode, measure blob bytes, adjust until just under target. Cap iterations (≤ ~8–10). Prefer JPG/WEBP for size control. Run in a **Web Worker** (multiple re-encodes). Return the best result ≤ target (or closest if target physically impossible).
- **Output:** Blob whose size ≤ target (report exact KB + dimensions/quality used).
- **Edge cases:** Target too small to be achievable at any quality (auto-reduce dimensions, then warn if still impossible); target larger than source (return source, note no change needed); PNG target (recommend JPG); ensure never exceeds the hard limit.
- **Libraries:** Canvas API in a Web Worker; browser-image-compression as a helper.

## 4. Crop Image
- **Purpose:** Crop to a region; free or fixed aspect ratio.
- **User flow:** Upload → drag/pinch crop box (presets: free, 1:1, 3:4, 4:3, custom) → Crop → preview → download.
- **Input:** JPG/PNG/WEBP. Crop rectangle (x,y,w,h) or aspect preset. Output format.
- **Processing logic:** Interactive crop via `react-easy-crop` (touch/zoom); on confirm, draw the selected source region to a canvas at the crop size; export `toBlob`.
- **Output:** Cropped image blob + new dimensions/size.
- **Edge cases:** Crop region outside bounds (clamp); zero-area crop (validate); EXIF orientation; very large images (downscale preview, crop from full-res source).
- **Libraries:** react-easy-crop, Canvas API.

## 5. Signature Cropper
- **Purpose:** Crop a photographed/scanned signature, clean the background, and hit a target KB for forms.
- **User flow:** Upload signature photo → auto-detect/adjust crop to the signature → choose background (white / transparent) → optional contrast clean → set target KB → Process → download.
- **Input:** JPG/PNG/WEBP photo. Crop rect. Background option. Optional threshold/contrast. Target KB & dimensions.
- **Processing logic:** Crop (canvas). Optional **luminance threshold** to whiten paper background / make near-white transparent (simple, fast, client-side). Resize to target dimensions. Reduce to target KB (reuse exact-KB engine). PNG for transparent, JPG for white-bg + small size.
- **Output:** Clean signature image (white or transparent bg) within target KB & dimensions.
- **Edge cases:** Low-contrast/faint signature (let user tune threshold); colored ink (preserve vs force black option); shadows (note limitation); transparent + JPG mismatch (force PNG for transparency).
- **Libraries:** react-easy-crop, Canvas API (pixel manipulation), exact-KB engine.

## 6. Passport Photo Maker
- **Purpose:** Produce a correctly-sized passport/ID photo (dimensions, DPI, background) for forms/exams.
- **User flow:** Upload photo → pick size preset (e.g. 35×45mm, 51×51mm, or exam-specific px) → position/crop face in guide → choose background (white/blue/keep) → Process → download (single or printable sheet later).
- **Input:** JPG/PNG/WEBP. Size preset (mm or px + DPI). Crop/position. Background option. Optional target KB.
- **Processing logic:** Crop to required aspect with a **face guide overlay**; resize to exact px (derived from mm × DPI); optional background fill/replace (canvas); optional reduce-to-KB. Presets defined as **config objects** (so exam presets plug in later).
- **Output:** Passport photo at exact dimensions/DPI/background; optional target KB.
- **Edge cases:** Face too small/large for guide (prompt to reposition); non-standard aspect (letterbox/crop choice); background replacement on complex backgrounds (MVP = solid fill / simple threshold; note limits); DPI metadata embedding.
- **Libraries:** react-easy-crop, Canvas API; (Phase 2+ optional segmentation model for true bg removal).

## 7. Background Color Changer
- **Purpose:** Replace an image background with a solid color (commonly white or blue) for photos/signatures.
- **User flow:** Upload → pick target background color → adjust sensitivity/threshold → preview → download.
- **Input:** JPG/PNG/WEBP. Target color (preset white/blue/custom). Threshold/tolerance.
- **Processing logic (MVP):** Canvas pixel pass — detect near-background pixels (luminance/edge/corner-color heuristic) and replace with target color. Good enough for signatures and simple, evenly-lit portrait backgrounds. (True subject segmentation = Phase 2+ optional lazy WASM/ML model, still client-side.)
- **Output:** Image with replaced background; before/after preview.
- **Edge cases:** Subject color similar to background (let user tune threshold; warn); busy/gradient backgrounds (note MVP limitation, suggest a clean-background source); transparency (PNG output if keeping alpha).
- **Libraries:** Canvas API; (Phase 2: optional segmentation model).

---

# PDF TOOLS

## 8. Compress PDF
- **Purpose:** Reduce PDF file size, mainly for image-heavy/scanned PDFs, to meet upload limits.
- **User flow:** Upload PDF → choose compression level (low/med/high) or target size → Compress → before/after size → download.
- **Input:** PDF file. Compression level or target size.
- **Processing logic:** Parse with `pdf-lib`; for embedded raster images, re-encode at reduced resolution/quality (render via PDF.js → recompress → re-embed) and rewrite the document. Drop redundant metadata. (Note: vector/text-only PDFs compress little; set expectations.)
- **Output:** Smaller PDF; before/after size.
- **Edge cases:** Encrypted/password PDF (detect, prompt/decline); already-optimized PDF (minimal gain message); huge multi-page PDF (process pages sequentially, progress bar, memory care); text-only PDF (explain limited savings).
- **Libraries:** pdf-lib, pdfjs-dist, Canvas API.

## 9. Merge PDF
- **Purpose:** Combine multiple PDFs into one, in a chosen order.
- **User flow:** Upload 2+ PDFs → drag to reorder → Merge → download combined PDF.
- **Input:** Multiple PDF files. Order.
- **Processing logic:** `pdf-lib` — load each doc, copy pages in order into a new document, save.
- **Output:** Single merged PDF.
- **Edge cases:** Single file (prompt for ≥ 2); encrypted PDFs (detect/skip/warn); mixed page sizes (allowed; note in UI); very large combined output (memory care, progress); preserve order strictly.
- **Libraries:** pdf-lib.

## 10. Split PDF
- **Purpose:** Extract pages or split a PDF into parts.
- **User flow:** Upload PDF → see page count/thumbnails → choose ranges (e.g. "1-3, 5") or "split each page" → Split → download (one file or zip).
- **Input:** PDF file. Page ranges / split mode.
- **Processing logic:** `pdf-lib` to copy selected pages into new document(s); `pdfjs-dist` for page thumbnails. Multiple outputs → zip (jszip/client-zip) for download.
- **Output:** One or more PDFs (zipped if multiple).
- **Edge cases:** Invalid/out-of-range page numbers (validate against count); single-page PDF (nothing to split message); encrypted PDF (handle); large PDF thumbnail rendering (lazy/sequential).
- **Libraries:** pdf-lib, pdfjs-dist, jszip/client-zip.

## 11. Image To PDF
- **Purpose:** Combine one or more images into a single PDF (e.g. scanned documents).
- **User flow:** Upload images → reorder → choose page size (A4/Letter/fit-to-image) + orientation + margin → Create PDF → download.
- **Input:** JPG/PNG/WEBP images (multiple). Order. Page size/orientation/margin/fit options.
- **Processing logic:** `pdf-lib` — create document; for each image, add a page (chosen size), embed and scale the image to fit with margins; save.
- **Output:** Single PDF containing the images as pages.
- **Edge cases:** Mixed orientations/sizes (fit each per settings); WEBP embedding (convert to PNG/JPG via canvas first if needed); very large/many images (sequential, progress, memory care); transparency (flatten onto white for JPG embedding).
- **Libraries:** pdf-lib, Canvas API.

## 12. PDF To Image
- **Purpose:** Convert PDF pages to images (JPG/PNG).
- **User flow:** Upload PDF → choose pages (all/range) + format + resolution (DPI/scale) → Convert → download (single or zip).
- **Input:** PDF file. Page selection. Output format (JPG/PNG). Scale/DPI.
- **Processing logic:** `pdfjs-dist` renders each selected page to a canvas at the chosen scale; export `toBlob` per page; zip if multiple.
- **Output:** Image(s) per page (zipped if multiple).
- **Edge cases:** Large/high-DPI pages (memory — cap scale, process sequentially, progress); encrypted PDF (handle); many pages (warn/zip); transparent areas → white background for JPG.
- **Libraries:** pdfjs-dist, Canvas API, jszip/client-zip.

---

# CONVERSION TOOLS

> All four conversions share **one canvas-based engine**: `lib/image/convert.ts (file, targetFormat, options) => Blob`. The four pages are thin wrappers with the source/target format preset.

## 13. PNG → JPG
- **Purpose:** Convert PNG to JPG (smaller, widely accepted by form portals).
- **User flow:** Upload PNG → optional quality + background color (for transparency) → Convert → download JPG.
- **Input:** PNG. Quality (0–1). Background color for flattening transparency (default white).
- **Processing logic:** Draw PNG onto canvas; **flatten transparency onto the chosen background** (JPG has no alpha); `toBlob('image/jpeg', quality)`.
- **Output:** JPG file.
- **Edge cases:** Transparent PNG (must flatten — let user pick bg color; default white); very large image (downscale option); already JPG (validate input type).
- **Libraries:** Canvas API.

## 14. JPG → PNG
- **Purpose:** Convert JPG to PNG (lossless, supports transparency for later editing).
- **User flow:** Upload JPG → Convert → download PNG.
- **Input:** JPG. (No quality — PNG is lossless.)
- **Processing logic:** Draw onto canvas; `toBlob('image/png')`.
- **Output:** PNG (note: usually larger than the source JPG).
- **Edge cases:** Note that file size typically increases; large images (memory); validate input type.
- **Libraries:** Canvas API.

## 15. WEBP → JPG
- **Purpose:** Convert WEBP (often unsupported by portals) to widely-accepted JPG.
- **User flow:** Upload WEBP → optional quality + background for transparency → Convert → download JPG.
- **Input:** WEBP. Quality. Background color for transparent WEBP.
- **Processing logic:** Decode WEBP via canvas (browser-native decode); flatten transparency onto background; `toBlob('image/jpeg', quality)`.
- **Output:** JPG file.
- **Edge cases:** Animated WEBP (use first frame; warn animation is dropped); transparency (flatten onto chosen bg); browser without WEBP decode (rare; fallback message); validate input type.
- **Libraries:** Canvas API.

## 16. WEBP → PNG
- **Purpose:** Convert WEBP to PNG, preserving transparency.
- **User flow:** Upload WEBP → Convert → download PNG.
- **Input:** WEBP.
- **Processing logic:** Decode via canvas; `toBlob('image/png')` (preserves alpha).
- **Output:** PNG file (transparency preserved).
- **Edge cases:** Animated WEBP (first frame + warning); large file size after conversion; validate input type.
- **Libraries:** Canvas API.

---

# Shared Engine Notes (for implementers)

- **Engine signature pattern:**
  ```ts
  // lib/image/resize.ts
  export interface ResizeOptions { width?: number; height?: number; lockAspect?: boolean; format?: OutputFormat; quality?: number; }
  export async function resizeImage(file: File, opts: ResizeOptions): Promise<Blob> { /* canvas, no React, no network */ }
  ```
- **Configurable for Exam Toolkit:** every engine accepts an options object. Phase 2 presets are just option objects (e.g. `{ width: 200, height: 230, format: 'jpeg', targetKB: 50, background: '#FFFFFF' }`). **Never hardcode exam-specific values inside an engine.**
- **Validation:** validate options with `zod` before processing; surface friendly errors to the UI.
- **Testing:** each engine has unit tests covering its edge cases (above) with small fixture files.
- **Workers:** expose engines so they can run on the main thread or inside a Web Worker; route heavy ops (exact-KB, PDF render/compress, multi-file) through workers.
