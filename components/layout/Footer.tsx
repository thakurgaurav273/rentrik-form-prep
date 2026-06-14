import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { Shield, Lock, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";

type NavLink = { label: string; href: string; bold?: boolean };

const TOOL_LINKS: Record<string, NavLink[]> = {
  "Image Tools": [
    { label: "Resize Image", href: "/image/resize" },
    { label: "Compress Image", href: "/image/compress" },
    { label: "Reduce to KB", href: "/image/reduce-to-kb" },
    { label: "Crop Image", href: "/image/crop" },
    { label: "Signature Cropper", href: "/image/signature-cropper" },
    { label: "Passport Photo", href: "/image/passport-photo-maker" },
    { label: "Change Background", href: "/image/background-color-changer" },
    { label: "Remove Background", href: "/image/remove-background" },
  ],
  "PDF Tools": [
    { label: "Compress PDF", href: "/pdf/compress" },
    { label: "Merge PDF", href: "/pdf/merge" },
    { label: "Split PDF", href: "/pdf/split" },
    { label: "Image to PDF", href: "/pdf/image-to-pdf" },
    { label: "PDF to Image", href: "/pdf/pdf-to-image" },
  ],
  "Convert": [
    { label: "PNG to JPG", href: "/convert/png-to-jpg" },
    { label: "JPG to PNG", href: "/convert/jpg-to-png" },
    { label: "WEBP to JPG", href: "/convert/webp-to-jpg" },
    { label: "WEBP to PNG", href: "/convert/webp-to-png" },
  ],
  "Exam Toolkit": [
    { label: "SSC CGL", href: "/exam/ssc-cgl" },
    { label: "UPSC CSE", href: "/exam/upsc-cse" },
    { label: "RRB NTPC", href: "/exam/rrb-ntpc" },
    { label: "IBPS PO", href: "/exam/ibps-po" },
    { label: "NEET UG", href: "/exam/neet" },
    { label: "All Exams →", href: "/exam", bold: true },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <Container className="py-10 sm:py-14">

        {/* Top: Brand + Links */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">

          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" aria-label="Rentrik Prep – Home">
              <Image
                src="/prep.png"
                alt="Rentrik Prep"
                width={160}
                height={44}
                className="h-30 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Free, private document tools for every Indian exam, college, and job application.
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { icon: Lock, text: "Files never leave your device" },
                { icon: Zap, text: "No signup, no login required" },
                { icon: Shield, text: "100% free, always" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(TOOL_LINKS).map(([category, links]) => (
              <div key={category}>
                <p className="font-semibold text-sm mb-3">{category}</p>
                <ul className="space-y-2">
                  {links.map(({ label, href, bold }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`text-sm transition-colors hover:text-foreground ${bold ? "font-medium text-foreground/80" : "text-muted-foreground"}`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name} · Free. Private. Fast.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: "About", href: "/about" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Contact", href: "/contact" },
              { label: "Blog", href: "/blog" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

      </Container>
    </footer>
  );
}
