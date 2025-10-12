// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./Providers";
import { GlobalProvider } from "@/components/shared/context/GlobalContext";
import Head from "next/head"; // import Head

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Montres - Luxury Watches",
  description: "Luxury watches store in Dubai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Viewport for iOS Safari responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        {/* iOS web app support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ToastContainer */}
        <ToastContainer />
        {/* Providers wrapper */}
        <Providers>
          <GlobalProvider>
            {children}
          </GlobalProvider>
        </Providers>
      </body>
    </html>
  );
}
