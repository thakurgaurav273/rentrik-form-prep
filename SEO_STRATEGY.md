# SEO_STRATEGY.md

SEO is a **first-class architectural concern**, not an afterthought. Our growth engine is organic search: users land on a tool page exactly when they search "reduce photo to 50 kb for ssc form". Every page is statically rendered, semantically structured, fast, and richly linked.

---

## 1. Core SEO Principles

1. **Static rendering** — every page ships meaningful HTML at build time (Server Components / SSG). No content hidden behind client JS.
2. **One intent per page** — each tool targets a specific search intent and keyword cluster.
3. **Speed = ranking** — our performance budget (LCP ≤ 2.5s, CLS ≤ 0.1) directly serves Core Web Vitals.
4. **Structured data everywhere** — `SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`.
5. **Topical authority** — tools + supporting blog content + tight internal linking build authority around "Indian form document prep".

---

## 2. URL Structure

Clean, lowercase, hyphenated, hierarchical, keyword-bearing, stable.

```
https://form-prep.rentrik.in/                         ← Home
https://form-prep.rentrik.in/image                    ← Image tools category
https://form-prep.rentrik.in/pdf                      ← PDF tools category
https://form-prep.rentrik.in/convert                  ← Conversion tools category

/image/resize
/image/compress
/image/reduce-to-kb
/image/crop
/image/signature-cropper
/image/passport-photo-maker
/image/background-color-changer

/pdf/compress
/pdf/merge
/pdf/split
/pdf/image-to-pdf
/pdf/pdf-to-image

/convert/png-to-jpg
/convert/jpg-to-png
/convert/webp-to-jpg
/convert/webp-to-png

/blog                                                 ← Blog index
/blog/[slug]                                          ← Articles

/exam            (Phase 2)                             ← Exam Toolkit hub
/exam/ssc-cgl    (Phase 2)                             ← Per-exam landing pages
/exam/upsc       (Phase 2)
/exam/rrb        (Phase 2)
/exam/ibps       (Phase 2)
```

**Rules:**
- No trailing slashes (or enforce one form consistently); 301 the other.
- No query-param-driven content for indexable pages.
- URLs never change once published; if they must, 301 redirect.
- Category prefix groups tools and reinforces topical clustering.

---

## 3. Sitemap Strategy

- **Dynamic `sitemap.ts`** (App Router) generates `sitemap.xml` at build from the **tool registry** + blog list — so adding a tool/post auto-adds it to the sitemap. No manual maintenance.
- Include `lastModified`; set `changeFrequency`/`priority` (home + category = high; tools = high; blog = medium).
- For scale, support a **sitemap index** splitting tools / blog / exams into separate sitemaps.
- `robots.ts` allows all, points to the sitemap, blocks nothing important (no `/api` to hide in MVP).
- Submit to **Google Search Console** and **Bing Webmaster**; monitor coverage and Core Web Vitals reports.

---

## 4. Metadata Strategy

Use Next.js Metadata API. Every page exports `metadata` (or `generateMetadata`).

**Per page:**
- **Title** — `Primary Keyword | Rentrik Form Prep` (≤ ~60 chars). E.g. *"Reduce Image to 50 KB Online (Free) | Rentrik Form Prep"*.
- **Description** — benefit + India/form context + free + privacy (≤ ~155 chars). E.g. *"Reduce any photo to an exact KB size for SSC, UPSC & exam forms. Free, fast, processed on your device — no upload."*
- **Canonical** — self-referential canonical on every page.
- **Open Graph + Twitter** — title, description, image (per-category OG image), site name, locale `en_IN`.
- **Robots** — `index,follow` for all public pages.
- **lang/locale** — `en` (and `hi` for Hindi pages later).

**Structured data (JSON-LD):**
- `SoftwareApplication` on tool pages (free web app, category Utilities).
- `HowTo` describing the steps to use the tool.
- `FAQPage` from each tool's FAQ section.
- `BreadcrumbList` (Home › Category › Tool).
- `Organization`/`WebSite` (with `SearchAction`) site-wide.

Keep metadata generation **centralized** (a helper that takes tool registry entries → metadata) to avoid duplication and drift.

---

## 5. Internal Linking Strategy

- **Hub-and-spoke:** Home → category hubs → tools; tools link back up to their category and across to **related tools**.
- **Related tools block** on every tool page (e.g. "Resize Image" links to "Compress", "Reduce to KB", "Crop"). Curated by relevance, not random.
- **Contextual links** in tool copy and FAQs ("after resizing, you may want to compress to a target KB").
- **Blog → tool** links: every how-to article links to the relevant tool with descriptive anchor text.
- **Breadcrumbs** on every deep page (also emitted as structured data).
- **Footer** links to all categories + key tools (site-wide crawlable map).
- **Anchor text** is descriptive and keyword-aligned, never "click here".
- **Phase 2:** exam landing pages link to the specific tools/presets they use, and vice versa.

---

## 6. Tool Page SEO (the workhorse pages)

Each tool page is a complete, content-rich, statically-rendered document — not just a widget. Recommended structure:

1. **H1** = primary keyword phrase (e.g. "Reduce Image to Exact KB Online").
2. **Short intro** (1–2 sentences) with the keyword + benefit + privacy promise.
3. **The tool widget** (lazy-loaded client component) high on the page.
4. **"How to use" steps** (3–4 steps) → also `HowTo` structured data.
5. **Why / use cases** (Indian form context: SSC, UPSC, college, KYC).
6. **FAQ** (5–8 real questions: "What size does SSC require?", "Is my photo uploaded?") → `FAQPage` structured data.
7. **Related tools** (internal links).
8. **Trust/privacy section** (reinforces "no upload" — also a trust + dwell-time signal).

**On-page rules:** one H1, logical heading order, descriptive `alt` text, fast LCP (text-first), no layout shift, mobile-first content order (widget reachable without scrolling far).

---

## 7. Blog Strategy

The blog builds topical authority and captures informational queries that funnel into tools.

**Content pillars:**
1. **Exam document guides** — "SSC CGL Photo & Signature Size Requirements (2025)", "UPSC application photo specifications", per exam.
2. **How-to articles** — "How to reduce a photo to 20 KB on your phone", "How to merge PDFs for free without software".
3. **Problem/solution** — "Why your exam form keeps rejecting your photo (and how to fix it)".
4. **Comparisons/FAQs** — "JPG vs PNG for form uploads", "What DPI for a passport photo".

**Rules:**
- Each post targets a specific keyword cluster + clear search intent.
- Each post links to the relevant tool(s) with descriptive anchors (and tools link back where relevant).
- Original, genuinely useful, India-specific, regularly updated (year in title where relevant).
- Add `Article`/`BlogPosting` structured data, author/org, published/updated dates.
- Publish a starter batch (8–12) in Month 1, then steady cadence.

---

## 8. Keywords to Target in India

Focus on **high-intent, long-tail** queries tied to real form-filling pain. (Validate with Search Console / keyword tools; below are seed clusters.)

### Exact-size / compression (highest intent)
- reduce photo size to 50 kb / 20 kb / 100 kb online
- compress image to 50 kb for exam form
- resize photo for online form
- photo size kam kaise kare (Hindi intent)
- signature size 10 kb / 20 kb online
- reduce jpg/jpeg to 50 kb

### Exam-specific (Phase 2 goldmine)
- ssc photo and signature size
- upsc photo size online
- rrb / railway exam photo signature size
- ibps / sbi photo signature resize
- neet / jee photo upload size
- [exam] form photo signature converter

### Passport / photo
- passport size photo maker online free
- white background photo for form
- change photo background to white online

### PDF
- compress pdf to 100 kb / 200 kb / under 1 mb
- merge pdf online free
- split pdf online
- image to pdf converter
- pdf to jpg online free

### Conversion
- png to jpg converter online
- jpg to png online
- webp to jpg / webp to png

### Modifiers that win in India
- "online", "free", "without watermark", "for [exam] form", "in kb", "on mobile", "no login", in-language variants (Hindi/Hinglish).

**Keyword application:** map one primary keyword cluster per tool/page; weave naturally into H1, intro, steps, FAQ; never keyword-stuff. Capture the long tail via FAQ questions and blog posts.

---

## 9. Technical SEO Checklist

- [ ] All public pages statically rendered with full HTML content.
- [ ] Unique title + meta description + canonical per page.
- [ ] JSON-LD: SoftwareApplication, HowTo, FAQPage, BreadcrumbList, Organization/WebSite.
- [ ] Dynamic sitemap + robots; submitted to GSC/Bing.
- [ ] Core Web Vitals green (LCP/CLS/INP) on mobile.
- [ ] Mobile-friendly, responsive, no horizontal scroll.
- [ ] Descriptive internal links + breadcrumbs.
- [ ] OG/Twitter cards with per-category images.
- [ ] No duplicate content; consistent URL casing/trailing-slash.
- [ ] `hreflang` when Hindi pages launch.
- [ ] 404 page that links back into the tool hubs.
