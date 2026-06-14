import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { CalendarDays, ChevronRight } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Document Prep Tips & Guides for Indian Exam Forms",
  description: "Free guides on resizing photos, compressing PDFs, and preparing documents for SSC, UPSC, Railway, and banking exam portals.",
  path: "/blog",
  keywords: ["ssc photo size guide", "upsc document preparation", "exam form tips india", "photo resize tutorial"],
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: "Document Prep Tips & Guides for Indian Exam Forms", description: "Free guides on document preparation for Indian exams.", path: "/blog" }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]),
      ]} />
      <Container as="main" className="py-8 sm:py-12 space-y-8">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tips & Guides</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-prose">
            Practical guides on preparing photos, signatures, and PDFs for Indian government exam and application forms.
          </p>
        </div>

        <div className="space-y-4">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-base group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
