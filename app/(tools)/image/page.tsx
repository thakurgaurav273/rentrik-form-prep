import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { IMAGE_TOOLS } from "@/config/tools";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCollectionPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Image Tools Online Free",
  description:
    "Free online image tools for Indian exam and application forms. Resize, compress, crop, reduce to KB, passport photo maker - all in your browser, nothing uploaded.",
  path: "/image",
  keywords: ["image tools online free", "resize compress crop image", "photo editor for exam form"],
});

export default function ImageHubPage() {
  return (
    <>
      <JsonLd data={[
        buildCollectionPageJsonLd({ title: "Image Tools Online Free", description: "Free online image tools for Indian exam and application forms.", path: "/image", tools: IMAGE_TOOLS }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }]),
      ]} />
      <Container as="main" className="py-8 sm:py-12 space-y-8">
        <div className="space-y-3">
          <Breadcrumbs items={[{ label: "Image Tools" }]} />
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Image Tools</h1>
          <p className="text-muted-foreground max-w-prose text-sm sm:text-base">
            Free, privacy-first image tools designed for Indian exam and job application forms.
            Resize, compress, crop, convert, and prepare photos - all processed in your browser.
            No upload, no account required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="group flex flex-col gap-2 rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <h2 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center justify-between">
                {tool.shortTitle}
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
