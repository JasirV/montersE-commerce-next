/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['montres.ae','res.cloudinary.com',"lh3.googleusercontent.com",]
  },
  env: {
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  },
};

export default nextConfig;
