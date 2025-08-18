// next-seo.config.js

const SEO = {
  title: 'Padho.net - India\'s Premier News Platform',
  description: 'Stay updated with the latest news from India. Read simplified, AI-powered summaries of important stories.',
  canonical: 'https://padho.net',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://padho.net',
    siteName: 'Padho.net',
    title: 'Padho.net - India\'s Premier News Platform',
    description: 'Stay updated with the latest news from India. Read simplified, AI-powered summaries of important stories.',
    images: [
      {
        url: 'https://padho.net/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Padho.net - India\'s Premier News Platform',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    handle: '@padho_net',
    site: '@padho_net',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      name: 'keywords',
      content: 'India news, news summaries, AI news, current affairs, latest news, padho.net'
    },
    {
      name: 'author',
      content: 'Padho.net'
    },
    {
      name: 'language',
      content: 'en-IN'
    },
    {
      name: 'geo.region',
      content: 'IN'
    },
    {
      name: 'geo.country',
      content: 'India'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180'
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest'
    }
  ],
}

export default SEO