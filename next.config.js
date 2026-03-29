/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.auth0.com",
      "logos-download.com",
      "pngimg.com",
      "wallpapercave.com",
      "cdn.icon-icons.com",
      "res.cloudinary.com",
      "chirag1261.github.io",
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable experimental features
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

module.exports = nextConfig;
