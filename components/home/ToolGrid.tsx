import Link from "next/link";
import type { ToolEntry } from "@/types/tools";
import { IMAGE_TOOLS, PDF_TOOLS, CONVERT_TOOLS } from "@/config/tools";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: ToolEntry;
}

function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.path}
      className="group flex flex-col gap-2 rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
        {tool.shortTitle}
      </p>
      <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{tool.description}</p>
      <span className="flex items-center gap-1 text-xs text-primary font-medium mt-1">
        Try it <ArrowRight className="h-3 w-3" aria-hidden />
      </span>
    </Link>
  );
}

interface CategorySectionProps {
  title: string;
  href: string;
  tools: ToolEntry[];
}

function CategorySection({ title, href, tools }: CategorySectionProps) {
  return (
    <section aria-labelledby={`cat-${title.replace(/\s/g, "-").toLowerCase()}`}>
      <div className="flex items-center justify-between mb-4">
        <h2
          id={`cat-${title.replace(/\s/g, "-").toLowerCase()}`}
          className="text-lg sm:text-xl font-semibold"
        >
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          See all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.path} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export function ToolGrid() {
  return (
    <div className="space-y-10">
      <CategorySection title="Image Tools" href="/image" tools={IMAGE_TOOLS} />
      <CategorySection title="PDF Tools" href="/pdf" tools={PDF_TOOLS} />
      <CategorySection title="Convert" href="/convert" tools={CONVERT_TOOLS} />
    </div>
  );
}
