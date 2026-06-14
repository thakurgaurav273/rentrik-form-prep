import type { Metadata } from "next";
import type { ToolEntry } from "@/types/tools";
import { siteConfig } from "@/config/site";

export function buildToolMetadata(tool: ToolEntry): Metadata {
  return {
    title: `${tool.title} | Rentrik Form Prep`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `${siteConfig.url}${tool.path}`,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `${siteConfig.url}${tool.path}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}/og/${tool.category}.png`,
          width: 1200,
          height: 630,
          alt: tool.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
    },
    robots: { index: true, follow: true },
  };
}

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title: `${opts.title} | Rentrik Form Prep`,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: `${siteConfig.url}${opts.path}` },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: `${siteConfig.url}${opts.path}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: `${siteConfig.url}/og/default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
    robots: { index: true, follow: true },
  };
}
