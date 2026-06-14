import Link from "next/link";
import { Container } from "./Container";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <Container className="py-8 space-y-8">
        {/* Row 1: Tools */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="font-semibold text-sm mb-3">Image Tools</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/image/resize" className="hover:text-foreground transition-colors">Resize Image</Link></li>
              <li><Link href="/image/compress" className="hover:text-foreground transition-colors">Compress Image</Link></li>
              <li><Link href="/image/reduce-to-kb" className="hover:text-foreground transition-colors">Reduce to KB</Link></li>
              <li><Link href="/image/crop" className="hover:text-foreground transition-colors">Crop Image</Link></li>
              <li><Link href="/image/signature-cropper" className="hover:text-foreground transition-colors">Signature Cropper</Link></li>
              <li><Link href="/image/passport-photo-maker" className="hover:text-foreground transition-colors">Passport Photo</Link></li>
              <li><Link href="/image/background-color-changer" className="hover:text-foreground transition-colors">Change Background</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">PDF Tools</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pdf/compress" className="hover:text-foreground transition-colors">Compress PDF</Link></li>
              <li><Link href="/pdf/merge" className="hover:text-foreground transition-colors">Merge PDF</Link></li>
              <li><Link href="/pdf/split" className="hover:text-foreground transition-colors">Split PDF</Link></li>
              <li><Link href="/pdf/image-to-pdf" className="hover:text-foreground transition-colors">Image to PDF</Link></li>
              <li><Link href="/pdf/pdf-to-image" className="hover:text-foreground transition-colors">PDF to Image</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Convert</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/convert/png-to-jpg" className="hover:text-foreground transition-colors">PNG to JPG</Link></li>
              <li><Link href="/convert/jpg-to-png" className="hover:text-foreground transition-colors">JPG to PNG</Link></li>
              <li><Link href="/convert/webp-to-jpg" className="hover:text-foreground transition-colors">WEBP to JPG</Link></li>
              <li><Link href="/convert/webp-to-png" className="hover:text-foreground transition-colors">WEBP to PNG</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Exam Toolkit</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/exam/ssc-cgl" className="hover:text-foreground transition-colors">SSC CGL</Link></li>
              <li><Link href="/exam/upsc-cse" className="hover:text-foreground transition-colors">UPSC CSE</Link></li>
              <li><Link href="/exam/rrb-ntpc" className="hover:text-foreground transition-colors">RRB NTPC</Link></li>
              <li><Link href="/exam/ibps-po" className="hover:text-foreground transition-colors">IBPS PO</Link></li>
              <li><Link href="/exam/neet" className="hover:text-foreground transition-colors">NEET UG</Link></li>
              <li><Link href="/exam" className="hover:text-foreground transition-colors font-medium">All Exams →</Link></li>
            </ul>
          </div>
        </div>

        {/* Row 2: Blog + Company */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="font-semibold text-sm mb-3">Blog</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog/how-to-reduce-photo-size-to-50kb-for-ssc-upsc-forms" className="hover:text-foreground transition-colors">Reduce Photo to 50 KB</Link></li>
              <li><Link href="/blog/ssc-cgl-photo-signature-size-requirements-2025" className="hover:text-foreground transition-colors">SSC CGL Photo Size</Link></li>
              <li><Link href="/blog/how-to-merge-pdf-files-online-free-without-uploading" className="hover:text-foreground transition-colors">Merge PDF Free</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors font-medium">All Guides →</Link></li>
            </ul>
          </div>
          <div className="col-span-1 sm:col-span-3 flex flex-col justify-start">
            <p className="font-semibold text-sm mb-3">Company</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden />
            <span>Your files are processed on your device and never uploaded to any server.</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rentrik Form Prep · Free. Private. Fast.
          </p>
        </div>
      </Container>
    </footer>
  );
}
