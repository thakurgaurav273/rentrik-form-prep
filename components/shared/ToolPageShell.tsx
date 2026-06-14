import type { ReactNode } from "react";
import type { ToolEntry } from "@/types/tools";
import { getRelatedTools } from "@/config/tools";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/ads/AdSlot";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolPageShellProps {
  tool: ToolEntry;
  intro: string;
  howToSteps: Array<{ name: string; text: string }>;
  faqs: FaqItem[];
  children: ReactNode;
}

export function ToolPageShell({ tool, intro, howToSteps, faqs, children }: ToolPageShellProps) {
  const categoryLabel =
    tool.category === "image" ? "Image Tools"
    : tool.category === "pdf" ? "PDF Tools"
    : "Convert";

  const categoryPath =
    tool.category === "image" ? "/image"
    : tool.category === "pdf" ? "/pdf"
    : "/convert";

  const relatedTools = getRelatedTools(tool.related);

  return (
    <Container as="main" className="py-6 sm:py-10 space-y-10">
      <div className="space-y-4">
        <Breadcrumbs
          items={[
            { label: categoryLabel, href: categoryPath },
            { label: tool.shortTitle },
          ]}
        />
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">{tool.title}</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-prose">{intro}</p>
      </div>

      <AdSlot size="leaderboard" className="mx-auto" />

      {/* Tool widget slot */}
      <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        {children}
      </div>

      <AdSlot size="rectangle" />

      {/* How to use */}
      <section aria-labelledby="how-to-heading">
        <h2 id="how-to-heading" className="text-lg sm:text-2xl font-semibold mb-4">How to use</h2>
        <ol className="space-y-3">
          {howToSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="font-medium text-sm">{step.name}</p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg sm:text-2xl font-semibold mb-4">Related tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((t) => (
              <Link
                key={t.path}
                href={t.path}
                className="flex items-center justify-between rounded-lg border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{t.shortTitle}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg sm:text-2xl font-semibold mb-4">Frequently asked questions</h2>
          <dl className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <dt className="font-medium text-sm sm:text-base">{faq.question}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <AdSlot size="banner" />
    </Container>
  );
}
