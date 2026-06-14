# PRODUCT_REQUIREMENTS.md

## 1. Product Vision

**Rentrik Form Prep** aims to be **India's most useful free document preparation platform** - the place every student, job seeker, and applicant opens when an online form says *"Upload photo (max 50 KB, 200×230 px, JPEG)"* and they have no idea how to comply.

Filling government and college forms in India is blocked daily by document formatting friction: photos that are too large, signatures that need cropping, PDFs that must be merged or compressed under a size limit, formats that must be converted. Existing tools are ad-choked, slow, upload private documents to unknown servers, or are buried behind paywalls.

Rentrik Form Prep solves this with a **fast, mobile-first, privacy-first** platform where **all processing happens in the user's browser** - files never leave the device. It is free, requires no login, and is engineered to be discoverable through search exactly when users need it.

**Long-term vision:** become the default "document prep" layer for Indian online applications, culminating in an **Exam Toolkit** that auto-formats documents to the exact official specs of SSC, UPSC, Railway, Banking, and other exams - removing the single most common reason applicants fail to submit.

---

## 2. User Personas

### Persona 1 - Ananya, the Government Exam Applicant
- **Age:** 22 · Tier-2 city · Applying for SSC CGL / Railway exams.
- **Device:** Budget Android phone, mobile data, intermittent connectivity.
- **Pain:** "Photo must be 20–50 KB, signature 10–20 KB, exact dimensions. The portal keeps rejecting my upload."
- **Need:** A tool that resizes/compresses to an *exact KB* and exact pixel size, quickly, on her phone.
- **Win condition:** First-attempt successful upload to the exam portal.

### Persona 2 - Rohit, the Job Seeker
- **Age:** 26 · Applying to multiple private + government jobs.
- **Device:** Mid-range phone + occasional laptop.
- **Pain:** Needs to merge certificates into one PDF, compress a resume PDF under 2 MB, convert PNG to JPG.
- **Need:** PDF merge, compress, and format conversion that just works without installing software.
- **Win condition:** A clean, correctly-sized application packet.

### Persona 3 - Sneha, the College Applicant
- **Age:** 18 · Filling admission/scholarship forms.
- **Device:** Shared family phone.
- **Pain:** Passport photo with white background, signature cropped neatly, marksheet scanned and compressed.
- **Need:** Passport Photo Maker, Background Color Changer, Signature Cropper, Image-to-PDF.
- **Win condition:** Submits a complete, compliant application.

### Persona 4 - Mr. Verma, the Helpful General User / Cyber-café operator
- **Age:** 40 · Helps neighbours/customers with forms.
- **Device:** Laptop, decent connection.
- **Pain:** Does the same formatting tasks repeatedly; wants something reliable, fast, free, and trustworthy with private documents.
- **Need:** All tools, fast, no surprises, works in any browser.
- **Win condition:** Becomes a repeat user and word-of-mouth promoter.

### Persona 5 - The Privacy-Conscious User
- Anyone who refuses to upload Aadhaar, marksheets, or signatures to a random website.
- **Need:** Verifiable, in-browser processing.
- **Win condition:** Trusts the platform because nothing is uploaded.

---

## 3. Goals

### Product Goals
1. Let any user prepare a compliant image/signature/PDF for an online form in **under 60 seconds**, on a phone.
2. **Never require login** or upload of private files (MVP).
3. Cover the **most common Indian form-prep tasks** in one place.
4. Be **found via search** at the moment of need.
5. Lay groundwork for the **Exam Toolkit** (preset-driven auto-formatting).

### Business Goals
1. Reach meaningful organic traffic through SEO before spending on marketing.
2. Keep infrastructure cost **near zero** (static + client-side).
3. Monetize later via **Google AdSense** without harming UX or privacy.

### Engineering Goals
1. Ship MVP fast with a small, predictable, reusable codebase.
2. Keep bundles small and pages fast (see performance budget in `CLAUDE.md`).
3. Architect engines as **configurable pure functions** so the Exam Toolkit reuses them.

---

## 4. Success Metrics

### North Star
**Successful document preparations per week** - a user opens a tool, processes a file, and downloads a result.

### Supporting Metrics
| Category | Metric | Target (early) |
|---|---|---|
| Acquisition | Organic search clicks/week | Growing month-over-month |
| Activation | % of visitors who complete a tool action | ≥ 35% |
| Engagement | Tools used per session | ≥ 1.5 |
| Retention | Returning users / week | Growing trend |
| Performance | Lighthouse mobile Perf | ≥ 90 |
| Performance | LCP (mobile, 4G) | ≤ 2.5 s |
| SEO | Indexed tool pages | 100% of tool pages |
| SEO | Tool pages ranking on page 1 for target long-tail keywords | Growing count |
| Trust | Bounce rate on tool pages | Decreasing trend |
| Cost | Monthly Vercel cost | ≈ ₹0 in MVP |

*(Analytics added post-MVP with a lightweight, privacy-respecting tool. Metrics above are targets to design toward.)*

---

## 5. Feature List (MVP)

### Image Tools
- **Resize Image** - change pixel dimensions (with/without aspect lock).
- **Compress Image** - reduce file size by quality/format.
- **Reduce Image To Exact KB** - iteratively hit a target file size (e.g. "≤ 50 KB").
- **Crop Image** - freeform and fixed-ratio cropping.
- **Signature Cropper** - crop + clean a signature, optional transparent/white background, target KB.
- **Passport Photo Maker** - produce standard passport/photo sizes with correct dimensions and background.
- **Background Color Changer** - replace background (e.g. white/blue) for photos/signatures.

### PDF Tools
- **Compress PDF** - reduce PDF size (downsample images, re-encode).
- **Merge PDF** - combine multiple PDFs / reorder.
- **Split PDF** - extract pages / split by range.
- **Image To PDF** - combine images into a single PDF.
- **PDF To Image** - render pages to JPG/PNG.

### Conversion Tools
- **PNG → JPG**
- **JPG → PNG**
- **WEBP → JPG**
- **WEBP → PNG**

### Cross-cutting (MVP platform features)
- Static, SEO-optimized landing + category + tool pages.
- Shared upload/dropzone, preview, download, and "process another file" patterns.
- Clear privacy messaging ("Your files never leave your device").
- Mobile-first responsive layout; reserved (empty) ad slots for the future.

---

## 6. Future Roadmap

### Phase 2 - Exam Toolkit (flagship differentiator)
- User selects an exam (SSC, UPSC, Railway, Banking, State PSCs, NEET/JEE, etc.).
- System loads **official document presets** (photo dimensions + KB range, signature dimensions + KB range, accepted formats, background color).
- Engines auto-format the user's uploads to match - one-tap compliance.
- Each exam gets its own **SEO landing page** ("SSC CGL photo & signature size online tool").
- Built entirely on the *same* MVP engines, fed by preset config objects.

### Phase 2.5 - Productivity & Trust
- Batch processing (multiple files at once).
- Drag-to-reorder, multi-page workflows.
- "Recipe" / saved preferences (local only).
- Hindi + regional language UI (i18n layer from day one).
- Lightweight privacy-respecting analytics.

### Phase 3 - Monetization & Scale
- Google AdSense in reserved, CLS-safe slots.
- More document tools: e-sign placement, watermark, OCR text extraction, scanned-doc cleanup, eSign-style stamp/affix.
- More conversions (HEIC→JPG, PDF→Word where feasible client-side).
- Possible optional, fully-consented server tools for tasks browsers can't do well - clearly separated and opt-in.
- PWA / offline support so tools work without connectivity.

### Guiding principle for the roadmap
Build the **simplest MVP** now, but keep engines **configurable and UI-agnostic**, so Phase 2's Exam Toolkit and Phase 3's scale features are additive - never rewrites.
