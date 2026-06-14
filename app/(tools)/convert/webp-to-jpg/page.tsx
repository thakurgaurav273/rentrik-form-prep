import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ConvertTool } from "@/components/tools/convert/ConvertTool";

const TOOL = getToolByPath("/convert/webp-to-jpg")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your WEBP file", text: "Drop or select a WEBP image." },
  { name: "Adjust quality and background", text: "Set JPEG quality and background color for transparent WEBP images." },
  { name: "Convert and download", text: "Get a widely-compatible JPG file." },
];

const FAQS = [
  { question: "Why do exam portals reject WEBP files?", answer: "Many Indian exam and college portals still require JPEG or PNG format. WEBP is a newer format not widely supported by older portal software." },
  { question: "What about animated WEBP files?", answer: "Only the first frame of animated WEBP is converted. Animation is not supported in JPEG." },
  { question: "Is my file uploaded?", answer: "No. All conversion is done in your browser. Nothing is uploaded." },
];

export default function WebpToJpgPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Convert", path: "/convert" }, { name: "WEBP to JPG", path: "/convert/webp-to-jpg" }])]} />
      <ToolPageShell tool={TOOL} intro="Convert WEBP to JPG for exam portals that don't accept WEBP. Free, fast, private - nothing uploaded." howToSteps={HOW_TO} faqs={FAQS}>
        <ConvertTool fromFormat="WEBP" fromMime="image/webp" toFormat="jpeg" toExt="jpg" showQuality showBackground />
      </ToolPageShell>
    </>
  );
}
