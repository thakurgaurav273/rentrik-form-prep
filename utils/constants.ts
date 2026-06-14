export const MAX_IMAGE_SIZE_MB = 25;
export const MAX_PDF_SIZE_MB = 50;
export const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_PDF_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_PDF_TYPES = ["application/pdf"];

export const REDUCE_TO_KB_PRESETS = [20, 50, 100, 200, 500] as const;

export const PASSPORT_PRESETS = [
  { label: "Standard (35×45mm @ 96dpi)", widthPx: 132, heightPx: 170 },
  { label: "US Passport (2×2 inch @ 96dpi)", widthPx: 192, heightPx: 192 },
  { label: "SSC CGL (200×230px)", widthPx: 200, heightPx: 230 },
  { label: "UPSC (300×300px)", widthPx: 300, heightPx: 300 },
  { label: "Railway/RRB (200×230px)", widthPx: 200, heightPx: 230 },
] as const;

export const CROP_ASPECT_PRESETS = [
  { label: "Free", value: null },
  { label: "1:1 (Square)", value: 1 },
  { label: "3:4 (Portrait)", value: 3 / 4 },
  { label: "4:3 (Landscape)", value: 4 / 3 },
  { label: "Passport (35:45)", value: 35 / 45 },
] as const;

export const BINARY_SEARCH_MAX_ITERATIONS = 10;
