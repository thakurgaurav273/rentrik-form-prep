import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ImageToPdfTool } from "@/components/tools/pdf/ImageToPdfTool";

const TOOL = getToolByPath("/pdf/image-to-pdf")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload images", text: "Select one or more JPG, PNG, or WEBP images. Each image becomes one page." },
  { name: "Choose page settings", text: "Pick page size (A4/Letter/fit to image), orientation, and margin." },
  { name: "Create PDF", text: "Click to combine all images into a single PDF." },
  { name: "Download", text: "Save the PDF to your device." },
];

const FAQS = [
  { question: "Can I combine multiple images into one PDF?", answer: "Yes. Add multiple images and they will all be placed as separate pages in order." },
  { question: "What image formats are supported?", answer: "JPG, PNG, and WEBP. WEBP is automatically converted to PNG for PDF embedding." },
  { question: "Is my document uploaded anywhere?", answer: "No. All processing uses pdf-lib in your browser. Nothing is uploaded." },
];

export default function ImageToPdfPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf" }, { name: "Image to PDF", path: "/pdf/image-to-pdf" }])]} />
      <ToolPageShell tool={TOOL} intro="Convert JPG, PNG, or WEBP images into a PDF document - combine multiple images into one PDF for job and exam applications." howToSteps={HOW_TO} faqs={FAQS}>
        <ImageToPdfTool />
      </ToolPageShell>
    </>
  );
}
