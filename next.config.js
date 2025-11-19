/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['media.guim.co.uk', 'i.guim.co.uk'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  trailingSlash: true,
}

module.exports = nextConfig