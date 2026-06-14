import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import { BLOG_POSTS, BLOG_POSTS_BY_SLUG } from "@/lib/blog/posts";
import { CalendarDays, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${siteConfig.url}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) notFound();

  return (
    <>
      <JsonLd data={[
        buildWebPageJsonLd({ title: post.title, description: post.description, path: `/blog/${post.slug}` }),
        buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]),
      ]} />
      <Container as="main" className="py-6 sm:py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </time>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
            {post.content}
          </div>

          <div className="border-t pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to all guides
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
