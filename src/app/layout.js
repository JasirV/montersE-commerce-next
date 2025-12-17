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

/* =========================
   METADATA (SEO + FAVICON)
   ========================= */
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Montres — Luxury Watches",
  description:
    "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",

  icons: {
    icon: [
      { url: "/favicon.ico" }, // REQUIRED for Chrome
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Montres — Luxury Watches",
    description:
      "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",
    images: ["/og-default.jpg"],
    siteName: "Montres",
  },

  twitter: {
    card: "summary_large_image",
    title: "Montres — Luxury Watches",
    description:
      "Montres — curated selection of authentic luxury watches. Worldwide shipping. Authenticity guaranteed.",
    images: ["/og-default.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden`}
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
