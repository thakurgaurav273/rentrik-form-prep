import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ConvertTool } from "@/components/tools/convert/ConvertTool";

const TOOL = getToolByPath("/convert/webp-to-png")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your WEBP file", text: "Drop or select a WEBP image." },
  { name: "Convert", text: "Click Convert. Transparency is preserved in the PNG output." },
  { name: "Download your PNG", text: "Save the converted PNG file." },
];

const FAQS = [
  { question: "Does WEBP to PNG preserve transparency?", answer: "Yes. PNG supports transparency (alpha channel), so transparent WEBP images will retain their transparency in the output PNG." },
  { question: "Is the PNG file larger than WEBP?", answer: "Usually yes. PNG is lossless and typically larger than WEBP for the same visual content." },
  { question: "Is my file uploaded?", answer: "No. Conversion happens in your browser. Nothing is uploaded." },
];

export default function WebpToPngPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Convert", path: "/convert" }, { name: "WEBP to PNG", path: "/convert/webp-to-png" }])]} />
      <ToolPageShell tool={TOOL} intro="Convert WEBP to PNG online, preserving transparency. Free, private, no upload needed." howToSteps={HOW_TO} faqs={FAQS}>
        <ConvertTool fromFormat="WEBP" fromMime="image/webp" toFormat="png" toExt="png" showQuality={false} />
      </ToolPageShell>
    </>
  );
}
