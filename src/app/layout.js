// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "./Providers";
import { GlobalProvider } from "@/components/shared/context/GlobalContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SITE-WIDE metadata (fallback defaults)
export const metadata = {
  title: "Montres — Luxury Watches",
  description: "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",
};

const SITE_URL = "https://www.montres.a"; // ← update
const DEFAULT_LOCALE = "en-US";

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Montres",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "sameAs": [
      "https://www.facebook.com/Montres.ae",
      "https://www.instagram.com/montres.ae",
      "https://www.tiktok.com/@montres.ae"
    ],
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+97142671124",
      "contactType": "customer service",
      "areaServed": "Worldwide",
      "availableLanguage": ["English","Arabic"]
    }]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": SITE_URL,
    "name": "Montres",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Social / Open Graph */}
        <meta property="og:site_name" content="Montres" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-default.jpg`} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitter" />
        <meta name="twitter:creator" content="@yourtwitter" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={`${SITE_URL}/og-default.jpg`} />

        {/* Canonical - override per page if needed */}
        <link rel="canonical" href={SITE_URL} />

        {/* Hreflang - example set, add/remove locales you support */}
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="en-US" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="en-GB" />
        <link rel="alternate" href={`${SITE_URL}/fr/`} hrefLang="fr-FR" />
        <link rel="alternate" href={`${SITE_URL}/de/`} hrefLang="de-DE" />
        <link rel="alternate" href={`${SITE_URL}/es/`} hrefLang="es-ES" />
        <link rel="alternate" href={`${SITE_URL}/zh/`} hrefLang="zh-CN" />
        <link rel="alternate" href={`${SITE_URL}/ar/`} hrefLang="ar-AE" />
        <link rel="alternate" href={`${SITE_URL}/ja/`} hrefLang="ja-JP" />
        <link rel="alternate" href={SITE_URL} hrefLang="x-default" />

        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={`${SITE_URL}/logo.png`} />
        <link rel="icon" href="https://www.montres.ae/favicon.ico" />

        {/* JSON-LD for Organization & WebSite (site-wide) */}
        <script
          type="application/ld+json"
          // NOTE: JSON must be stringified
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden overflow-y-auto`}>
        <ToastContainer />
        <Providers>
          <GlobalProvider>
            {children}
          </GlobalProvider>
        </Providers>
      </body>
    </html>
  );
}
