import { Shield, Smartphone, Zap, Lock } from "lucide-react";

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "Your files stay on your device",
    description:
      "All processing happens locally in your browser using Canvas and PDF APIs. No file is ever sent to a server.",
  },
  {
    icon: Smartphone,
    title: "Built for mobile",
    description:
      "Designed for budget Android phones with mobile data. Fast, touch-friendly, works on any browser.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description:
      "No upload wait. No queue. Processing starts immediately on your device and finishes in seconds.",
  },
  {
    icon: Lock,
    title: "No login, no account",
    description:
      "Start using any tool immediately. We never ask for your email, phone number, or personal information.",
  },
] as const;

export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="py-10 sm:py-14">
      <h2 id="trust-heading" className="text-lg sm:text-2xl font-semibold text-center mb-8">
        Why millions of Indians trust Rentrik Form Prep
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
