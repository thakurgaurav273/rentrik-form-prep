import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ConvertTool } from "@/components/tools/convert/ConvertTool";

const TOOL = getToolByPath("/convert/jpg-to-png")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your JPG", text: "Drop or select a JPEG/JPG file." },
  { name: "Convert", text: "Click to convert. No settings needed - PNG is always lossless." },
  { name: "Download your PNG", text: "Note: PNG files are usually larger than JPG." },
];

const FAQS = [
  { question: "Why is the PNG file larger than the JPG?", answer: "PNG is a lossless format, which means it stores all pixel data without compression artifacts. This typically results in larger file sizes." },
  { question: "Does converting JPG to PNG improve quality?", answer: "No. The JPG compression artifacts are already baked in. Converting to PNG preserves those pixels as-is, without adding or removing quality." },
  { question: "Is my file uploaded?", answer: "No. All conversion happens in your browser." },
];

export default function JpgToPngPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Convert", path: "/convert" }, { name: "JPG to PNG", path: "/convert/jpg-to-png" }])]} />
      <ToolPageShell tool={TOOL} intro="Convert JPG to PNG online - free, fast, processed in your browser. Nothing uploaded." howToSteps={HOW_TO} faqs={FAQS}>
        <ConvertTool fromFormat="JPG" fromMime="image/jpeg" toFormat="png" toExt="png" showQuality={false} />
      </ToolPageShell>
    </>
  );
}
