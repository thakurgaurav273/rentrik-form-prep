import type { ToolEntry } from "@/types/tools";
import { siteConfig } from "@/config/site";

interface WebPageOpts {
  title: string;
  description: string;
  path: string;
}

interface CollectionPageOpts {
  title: string;
  description: string;
  path: string;
  tools: ToolEntry[];
}

interface HowToStep {
  name: string;
  text: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-IN",
  };
}

export function buildWebPageJsonLd({ title, description, path }: WebPageOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteConfig.url}${path}`,
    isPartOf: { "@type": "WebSite", url: siteConfig.url },
    inLanguage: "en-IN",
  };
}

export function buildCollectionPageJsonLd({ title, description, path, tools }: CollectionPageOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: "en-IN",
    hasPart: tools.map((t) => ({
      "@type": "SoftwareApplication",
      name: t.title,
      url: `${siteConfig.url}${t.path}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    })),
  };
}

export function buildSoftwareAppJsonLd(tool: ToolEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    url: `${siteConfig.url}${tool.path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}

export function buildHowToJsonLd(tool: ToolEntry, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.shortTitle}`,
    description: tool.description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function buildFaqJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
