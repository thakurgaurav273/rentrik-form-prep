import { ShieldCheck } from "lucide-react";

interface PrivacyNoteProps {
  className?: string;
}

export function PrivacyNote({ className = "" }: PrivacyNoteProps) {
  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden />
      <span>
        <strong className="font-medium text-foreground">100% private.</strong>{" "}
        Your files never leave your device - all processing runs in your browser.
      </span>
    </div>
  );
}
