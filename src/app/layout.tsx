import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Instrument_Serif } from 'next/font/google'
import './globals.css'

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Higher Level — Campaign Dashboard',
  description: 'Live Meta Ads reporting for Higher Level Agency clients',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
