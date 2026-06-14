import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { CropTool } from "@/components/tools/image/CropTool";

const TOOL = getToolByPath("/image/crop")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your image", text: "Drop or select your image file." },
  { name: "Adjust the crop box", text: "Drag to move the crop area. Pinch or scroll to zoom. Choose an aspect ratio preset or freeform crop." },
  { name: "Click Crop Image", text: "The selected region is extracted and saved." },
  { name: "Download", text: "Download your cropped image." },
];

const FAQS = [
  { question: "How do I crop to passport photo proportions?", answer: "Select the 'Passport (35:45)' aspect ratio preset. This matches standard passport photo proportions used by most Indian portals." },
  { question: "Can I crop a WEBP file?", answer: "Yes - WEBP, JPG, and PNG are all supported." },
  { question: "Is my image uploaded anywhere?", answer: "No. Cropping happens entirely in your browser using Canvas. Nothing is uploaded." },
];

export default function CropPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Crop", path: "/image/crop" }])]} />
      <ToolPageShell tool={TOOL} intro="Crop photos with free or fixed aspect ratios - touch-friendly on mobile. No upload needed." howToSteps={HOW_TO} faqs={FAQS}>
        <CropTool />
      </ToolPageShell>
    </>
  );
}
