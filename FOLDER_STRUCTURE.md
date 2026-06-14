# FOLDER_STRUCTURE.md

A scalable **Next.js 15 App Router** architecture. The guiding rule: **pages are thin and static (SEO), UI widgets are isolated client components, and processing engines are pure functions with no UI and no network.** This separation is what keeps the codebase small now and lets it scale to millions of users and the Exam Toolkit later.

---

## Top-Level Layout

```
rentrik-form-prep/
├── app/                      # Routes (App Router) - Server Components by default
├── components/               # Reusable React components (UI + tool widgets)
├── hooks/                    # Reusable client hooks
├── lib/                      # Pure processing engines + core helpers (no React, no network)
├── services/                 # Higher-level orchestration (workers, file IO, future analytics)
├── utils/                    # Small generic utilities (formatting, validation, constants)
├── config/                   # Tool registry, exam presets (Phase 2), site config
├── content/                  # Blog posts (MDX) + static copy
├── public/                   # Static assets (icons, OG images, manifest)
├── styles/                   # (unused - globals.css lives at app/globals.css per Next.js convention)
├── types/                    # Shared TypeScript types
├── workers/                  # Web Worker entry points
├── CLAUDE.md                 # AI/dev master context
├── PRODUCT_REQUIREMENTS.md
├── SYSTEM_DESIGN.md
├── TECH_STACK.md
├── UI_UX_GUIDELINES.md
├── MVP_ROADMAP.md
├── SEO_STRATEGY.md
├── TOOL_SPECIFICATIONS.md
├── CLAUDE_BUILD_RULES.md
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## `app/` - Routing & SEO

```
app/
├── layout.tsx                # Root layout: <html lang>, fonts, theme, header/footer, JSON-LD (Org/WebSite)
├── page.tsx                  # Home (Server Component): hero, tool grid, trust messaging
├── globals.css               # Tailwind base/components/utilities + token CSS vars
├── sitemap.ts                # Dynamic sitemap from tool registry + blog
├── robots.ts                 # robots.txt
├── not-found.tsx             # 404 → links back into tool hubs
├── opengraph-image.tsx       # (optional) default OG image
│
├── (marketing)/              # Route group: static informational pages
│   ├── about/page.tsx
│   ├── privacy/page.tsx
│   └── contact/page.tsx
│
├── (tools)/                  # Route group for all tools (shared tools layout)
│   ├── layout.tsx            # Tools layout: breadcrumb slot, ad-slot regions (no-op MVP)
│   │
│   ├── image/
│   │   ├── page.tsx                      # /image  - Image tools category hub
│   │   ├── resize/page.tsx               # /image/resize
│   │   ├── compress/page.tsx
│   │   ├── reduce-to-kb/page.tsx
│   │   ├── crop/page.tsx
│   │   ├── signature-cropper/page.tsx
│   │   ├── passport-photo-maker/page.tsx
│   │   └── background-color-changer/page.tsx
│   │
│   ├── pdf/
│   │   ├── page.tsx                       # /pdf - PDF tools hub
│   │   ├── compress/page.tsx
│   │   ├── merge/page.tsx
│   │   ├── split/page.tsx
│   │   ├── image-to-pdf/page.tsx
│   │   └── pdf-to-image/page.tsx
│   │
│   └── convert/
│       ├── page.tsx                       # /convert - Conversion hub
│       ├── png-to-jpg/page.tsx
│       ├── jpg-to-png/page.tsx
│       ├── webp-to-jpg/page.tsx
│       └── webp-to-png/page.tsx
│
├── blog/
│   ├── page.tsx                           # Blog index
│   └── [slug]/page.tsx                    # Article (renders MDX from content/)
│
└── exam/                                  # Phase 2 (Exam Toolkit)
    ├── page.tsx                           # /exam - exam hub
    └── [exam]/page.tsx                    # /exam/ssc-cgl etc. (driven by config/exam-presets)
```

**Page convention:** every tool `page.tsx` is a **Server Component** that:
1. Exports `metadata` (centralized helper using the tool registry).
2. Emits JSON-LD (SoftwareApplication + HowTo + FAQPage + Breadcrumb).
3. Renders `ToolPageShell` with static copy, "how to use", FAQ, related tools.
4. Mounts the tool widget via `next/dynamic({ ssr: false })` (lazy, client-side).

---

## `components/`

```
components/
├── ui/                       # shadcn/ui primitives (button, slider, dialog, input, tabs, ...)
│
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Container.tsx
│   ├── Breadcrumbs.tsx
│   └── ThemeToggle.tsx
│
├── seo/
│   ├── JsonLd.tsx            # Renders structured data
│   └── (metadata helpers live in lib/seo)
│
├── ads/
│   └── AdSlot.tsx            # No-op placeholder in MVP; reserves space (CLS-safe)
│
├── shared/                   # Reusable across all tools
│   ├── Dropzone.tsx
│   ├── FilePreview.tsx
│   ├── ToolControls.tsx
│   ├── ProcessButton.tsx
│   ├── DownloadButton.tsx
│   ├── ResultStats.tsx
│   ├── PrivacyNote.tsx
│   ├── ProgressBar.tsx
│   └── ToolPageShell.tsx     # Server component: title, intro, widget slot, FAQ, related tools
│
├── home/
│   ├── Hero.tsx
│   ├── ToolGrid.tsx
│   └── TrustSection.tsx
│
└── tools/                    # One folder per domain; each widget is a Client Component
    ├── image/
    │   ├── ResizeTool.tsx
    │   ├── CompressTool.tsx
    │   ├── ReduceToKbTool.tsx
    │   ├── CropTool.tsx
    │   ├── SignatureCropperTool.tsx
    │   ├── PassportPhotoMaker.tsx
    │   └── BackgroundColorChanger.tsx
    ├── pdf/
    │   ├── CompressPdfTool.tsx
    │   ├── MergePdfTool.tsx
    │   ├── SplitPdfTool.tsx
    │   ├── ImageToPdfTool.tsx
    │   └── PdfToImageTool.tsx
    └── convert/
        └── ConvertTool.tsx   # Single configurable widget; 4 pages pass format props
```

---

## `lib/` - Pure Engines & Core (no React, no network)

```
lib/
├── image/
│   ├── resize.ts
│   ├── compress.ts
│   ├── reduce-to-kb.ts
│   ├── crop.ts
│   ├── signature.ts
│   ├── passport.ts
│   ├── background.ts
│   ├── convert.ts            # shared PNG/JPG/WEBP conversion engine
│   └── canvas.ts             # shared canvas helpers (decode, draw, toBlob, EXIF)
│
├── pdf/
│   ├── compress.ts
│   ├── merge.ts
│   ├── split.ts
│   ├── image-to-pdf.ts
│   ├── pdf-to-image.ts
│   └── pdf-utils.ts          # shared pdf-lib / pdfjs helpers
│
├── seo/
│   ├── metadata.ts           # buildMetadata(toolEntry) -> Metadata
│   ├── jsonld.ts             # builders for SoftwareApplication/HowTo/FAQPage/Breadcrumb
│   └── og.ts
│
└── files/
    ├── download.ts           # save blob
    ├── read.ts               # read File -> data
    └── zip.ts                # (Phase 2) bundle multiple outputs
```

> **Rule:** engines in `lib/` import no React and perform no `fetch`. They are unit-testable pure functions: `(File, Options) => Promise<Blob>`. Co-locate tests as `*.test.ts`.

---

## `hooks/`

```
hooks/
├── useImageFile.ts           # selecting/validating/previewing an image file
├── usePdfFile.ts
├── useFileDownload.ts
├── useWorker.ts              # generic Web Worker runner with progress
├── useProcessing.ts          # processing state machine (idle/working/done/error)
└── useMediaQuery.ts
```

---

## `services/` - Orchestration

```
services/
├── processing/
│   ├── runImageJob.ts        # orchestrates engine + worker + progress for image tools
│   └── runPdfJob.ts
├── worker-client.ts          # message contract with workers/
└── analytics.ts              # (Phase 2.5) thin, privacy-respecting wrapper; no-op in MVP
```

> `services/` is where engines (`lib/`) get wired to workers, progress, and (later) analytics. UI talks to `services/`/`hooks/`, not directly to workers.

---

## `workers/`

```
workers/
├── image.worker.ts           # imports lib/image engines; runs heavy ops off main thread
└── pdf.worker.ts             # imports lib/pdf engines (render/compress/split)
```

---

## `utils/`

```
utils/
├── format.ts                 # bytesToKB, formatSize, formatDimensions
├── validate.ts               # zod schemas + helpers for file type/size/options
├── mime.ts                   # MIME helpers, format detection
└── constants.ts              # size limits, accepted types, presets defaults
```

> **Note:** The `cn()` helper (clsx + tailwind-merge) lives at `lib/utils.ts` rather than `utils/cn.ts`.
> This is intentional - shadcn/ui hardcodes this path in `components.json` aliases and regenerates it
> on every `shadcn add`. Moving it would break the shadcn toolchain.

---

## `config/`

```
config/
├── site.ts                   # name, domain, social, default metadata
├── tools.ts                  # TOOL REGISTRY - single source of truth (see below)
└── exam-presets.ts           # Phase 2: per-exam preset configs (zod-validated)
```

**Tool registry (`config/tools.ts`)** drives navigation, the sitemap, metadata, the home grid, and related-tool links - so adding a tool updates everything in one place:

```ts
export interface ToolEntry {
  slug: string;            // "resize"
  category: "image" | "pdf" | "convert";
  path: string;            // "/image/resize"
  title: string;           // SEO H1 / title
  description: string;     // meta description
  keywords: string[];
  related: string[];       // other tool paths
  component: () => Promise<unknown>; // dynamic import of the widget
}
export const TOOLS: ToolEntry[] = [ /* ... */ ];
```

---

## `content/`

```
content/
└── blog/
    ├── reduce-photo-to-50kb.mdx
    ├── ssc-photo-signature-size.mdx
    └── merge-pdf-free.mdx
```

---

## `types/`

```
types/
├── tools.ts                  # OutputFormat, options interfaces shared across engines
├── pdf.ts
└── exam.ts                   # Phase 2 preset types (inferred from zod)
```

---

## `public/`

```
public/
├── icons/                    # favicon, app icons
├── og/                       # per-category OG images
├── manifest.webmanifest      # (PWA-ready, Phase 3)
└── robots/                   # (if any static assets)
```

---

## Scaling Principles Encoded in This Structure

1. **Add a tool = add 1 engine (`lib/`) + 1 widget (`components/tools/`) + 1 page (`app/`) + 1 registry entry (`config/tools.ts`).** Sitemap, nav, metadata, and related links update automatically.
2. **Engines are isolated and pure** → testable, reusable, worker-friendly, and Exam-Toolkit-ready.
3. **Server vs Client boundary is explicit** → pages static for SEO, widgets lazy for performance.
4. **One source of truth** (tool registry, design tokens, exam presets) → no drift, no duplication.
5. **Route groups** (`(tools)`, `(marketing)`) keep layouts and concerns cleanly separated as the site grows.
