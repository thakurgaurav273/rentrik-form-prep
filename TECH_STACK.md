# TECH_STACK.md

This document lists the exact technologies, *why* each was chosen, and the alternatives that were considered and rejected. The core stack (Next.js 15, TypeScript, Tailwind, shadcn/ui) is fixed by the product brief and **must not be swapped**.

---

## Core Framework & Language

### Next.js 15 (App Router) — **chosen**
- **Why:** Best-in-class SEO via Server Components + static rendering; file-based routing maps cleanly to one route per tool; image/font optimization built in; first-class Vercel deployment; mature ecosystem.
- **How we use it:** Static rendering (SSG) for all pages; Server Components for shells; Client Components only for interactive widgets; `next/dynamic` for lazy loading; built-in metadata API for SEO.
- **Alternatives considered:**
  - *Vite + React SPA* — simpler, but weak SEO (client-rendered), no built-in route-level static generation. Rejected: SEO-first is a hard constraint.
  - *Astro* — excellent for content SEO and partial hydration ("islands"), genuinely strong here. Rejected only because the brief fixes Next.js 15 and the team standardizes on React tooling. (Astro would have been the strongest alternative.)
  - *Remix* — great DX, but SSR-leaning and less aligned with a static + client-compute model.

### TypeScript (strict mode) — **chosen**
- **Why:** Type safety across engines, configs, and exam presets (zod + TS); fewer runtime errors; far better maintainability as the codebase grows toward millions of users.
- **Alternatives:** Plain JavaScript — rejected; loses safety and refactorability. JSDoc-typed JS — rejected; weaker than real TS for this scale.

---

## Styling & UI

### TailwindCSS — **chosen**
- **Why:** Mobile-first by default (responsive prefixes), tiny production CSS via purging, design tokens via config, fast to build with, no context-switching to CSS files.
- **Alternatives:**
  - *CSS Modules / vanilla CSS* — more verbose, slower iteration, harder to keep mobile-first discipline.
  - *Styled-components / Emotion* — runtime cost and SSR complexity; conflicts with "fast loading" + Server Components.
  - *Plain Tailwind without a component lib* — viable but reinvents accessible primitives.

### shadcn/ui (built on Radix UI) — **chosen**
- **Why:** Accessible, unstyled-but-styleable primitives copied into our repo (we own the code, no version lock-in), themeable via Tailwind tokens, excellent keyboard/ARIA behavior out of the box — directly supports the accessibility-first rule.
- **Alternatives:**
  - *MUI / Chakra* — heavier runtime, opinionated styling that fights Tailwind, larger bundles. Rejected for performance.
  - *Headless UI* — good, but shadcn/ui gives a broader, ready-to-use component set.
  - *Hand-rolled components* — reinventing accessibility; error-prone.

### lucide-react (icons) — **chosen**
- **Why:** Tree-shakeable, lightweight, consistent with shadcn/ui conventions.
- **Alternatives:** Font-icon sets (extra payload), react-icons (less consistent, larger).

---

## File Processing Libraries (all client-side, lazy-loaded)

### browser-image-compression — **chosen** (image compress / reduce-to-KB helper)
- **Why:** Battle-tested, runs in a Web Worker, handles quality/size targeting reliably across devices.
- **Alternatives:** Hand-rolled canvas loops only (fine for simple cases, but this library handles edge cases and workers for us); `compressorjs` (good, similar — acceptable secondary choice).

### Canvas API / OffscreenCanvas — **chosen** (resize, crop, convert, background)
- **Why:** Native, zero-dependency, fast, universally available; ideal for resize/crop/format conversion and background fills.
- **Alternatives:** `sharp` — server-side only (Node), violates client-side constraint. `jimp` — pure-JS but heavy and slow in-browser.

### pdf-lib — **chosen** (merge, split, image→PDF, structural edits, compress rewrite)
- **Why:** Pure JavaScript, runs in-browser, no server, actively maintained, good API for creating/merging/splitting.
- **Alternatives:** `hummus`/`muhammara` — Node-only. Server-based PDF services — violate privacy + cost constraints.

### pdfjs-dist (PDF.js) — **chosen** (PDF → image rendering)
- **Why:** Mozilla's renderer, the de-facto standard for rendering PDF pages to canvas in the browser.
- **Alternatives:** None comparable for client-side rendering.

### react-easy-crop (or react-cropper) — **chosen** (crop / signature crop UI)
- **Why:** Touch-friendly, gesture support, fixed-ratio cropping — perfect for mobile crop, passport ratios, and signature cropping.
- **Alternatives:** Building crop gestures from scratch — unnecessary effort and worse UX on touch.

### file-saver (or native `<a download>`) — **chosen** (download results)
- **Why:** Reliable cross-browser file download from blobs.
- **Alternatives:** Native anchor download (use where sufficient; file-saver covers tricky browsers).

### zod — **chosen** (validation of tool options & exam presets)
- **Why:** Runtime validation + inferred TS types for tool configs and (Phase 2) exam preset schemas; one source of truth.
- **Alternatives:** `yup` (heavier, weaker TS inference), manual validation (error-prone).

### client-zip / jszip — **deferred** (batch multi-file download, Phase 2.5)
- **Why:** Bundle multiple outputs into one download for batch workflows.
- Not in MVP; listed for roadmap.

---

## Tooling & Quality

| Tool | Purpose | Why |
|---|---|---|
| **ESLint** (+ `eslint-config-next`) | Linting | Catch issues, enforce rules. |
| **Prettier** | Formatting | Consistent style, zero debate. |
| **TypeScript strict** | Types | Safety; build fails on type errors. |
| **Vitest** (or Jest) | Unit tests for engines | Engines are pure functions → easy to test. |
| **Playwright** (later) | E2E for critical tool flows | Confidence on real browsers. |
| **Lighthouse CI** (optional) | Perf/SEO/A11y budget guard | Enforce `CLAUDE.md` budget. |
| **GitHub Actions / Vercel checks** | CI | Lint + typecheck + build on every PR. |

---

## Hosting & Infra

### Vercel — **chosen**
- **Why:** Native Next.js host, automatic preview deployments, global edge CDN, generous free/low-cost tiers, zero-config static hosting.
- **Cost posture:** Static + edge caching, no always-on functions → stays in the cheapest tier even at scale (compute happens on users' devices).
- **Alternatives:** Netlify (comparable), Cloudflare Pages (very cheap, great edge — viable future option), self-hosted (more ops, no benefit for a static site). Vercel chosen per brief.

---

## Explicitly Out of Scope (MVP)

| Not using | Reason |
|---|---|
| Any backend framework / API server | No backend unless absolutely necessary. |
| Database / ORM | No data to store; no auth. |
| Auth provider (NextAuth, Clerk, etc.) | No login in MVP. |
| Redux / Zustand / global state lib | React state + URL params suffice; add only if justified. |
| Heavy analytics / trackers | Privacy-first; lightweight analytics later. |
| Server-side image/PDF processing (sharp, etc.) | Violates client-side + privacy + cost constraints. |
| Google AdSense | Added in Phase 3, slots reserved now. |

---

## Dependency Discipline

- Keep the dependency surface **small**. Every new dependency must justify its bundle cost.
- Heavy libraries are **lazy-loaded** only.
- Pin versions; run `npm audit`; review transitive bloat with bundle analysis.
- Prefer **native browser APIs** before adding a library.
