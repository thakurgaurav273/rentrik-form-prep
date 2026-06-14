import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { CompressTool } from "@/components/tools/image/CompressTool";

const TOOL = getToolByPath("/image/compress")!;

export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your image", text: "Drop or select a JPG, PNG, or WEBP image." },
  { name: "Adjust quality", text: "Use the slider to set quality. 70–80% gives good results for form uploads." },
  { name: "Choose output format", text: "JPEG gives the smallest files. WEBP gives even better compression for modern apps." },
  { name: "Download the compressed image", text: "See before/after file size, then download." },
];

const FAQS = [
  { question: "What's the difference between Compress and Reduce to KB?", answer: "Compress reduces quality by a percentage. Reduce to KB precisely targets a file size (e.g. exactly 50 KB). Use Reduce to KB when portals have strict size limits." },
  { question: "Why does my PNG not compress much?", answer: "PNG is a lossless format. For real compression savings, convert to JPEG using the PNG→JPG tool, which removes lossless overhead." },
  { question: "Is my image uploaded anywhere?", answer: "No. All processing happens locally in your browser. Your files are never uploaded to any server." },
];

export default function CompressPage() {
  return (
    <>
      <JsonLd data={[
        buildSoftwareAppJsonLd(TOOL),
        buildHowToJsonLd(TOOL, HOW_TO),
        buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Compress", path: "/image/compress" }]),
      ]} />
      <ToolPageShell
        tool={TOOL}
        intro="Compress JPG, PNG, or WEBP images quickly online. Reduce file size while keeping acceptable quality for exam forms and job applications."
        howToSteps={HOW_TO}
        faqs={FAQS}
      >
        <CompressTool />
      </ToolPageShell>
    </>
  );
}
