import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Rentrik Form Prep privacy policy - your files never leave your device. No data collected, no cookies, no tracking.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: "Privacy Policy", description: "Your files never leave your device. No data collected, no cookies, no tracking.", path: "/privacy" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]),
      ]} />
      <Container as="main" className="py-10 sm:py-16 max-w-prose">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

        <div className="space-y-6 text-base text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">No file uploads</h2>
            <p>
              Rentrik Form Prep does not upload your files to any server. All image, PDF, and document processing
              happens entirely in your browser using browser-native APIs (Canvas API, pdf-lib, PDF.js).
              Your documents never leave your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">No personal data collected</h2>
            <p>
              We do not collect your name, email address, phone number, or any other personally identifiable
              information. There is no user account system. We have no knowledge of who you are.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Analytics (future)</h2>
            <p>
              We may add lightweight, privacy-respecting analytics (such as Vercel Analytics or Plausible)
              in the future to understand which tools are most useful. These tools collect aggregate usage
              statistics and do not track individuals. This policy will be updated when analytics are added.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Cookies</h2>
            <p>
              We do not use tracking cookies. Standard browser functionality (local storage for UI preferences)
              may be used in future updates, but only for your device&apos;s own preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Advertising (future)</h2>
            <p>
              We plan to add Google AdSense in the future to help fund the platform. This will involve
              Google&apos;s ad scripts, which may use cookies. We will update this policy and provide consent
              options before enabling advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
            <p>
              For any privacy concerns, contact us at{" "}
              <a href="mailto:privacy@rentrik.in" className="text-primary hover:underline">
                privacy@rentrik.in
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
