import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "./Providers";
import { GlobalProvider } from "@/components/shared/context/GlobalContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Analytics } from "@vercel/analytics/next"; 
// Optional: Speed Insights
// import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.montres.ae";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Montres — Luxury Watches",
  description:
    "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Montres — Luxury Watches",
    description:
      "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",
    images: [`${SITE_URL}/og-default.jpg`],
    siteName: "Montres",
  },

  twitter: {
    card: "summary_large_image",
    title: "Montres — Luxury Watches",
    description:
      "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Montres",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/Montres.ae",
      "https://www.instagram.com/montres.ae",
      "https://www.tiktok.com/@montres.ae",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+97142671124",
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Arabic"],
      },
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "Montres",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={SITE_URL} />

        <link rel="alternate" href={SITE_URL} hrefLang="en-US" />
        <link rel="alternate" href={SITE_URL} hrefLang="x-default" />

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden overflow-y-auto`}
      >
        <ToastContainer />
        <Providers>
          <GlobalProvider>{children}</GlobalProvider>
        </Providers>

        {/* Optional Speed Insights */}
        {/* <SpeedInsights /> */}

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
