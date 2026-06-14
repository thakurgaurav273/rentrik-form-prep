import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ResizeTool } from "@/components/tools/image/ResizeTool";

const TOOL = getToolByPath("/image/resize")!;

export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your image", text: "Drop or select a JPG, PNG, or WEBP image. Your file never leaves your device." },
  { name: "Set target dimensions", text: "Enter the width and height in pixels. Enable aspect-ratio lock to avoid distortion." },
  { name: "Choose output format", text: "Select JPEG for smallest file, PNG for lossless quality, or WEBP for modern apps." },
  { name: "Download", text: "Click Resize Image, then download the result instantly." },
];

const FAQS = [
  { question: "What image formats does this support?", answer: "JPG, PNG, and WEBP files up to 25 MB." },
  { question: "What pixel size do exam portals require for photos?", answer: "SSC CGL and Railway require 200×230 px. UPSC typically wants 300×300 px. Check your specific exam notification." },
  { question: "Will resizing to a larger size improve quality?", answer: "No - upscaling stretches pixels and reduces quality. Always resize to equal or smaller dimensions for best results." },
  { question: "Is my image uploaded to a server?", answer: "No. All processing happens in your browser using Canvas API. Your files never leave your device." },
  { question: "How do I resize without distorting the image?", answer: "Enable 'Lock aspect ratio'. Enter just the width or height and the other dimension will be calculated automatically." },
];

export default function ResizePage() {
  return (
    <>
      <JsonLd data={[
        buildSoftwareAppJsonLd(TOOL),
        buildHowToJsonLd(TOOL, HOW_TO),
        buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Resize", path: "/image/resize" }]),
      ]} />
      <ToolPageShell
        tool={TOOL}
        intro="Resize any photo or image to exact pixel dimensions for exam forms, job applications, and college admissions - all in your browser, nothing uploaded."
        howToSteps={HOW_TO}
        faqs={FAQS}
      >
        <ResizeTool />
      </ToolPageShell>
    </>
  );
}
