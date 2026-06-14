export interface ExamDocSpec {
  widthPx: number;
  heightPx: number;
  minKB: number;
  maxKB: number;
  format: "jpeg" | "png";
  background: string;
}

export interface ExamPreset {
  id: string;
  name: string;
  fullName: string;
  category: "central" | "railway" | "banking" | "medical" | "engineering" | "state";
  photo: ExamDocSpec;
  signature: ExamDocSpec;
  notes?: string;
}
