/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['montres.ae','res.cloudinary.com',"lh3.googleusercontent.com","platform-lookaside.fbsbx.com"]
  },
  i18n: {
    locales: ['en', 'es', 'fr', 'de'],
    defaultLocale: 'en',
  },
  env: {
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  },
};

export default nextConfig;
