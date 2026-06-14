import Link from "next/link";
import type { ReactNode } from "react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  content: ReactNode;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-reduce-photo-size-to-50kb-for-ssc-upsc-forms",
    title: "How to Reduce Photo Size to 20–50 KB for SSC, UPSC & Railway Forms",
    description: "Step-by-step guide to reducing your photo to exactly 20 KB, 50 KB, or any target size required by SSC, UPSC, Railway, and banking exam portals - free and without uploading.",
    date: "2026-06-14",
    keywords: ["reduce photo to 50kb", "compress photo for ssc", "photo size for exam form", "reduce image size kb online free india"],
    content: (
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every government exam portal in India - SSC, UPSC, RRB, IBPS, SBI - requires your
          photo to be a specific KB size. The most common requirement is <strong>20–50 KB in JPEG format</strong>.
          If your phone camera takes 2–5 MB photos, you need to reduce the size by up to 99%.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-3">Why Exam Portals Reject Large Photos</h2>
          <p className="text-muted-foreground">
            Exam servers process millions of uploads. Large files slow down the database and
            increase storage costs. The portal validates file size before accepting your form -
            uploading a 2 MB photo when 50 KB is required will fail immediately with an error.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Common Photo Size Requirements by Exam</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Exam</th>
                  <th className="px-4 py-3 text-left font-medium">Photo Size</th>
                  <th className="px-4 py-3 text-left font-medium">Format</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["SSC CGL / CHSL", "20–50 KB", "JPEG"],
                  ["UPSC CSE (IAS)", "3–300 KB", "JPEG"],
                  ["RRB NTPC / Group D", "20–50 KB", "JPEG"],
                  ["IBPS PO / Clerk", "20–50 KB", "JPEG"],
                  ["SBI PO / Clerk", "20–100 KB", "JPEG"],
                  ["NEET UG", "10–200 KB", "JPEG"],
                  ["JEE Main", "4–100 KB", "JPEG"],
                ].map(([exam, size, fmt]) => (
                  <tr key={exam}>
                    <td className="px-4 py-3 font-medium">{exam}</td>
                    <td className="px-4 py-3">{size}</td>
                    <td className="px-4 py-3">{fmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pixel dimensions vary by exam and notification cycle. Always check the current official notification for exact dimensions before submitting your form.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How to Reduce Your Photo to 50 KB (Step by Step)</h2>
          <ol className="space-y-4">
            {[
              ["Open the Reduce to KB tool", <>Go to <Link href="/image/reduce-to-kb" className="text-primary hover:underline">Reduce Image to Exact KB</Link> - it's free and runs entirely in your browser.</>],
              ["Upload your photo", "Tap 'Browse file' or drag and drop your photo. JPG, PNG, and WEBP are all accepted."],
              ["Set the target KB", "Type '50' (or 20, or whatever your exam requires). The tool uses a binary search algorithm to hit exactly that size."],
              ["Click 'Reduce to KB'", "Processing takes 2–5 seconds. The tool tries multiple quality levels to get as close as possible to your target without going over."],
              ["Download and verify", "Download the result and check the file size. It will be at or under your target. Upload it to the exam portal."],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-sm">{title as string}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc as ReactNode}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Is My Photo Uploaded to Any Server?</h2>
          <p className="text-muted-foreground">
            No. Rentrik Form Prep processes everything in your browser using the Canvas API.
            Your photo never leaves your device. No server receives it, stores it, or sees it.
            This makes it safe even for sensitive government documents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Tips for Best Results</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Start with a clear, well-lit photo. Blurry photos need higher quality settings to look acceptable, making compression harder.</li>
            <li>For very small targets (under 10 KB), quality will visibly degrade. Most portals accept 20–50 KB which gives acceptable quality.</li>
            <li>If the portal also requires specific pixel dimensions (check the notification), use the <Link href="/image/resize" className="text-primary hover:underline">Resize Image</Link> tool first, then reduce to KB.</li>
            <li>Or use the <Link href="/exam" className="text-primary hover:underline">Exam Toolkit</Link> - it handles both resize and KB reduction in one step for your specific exam.</li>
          </ul>
        </section>
      </div>
    ),
  },

  {
    slug: "ssc-cgl-photo-signature-size-requirements-2025",
    title: "SSC CGL Photo & Signature Upload Requirements – File Size, Format & Background Guide",
    description: "SSC CGL photo and signature upload requirements: file size, format, background, and preparation tips. Based on commonly accepted SSC guidelines — always verify with the current official notification.",
    date: "2026-06-14",
    keywords: ["ssc cgl photo size", "ssc cgl signature size", "ssc photo requirements", "ssc cgl photo kb", "ssc cgl photo format"],
    content: (
      <div className="space-y-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          <strong>Note:</strong> The specifications below are based on commonly accepted SSC upload requirements at the time of writing. SSC can update requirements with each notification cycle. Always refer to the current official SSC notification before submitting your form.
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          SSC CGL is one of India&apos;s most competitive exams, with lakhs of applicants each year.
          A common reason for form rejection is incorrect photo or signature specifications —
          wrong file size, wrong format, or wrong background colour.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-3">SSC CGL Photo Requirements</h2>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            {[
              ["File format", "JPG / JPEG only"],
              ["File size", "20 KB to 50 KB"],
              ["Background", "Plain white or light background"],
              ["Expression", "Front-facing, eyes open, neutral expression"],
              ["Age", "Recent photograph (taken within 6 months)"],
            ].map(([key, val]) => (
              <div key={key as string} className="flex gap-3 text-sm">
                <span className="w-28 text-muted-foreground shrink-0">{key}</span>
                <span className="font-medium">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pixel dimensions vary across SSC portals and notification years. Check the current notification PDF for the exact value required for your cycle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">SSC CGL Signature Requirements</h2>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            {[
              ["File format", "JPG / JPEG only"],
              ["File size", "10 KB to 20 KB"],
              ["Background", "White paper"],
              ["Ink", "Black or blue ink, clear and legible"],
              ["Style", "Cursive, matching your government ID signature"],
            ].map(([key, val]) => (
              <div key={key as string} className="flex gap-3 text-sm">
                <span className="w-28 text-muted-foreground shrink-0">{key}</span>
                <span className="font-medium">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Signature dimensions also vary. The notification will specify the exact pixel size for the current cycle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How to Prepare Your SSC CGL Photo & Signature</h2>
          <p className="text-muted-foreground mb-3">
            Use the <Link href="/exam/ssc-cgl" className="text-primary hover:underline">SSC CGL Photo & Signature Resizer</Link> to compress and resize both files to meet SSC requirements — runs entirely in your browser, nothing uploaded.
          </p>
          <ol className="space-y-3">
            {[
              "Check the current SSC notification for this cycle's exact pixel dimensions.",
              "Open the SSC CGL Resizer tool and upload your photo. Set the target dimensions from the notification and the tool compresses to under 50 KB automatically.",
              "Upload your signature scan. Set the target dimensions and compress to under 20 KB.",
              "Download both files and verify the file sizes before uploading to the portal.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Common Mistakes That Cause Form Rejection</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li><strong className="text-foreground">Photo too large:</strong> Phone cameras save at 2–8 MB. This is 40–160× too large. Always compress before uploading.</li>
            <li><strong className="text-foreground">Wrong format:</strong> PNG, WEBP, HEIC are not accepted. Convert to JPEG/JPG first.</li>
            <li><strong className="text-foreground">Coloured background:</strong> Only white or very light backgrounds. No blue, grey, or patterned backgrounds.</li>
            <li><strong className="text-foreground">Signature too large:</strong> Scanned signatures are often 200–500 KB. The limit is typically 20 KB — always compress.</li>
            <li><strong className="text-foreground">Wrong dimensions:</strong> Even if the KB is correct, pixel dimensions that don't match the portal's requirement can fail validation. Always check the notification.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Other SSC Exams</h2>
          <p className="text-muted-foreground">
            SSC CHSL, SSC MTS, SSC GD Constable, and SSC CPO use similar photo and signature requirements — JPG format, 20–50 KB photo, 10–20 KB signature, plain white background. Exact pixel dimensions may differ between exams and cycles. Always verify with the current official notification before submitting.
          </p>
        </section>
      </div>
    ),
  },

  {
    slug: "how-to-merge-pdf-files-online-free-without-uploading",
    title: "How to Merge PDF Files Online Free – Without Uploading to Any Server",
    description: "Merge multiple PDF files into one online, completely free, with no upload to any server. Your documents stay on your device. Works on mobile.",
    date: "2026-06-14",
    keywords: ["merge pdf online free", "combine pdf online", "merge pdf without uploading", "pdf merge india", "join pdf files free"],
    content: (
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Many job applications and college admissions require you to submit all your documents as a
          single PDF - marksheets, certificates, ID proof, all in one file. Here&apos;s how to merge
          PDFs in seconds, for free, without any upload or account.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-3">Why You Need to Merge PDFs</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Job application portals often accept only one file - you need to combine resume, certificates, and ID.</li>
            <li>College admissions may require marksheets from multiple years merged into one PDF.</li>
            <li>Government forms may ask for a single document bundle.</li>
            <li>Sending multiple attachments over email when one combined file is cleaner.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How to Merge PDFs with Rentrik Form Prep</h2>
          <ol className="space-y-4">
            {[
              ["Open the Merge PDF tool", <>Go to <Link href="/pdf/merge" className="text-primary hover:underline">Merge PDF Online</Link>.</>],
              ["Upload your PDFs", "Click 'Add PDF' or drag and drop multiple files. You can add as many as you need."],
              ["Reorder if needed", "Drag the files into the order you want them to appear in the merged document."],
              ["Click 'Merge PDFs'", "Processing happens in your browser using pdf-lib. No files are uploaded anywhere."],
              ["Download the merged PDF", "A single combined PDF downloads directly to your device."],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-sm">{title as string}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc as ReactNode}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Is It Safe to Merge PDFs Online?</h2>
          <p className="text-muted-foreground">
            With most online tools, your PDF is uploaded to a server you don&apos;t control - a significant
            privacy risk when the documents contain Aadhaar numbers, marksheets, or salary slips.
          </p>
          <p className="text-muted-foreground mt-2">
            Rentrik Form Prep uses <strong className="text-foreground">pdf-lib</strong>, a JavaScript library that
            runs entirely in your browser. Your PDFs are never sent over the internet. The merged
            file is created locally on your device and downloaded directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Tips for a Clean Merged PDF</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>If the merged file is too large, use the <Link href="/pdf/compress" className="text-primary hover:underline">PDF Compressor</Link> after merging.</li>
            <li>Add files in the order you want them - the tool preserves your ordering.</li>
            <li>Password-protected PDFs cannot be merged. Remove the password first.</li>
            <li>Very large PDFs (100+ MB) may be slow on low-RAM phones. Split them first if needed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Related PDF Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["/pdf/compress", "Compress PDF", "Reduce PDF size to meet upload limits"],
              ["/pdf/split", "Split PDF", "Extract specific pages from a PDF"],
              ["/pdf/image-to-pdf", "Images to PDF", "Combine photos into a PDF"],
              ["/pdf/pdf-to-image", "PDF to Image", "Convert pages to JPG or PNG"],
            ].map(([href, title, desc]) => (
              <Link
                key={href}
                href={href as string}
                className="rounded-lg border bg-card p-3 hover:border-primary/50 transition-colors group"
              >
                <p className="text-sm font-medium group-hover:text-primary">{title as string}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc as string}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    ),
  },
];

export const BLOG_POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p])
);
