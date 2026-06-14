import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";

// Replace with your actual AdSense publisher ID (same as in components/ads/AdSlot.tsx)
const ADSENSE_PUBLISHER_ID = "ca-pub-5234187071328825";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Free Document Preparation for Indian Forms`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "resize photo to kb", "compress pdf online", "passport photo maker",
    "crop signature online", "SSC photo resize", "UPSC photo size",
    "government form photo resize", "image tools online free india",
  ],
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />

        {/* Google Analytics (GA4) — one tag covers all pages in App Router */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-789M5DMHYW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-789M5DMHYW');
          `}
        </Script>

        {/* Google AdSense — loads after page is interactive, non-blocking */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Header />
        <div className="flex-1">{children}</div>
        <Footer />

        {/* Vercel Analytics — privacy-respecting, no cookies */}
        <Analytics />
      </body>
    </html>
  );
}
