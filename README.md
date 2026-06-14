# Rentrik Form Prep

> India's most useful **free, privacy-first** document preparation platform for online forms.
> Prepare images, signatures, and PDFs to the exact size, format, and dimensions any
> government exam, college, or job application demands — **all in your browser. Nothing is uploaded.**

**Domain:** `form-prep.rentrik.in`
**Stack:** Next.js 15 (App Router) · TypeScript · TailwindCSS · shadcn/ui · deployed on Vercel

---

## Why this exists

Every day, Indian applicants get blocked by *"Upload photo (max 50 KB, 200×230 px, JPEG)"*.
Rentrik Form Prep fixes that in under a minute — for free, with no login, and without ever
sending private documents to a server.

## Core constraints (the rules everything follows)

1. Mobile-first · 2. Fast · 3. Privacy-first · 4. Browser-side processing · 5. No auth (MVP)
6. No backend unless unavoidable · 7. SEO-first · 8. Fixed stack (Next 15 / TS / Tailwind / shadcn)
9. Cheap on Vercel · 10. AdSense later (slots reserved now)

---

## MVP Tools (16)

**Image:** Resize · Compress · Reduce to Exact KB · Crop · Signature Cropper · Passport Photo Maker · Background Color Changer
**PDF:** Compress · Merge · Split · Image→PDF · PDF→Image
**Convert:** PNG→JPG · JPG→PNG · WEBP→JPG · WEBP→PNG

**Next (Phase 2):** Exam Toolkit — pick SSC/UPSC/Railway/Banking, auto-format photo & signature to official specs.

---

## Documentation — read in this order

| # | File | What it covers |
|---|------|----------------|
| 0 | **[CLAUDE.md](./CLAUDE.md)** | **Start here.** Master context & workflow for any AI agent or developer. |
| 1 | [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) | Vision, personas, goals, metrics, features, roadmap. |
| 2 | [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) | Architecture, client-side processing, deployment, performance, security. |
| 3 | [TECH_STACK.md](./TECH_STACK.md) | Exact technologies, why, and alternatives rejected. |
| 4 | [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md) | Design system, type, color, components, mobile-first, accessibility. |
| 5 | [MVP_ROADMAP.md](./MVP_ROADMAP.md) | 2-day / Week 1 / Month 1 / Phase 2 / Phase 3 plan. |
| 6 | [SEO_STRATEGY.md](./SEO_STRATEGY.md) | URLs, sitemap, metadata, internal linking, blog, India keywords. |
| 7 | [TOOL_SPECIFICATIONS.md](./TOOL_SPECIFICATIONS.md) | Per-tool purpose, flow, I/O, logic, edge cases, libraries. |
| 8 | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Scalable Next.js App Router architecture. |
| 9 | [CLAUDE_BUILD_RULES.md](./CLAUDE_BUILD_RULES.md) | Strict, enforceable engineering rules. |

---

## Getting started (once the app is scaffolded)

```bash
# Scaffold (target setup)
npx create-next-app@latest rentrik-form-prep --typescript --tailwind --app --eslint
cd rentrik-form-prep
npx shadcn@latest init

# Dev
npm run dev        # http://localhost:3000

# Quality gates (must pass before merge)
npm run lint
npm run typecheck  # tsc --noEmit
npm run build
```

## Architecture in one line

Static, SEO-optimized **Server Component** pages mount lazy-loaded **Client Component** tool widgets
that call **pure processing engines** (`lib/`) running entirely in the browser (Canvas / pdf-lib / pdf.js,
heavy work in Web Workers). No file ever leaves the device.

## How to add a new tool

1. Engine → `lib/<domain>/<tool>.ts` (pure, typed, no React/network, unit-tested).
2. Widget → `components/tools/<domain>/<Tool>.tsx` (`"use client"`, composes shared components).
3. Page → `app/(tools)/<domain>/<slug>/page.tsx` (Server Component: metadata, JSON-LD, copy, FAQ, lazy-mounts the widget).
4. Register → add an entry to `config/tools.ts` (sitemap, nav, metadata, related links update automatically).

See [CLAUDE_BUILD_RULES.md](./CLAUDE_BUILD_RULES.md) and the [Definition of Done](./CLAUDE.md) before opening a PR.

---

*Free. Private. Fast. Built for India.*