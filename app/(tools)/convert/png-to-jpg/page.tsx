import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ConvertTool } from "@/components/tools/convert/ConvertTool";

const TOOL = getToolByPath("/convert/png-to-jpg")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your PNG", text: "Drop or select a PNG file." },
  { name: "Set quality and background", text: "Set JPEG quality (90% is good). Choose background color for any transparent areas." },
  { name: "Convert", text: "Click to convert to JPG." },
  { name: "Download your JPG", text: "Save the converted file." },
];

const FAQS = [
  { question: "Why should I convert PNG to JPG for forms?", answer: "Most Indian exam portals only accept JPEG files. PNG files are often rejected. Converting to JPEG also makes the file smaller." },
  { question: "What happens to transparent areas in the PNG?", answer: "JPG doesn't support transparency. Transparent areas are filled with your chosen background color (white by default)." },
  { question: "Will quality be reduced?", answer: "At 90% quality, the JPG will look nearly identical to the PNG for normal photos. Use 100% for maximum quality." },
  { question: "Is my file uploaded?", answer: "No. All conversion happens in your browser. Nothing is uploaded." },
];

export default function PngToJpgPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Convert", path: "/convert" }, { name: "PNG to JPG", path: "/convert/png-to-jpg" }])]} />
      <ToolPageShell tool={TOOL} intro="Convert PNG to JPG online - essential for exam portals that only accept JPEG. Smaller file size, widely accepted. Nothing uploaded." howToSteps={HOW_TO} faqs={FAQS}>
        <ConvertTool fromFormat="PNG" fromMime="image/png" toFormat="jpeg" toExt="jpg" showQuality showBackground />
      </ToolPageShell>
    </>
  );
}
