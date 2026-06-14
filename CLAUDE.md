@AGENTS.md

# CLAUDE.md

> This is the master context file for AI-assisted development of **Rentrik Form Prep**.
> Any AI agent (Claude Code, Cursor, etc.) or human contributor should read this file first
> before writing a single line of code. It is the single source of truth for *how* we build.
> For *what* we build, see `PRODUCT_REQUIREMENTS.md`.

---

## 1. Project Snapshot

| Field | Value |
|---|---|
| **Product** | Rentrik Form Prep |
| **Domain** | `form-prep.rentrik.in` |
| **One-liner** | India's most useful free, privacy-first document preparation platform for online forms. |
| **Primary users** | Students, job seekers, government exam applicants, college applicants, general users in India. |
| **Stack** | Next.js 15 (App Router) · TypeScript · TailwindCSS · shadcn/ui |
| **Hosting** | Vercel (must run cheaply - ideally Hobby/low Pro tier) |
| **Monetization** | Google AdSense (added later, not in MVP) |
| **Auth** | None in MVP |
| **Backend** | Avoid. Browser-side processing by default. |

---

## 2. The Ten Commandments (Non-Negotiable Constraints)

These come straight from the product brief. Every decision is checked against them.

1. **Mobile-first.** Design and build for a 360px phone first, then scale up.
2. **Fast loading.** Ship the minimum JS. Lazy-load heavy libraries.
3. **Privacy-first.** Files never leave the device unless technically unavoidable.
4. **Browser-side processing.** Default to client-side. A backend is a last resort.
5. **No auth in MVP.** No login, no accounts, no user database.
6. **No backend unless absolutely necessary.** If you think you need one, justify it in a PR description and tag the maintainer.
7. **SEO-first architecture.** Every tool is a statically-rendered, indexable page.
8. **Exact stack.** Next.js 15 + TypeScript + Tailwind + shadcn/ui. No swapping these out.
9. **Cheap on Vercel.** No always-on serverless functions for file processing. Static + edge where possible.
10. **AdSense-ready later.** Leave ad slots in the layout, but do not integrate AdSense in MVP.

> If a feature request conflicts with any of these, **stop and flag it** rather than silently breaking a constraint.

---

## 3. Architecture in One Paragraph

Rentrik Form Prep is a **mostly-static Next.js App Router site**. Each tool lives at its own route (`/image/resize`, `/pdf/merge`, etc.) and is statically rendered for SEO. The page shell, copy, FAQ, and related-tool links are **Server Components**. The interactive tool widget itself is a **Client Component** that is dynamically imported (lazy) so heavy libraries (image/PDF/WASM) only download when the user actually opens that tool. **All file processing happens in the browser** using Canvas, Web APIs, `pdf-lib`, `browser-image-compression`, and similar client libraries. There is **no file upload to a server**. The result is a fast, private, SEO-friendly, near-zero-cost platform.

```
User → Static HTML (SEO + copy)  ← rendered at build time
         │
         ▼
   Lazy-loaded Client tool component
         │
         ▼
   Browser APIs / WASM do the work (no network)
         │
         ▼
   User downloads result locally
```

---

## 4. Documentation Map

Read these as needed. Do not duplicate their content here.

| File | Read it when you are… |
|---|---|
| `PRODUCT_REQUIREMENTS.md` | Unsure *what* to build or *why*. |
| `SYSTEM_DESIGN.md` | Designing architecture or choosing a processing approach. |
| `TECH_STACK.md` | Adding a dependency or picking a library. |
| `UI_UX_GUIDELINES.md` | Building any UI, picking colors, type, spacing. |
| `MVP_ROADMAP.md` | Deciding what to build *next* / sequencing work. |
| `SEO_STRATEGY.md` | Touching routes, metadata, sitemaps, or content. |
| `TOOL_SPECIFICATIONS.md` | Implementing a specific tool. |
| `FOLDER_STRUCTURE.md` | Deciding where a file goes. |
| `CLAUDE_BUILD_RULES.md` | Writing code - the strict, enforceable rules. |

---

## 5. How to Work in This Repo (AI Agent Workflow)

When given a task, follow this loop:

1. **Locate the spec.** Find the tool/feature in `TOOL_SPECIFICATIONS.md` and the rules in `CLAUDE_BUILD_RULES.md`.
2. **Check for reuse.** Search `components/`, `hooks/`, `utils/`, `lib/` for something that already does part of the job. **Never** duplicate logic. (See "No duplicate code" rule.)
3. **Plan the boundary.** Decide what is Server Component (static, SEO) vs Client Component (interactive). Default to Server. Only `"use client"` when you need state, refs, events, or browser APIs.
4. **Lazy-load heavy stuff.** Any tool engine (image/PDF/WASM) is dynamically imported, never in the initial bundle.
5. **Type strictly.** No `any`. No `// @ts-ignore` without a written reason.
6. **Build the UI from shadcn/ui + Tailwind tokens.** No raw hex, no inline magic numbers - use the design tokens.
7. **Handle the edge cases** listed in the tool spec (wrong file type, huge file, 0-byte file, browser-unsupported).
8. **Verify the constraints.** Mobile (360px) OK? No file leaves the browser? Page still indexable? Bundle still small?
9. **Self-review against the checklist** in §9 before declaring done.

---

## 6. Golden Rules for Code (Summary - full version in CLAUDE_BUILD_RULES.md)

- **TypeScript strict mode is on.** Treat type errors as build failures.
- **Server Components by default**, Client Components only when interaction is required.
- **One responsibility per file.** Tool engines (pure functions) are separate from UI.
- **Pure processing functions** live in `lib/` or `services/` and take inputs / return outputs - no DOM, no React inside them where avoidable, fully unit-testable.
- **No premature backend.** Everything client-side until proven impossible.
- **No global state library** in MVP (no Redux/Zustand) unless justified - React state + URL params are enough.
- **Accessibility is not optional.** Labels, focus states, keyboard support, alt text.
- **Performance budget is enforced** (see §8).

---

## 7. Tool Implementation Pattern (Copy This Shape)

Every tool follows the same shape so the codebase stays predictable:

```
app/(tools)/image/resize/page.tsx        ← Server Component: SEO, copy, FAQ, related tools, mounts the widget
components/tools/image/ResizeTool.tsx     ← Client Component ("use client"): UI, dropzone, controls, preview
lib/image/resize.ts                       ← Pure engine: (file, options) => Promise<Blob>. No React. Testable.
```

- The **page** is static and indexable. It imports the widget via `next/dynamic` with `ssr: false`.
- The **widget** handles user interaction and calls the engine.
- The **engine** does the actual processing and knows nothing about UI.

This separation means: SEO works, bundles stay small, engines are testable, and tools are easy to clone.

---

## 8. Performance Budget (Hard Limits)

| Metric | Budget |
|---|---|
| Initial JS (per tool route, gzipped) | ≤ 90 KB before lazy chunks load |
| Largest Contentful Paint (mobile, 4G) | ≤ 2.5 s |
| Cumulative Layout Shift | ≤ 0.1 |
| Heavy library (pdf-lib, image libs, WASM) | **Lazy-loaded only**, never in initial bundle |
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse SEO / Accessibility | ≥ 95 |

If a change blows the budget, it does not merge.

---

## 9. Definition of Done - Self-Review Checklist

Before any task is considered complete, confirm:

- [ ] Works on a 360px-wide screen with touch.
- [ ] No file is sent over the network (verify in DevTools Network tab - zero upload requests).
- [ ] Page renders meaningful HTML without JS (Server Component shell), and is indexable.
- [ ] Heavy library is lazy-loaded (check the network waterfall - it loads on interaction, not on page load).
- [ ] TypeScript strict passes; no `any`, no unexplained `ts-ignore`.
- [ ] Reused existing components/utils where possible; no copy-pasted logic.
- [ ] All inputs have labels; keyboard + screen-reader usable; visible focus states.
- [ ] Edge cases from the tool spec are handled with friendly error messages.
- [ ] Metadata (title, description, canonical, OG) present and correct.
- [ ] Lighthouse mobile: Perf ≥ 90, SEO ≥ 95, A11y ≥ 95.
- [ ] No console errors or warnings.

---

## 10. What NOT to Do

- ❌ Do **not** upload user files to any server or third-party API.
- ❌ Do **not** add authentication, databases, or user accounts in MVP.
- ❌ Do **not** add AdSense, analytics-heavy scripts, or trackers in MVP.
- ❌ Do **not** import heavy libraries at the top level of a page.
- ❌ Do **not** use `any`, disable strict mode, or silence the linter to "make it work".
- ❌ Do **not** introduce a state-management library, ORM, or backend framework without explicit sign-off.
- ❌ Do **not** ship pixel values / hex colors directly - use design tokens.
- ❌ Do **not** block the main thread with large sync processing - use Web Workers for heavy CPU work.

---

## 11. Naming & Conventions Quick Reference

- **Components:** `PascalCase.tsx` (e.g. `PassportPhotoMaker.tsx`)
- **Hooks:** `useCamelCase.ts` (e.g. `useImageFile.ts`)
- **Engines/utils:** `kebab-or-camel.ts` exporting named pure functions
- **Routes:** lowercase, hyphenated, descriptive (`/image/reduce-to-kb`)
- **Tool engines:** colocated under `lib/<domain>/` (`lib/pdf/merge.ts`)
- **Tests:** `*.test.ts` next to the engine they test
- **No barrel-file abuse** that breaks tree-shaking - import directly where it matters

---

## 12. Future-Proofing Notes (Build for Millions, Ship Simple)

We design so the codebase can scale to millions of users, but we **implement the simplest version now**:

- **Exam Toolkit** (SSC/UPSC/Railway/Banking presets) is Phase 2. Build tool engines now so they accept a *config object* (target KB, dimensions, format, background) - then the Exam Toolkit just feeds presets into the same engines. Do not hardcode dimensions inside engines.
- **AdSense** slots: reserve layout regions (`<AdSlot />` placeholder component that renders nothing in MVP) so adding ads later is non-breaking and CLS-safe.
- **i18n** (Hindi + regional): keep all user-facing strings in a strings layer from day one, even if only English exists now.
- **Analytics**: pick a privacy-respecting, lightweight option later (e.g. Plausible/Vercel Analytics). Reserve a single integration point.

> Principle: **engines are configurable and dumb; presets and UI are smart.** This is what lets one set of tools power an entire Exam Toolkit later without rewrites.