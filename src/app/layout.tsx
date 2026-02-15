import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { AnalyticsLoader } from "@/components/analytics-loader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://senile.online"),
  title: {
    default: "S.E.N.I.L.E. Interactive Archive",
    template: "%s | S.E.N.I.L.E.",
  },
  description:
    "Immersive institutional archive following S.E.N.I.L.E. containment records, case files, and graphic novel disclosures.",
  keywords: [
    "S.E.N.I.L.E.",
    "graphic novel",
    "interactive archive",
    "case files",
    "comic series",
    "Webtoon",
    "domestic anomalies",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://senile.online",
    siteName: "S.E.N.I.L.E. Interactive Archive",
    title: "S.E.N.I.L.E. Interactive Archive",
    description:
      "An immersive archive world tracking minor domestic anomalies with catastrophic seriousness.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "S.E.N.I.L.E. logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "S.E.N.I.L.E. Interactive Archive",
    description:
      "Explore case files, containment records, and public disclosure editions from the S.E.N.I.L.E. universe.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1720",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "S.E.N.I.L.E.",
    url: "https://senile.online",
    logo: "https://senile.online/icon.png",
    sameAs: ["https://www.instagram.com/senile.06/", "https://www.tiktok.com/@senile06"],
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "S.E.N.I.L.E. Interactive Archive",
    url: "https://senile.online",
    inLanguage: "en",
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <div className="appShell">
          <SiteHeader />
          <div className="appContent">{children}</div>
          <SiteFooter />
          <CookieConsentBanner />
          <AnalyticsLoader />
        </div>
      </body>
    </html>
  );
}
