'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/dashboard', label: 'Clients', match: (p: string) => p === '/dashboard' || (p.startsWith('/dashboard/') && !p.startsWith('/dashboard/audit') && !p.startsWith('/dashboard/library') && !p.startsWith('/dashboard/onboarding') && !p.startsWith('/dashboard/daily')) },
  { href: '/dashboard/daily', label: 'Daily', match: (p: string) => p.startsWith('/dashboard/daily') },
  { href: '/dashboard/audit', label: 'Site Audit', match: (p: string) => p.startsWith('/dashboard/audit') },
  { href: '/dashboard/library', label: 'Ad Library', match: (p: string) => p.startsWith('/dashboard/library') },
  { href: '/dashboard/onboarding', label: 'Onboarding', match: (p: string) => p.startsWith('/dashboard/onboarding') },
]

export function AdminSidebar() {
  const pathname = usePathname() || ''

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 px-4 py-5 z-20"
      style={{ background: '#0B0C0F', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-1">
        <Image
          src="/logo.png"
          alt="Higher Level"
          width={220}
          height={52}
          className="h-12 w-auto"
          priority
        />
      </Link>

      <nav className="flex-1 flex flex-col gap-0.5">
        <p className="text-[10px] font-medium uppercase tracking-wider px-2 mb-1.5" style={{ color: '#5C606C' }}>Agency</p>
        {LINKS.map(n => {
          const active = n.match(pathname)
          return (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={active
                ? { background: 'rgba(94,106,210,0.12)', color: '#F4F5F8' }
                : { color: '#8A8F98' }
              }
            >
              <span className="w-1 h-1 rounded-full" style={{ background: active ? '#5E6AD2' : 'transparent' }} />
              {n.label}
            </Link>
          )
        })}
      </nav>

      <Link
        prefetch={false}
        href="/logout"
        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors mt-auto"
        style={{ color: '#5C606C' }}
      >
        Sign out
      </Link>
    </aside>
  )
}

export function AdminMobileTopBar() {
  const pathname = usePathname() || ''

  return (
    <header
      className="lg:hidden sticky top-0 z-10 px-4 py-3"
      style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <Link href="/dashboard">
          <Image src="/logo.png" alt="Higher Level" width={180} height={42} className="h-9 w-auto" priority />
        </Link>
        <Link
          prefetch={false}
          href="/logout"
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.1)', color: '#F4F5F8' }}
        >
          Sign out
        </Link>
      </div>
      <nav className="flex items-center gap-0 overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
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
    </header>
  )
}

export function AdminNav() {
  return (
    <>
      <AdminSidebar />
      <AdminMobileTopBar />
    </>
  )
}
