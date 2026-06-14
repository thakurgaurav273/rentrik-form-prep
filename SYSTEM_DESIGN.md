# SYSTEM_DESIGN.md

## 1. High-Level Architecture

Rentrik Form Prep is a **static-first, client-processing web application**. There is no application server handling user files. The "system" is essentially three layers:

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD TIME (Vercel)                                          │
│  Next.js 15 App Router → statically renders all pages         │
│  (landing, category, every tool page, blog) for SEO           │
└─────────────────────────────────────────────────────────────┘
                              │ deploy
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  EDGE / CDN (Vercel)                                          │
│  Serves pre-rendered HTML + static assets globally, cached    │
└─────────────────────────────────────────────────────────────┘
                              │ request
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BROWSER (the actual compute layer)                           │
│  • Server-rendered shell paints instantly (SEO + content)     │
│  • User interacts → lazy-loads the tool's Client Component     │
│  • File processing runs locally via Canvas / WASM / pdf-lib    │
│  • Heavy CPU work offloaded to Web Workers                     │
│  • Result downloaded directly to the device                    │
│  • NO file ever transmitted over the network                  │
└─────────────────────────────────────────────────────────────┘
```

**Key idea:** the user's device is the server. Vercel only ships static HTML/JS and caches it at the edge. This gives us SEO, speed, privacy, and near-zero cost simultaneously.

### Component Topology per Tool Page

```
page.tsx (Server Component)            ← static HTML, metadata, copy, FAQ, related links, ad slots
  └─ <ToolWidget />  (dynamic import, ssr:false, Client Component)
        ├─ <Dropzone /> / file input   ← shared component
        ├─ tool-specific controls
        ├─ <Preview />                 ← shared component
        ├─ <DownloadButton />          ← shared component
        └─ calls → lib/<domain>/<engine>.ts (pure function, may spawn a Web Worker)
```

---

## 2. Client-Side Processing Strategy

### Principle
Default to the **simplest browser-native API** that does the job; reach for libraries / WASM only when native APIs fall short.

### Image processing
- Use the **Canvas API** (`OffscreenCanvas` where supported) for resize, crop, format conversion, background fill.
- **Resize:** draw the source onto a canvas of target dimensions; export via `canvas.toBlob(type, quality)`.
- **Compress / convert:** re-encode via `toBlob` with the target MIME and quality. Use `browser-image-compression` for robust, worker-based compression where helpful.
- **Reduce to exact KB:** binary-search the quality/scale parameter, re-encoding until the blob size is just under the target. Cap iterations (e.g. ≤ 8) and run in a worker to avoid blocking the UI.
- **Crop / Signature crop:** crop region via canvas; for signatures optionally do simple background→transparent/white thresholding.
- **Passport Photo Maker:** fixed output dimensions + DPI metadata + background fill; presets feed the resize/crop engine.
- **Background Color Changer:** MVP = solid-color background replacement using luminance/edge thresholding on canvas (good enough for signatures and simple photos). Advanced subject segmentation is a Phase 2+ enhancement (optional small WASM/ML model, lazy-loaded, still client-side).

### PDF processing
- Use **`pdf-lib`** for merge, split, image→PDF, and structural edits (pure JS, runs in-browser).
- Use **`pdfjs-dist` (PDF.js)** for PDF→Image (render pages to canvas, export).
- **Compress PDF:** re-encode embedded images at lower resolution/quality and rewrite the document with `pdf-lib`. (True deep PDF optimization is hard client-side; MVP targets the common case - image-heavy scanned PDFs.)

### Heavy work → Web Workers
Any operation that can block the main thread (large image encode loops, multi-page PDF rendering, exact-KB binary search) runs in a **Web Worker** so the UI stays responsive on low-end phones. Engines are written as pure functions that can be invoked from either the main thread or a worker.

### Memory discipline (low-end devices matter)
- Revoke object URLs (`URL.revokeObjectURL`) after use.
- Process pages/files sequentially when memory is a concern.
- Downscale very large source images before heavy operations.
- Guard against oversized inputs with friendly limits + messages.

### Why client-side
- **Privacy:** files never leave the device (core promise).
- **Cost:** no compute on our servers.
- **Speed:** no upload/download round-trip.
- **Scale:** compute scales with users' own devices - infinite by definition.

---

## 3. Libraries to Use

> See `TECH_STACK.md` for full rationale and alternatives. Summary here.

| Concern | Library | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSG/Server Components for SEO. |
| Language | **TypeScript** (strict) | Safety, maintainability. |
| Styling | **TailwindCSS** | Mobile-first utility CSS. |
| UI components | **shadcn/ui** (Radix under the hood) | Accessible, themeable, owned-in-repo. |
| Icons | **lucide-react** | Lightweight, tree-shakeable. |
| Image compression | **browser-image-compression** | Worker-based, reliable. |
| PDF manipulation | **pdf-lib** | Merge/split/create, pure JS. |
| PDF rendering | **pdfjs-dist** | PDF → image. |
| Cropping UI | **react-easy-crop** (or `react-cropper`) | Touch-friendly crop UX. |
| File save | **file-saver** (or native `<a download>`) | Reliable cross-browser download. |
| Zip (batch, later) | **client-zip** / **jszip** | For multi-file downloads. |
| Schema/validation | **zod** | Validate tool options/config (esp. exam presets). |

All heavy libraries are **dynamically imported** at the point of use, never in the global/initial bundle.

---

## 4. Deployment Architecture

```
GitHub repo
   │  push / PR
   ▼
Vercel
   ├─ Preview deployment per PR (automatic)
   ├─ Production deployment on main
   ├─ Build: next build → static pages + minimal JS chunks
   ├─ Edge CDN: serves cached static HTML/assets worldwide
   └─ (No serverless file-processing functions in MVP)
```

- **Rendering modes:** prefer **Static (SSG)** for all marketing/tool/blog pages. Use ISR only if/when content needs periodic regeneration. Avoid SSR for tool pages - there's no per-request server work to do.
- **Functions:** none needed for MVP. Sitemap/robots are generated at build time. If a tiny edge function is ever required (e.g. dynamic OG images), keep it stateless and cheap.
- **Assets:** static, fingerprinted, cached aggressively at the edge.
- **Domain:** `form-prep.rentrik.in` via Vercel domain config.
- **Cost posture:** static + edge caching keeps us in the cheapest tier. No databases, no always-on compute.

### CI/CD
- Lint + typecheck + build must pass on every PR (GitHub Actions or Vercel checks).
- Preview URL on every PR for manual/mobile QA.
- Lighthouse CI (optional) to guard the performance budget.

---

## 5. Performance Considerations

| Lever | Approach |
|---|---|
| **Initial payload** | Server Components ship HTML, near-zero JS for the page shell. |
| **Code splitting** | `next/dynamic` for every tool widget; heavy libs in their own chunks loaded on demand. |
| **Lazy engines** | Image/PDF/WASM engines imported only when the user acts. |
| **Fonts** | `next/font` self-hosted, `display: swap`, subset to Latin (+ Devanagari later). |
| **Images (UI)** | `next/image`, modern formats, correct sizing. |
| **Main-thread** | Offload heavy compute to Web Workers; show progress UI. |
| **Caching** | Edge CDN caching of static assets; immutable hashed filenames. |
| **CLS** | Reserve space for previews and (future) ad slots to avoid layout shift. |
| **Budget** | Enforced limits in `CLAUDE.md` §8; Lighthouse mobile ≥ 90. |
| **Low-end devices** | Test on throttled CPU/network; cap input sizes; sequential processing. |

---

## 6. Security & Privacy Considerations

### Privacy (the core promise)
- **No uploads.** All file processing is local. We must be able to demonstrate (DevTools Network tab) that no file bytes are transmitted.
- **No accounts, no PII storage** in MVP.
- **No third-party file APIs.** Don't route documents through external services.
- **Clear messaging:** every tool states "Your files are processed on your device and never uploaded."

### Application security
- **Strict CSP** and security headers (e.g. `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locking down camera/geolocation unless a tool needs it).
- **No `dangerouslySetInnerHTML`** with untrusted content. Sanitize any rich content.
- **Validate inputs** (file type, size, dimension bounds) before processing; reject hostile inputs gracefully.
- **Dependency hygiene:** pin versions, run `npm audit`, keep the dependency surface small. Heavy libs are well-known and vetted (`pdf-lib`, `pdfjs-dist`).
- **HTTPS only**, HSTS via Vercel.
- **Local memory cleanup:** revoke blob URLs; don't persist files to `localStorage`/`IndexedDB` unless the user explicitly opts into a local-only feature later.

### When AdSense is added (Phase 3)
- Load ad scripts **after** core content and outside the critical path.
- Reserve fixed ad slot dimensions to protect CLS.
- Update CSP and the privacy/consent notice accordingly (India + GDPR-style consent where relevant).

### Threat model summary
The biggest "risk" is breaking the privacy promise by accidentally introducing a network upload, or breaking SEO by over-clienting pages. Both are caught by the Definition-of-Done checklist and by keeping processing in `lib/` pure engines that have no network access.
