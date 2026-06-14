import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { CompressPdfTool } from "@/components/tools/pdf/CompressPdfTool";

const TOOL = getToolByPath("/pdf/compress")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your PDF", text: "Drop or select a PDF file up to 50 MB." },
  { name: "Choose compression level", text: "Medium is recommended for most scanned PDFs. High gives the smallest file." },
  { name: "Click Compress PDF", text: "Wait for all pages to be processed. A progress bar shows the status." },
  { name: "Download the compressed PDF", text: "See before/after size, then save." },
];

const FAQS = [
  { question: "Why doesn't my PDF shrink much?", answer: "Text-only or already-optimized PDFs may not compress much. This tool works best on scanned/image-heavy PDFs." },
  { question: "What's the maximum PDF size?", answer: "50 MB. Very large PDFs with many high-resolution images may take 1–2 minutes on mobile." },
  { question: "Are encrypted PDFs supported?", answer: "Encrypted PDFs cannot be compressed. Remove the password first." },
  { question: "Is my PDF uploaded anywhere?", answer: "No. All processing happens in your browser. Your PDF is never uploaded to any server." },
];

export default function CompressPdfPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf" }, { name: "Compress PDF", path: "/pdf/compress" }])]} />
      <ToolPageShell tool={TOOL} intro="Reduce PDF file size for exam portals and job applications - upload limits as low as 100 KB are common. All processing in your browser, nothing uploaded." howToSteps={HOW_TO} faqs={FAQS}>
        <CompressPdfTool />
      </ToolPageShell>
    </>
  );
}
