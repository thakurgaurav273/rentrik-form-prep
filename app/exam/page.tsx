import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { EXAM_PRESETS, EXAM_CATEGORIES } from "@/config/exam-presets";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Exam Toolkit – Auto-Format Photo & Signature for SSC, UPSC, Railway, Banking",
  description:
    "Select your exam and instantly get a perfectly formatted photo and signature. SSC CGL, UPSC, Railway, IBPS, SBI, NEET, JEE and more. Free, private, no upload.",
  path: "/exam",
  keywords: [
    "ssc cgl photo size", "upsc photo size", "railway exam photo", "ibps photo size",
    "exam photo format online", "resize photo for exam", "ssc photo kb",
  ],
});

type Category = keyof typeof EXAM_CATEGORIES;

export default function ExamHubPage() {
  const byCategory = EXAM_PRESETS.reduce<Record<string, typeof EXAM_PRESETS>>((acc, p) => {
    const cat = p.category;
    acc[cat] = [...(acc[cat] ?? []), p];
    return acc;
  }, {});

  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: "Exam Toolkit – Auto-Format Photo & Signature", description: "Select your exam and get a perfectly formatted photo and signature instantly.", path: "/exam" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Exam Toolkit", path: "/exam" }]),
      ]} />
      <Container as="main" className="py-8 sm:py-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Exam Toolkit</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Auto-Format Your Photo & Signature for Any Exam
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Pick your exam below. We&apos;ll resize your photo and signature to commonly required
            dimensions and KB limits - in your browser, nothing uploaded.
          </p>
          <p className="text-xs text-muted-foreground border rounded-md px-3 py-2 bg-muted/40 max-w-xl">
            Dimensions shown are based on widely referenced guidelines and may differ from the current official notification. Always verify with the latest notification PDF before submitting.
          </p>
        </div>

        {(Object.entries(byCategory) as [Category, typeof EXAM_PRESETS][]).map(([cat, exams]) => (
          <section key={cat} aria-labelledby={`${cat}-heading`}>
            <h2 id={`${cat}-heading`} className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {EXAM_CATEGORIES[cat]}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="group flex items-center justify-between rounded-xl border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{exam.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Photo {exam.photo.widthPx}×{exam.photo.heightPx}px · {exam.photo.maxKB} KB max
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2 transition-colors" aria-hidden />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
