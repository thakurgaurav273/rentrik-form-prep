export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
}

export interface PdfDocInfo {
  pageCount: number;
  pages: PdfPageInfo[];
  fileSizeBytes: number;
}
