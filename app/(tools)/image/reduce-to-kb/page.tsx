import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { ReduceToKbTool } from "@/components/tools/image/ReduceToKbTool";

const TOOL = getToolByPath("/image/reduce-to-kb")!;

export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your image", text: "Drop or select a JPG, PNG, or WEBP image." },
  { name: "Select target KB", text: "Pick a preset (20 KB, 50 KB, 100 KB) or type a custom value. Most exam portals need 20–50 KB." },
  { name: "Click Reduce to KB", text: "The tool runs a binary search over quality levels to hit exactly your target size." },
  { name: "Download", text: "Download the result. The file will be at or under your target KB." },
];

const FAQS = [
  { question: "What KB size does SSC require for photos?", answer: "SSC CGL and SSC CHSL typically require the photo to be between 20 KB and 50 KB in JPEG format. Check your exam notification for exact limits." },
  { question: "What KB size does SSC require for signatures?", answer: "SSC typically requires signature files to be 10–20 KB in JPEG format." },
  { question: "What KB size does Railway (RRB) require?", answer: "RRB typically requires photo 20–50 KB and signature 10–40 KB. Always verify with the official notification." },
  { question: "Will reducing to a very small KB hurt quality?", answer: "Yes, very small targets (under 10 KB) will visibly reduce quality. Most portals accept 20–50 KB which gives good-enough quality." },
  { question: "Is my photo uploaded anywhere?", answer: "No. The entire process happens in your browser using Canvas. Nothing is ever sent to a server." },
  { question: "What if the tool can't reach my target?", answer: "It will return the smallest achievable size and show a warning. This can happen if the target is extremely small (under 5 KB). Try a slightly larger target." },
];

export default function ReduceToKbPage() {
  return (
    <>
      <JsonLd data={[
        buildSoftwareAppJsonLd(TOOL),
        buildHowToJsonLd(TOOL, HOW_TO),
        buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Reduce to KB", path: "/image/reduce-to-kb" }]),
      ]} />
      <ToolPageShell
        tool={TOOL}
        intro="Force any photo to exactly 20 KB, 50 KB, 100 KB, or any custom size for SSC, UPSC, Railway and college form portals. Processed entirely in your browser - nothing uploaded."
        howToSteps={HOW_TO}
        faqs={FAQS}
      >
        <ReduceToKbTool />
      </ToolPageShell>
    </>
  );
}
