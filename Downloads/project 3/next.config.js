/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Add any other domains you'll use for images
    unoptimized: true,
  },
}

module.exports = nextConfig
