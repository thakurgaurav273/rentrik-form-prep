import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { BackgroundRemoverTool } from "@/components/tools/image/BackgroundRemoverTool";

const TOOL = getToolByPath("/image/remove-background")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your photo", text: "Drop or select a JPG, PNG, or WEBP image." },
  { name: "Click Remove Background", text: "The AI model loads once (~20 s first time) and runs entirely in your browser." },
  { name: "Download the transparent PNG", text: "Preview the result with a checkerboard pattern, then download." },
  { name: "Add a color (optional)", text: "Use the Change Background tool to place a white, blue, or custom color behind the subject." },
];

const FAQS = [
  { question: "How long does it take?", answer: "The first image takes 20–30 seconds because the AI model (~25 MB) is downloaded to your device. After that, the model stays loaded and each additional image takes only a few seconds." },
  { question: "What format is the output?", answer: "You get a PNG with a fully transparent background. You can then use our Change Background tool to set a specific color." },
  { question: "Is my photo uploaded to any server?", answer: "No. The AI model runs entirely in your browser using WebAssembly. Your photo never leaves your device." },
  { question: "Which photos work best?", answer: "Photos with a clear subject (person, product, signature) work best. Complex, cluttered backgrounds may have rough edges around fine details like hair." },
];

export default function RemoveBackgroundPage() {
  return (
    <>
      <JsonLd data={[
        buildSoftwareAppJsonLd(TOOL),
        buildHowToJsonLd(TOOL, HOW_TO),
        buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Image Tools", path: "/image" },
          { name: "Background Remover", path: "/image/remove-background" },
        ]),
      ]} />
      <ToolPageShell
        tool={TOOL}
        intro="Remove the background from any photo and get a clean transparent PNG - free, AI-powered, and processed entirely in your browser. No upload, no signup."
        howToSteps={HOW_TO}
        faqs={FAQS}
      >
        <BackgroundRemoverTool />
      </ToolPageShell>
    </>
  );
}
