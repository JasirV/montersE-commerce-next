import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "./Providers";
import { GlobalProvider } from "@/components/shared/context/GlobalContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Analytics } from "@vercel/analytics/next";

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
    icon: [
      { url: "/my-app/public/favicon.ico", sizes: "any" },
      {
        url: "/my-app/public/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/my-app/public/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/my-app/public/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

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
  return (
    <html lang="en">
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href={SITE_URL} />

        {/* Apple touch icon */}
        <link
          rel="apple-touch-icon"
          href="/my-app/public/apple-touch-icon.png"
          sizes="180x180"
        />

        {/* Favicon PNGs */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/my-app/public/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/my-app/public/favicon-16x16.png"
        />

        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden overflow-y-auto`}
      >
        <ToastContainer />

        <Providers>
          <GlobalProvider>{children}</GlobalProvider>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
