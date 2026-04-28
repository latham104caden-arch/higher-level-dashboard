'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/dashboard', label: 'Clients', match: (p: string) => p === '/dashboard' || (p.startsWith('/dashboard/') && !p.startsWith('/dashboard/audit') && !p.startsWith('/dashboard/library') && !p.startsWith('/dashboard/onboarding') && !p.startsWith('/dashboard/upcoming')) },
  { href: '/dashboard/upcoming', label: 'Upcoming', match: (p: string) => p.startsWith('/dashboard/upcoming') },
  { href: '/dashboard/audit', label: 'Site Audit', match: (p: string) => p.startsWith('/dashboard/audit') },
  { href: '/dashboard/library', label: 'Ad Library', match: (p: string) => p.startsWith('/dashboard/library') },
  { href: '/dashboard/onboarding', label: 'Onboarding', match: (p: string) => p.startsWith('/dashboard/onboarding') },
]

export function AdminNav() {
  const pathname = usePathname() || ''

  return (
    <header
      className="sticky top-0 z-10 px-4 sm:px-6 py-3"
      style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Higher Level" width={140} height={32} className="h-8 sm:h-9 w-auto" priority />
          </Link>
          <Link href="/logout" className="text-xs font-medium" style={{ color: '#5C606C' }}>
            Sign out
          </Link>
        </div>
        <nav
          className="flex items-center gap-0 overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {LINKS.map(n => {
            const active = n.match(pathname)
            return (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 -mb-px border-b-2"
                style={active
                  ? { color: '#F4F5F8', borderColor: '#5E6AD2' }
                  : { color: '#8A8F98', borderColor: 'transparent' }
                }
              >
                {n.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
