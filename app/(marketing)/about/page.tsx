import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "About Rentrik Form Prep",
  description: "Learn about Rentrik Form Prep - India's free, privacy-first document preparation platform for exam and application forms.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: "About Rentrik Form Prep", description: "India's free, privacy-first document preparation platform for exam and application forms.", path: "/about" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
      ]} />
      <Container as="main" className="py-10 sm:py-16 max-w-prose">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">About Rentrik Form Prep</h1>

        <div className="prose prose-slate max-w-none space-y-4 text-base text-muted-foreground">
          <p>
            Every day in India, millions of students, job seekers, and exam applicants get blocked by a single
            frustrating message: <em>&quot;Upload photo (max 50 KB, 200×230 px, JPEG)&quot;</em> - with no tool to help them
            comply.
          </p>
          <p>
            Rentrik Form Prep is a free, privacy-first platform that solves this problem in under a minute.
            Resize photos, compress PDFs, crop signatures, convert formats - all in your browser, on your phone,
            with nothing ever uploaded to a server.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Our promise</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-foreground">Free, always.</strong> No premium plans, no hidden paywalls.</li>
            <li><strong className="text-foreground">Private.</strong> Your documents never leave your device. We technically cannot see them.</li>
            <li><strong className="text-foreground">No login.</strong> No email, no account, no data collected about you.</li>
            <li><strong className="text-foreground">Mobile-first.</strong> Built for budget Android phones on mobile data.</li>
          </ul>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">How it works</h2>
          <p>
            All processing uses the Canvas API, pdf-lib, and PDF.js - technologies built into your browser.
            When you resize an image or compress a PDF, the computation happens on your device, and the result
            is downloaded directly to you. No upload. No wait. No server.
          </p>
          <p>
            Rentrik Form Prep is part of the Rentrik product family, built to solve practical problems for
            Indian users at scale.
          </p>
        </div>
      </Container>
    </>
  );
}
