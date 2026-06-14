import Link from "next/link";
import { Container } from "./Container";
import { FileStack } from "lucide-react";

const NAV_LINKS: Array<{ label: string; href: string; highlight?: boolean }> = [
  { label: "Image", href: "/image" },
  { label: "PDF", href: "/pdf" },
  { label: "Convert", href: "/convert" },
  { label: "Exam Toolkit", href: "/exam", highlight: true },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity shrink-0">
          <FileStack className="h-5 w-5 text-primary" aria-hidden />
          <span className="text-sm sm:text-base">
            <span className="text-primary font-bold">Rentrik</span>{" "}
            <span className="hidden sm:inline text-muted-foreground font-normal">Form Prep</span>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    link.highlight
                      ? "rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                      : "rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
