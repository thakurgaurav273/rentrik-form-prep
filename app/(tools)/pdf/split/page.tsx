import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { SplitPdfTool } from "@/components/tools/pdf/SplitPdfTool";

const TOOL = getToolByPath("/pdf/split")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your PDF", text: "Drop or select a PDF. The tool shows the total page count." },
  { name: "Enter page ranges", text: "Type ranges like '1-3, 5' to extract those pages. Type 'all' to split every page into its own file." },
  { name: "Click Split PDF", text: "Files download automatically. Multiple outputs are saved as separate files." },
];

const FAQS = [
  { question: "Can I extract a single page from a PDF?", answer: "Yes. Enter the page number (e.g. '3') to extract just that page." },
  { question: "Can I extract multiple ranges?", answer: "Yes. Separate ranges with commas: '1-2, 4-6, 8'." },
  { question: "What does 'all' do?", answer: "Splits the PDF so each page becomes a separate file. All files download individually." },
  { question: "Is my PDF uploaded?", answer: "No. Splitting happens in your browser using pdf-lib. Nothing is uploaded." },
];

export default function SplitPdfPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf" }, { name: "Split PDF", path: "/pdf/split" }])]} />
      <ToolPageShell tool={TOOL} intro="Extract pages or split a PDF into separate files by page range - free, private, no upload required." howToSteps={HOW_TO} faqs={FAQS}>
        <SplitPdfTool />
      </ToolPageShell>
    </>
  );
}
