# UI_UX_GUIDELINES.md

The product is **mobile-first, fast, trustworthy, and effortless**. A stressed exam applicant on a budget phone must be able to fix a document in under a minute. Every UI decision optimizes for *clarity and speed on a small touchscreen*.

---

## 1. Design Principles

1. **Task-first.** Each tool page does one job. The primary action is obvious and above the fold on mobile.
2. **Trust visible.** Privacy reassurance ("processed on your device, never uploaded") is shown on every tool, not buried.
3. **Forgiving.** Friendly, specific error messages. Never blame the user. Always offer the next step.
4. **Calm and uncluttered.** Generous spacing, one decision at a time, progressive disclosure of advanced options.
5. **Fast-feeling.** Instant feedback, progress indicators for heavy work, optimistic UI where safe.
6. **Consistent.** Every tool reuses the same dropzone → controls → preview → download rhythm.

---

## 2. Design System

We use **shadcn/ui** primitives themed with **Tailwind tokens**. Tokens are defined once (Tailwind config + CSS variables) and never hard-coded in components.

### Spacing scale (Tailwind defaults, 4px base)
Use `2 / 3 / 4 / 6 / 8 / 12 / 16` consistently. Default page padding on mobile: `px-4`. Section gaps: `gap-6` / `gap-8`.

### Radius
- Controls/cards: `rounded-xl` (friendly, modern).
- Inputs/buttons: `rounded-lg`.
- Define `--radius` token so shadcn components inherit it.

### Elevation
- Prefer subtle borders + soft shadows over heavy drop shadows.
- Cards: `border` + `shadow-sm`; raise to `shadow-md` only for active/floating elements.

### Component density
- Touch targets **≥ 44×44px**.
- Primary buttons full-width on mobile.
- Avoid dense tables on mobile; stack into cards.

---

## 3. Typography

- **Font:** `Inter` (UI) via `next/font` (self-hosted, `display: swap`). For Hindi/Devanagari (Phase 2): `Noto Sans Devanagari`. Subset fonts; preload the primary weight.
- **Why Inter:** highly legible at small sizes, neutral, excellent for forms and numbers (KB/dimension labels).

### Type scale (mobile-first; scale up at `md`)
| Token | Mobile | Desktop | Use |
|---|---|---|---|
| Display | `text-2xl` (24) | `text-4xl` (36) | Landing hero |
| H1 | `text-xl` (20) | `text-3xl` (30) | Tool page title |
| H2 | `text-lg` (18) | `text-2xl` (24) | Section headings |
| H3 | `text-base` (16) | `text-xl` (20) | Sub-sections |
| Body | `text-base` (16) | `text-base` (16) | Default text |
| Small | `text-sm` (14) | `text-sm` (14) | Helper/captions |
| Tiny | `text-xs` (12) | `text-xs` (12) | Legal/labels |

- **Line length:** cap content at `max-w-prose` for readability.
- **Weights:** 400 body, 500 labels, 600–700 headings. Avoid more than 3 weights (payload).
- **Never** go below 14px for interactive text on mobile.

---

## 4. Color Palette

Defined as CSS variables (light + dark) and exposed through Tailwind. **No raw hex in components.**

### Brand
| Token | Light | Role |
|---|---|---|
| `--primary` | Indigo/Blue `#2563EB` | Primary actions, links, brand. |
| `--primary-foreground` | `#FFFFFF` | Text on primary. |
| `--accent` | Emerald `#10B981` | Success / privacy reassurance. |

### Neutrals (Slate scale)
| Token | Value (light) | Role |
|---|---|---|
| `--background` | `#FFFFFF` | Page background. |
| `--foreground` | `#0F172A` | Primary text. |
| `--muted` | `#F1F5F9` | Subtle surfaces, dropzone bg. |
| `--muted-foreground` | `#64748B` | Secondary text. |
| `--border` | `#E2E8F0` | Borders, dividers. |
| `--card` | `#FFFFFF` | Card surfaces. |

### Semantic
| Token | Value | Role |
|---|---|---|
| `--success` | `#10B981` | Success states. |
| `--warning` | `#F59E0B` | Cautions (e.g. large file). |
| `--destructive` | `#EF4444` | Errors, destructive actions. |
| `--info` | `#3B82F6` | Informational notes. |

- **Dark mode:** provide a full dark token set (invert background/foreground, adjust borders/muted). Support via `next-themes` or class strategy. Optional for MVP but tokens should be defined now.
- **Contrast:** all text/background combos must meet **WCAG AA** (4.5:1 body, 3:1 large text).
- Reserve a neutral, low-contrast background region for **future ad slots** so ads don't clash.

---

## 5. Component Standards

### Reusable building blocks (build once, reuse everywhere)
- `<Dropzone />` — drag/drop + tap-to-select + camera capture on mobile; shows accepted types & size hint.
- `<FilePreview />` — image/PDF thumbnail, filename, size badge.
- `<ToolControls />` — consistent layout for sliders, selects, inputs (target KB, dimensions, format).
- `<ProcessButton />` — primary action; shows loading/progress state.
- `<DownloadButton />` — appears after processing; "Download" + "Process another file".
- `<ResultStats />` — before/after size, dimensions, format.
- `<PrivacyNote />` — standard reassurance line/badge.
- `<ToolPageShell />` — Server Component layout: title, intro, the widget slot, FAQ, related tools, ad slot.
- `<AdSlot />` — renders nothing in MVP; reserves dimensions to prevent CLS later.

### Interaction standards
- **States for every interactive element:** default, hover, focus-visible, active, disabled, loading, error.
- **Progress:** any operation > ~300ms shows a spinner/progress bar. Long operations (PDF render, exact-KB search) show determinate progress where possible.
- **Errors:** inline, specific, actionable. E.g. "This file is 8 MB. For best results on mobile, try a file under 5 MB." Never a raw stack trace.
- **Empty state:** dropzone with clear instruction + example ("e.g. your passport photo").
- **Success:** clear confirmation + before/after stats + prominent download.

### Forms & inputs
- Every input has a visible `<label>` (not just placeholder).
- Numeric inputs (KB, px) use `inputmode="numeric"` and sensible min/max with validation.
- Sliders paired with a numeric field for precision.

---

## 6. Mobile-First Guidelines

- **Design at 360px first.** Then add `sm:`, `md:`, `lg:` enhancements. Never the reverse.
- **Single column** on mobile; multi-column only at `md+`.
- **Thumb-friendly:** primary actions reachable in the lower half; full-width primary buttons.
- **Sticky primary action** (e.g. Download/Process) on long tool pages so it's always reachable.
- **Camera-first:** allow `capture` on file inputs so users can shoot a photo/signature directly.
- **Avoid hover-only affordances** — everything must work with tap.
- **Minimal typing:** prefer presets, steppers, sliders over free text where possible.
- **Test on throttled CPU/network** and a real low-end Android device.
- **Respect safe areas** and avoid content under the on-screen keyboard.

---

## 7. Accessibility Requirements (non-negotiable)

Target **WCAG 2.1 AA**.

- **Keyboard:** every action operable via keyboard; logical tab order; visible `:focus-visible` rings (don't remove outlines).
- **Screen readers:** semantic HTML (`<button>`, `<label>`, `<nav>`, headings in order); ARIA only where semantics fall short (shadcn/Radix handles most).
- **Labels & alt text:** all controls labeled; meaningful `alt` on images; decorative images `alt=""`.
- **Live regions:** announce processing status and results (`aria-live="polite"`).
- **Color:** never convey meaning by color alone (pair with icon/text); meet AA contrast.
- **Motion:** respect `prefers-reduced-motion`; keep animations subtle and optional.
- **Targets:** ≥ 44×44px touch targets, adequate spacing.
- **Forms:** associate errors with fields via `aria-describedby`; programmatically focus the first error.
- **Language:** set `<html lang="en">` (and `hi` for Hindi pages later).
- **Testing:** axe/Lighthouse a11y ≥ 95; manual keyboard + screen-reader pass on each tool.

---

## 8. Content & Microcopy

- **Plain, friendly English** (Hindi later). Short sentences. Indian context ("exam form", "₹", "KB").
- **Action labels are verbs:** "Resize", "Compress", "Download".
- **Reassure on privacy** in one short line, consistently worded.
- **Explain limits before they hit them** ("Most exam portals want photos under 50 KB").
- **No jargon** unless defined inline.
