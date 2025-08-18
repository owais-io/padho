/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.guim.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'static.guim.co.uk',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig