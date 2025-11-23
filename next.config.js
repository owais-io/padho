/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds, not dev server
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
    domains: ['media.guim.co.uk', 'i.guim.co.uk'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

module.exports = nextConfig