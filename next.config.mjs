/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
    domains: ['montres.ae', 'via.placeholder.com',"encrypted-tbn0.gstatic.com",'res.cloudinary.com',], // add all external domains you use
  },
  env: {
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  },
};

export default nextConfig;
