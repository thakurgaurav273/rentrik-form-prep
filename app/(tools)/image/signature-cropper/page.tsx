import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { SignatureCropperTool } from "@/components/tools/image/SignatureCropperTool";

const TOOL = getToolByPath("/image/signature-cropper")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Take a photo of your signature", text: "Sign on white paper, photograph it, and upload the image." },
  { name: "Crop to the signature", text: "Drag the crop box to frame just your signature." },
  { name: "Choose background", text: "White background (JPEG) for most forms. Transparent (PNG) for advanced use." },
  { name: "Set target KB (optional)", text: "Enter 20 KB for most SSC/Railway portals." },
  { name: "Process and download", text: "Get a clean, form-ready signature image." },
];

const FAQS = [
  { question: "What KB size is required for signature in SSC?", answer: "SSC typically requires signatures to be 10–20 KB in JPEG format with white background. Check your exam notification." },
  { question: "My signature ink is blue - will it look correct?", answer: "Yes. The tool only removes the paper/background. Signature ink color is preserved." },
  { question: "The background is not fully removed - what should I do?", answer: "Increase the 'sensitivity' slider. If your paper has a slightly off-white or uneven color, you may need a higher threshold." },
  { question: "Is my signature uploaded to any server?", answer: "No. Everything runs in your browser. Your signature image is private and never transmitted." },
];

export default function SignatureCropperPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Signature Cropper", path: "/image/signature-cropper" }])]} />
      <ToolPageShell tool={TOOL} intro="Crop your handwritten signature, remove the background, and reduce to the exact KB required by SSC, UPSC, Railway, and other exam portals." howToSteps={HOW_TO} faqs={FAQS}>
        <SignatureCropperTool />
      </ToolPageShell>
    </>
  );
}
