import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { BackgroundColorChanger } from "@/components/tools/image/BackgroundColorChanger";

const TOOL = getToolByPath("/image/background-color-changer")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your photo", text: "Works best with photos taken on a plain, evenly-lit background." },
  { name: "Pick a target background color", text: "Choose white, blue, or any custom color." },
  { name: "Adjust sensitivity", text: "Higher values replace more pixels. Adjust if edges look rough." },
  { name: "Process and download", text: "Preview the result and download your photo with the new background." },
];

const FAQS = [
  { question: "Does this work for complex backgrounds?", answer: "The MVP uses a corner-color sampling approach, which works well for plain, evenly-lit backgrounds. Complex or gradient backgrounds may need manual touch-up." },
  { question: "What background color do most exam forms require?", answer: "Most Indian government exam forms require a plain white background. Some require light blue or red." },
  { question: "Is my photo uploaded anywhere?", answer: "No. Background processing happens entirely in your browser using Canvas. Nothing is uploaded." },
];

export default function BackgroundChangerPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Change Background", path: "/image/background-color-changer" }])]} />
      <ToolPageShell tool={TOOL} intro="Replace your photo background with white, blue, or any custom color - free online tool for exam form photos, all in your browser." howToSteps={HOW_TO} faqs={FAQS}>
        <BackgroundColorChanger />
      </ToolPageShell>
    </>
  );
}
