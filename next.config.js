/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig

