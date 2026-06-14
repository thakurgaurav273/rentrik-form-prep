"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";

const NAV_LINKS: Array<{ label: string; href: string; highlight?: boolean }> = [
  { label: "Image Tools", href: "/image" },
  { label: "PDF Tools", href: "/pdf" },
  { label: "Convert", href: "/convert" },
  { label: "Exam Toolkit", href: "/exam", highlight: true },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Rentrik Form Prep – Home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/prep.png"
            alt="Rentrik Prep"
            width={180}
            height={50}
            className="h-25 w-40"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    link.highlight
                      ? "rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                      : "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-md border border-border hover:bg-muted transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-background shadow-lg">
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      link.highlight
                        ? "flex items-center px-5 py-3.5 text-base font-semibold text-primary hover:bg-primary/5 transition-colors"
                        : "flex items-center px-5 py-3.5 text-base font-medium text-foreground hover:bg-muted transition-colors"
                    }
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
