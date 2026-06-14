"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Processing…"}
      className="space-y-2"
    >
      {label && (
        <p className="text-sm text-muted-foreground" aria-live="polite">{label}</p>
      )}
      <Progress value={value} className="h-2" />
    </div>
  );
}
