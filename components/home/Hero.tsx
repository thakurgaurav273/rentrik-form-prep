import { ShieldCheck, Smartphone, Infinity, KeyRound } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "No Upload Required", color: "text-emerald-500" },
  { icon: Smartphone, label: "Works on Mobile", color: "text-primary" },
  { icon: Infinity, label: "Free Forever", color: "text-violet-500" },
  { icon: KeyRound, label: "No Login Needed", color: "text-muted-foreground" },
] as const;

export function Hero() {
  return (
    <section className="py-8 sm:py-14 text-center space-y-6" aria-label="Hero">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          <span className="text-primary">Resize Photos,</span>{" "}
          Crop Signatures &{" "}
          Compress PDFs for SSC, UPSC & Job Forms
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Resize images to exact KB, create passport photos, crop signatures and prepare
          application-ready documents in seconds.{" "}
          <strong className="text-foreground">All in your browser. Nothing is uploaded.</strong>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/image/reduce-to-kb"
          className={cn(buttonVariants({ size: "lg" }), "font-semibold")}
        >
          Resize Photo to Exact KB
        </Link>
        <Link href="/image" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
          Browse Image Tools
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground pt-1">
        {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
