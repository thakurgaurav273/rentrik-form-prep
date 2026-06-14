# CLAUDE_BUILD_RULES.md

Strict, enforceable development rules for Rentrik Form Prep. These are **hard requirements**, not suggestions. A change that violates any rule does not merge. When a rule conflicts with a request, **stop and flag it** rather than breaking the rule silently.

---

## 1. TypeScript — Strict Always

- `tsconfig.json` runs in **strict mode** (`strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitAny: true`, `noImplicitReturns: true`).
- **No `any`.** Use precise types, `unknown` + narrowing, or generics. `any` is a review blocker.
- **No `// @ts-ignore` / `@ts-expect-error`** without a one-line comment explaining why and a follow-up plan.
- **No non-null assertions (`!`)** to silence the compiler — handle the null case.
- All function inputs/outputs are explicitly typed. Engine option objects are typed interfaces, validated at runtime with **zod**.
- Shared types live in `types/`; don't redeclare the same shape in multiple files.
- Type errors are **build failures**. CI fails on `tsc --noEmit` errors.

## 2. Reusable Components Only

- Before building UI, **search `components/shared/` and `components/ui/`** for an existing component. Extend it; don't fork it.
- Every tool widget composes the same shared pieces: `Dropzone`, `FilePreview`, `ToolControls`, `ProcessButton`, `DownloadButton`, `ResultStats`, `PrivacyNote`.
- A component does **one thing**. If it grows multiple responsibilities, split it.
- Props are typed and minimal; prefer composition over boolean-flag soup.
- UI primitives come from **shadcn/ui** themed with tokens — don't hand-roll buttons/inputs/dialogs.

## 3. No Duplicate Code (DRY)

- **No copy-paste.** If logic appears twice, extract it (to `lib/`, `utils/`, `hooks/`, or a shared component) on the second occurrence.
- The four conversion tools share **one** engine (`lib/image/convert.ts`) and **one** widget — they are config wrappers, not four copies.
- Shared canvas/PDF helpers live in `lib/image/canvas.ts` / `lib/pdf/pdf-utils.ts`; engines reuse them.
- Metadata, JSON-LD, sitemap, nav, and related links all derive from the **single tool registry** (`config/tools.ts`). Never hand-maintain these lists in parallel.
- No magic numbers/strings repeated across files — centralize in `utils/constants.ts` or `config/`.

## 4. Mobile-First

- Build at **360px first**, then layer `sm:`/`md:`/`lg:` enhancements. Never desktop-down.
- Single-column on mobile; touch targets ≥ **44×44px**; primary action full-width and reachable by thumb.
- Test every tool on a throttled mobile profile (CPU 4–6× slowdown, slow 4G) before "done".
- No hover-only interactions; everything works with tap.
- Image file inputs allow camera `capture` where it helps.

## 5. Accessibility-First (WCAG 2.1 AA)

- Semantic HTML first; ARIA only to fill gaps (shadcn/Radix covers most).
- Every interactive element: visible `:focus-visible`, keyboard operable, proper role/label.
- Every input has an associated `<label>`; errors linked via `aria-describedby`.
- Processing status + results announced via `aria-live="polite"`.
- Meaningful `alt` text; decorative images `alt=""`.
- AA contrast for all text; never convey meaning by color alone.
- Respect `prefers-reduced-motion`.
- Each tool gets a keyboard + screen-reader pass; Lighthouse a11y ≥ 95.

## 6. SEO-First

- Every public page is **statically rendered** with full, meaningful HTML (Server Component shell). Content must not depend on client JS to exist.
- Each page exports `metadata` via the centralized builder (title, description, canonical, OG/Twitter).
- Each tool page emits JSON-LD: `SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`.
- One `<h1>` per page; logical heading order; descriptive internal links (no "click here").
- URLs follow `SEO_STRATEGY.md` (lowercase, hyphenated, stable); changing a URL requires a 301.
- Tool widgets being client-only must **not** strip the page's static, indexable content.

## 7. Server Components Where Possible

- **Default to Server Components.** A file is a Server Component unless it needs interactivity.
- Pages, layouts, copy, FAQ, related-tools, breadcrumbs, JSON-LD → Server Components.
- Keep the `"use client"` boundary as **low/leaf** as possible — wrap only the interactive widget, not the whole page.
- Server Components must not import client-only libraries or browser APIs.

## 8. Client Components Only When Necessary

- Add `"use client"` only when you need: state, effects, refs, event handlers, or browser APIs (Canvas, File, Worker).
- The tool **widget** is the client boundary; the **page** around it stays server-rendered.
- Don't push data-fetching or static rendering into client components.

## 9. Lazy Loading

- Every tool widget is imported with `next/dynamic({ ssr: false })` so it's not in the page's initial bundle.
- Heavy libraries (`pdf-lib`, `pdfjs-dist`, `browser-image-compression`, crop libs, any WASM/ML) are **dynamically imported inside the engine/widget at point of use** — never at module top level of a page.
- Render a lightweight skeleton/placeholder while a widget loads.
- Verify in the network waterfall: heavy chunks load on interaction, not on page load.

## 10. Performance Budget (Enforced)

| Metric | Limit |
|---|---|
| Initial route JS (gzip, before lazy chunks) | ≤ 90 KB |
| LCP (mobile, 4G) | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse SEO / Accessibility | ≥ 95 |

- Offload heavy CPU work to **Web Workers**; never block the main thread with long sync loops.
- Use `next/font` (self-hosted, subset, `swap`) and `next/image`.
- Reserve space for previews and (future) ad slots to protect CLS.
- A change that regresses the budget does not merge. Run Lighthouse/bundle analysis on touched routes.

## 11. Privacy & Security (Product-Defining)

- **No file is uploaded.** Engines in `lib/` perform **no network calls**. Verify zero upload requests in DevTools for every tool.
- No auth, no databases, no PII storage in MVP.
- No third-party document/processing APIs.
- Validate every input (type, size, bounds) before processing; reject hostile/corrupt input gracefully.
- No `dangerouslySetInnerHTML` with untrusted content.
- Set strict security headers/CSP. HTTPS only.
- Revoke object URLs after use; don't persist user files.
- Run `npm audit`; keep dependencies minimal and pinned.

## 12. Code Quality Standards

- **ESLint + Prettier** pass with zero warnings; CI enforces lint + format + typecheck + build on every PR.
- **Naming:** components `PascalCase`, hooks `useX`, engines/utils `camelCase` named exports, routes `kebab-case`.
- **Functions are small and single-purpose.** Prefer pure functions; isolate side effects.
- **No dead code, no commented-out blocks, no `console.log`** in committed code (use a debug util if needed).
- **Comments explain *why*, not *what*.** Self-documenting names over clever code.
- **Engines have unit tests** (Vitest) covering the edge cases in `TOOL_SPECIFICATIONS.md`. Top flows have Playwright E2E (Month 1).
- **Error handling is user-facing and friendly** — no raw errors/stack traces shown; log technical detail to console only.
- **Imports:** direct imports that preserve tree-shaking; no barrel files that pull in heavy deps.
- **Commits/PRs:** small, focused, with a description that notes any constraint trade-offs.

## 13. Engine Design Rule (Future-Proofing)

- Engines accept a **typed options/config object** and return a `Blob`. They contain **no hardcoded exam values, no UI, no network**.
- Phase 2 Exam Toolkit presets are just option objects fed to these same engines — engines must be written so this works **without modification**.
- Example shape:
  ```ts
  export async function reduceToKB(file: File, opts: { targetKB: number; maxDimension?: number; format?: OutputFormat }): Promise<Blob>;
  ```

## 14. The Definition of Done

A task is complete only when it passes the checklist in `CLAUDE.md` §9:
mobile-OK (360px) · zero network uploads · indexable static content · heavy libs lazy-loaded · strict-typed (no `any`) · reused existing code · fully accessible · edge cases handled · correct metadata · Lighthouse Perf ≥ 90 / SEO ≥ 95 / A11y ≥ 95 · no console errors.

---

### Quick "Stop and Flag" Triggers
Pause and ask before doing any of these:
- Adding a backend, API route for file processing, database, or auth.
- Uploading any user file anywhere.
- Adding a heavy dependency or a global state library.
- Changing a published URL.
- Disabling strict mode, lint, or the type checker.
- Anything that breaks one of the Ten Commandments in `CLAUDE.md` §2.
