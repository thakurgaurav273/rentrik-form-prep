import type { MetadataRoute } from "next";
import { TOOLS } from "@/config/tools";
import { siteConfig } from "@/config/site";

const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/image`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/pdf`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/convert`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${siteConfig.url}${tool.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}
