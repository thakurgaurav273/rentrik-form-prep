"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}

export function ProcessButton({
  onClick,
  loading = false,
  disabled = false,
  label = "Process",
  loadingLabel = "Processing…",
}: ProcessButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full sm:w-auto min-w-[160px] font-semibold"
      aria-busy={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
      {loading ? loadingLabel : label}
    </Button>
  );
}
