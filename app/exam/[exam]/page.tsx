import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import { EXAM_PRESETS, EXAM_PRESETS_BY_ID } from "@/config/exam-presets";
import { ExamToolkit } from "@/components/tools/exam/ExamToolkit";

export function generateStaticParams() {
  return EXAM_PRESETS.map((p) => ({ exam: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const { exam: examId } = await params;
  const preset = EXAM_PRESETS_BY_ID[examId];
  if (!preset) return {};

  const title = `${preset.name} Photo & Signature Size – Auto-Resize Online Free`;
  const description = `Automatically resize your photo to ${preset.photo.widthPx}×${preset.photo.heightPx}px (${preset.photo.maxKB} KB) and signature to ${preset.signature.widthPx}×${preset.signature.heightPx}px (${preset.signature.maxKB} KB) for ${preset.name}. Free, in-browser, nothing uploaded.`;

  return {
    title,
    description,
    keywords: [`${preset.name} photo size`, `${preset.name} signature size`, `${preset.name.toLowerCase()} photo kb`, "exam photo resize online", "exam signature resize free"],
    alternates: { canonical: `${siteConfig.url}/exam/${preset.id}` },
    openGraph: { title, description, url: `${siteConfig.url}/exam/${preset.id}` },
  };
}

export default async function ExamPage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam: examId } = await params;
  const preset = EXAM_PRESETS_BY_ID[examId];
  if (!preset) notFound();

  const howToSteps = [
    { name: "Select your exam", text: `Choose ${preset.name} from the exam list.` },
    { name: "Upload your photo", text: `Upload any JPG, PNG or WEBP photo. The tool resizes it to ${preset.photo.widthPx}×${preset.photo.heightPx}px and compresses to under ${preset.photo.maxKB} KB automatically.` },
    { name: "Upload your signature", text: `Upload your signature scan. It will be resized to ${preset.signature.widthPx}×${preset.signature.heightPx}px and compressed to under ${preset.signature.maxKB} KB.` },
    { name: "Download", text: "Download the formatted photo and signature. Both are now compliant with official specs." },
  ];

  const faqs = [
    { question: `What photo size does ${preset.name} require?`, answer: `${preset.name} requires a photo of ${preset.photo.widthPx}×${preset.photo.heightPx} pixels, between ${preset.photo.minKB}–${preset.photo.maxKB} KB, in ${preset.photo.format.toUpperCase()} format with a ${preset.photo.background === "#FFFFFF" ? "white" : "light"} background.` },
    { question: `What signature size does ${preset.name} require?`, answer: `${preset.name} requires a signature of ${preset.signature.widthPx}×${preset.signature.heightPx} pixels, between ${preset.signature.minKB}–${preset.signature.maxKB} KB, in ${preset.signature.format.toUpperCase()} format.` },
    { question: "Is my photo uploaded to any server?", answer: "No. All resizing and compression happens entirely in your browser. Your files are never sent to any server." },
    { question: "What if my photo doesn't meet the requirements after processing?", answer: "The tool enforces exact pixel dimensions and compresses to under the maximum KB. If the KB is still above the limit, try using a simpler background or a cleaner photo." },
    { question: "Can I use this on mobile?", answer: "Yes. The tool is fully mobile-friendly. You can upload directly from your phone camera or gallery." },
  ];

  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: `${preset.name} Photo & Signature Size – Auto-Resize`, description: `Resize photo and signature for ${preset.name} automatically.`, path: `/exam/${preset.id}` }),
        buildHowToJsonLd({ title: preset.name, shortTitle: preset.name, description: `Auto-format photo and signature for ${preset.name}`, path: `/exam/${preset.id}`, keywords: [], related: [], slug: preset.id, icon: "", category: "image" }, howToSteps),
        buildFaqJsonLd(faqs),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Exam Toolkit", path: "/exam" }, { name: preset.name, path: `/exam/${preset.id}` }]),
      ]} />
      <Container as="main" className="py-6 sm:py-10 space-y-8">
        <div className="space-y-3">
          <Breadcrumbs items={[{ label: "Exam Toolkit", href: "/exam" }, { label: preset.name }]} />
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            {preset.name} Photo & Signature Resizer
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-prose">
            Auto-format your photo and signature to meet <strong>{preset.fullName}</strong> official specifications.
            Photo: {preset.photo.widthPx}×{preset.photo.heightPx}px · max {preset.photo.maxKB} KB.
            Signature: {preset.signature.widthPx}×{preset.signature.heightPx}px · max {preset.signature.maxKB} KB.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <ExamToolkit initialExamId={preset.id} />
        </div>

        {/* How to use */}
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-lg sm:text-2xl font-semibold mb-4">How to use</h2>
          <ol className="space-y-3">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="font-medium text-sm">{step.name}</p>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Spec table */}
        <section aria-labelledby="specs-heading">
          <h2 id="specs-heading" className="text-lg sm:text-2xl font-semibold mb-4">Official {preset.name} Document Specifications</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Document</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dimensions</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Size</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Format</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-medium">Photo</td>
                  <td className="px-4 py-3">{preset.photo.widthPx} × {preset.photo.heightPx} px</td>
                  <td className="px-4 py-3">{preset.photo.minKB}–{preset.photo.maxKB} KB</td>
                  <td className="px-4 py-3 uppercase">{preset.photo.format}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Signature</td>
                  <td className="px-4 py-3">{preset.signature.widthPx} × {preset.signature.heightPx} px</td>
                  <td className="px-4 py-3">{preset.signature.minKB}–{preset.signature.maxKB} KB</td>
                  <td className="px-4 py-3 uppercase">{preset.signature.format}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {preset.notes && <p className="mt-2 text-xs text-muted-foreground">{preset.notes}</p>}
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg sm:text-2xl font-semibold mb-4">Frequently asked questions</h2>
          <dl className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <dt className="font-medium text-sm sm:text-base">{faq.question}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </>
  );
}
