# MVP_ROADMAP.md

Sequenced build plan. Each phase ends with something shippable. We bias toward **shipping a few tools fully** over many tools half-done. Engines are built **configurable from day one** so the Exam Toolkit (Phase 2) reuses them.

---

## Guiding Sequencing Logic

1. **Platform shell first** (routing, layout, SEO, shared components) - so every later tool is a drop-in.
2. **Highest-demand tools first** - the ones that unblock the most users: *Reduce to Exact KB*, *Resize*, *Compress*, *Image→PDF*, *Merge/Compress PDF*. These map directly to "form rejected my upload" pain.
3. **Conversions are cheap** - PNG/JPG/WEBP conversions share one engine; batch them in early.
4. **Polish + SEO content** before chasing more features.

---

## 2-Day Build Plan (Prototype / Walking Skeleton)

**Goal:** A live, deployed site with the shell and 2–3 working flagship tools.

### Day 1 - Foundation
- [ ] `create-next-app` (Next 15, TS, Tailwind, App Router). Init shadcn/ui, ESLint, Prettier.
- [ ] Define design tokens (colors, radius, type) per `UI_UX_GUIDELINES.md`.
- [ ] Build the **app shell**: header, footer, container, theme.
- [ ] Build shared components: `Dropzone`, `FilePreview`, `ProcessButton`, `DownloadButton`, `ResultStats`, `PrivacyNote`, `ToolPageShell`, `AdSlot` (no-op).
- [ ] Set up routing structure (`/image/*`, `/pdf/*`, `/convert/*`) and a tool registry (metadata-driven).
- [ ] SEO baseline: metadata API, `robots.ts`, dynamic `sitemap.ts`, canonical URLs.
- [ ] Deploy to Vercel on `form-prep.rentrik.in`. Confirm static rendering + Lighthouse baseline.

### Day 2 - First Flagship Tools
- [ ] **Resize Image** (engine `lib/image/resize.ts` + widget).
- [ ] **Compress Image** (engine + widget, using `browser-image-compression`).
- [ ] **Reduce Image To Exact KB** (binary-search engine in a Web Worker + widget). *Highest-value tool.*
- [ ] Wire each into a full tool page (copy, FAQ stub, related links, privacy note).
- [ ] Verify Definition-of-Done checklist for each (mobile, no upload, indexable, lazy-loaded).
- [ ] Ship.

**End-of-2-day deliverable:** Live site, 3 working image tools, SEO scaffolding, all client-side.

---

## Week 1 Plan (Complete the MVP Toolset)

**Goal:** All 16 MVP tools live and polished.

### Image tools (finish the set)
- [ ] **Crop Image** (react-easy-crop + canvas).
- [ ] **Signature Cropper** (crop + background clean + target KB).
- [ ] **Passport Photo Maker** (preset dimensions + background fill; preset-config driven).
- [ ] **Background Color Changer** (canvas threshold MVP).

### PDF tools
- [ ] **Image To PDF** (`pdf-lib`).
- [ ] **Merge PDF** (`pdf-lib`, reorder).
- [ ] **Split PDF** (`pdf-lib`, ranges/extract).
- [ ] **PDF To Image** (`pdfjs-dist`).
- [ ] **Compress PDF** (re-encode images + rewrite).

### Conversion tools (one shared engine)
- [ ] **PNG→JPG**, **JPG→PNG**, **WEBP→JPG**, **WEBP→PNG** (single canvas convert engine, 4 thin pages).

### Platform
- [ ] Category landing pages (`/image`, `/pdf`, `/convert`) with internal linking.
- [ ] Home page (hero, tool grid, trust messaging).
- [ ] Consistent FAQ + "related tools" on every page (SEO + internal links).
- [ ] Web Worker offloading for all heavy ops; progress UI.
- [ ] Mobile QA on a real low-end Android device.
- [ ] Lighthouse pass: Perf ≥ 90, SEO ≥ 95, A11y ≥ 95 on key pages.

**End-of-Week-1 deliverable:** Full MVP - 16 tools, all client-side, mobile-first, SEO-ready, fast.

---

## Month 1 Plan (Harden, Rank, Grow)

**Goal:** Make it trustworthy, discoverable, and resilient.

### Quality & reliability
- [ ] Unit tests for every engine (Vitest); cover edge cases from `TOOL_SPECIFICATIONS.md`.
- [ ] Playwright E2E for top 5 tool flows.
- [ ] Cross-browser/device matrix (Chrome/Safari/Firefox; Android/iOS).
- [ ] Error boundaries + graceful fallbacks for unsupported browsers/features.
- [ ] Security headers/CSP; verify zero network uploads across all tools.

### SEO & content
- [ ] Per-tool optimized titles/descriptions/structured data (`HowTo`, `FAQPage`, `SoftwareApplication`).
- [ ] Write 8–12 launch blog posts targeting Indian long-tail keywords (see `SEO_STRATEGY.md`).
- [ ] Submit sitemap to Google Search Console; monitor indexing.
- [ ] Internal linking pass (tool↔tool, blog↔tool).

### UX polish
- [ ] Micro-interactions, loading/empty/error states refined.
- [ ] Add "How to use" + sample expectations to each tool.
- [ ] Lightweight, privacy-respecting analytics integrated.
- [ ] Dark mode finalized.

**End-of-Month-1 deliverable:** A polished, tested, indexed product accumulating organic traffic.

---

## Phase 2 Features (Exam Toolkit - the Differentiator)

**Goal:** Auto-format documents to official exam specs.

- [ ] **Exam preset schema** (zod): per exam → photo {w,h,minKB,maxKB,format,bg}, signature {...}, accepted formats.
- [ ] Preset data for **SSC, UPSC, Railway (RRB), Banking (IBPS/SBI), State PSCs, SSC GD**, plus NEET/JEE.
- [ ] **Exam selection flow:** pick exam → upload photo + signature → engines auto-format → download compliant set.
- [ ] Reuse existing engines (resize, exact-KB, crop, background) driven by preset configs - **no engine rewrites**.
- [ ] Dedicated SEO landing page per exam ("SSC CGL photo & signature resize tool").
- [ ] Batch processing + zip download of the compliant document set.
- [ ] Hindi UI (i18n layer activated).
- [ ] Saved local preferences (no account; local only).

---

## Phase 3 Features (Monetize & Scale)

- [ ] **Google AdSense** in reserved, CLS-safe slots; consent handling.
- [ ] PWA / offline support (tools usable without connectivity).
- [ ] More tools: watermark, rotate/deskew scans, OCR text extraction, e-sign placement, HEIC→JPG, PDF→Word (where client-side feasible).
- [ ] Advanced background removal (small lazy-loaded WASM/ML model, still client-side).
- [ ] More exam/state coverage; regional languages.
- [ ] Optional, fully-consented server tools for tasks browsers can't do well - clearly separated, opt-in, privacy-documented.
- [ ] Performance/scale tuning for high traffic; CDN/caching review.

---

## Definition of "Shippable" at Each Phase
Every shipped increment must pass the **Definition of Done** in `CLAUDE.md` §9: mobile-OK, no uploads, indexable, lazy-loaded, strict-typed, accessible, within performance budget.
