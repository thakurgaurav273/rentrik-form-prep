import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CONVERT_TOOLS } from "@/config/tools";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCollectionPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Image Format Converter Online Free",
  description:
    "Convert PNG to JPG, JPG to PNG, WEBP to JPG and more - free online converters. All processed in your browser, no upload required.",
  path: "/convert",
  keywords: ["image converter online free", "png to jpg", "jpg to png", "webp to jpg", "convert image format"],
});

export default function ConvertHubPage() {
  return (
    <>
      <JsonLd data={[
        buildCollectionPageJsonLd({ title: "Image Format Converter Online Free", description: "Convert PNG to JPG, JPG to PNG, WEBP to JPG and more - free online converters.", path: "/convert", tools: CONVERT_TOOLS }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Convert", path: "/convert" }]),
      ]} />
      <Container as="main" className="py-8 sm:py-12 space-y-8">
        <div className="space-y-3">
          <Breadcrumbs items={[{ label: "Convert" }]} />
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Image Format Converter</h1>
          <p className="text-muted-foreground max-w-prose text-sm sm:text-base">
            Convert between image formats instantly - PNG to JPG, WEBP to JPG, and more.
            Processed locally in your browser. No upload, no account required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CONVERT_TOOLS.map((tool) => (
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
