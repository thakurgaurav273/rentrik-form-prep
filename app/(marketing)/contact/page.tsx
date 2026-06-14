import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Get in touch with the Rentrik Form Prep team. Report bugs, suggest features, or ask about the platform.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: "Contact Rentrik Form Prep", description: "Get in touch with the Rentrik Form Prep team.", path: "/contact" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
      ]} />
      <Container as="main" className="py-10 sm:py-16 max-w-prose">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Contact</h1>
        <div className="space-y-4 text-base text-muted-foreground">
          <p>
            Have a suggestion, found a bug, or need a specific tool?
            We&apos;d love to hear from you.
          </p>
          <p>
            Email us at{" "}
            <a href="mailto:hello@rentrik.in" className="text-primary hover:underline">
              hello@rentrik.in
            </a>
          </p>
          <p className="text-sm">
            We typically respond within 1–2 business days. For privacy concerns, see our{" "}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
