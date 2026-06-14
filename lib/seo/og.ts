import type { ToolEntry } from "@/types/tools";

// Placeholder for dynamic OG image generation (Phase 2).
// Will use @vercel/og or next/og to generate per-tool OG images.
export function buildOgImageUrl(tool: ToolEntry): string {
  return `/og/${tool.category}-${tool.slug}.png`;
}
