/** @type {import('next').NextConfig} */
const nextConfig = {
   i18n: {
    locales: ['en-US','en-GB','fr-FR','de-DE','es-ES','zh-CN','ja-JP','ar-AE'],
    defaultLocale: 'en-US',
    localeDetection: true, // be careful: don't auto-redirect bots; handle with middleware
  },
  images: {
    domains: [
      'montres.ae',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
    ],
    unoptimized: true, // ✅ placed correctly outside of domains array
  },

  env: {
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  },
};

export default nextConfig;
