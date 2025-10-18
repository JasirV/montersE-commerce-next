/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'montres.ae',
      'via.placeholder.com',
      'encrypted-tbn0.gstatic.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'i.pravatar.cc',
      'images.unsplash.com'
    ],
    formats: ['image/avif', 'image/webp'], // optimized for iOS Safari
  },

  // Force HTTPS to avoid Safari blocking mixed content
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'montres.ae' }],
        destination: 'https://montres.ae/:path*',
        permanent: true,
      },
    ];
  },

  // Ensure code compiles for iOS Safari
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  env: {
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  },

  experimental: {
    forceSwcTransforms: true, // iOS-compatible JS
  },
};

export default nextConfig;
