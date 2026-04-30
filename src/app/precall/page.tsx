import type { Metadata } from 'next'
import PrecallClient from './PrecallClient'

export const metadata: Metadata = {
  title: 'Before Our Call · Higher Level',
  description: 'Watch this quick video before our call.',
  robots: { index: false, follow: false },
}

export default function PrecallPage() {
  return <PrecallClient />
}
