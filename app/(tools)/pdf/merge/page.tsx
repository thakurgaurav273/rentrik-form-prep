import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { MergePdfTool } from "@/components/tools/pdf/MergePdfTool";

const TOOL = getToolByPath("/pdf/merge")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your PDFs", text: "Drop or select multiple PDF files. You can add more after the initial upload." },
  { name: "Set the order", text: "Files are merged in the order shown. Remove and re-add files to change the order." },
  { name: "Click Merge", text: "All PDFs are combined into one document." },
  { name: "Download the merged PDF", text: "Save the combined PDF to your device." },
];

const FAQS = [
  { question: "How many PDFs can I merge at once?", answer: "There is no hard limit, but very large files (10+ PDFs each over 10 MB) may be slow on low-end phones. Process sequentially for best results." },
  { question: "Are encrypted PDFs supported?", answer: "Encrypted PDFs will show an error. Remove password protection from your PDF first, then merge." },
  { question: "Is my PDF uploaded to a server?", answer: "No. Merging is done entirely in your browser using pdf-lib. Nothing is ever uploaded." },
  { question: "Will the merged PDF maintain the original quality?", answer: "Yes. The merge operation copies pages as-is without re-encoding, so quality is preserved." },
];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf" }, { name: "Merge PDF", path: "/pdf/merge" }])]} />
      <ToolPageShell tool={TOOL} intro="Combine multiple PDF files into one - no upload, no account required. Great for merging certificates, mark sheets, and documents for job applications." howToSteps={HOW_TO} faqs={FAQS}>
        <MergePdfTool />
      </ToolPageShell>
    </>
  );
}
