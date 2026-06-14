import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { PdfToImageTool } from "@/components/tools/pdf/PdfToImageTool";

const TOOL = getToolByPath("/pdf/pdf-to-image")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your PDF", text: "Drop or select a PDF file." },
  { name: "Choose pages and format", text: "Select 'all' or specific page ranges. Choose JPEG for smaller files or PNG for lossless." },
  { name: "Set resolution", text: "1.5× is good for on-screen use. 2–3× for printing." },
  { name: "Convert and download", text: "Images download automatically." },
];

const FAQS = [
  { question: "How do I convert just one page of a PDF to an image?", answer: "Enter the page number in the Pages field (e.g. '2' for page 2)." },
  { question: "What's the best resolution setting?", answer: "1.5× is good for web/email. Use 2× or higher if you need print quality." },
  { question: "Is my PDF uploaded anywhere?", answer: "No. PDF rendering happens entirely in your browser using PDF.js. Nothing is uploaded." },
];

export default function PdfToImagePage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf" }, { name: "PDF to Image", path: "/pdf/pdf-to-image" }])]} />
      <ToolPageShell tool={TOOL} intro="Convert PDF pages to JPG or PNG images - choose resolution and page range. No upload, no account, processed entirely in your browser." howToSteps={HOW_TO} faqs={FAQS}>
        <PdfToImageTool />
      </ToolPageShell>
    </>
  );
}
