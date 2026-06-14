import { MAX_IMAGE_BYTES, MAX_PDF_BYTES, ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES } from "./constants";

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `Unsupported file type. Please upload a JPG, PNG, or WEBP image.`;
  }
  if (file.size === 0) {
    return "This file appears to be empty. Please choose a valid image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please use an image under 25 MB.`;
  }
  return null;
}

export function validatePdfFile(file: File): string | null {
  if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
    return `Unsupported file type. Please upload a PDF file.`;
  }
  if (file.size === 0) {
    return "This file appears to be empty. Please choose a valid PDF.";
  }
  if (file.size > MAX_PDF_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please use a PDF under 50 MB.`;
  }
  return null;
}

export function validateTargetKB(value: number): string | null {
  if (!Number.isFinite(value) || value <= 0) {
    return "Target size must be a positive number.";
  }
  if (value < 1) {
    return "Target size must be at least 1 KB.";
  }
  if (value > 10240) {
    return "Target size must be 10 MB or less.";
  }
  return null;
}

export function validateDimension(value: number, label: string): string | null {
  if (!Number.isInteger(value) || value <= 0) {
    return `${label} must be a positive whole number.`;
  }
  if (value > 10000) {
    return `${label} must be 10,000 px or less.`;
  }
  return null;
}
