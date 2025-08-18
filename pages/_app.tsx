// pages/_app.tsx

import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'

import type { AppProps } from "next/app"
import "../styles/globals.css"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}