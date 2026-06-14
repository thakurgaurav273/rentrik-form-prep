import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/home/Hero";
import { ToolGrid } from "@/components/home/ToolGrid";
import { TrustSection } from "@/components/home/TrustSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Free Document Preparation for Indian Forms`,
  description: siteConfig.description,
  keywords: [
    "resize photo to kb online free", "compress pdf india", "passport photo maker online",
    "crop signature for exam", "SSC CGL photo resize", "UPSC photo size tool",
    "document preparation online", "form photo resize india",
  ],
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: `${siteConfig.name} - Free Document Preparation for Indian Forms`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: `${siteConfig.url}/og/default.png`, width: 1200, height: 630, alt: siteConfig.name }],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: `${siteConfig.name} - Free Document Preparation for Indian Forms`, description: siteConfig.description, path: "/" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]),
      ]} />
      <Container as="main">
        <Hero />
        <AdSlot size="leaderboard" />
        <ToolGrid />
        <TrustSection />
      </Container>
    </>
  );
}
