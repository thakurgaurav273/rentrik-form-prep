"use client";

import { useState, useCallback, useRef } from "react";
import { EXAM_PRESETS } from "@/config/exam-presets";
import type { ExamPreset, ExamDocSpec } from "@/types/exam";
import { PrivacyNote } from "@/components/shared/PrivacyNote";
import { CheckCircle2, AlertCircle, Upload, Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocState {
  file: File | null;
  status: "idle" | "processing" | "done" | "error";
  result: Blob | null;
  error: string | null;
  previewUrl: string | null;
  resultUrl: string | null;
}

const INITIAL_DOC: DocState = {
  file: null, status: "idle", result: null, error: null, previewUrl: null, resultUrl: null,
};

async function processDoc(file: File, spec: ExamDocSpec): Promise<Blob> {
  const { resizeImage } = await import("@/lib/image/resize");
  const { reduceImageToKB } = await import("@/lib/image/reduce-to-kb");

  const resizedBlob = await resizeImage(file, {
    width: spec.widthPx,
    height: spec.heightPx,
    format: spec.format,
    quality: 0.95,
    lockAspect: false,
  });

  const resizedFile = new File([resizedBlob], "temp.jpg", { type: `image/${spec.format}` });
  return reduceImageToKB(resizedFile, { targetKB: spec.maxKB, format: spec.format });
}

interface ExamToolkitProps {
  initialExamId?: string;
}

export function ExamToolkit({ initialExamId }: ExamToolkitProps) {
  const defaultExam = EXAM_PRESETS.find((p) => p.id === initialExamId) ?? EXAM_PRESETS[0]!;
  const [selectedExam, setSelectedExam] = useState<ExamPreset>(defaultExam);
  const [photo, setPhoto] = useState<DocState>(INITIAL_DOC);
  const [sig, setSig] = useState<DocState>(INITIAL_DOC);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleExamChange = useCallback((id: string) => {
    const exam = EXAM_PRESETS.find((p) => p.id === id);
    if (!exam) return;
    setSelectedExam(exam);
    setPhoto(INITIAL_DOC);
    setSig(INITIAL_DOC);
  }, []);

  const handleFile = useCallback(
    async (file: File, type: "photo" | "sig") => {
      const set = type === "photo" ? setPhoto : setSig;
      const spec = type === "photo" ? selectedExam.photo : selectedExam.signature;

      const previewUrl = URL.createObjectURL(file);
      set((prev) => { URL.revokeObjectURL(prev.previewUrl ?? ""); return { ...INITIAL_DOC, file, previewUrl, status: "processing" }; });

      try {
        const result = await processDoc(file, spec);
        const resultUrl = URL.createObjectURL(result);
        set((prev) => ({ ...prev, status: "done", result, resultUrl }));
      } catch (e) {
        set((prev) => ({ ...prev, status: "error", error: String(e) }));
      }
    },
    [selectedExam]
  );

  const downloadDoc = useCallback((docState: DocState, label: string, preset: ExamPreset) => {
    if (!docState.result || !docState.resultUrl) return;
    const ext = preset.photo.format === "jpeg" ? "jpg" : "png";
    const a = document.createElement("a");
    a.href = docState.resultUrl;
    a.download = `${preset.id}-${label}.${ext}`;
    a.click();
  }, []);

  return (
    <div className="space-y-6">
      {/* Exam selector */}
      <div className="space-y-2">
        <label htmlFor="exam-select" className="text-sm font-medium">
          Select Exam
        </label>
        <div className="relative">
          <select
            id="exam-select"
            value={selectedExam.id}
            onChange={(e) => handleExamChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {EXAM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - {p.fullName.split("–")[1]?.trim() ?? p.fullName}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        </div>
        {selectedExam.notes && (
          <p className="text-xs text-muted-foreground">{selectedExam.notes}</p>
        )}
      </div>

      {/* Specs summary */}
      <div className="grid grid-cols-2 gap-3">
        <SpecCard label="Photo" spec={selectedExam.photo} />
        <SpecCard label="Signature" spec={selectedExam.signature} />
      </div>

      {/* Upload zones */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DocUpload
          label="Photo"
          docState={photo}
          inputRef={photoInputRef}
          accept="image/jpeg,image/png,image/webp"
          spec={selectedExam.photo}
          onFile={(f) => handleFile(f, "photo")}
          onDownload={() => downloadDoc(photo, "photo", selectedExam)}
        />
        <DocUpload
          label="Signature"
          docState={sig}
          inputRef={sigInputRef}
          accept="image/jpeg,image/png,image/webp"
          spec={selectedExam.signature}
          onFile={(f) => handleFile(f, "sig")}
          onDownload={() => downloadDoc(sig, "signature", selectedExam)}
        />
      </div>

      <PrivacyNote />
    </div>
  );
}

function SpecCard({ label, spec }: { label: string; spec: ExamDocSpec }) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{spec.widthPx} × {spec.heightPx} px</p>
      <p className="text-xs text-muted-foreground">{spec.minKB}–{spec.maxKB} KB · {spec.format.toUpperCase()}</p>
    </div>
  );
}

function DocUpload({
  label, docState, inputRef, accept, spec, onFile, onDownload,
}: {
  label: string;
  docState: DocState;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  spec: ExamDocSpec;
  onFile: (f: File) => void;
  onDownload: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={handleChange} />

      {docState.status === "idle" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full rounded-xl border-2 border-dashed border-border/60 p-6 text-center hover:border-primary/50 hover:bg-accent/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" aria-hidden />
          <p className="text-sm text-muted-foreground">Upload {label}</p>
          <p className="text-xs text-muted-foreground mt-1">{spec.widthPx}×{spec.heightPx}px · max {spec.maxKB} KB</p>
        </button>
      )}

      {docState.status === "processing" && (
        <div className="rounded-xl border bg-card p-6 text-center space-y-2">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Formatting…</p>
        </div>
      )}

      {docState.status === "done" && docState.result && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          {docState.resultUrl && (
            <img
              src={docState.resultUrl}
              alt={`Formatted ${label}`}
              className="mx-auto rounded border max-h-32 object-contain"
              style={{ aspectRatio: `${spec.widthPx}/${spec.heightPx}` }}
            />
          )}
          <div className="flex items-center gap-2 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{spec.widthPx}×{spec.heightPx}px · {(docState.result.size / 1024).toFixed(1)} KB</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDownload}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              )}
            >
              <Download className="h-4 w-4" aria-hidden />
              Download
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2.5 text-sm rounded-lg border hover:bg-accent/10 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {docState.status === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Processing failed. Try a different image.</span>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
