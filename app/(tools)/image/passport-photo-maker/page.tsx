import type { Metadata } from "next";
import { ToolPageShell } from "@/components/shared/ToolPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolByPath } from "@/config/tools";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildSoftwareAppJsonLd, buildHowToJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

import { PassportPhotoMaker } from "@/components/tools/image/PassportPhotoMaker";

const TOOL = getToolByPath("/image/passport-photo-maker")!;
export const metadata: Metadata = buildToolMetadata(TOOL);

const HOW_TO = [
  { name: "Upload your photo", text: "Use a recent, clear photo with a plain background. Your face should be well-lit." },
  { name: "Select a size preset", text: "Pick from standard sizes (35×45mm, SSC 200×230px, UPSC 300×300px) or enter custom dimensions." },
  { name: "Position your face", text: "Drag and zoom so your face fills the guide frame in the crop area." },
  { name: "Choose background", text: "Select white or blue background as required by your form." },
  { name: "Download", text: "Get a passport-size photo at the exact dimensions required." },
];

const FAQS = [
  { question: "What size photo does SSC require?", answer: "SSC CGL typically requires 200×230 pixels, JPEG, between 20–50 KB with a plain white or light background. Select the 'SSC CGL' preset." },
  { question: "What photo size does UPSC require?", answer: "UPSC generally requires photos at 300×300 pixels or 35×45mm at 96 DPI." },
  { question: "Can I make a passport photo with a blue background?", answer: "Yes. Select 'Blue background' in the background option." },
  { question: "Is my photo uploaded to any server?", answer: "No. Everything is processed locally in your browser. Nothing is ever uploaded." },
];

export default function PassportPhotoPage() {
  return (
    <>
      <JsonLd data={[buildSoftwareAppJsonLd(TOOL), buildHowToJsonLd(TOOL, HOW_TO), buildFaqJsonLd(FAQS),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Image Tools", path: "/image" }, { name: "Passport Photo", path: "/image/passport-photo-maker" }])]} />
      <ToolPageShell tool={TOOL} intro="Make passport size photos for SSC, UPSC, Railway exam forms and any other application - correct dimensions, white or blue background, all in your browser." howToSteps={HOW_TO} faqs={FAQS}>
        <PassportPhotoMaker />
      </ToolPageShell>
    </>
  );
}
