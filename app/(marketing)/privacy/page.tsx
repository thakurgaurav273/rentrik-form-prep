import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Rentrik Form Prep privacy policy - your files never leave your device. We use Google Analytics and Google AdSense.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: "Privacy Policy", description: "Your files never leave your device. We use Google Analytics and AdSense.", path: "/privacy" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]),
      ]} />
      <Container as="main" className="py-10 sm:py-16 max-w-prose">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-base text-muted-foreground">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your files never leave your device</h2>
            <p>
              Rentrik Form Prep does <strong className="text-foreground">not upload your files to any server</strong>.
              All image, PDF, and document processing happens entirely in your browser using browser-native
              APIs (Canvas API, pdf-lib, PDF.js). Your photos, signatures, and documents are never sent
              over the internet. The processed result downloads directly to your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">No personal data collected by us</h2>
            <p>
              We do not collect your name, email address, phone number, Aadhaar number, or any other
              personally identifiable information. There is no user account system. We have no knowledge
              of who you are or what files you process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Analytics - Google Analytics (GA4)</h2>
            <p>
              We use <strong className="text-foreground">Google Analytics 4</strong> to understand which
              tools are most useful and how visitors use the site. Google Analytics collects anonymous
              usage data such as pages visited, time on page, and general location (country/city level).
              It does <strong className="text-foreground">not</strong> receive or process any of your
              uploaded files.
            </p>
            <p className="mt-2">
              Google Analytics sets cookies (<code className="text-xs bg-muted px-1 py-0.5 rounded">_ga</code>,{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">_ga_*</code>) to distinguish unique
              visitors. You can opt out via the{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Advertising - Google AdSense</h2>
            <p>
              We use <strong className="text-foreground">Google AdSense</strong> to display advertisements
              that help fund this free platform. Google AdSense may use cookies and similar technologies
              to show relevant ads based on your browsing activity across websites.
            </p>
            <p className="mt-2">
              Google&apos;s advertising cookies are separate from anything related to your document files -
              AdSense has no access to files you process on this site. You can manage ad personalisation
              at{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google Ad Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Cookies summary</h2>
            <div className="overflow-x-auto rounded-lg border mt-2">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Cookie</th>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Set by</th>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_ga, _ga_*</td>
                    <td className="px-3 py-2">Google Analytics</td>
                    <td className="px-3 py-2">Anonymous usage statistics</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">__gads, __gpi</td>
                    <td className="px-3 py-2">Google AdSense</td>
                    <td className="px-3 py-2">Ad delivery and frequency</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm">
              We do not set any first-party cookies ourselves. The cookies above are set by Google.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Third-party services</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong className="text-foreground">Google Analytics</strong> - governed by{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google&apos;s Privacy Policy</a>
              </li>
              <li>
                <strong className="text-foreground">Google AdSense</strong> - governed by{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google&apos;s Privacy Policy</a>
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> - our hosting provider. Vercel may log
                standard server access data (IP address, request time). See{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel&apos;s Privacy Policy</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
            <p>
              For any privacy concerns, contact us at{" "}
              <a href="mailto:hr.rentrik@gmail.in" className="text-primary hover:underline">
                hr.rentrik@gmail.in
              </a>
              .
            </p>
          </section>

        </div>
      </Container>
    </>
  );
}
