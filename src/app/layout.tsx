import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Higher Level — Campaign Dashboard',
  description: 'Live Meta Ads reporting for Higher Level Agency clients',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
