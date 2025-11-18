/** @type {import('next').NextConfig} */
const nextConfig = {
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
