export type OutputFormat = "jpeg" | "png" | "webp";

export type ToolCategory = "image" | "pdf" | "convert";

export interface ToolEntry {
  slug: string;
  category: ToolCategory;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  related: string[];
  icon: string;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  lockAspect?: boolean;
  format?: OutputFormat;
  quality?: number;
}

export interface CompressOptions {
  quality?: number;
  maxDimension?: number;
  format?: OutputFormat;
}

export interface ReduceToKbOptions {
  targetKB: number;
  maxDimension?: number;
  format?: OutputFormat;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  cropArea: CropArea;
  format?: OutputFormat;
  quality?: number;
}

export interface SignatureOptions {
  cropArea?: CropArea;
  background: "white" | "transparent";
  threshold?: number;
  targetKB?: number;
  width?: number;
  height?: number;
}

export interface PassportOptions {
  widthPx: number;
  heightPx: number;
  background: "white" | "blue" | "keep";
  cropArea?: CropArea;
  targetKB?: number;
  quality?: number;
}

export interface BackgroundOptions {
  color: string;
  format?: OutputFormat;
}

export interface ConvertOptions {
  targetFormat: OutputFormat;
  quality?: number;
  background?: string;
}

export interface PdfMergeOptions {
  files: File[];
}

export interface PdfSplitOptions {
  ranges: string;
}

export interface PdfCompressOptions {
  level: "low" | "medium" | "high";
}

export interface ImageToPdfOptions {
  pageSize: "A4" | "Letter" | "fit";
  orientation: "portrait" | "landscape";
  margin: number;
}

export interface PdfToImageOptions {
  pages: "all" | string;
  format: "jpeg" | "png";
  scale: number;
}

export type ProcessingState = "idle" | "working" | "done" | "error";

export interface ProcessingResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  resultSize: number;
  width?: number;
  height?: number;
  format?: string;
}
