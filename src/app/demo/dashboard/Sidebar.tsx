'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/demo/dashboard', label: 'Overview' },
  { href: '/demo/dashboard/performance', label: 'Performance' },
  { href: '/demo/dashboard/grow', label: 'Grow' },
  { href: '/demo/dashboard/learn', label: 'Learn' },
]

const CLIENT = { name: 'Riverside Window Cleaning', initial: 'R' }

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 px-4 py-5 z-20"
      style={{ background: '#0B0C0F', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      <Link href="/demo/dashboard" className="flex items-center gap-2 mb-8 px-1">
        <Image
          src="/logo.png"
          alt="Higher Level"
          width={220}
          height={52}
          className="h-12 w-auto"
          priority
        />
      </Link>

      <div className="flex items-center gap-2.5 px-2 py-2 mb-6 rounded-md" style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs flex-shrink-0"
          style={{ background: '#1A1B20', border: '1px solid rgba(255,255,255,0.08)', color: '#F4F5F8' }}
        >
          {CLIENT.initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-xs leading-tight truncate" style={{ color: '#F4F5F8' }}>{CLIENT.name}</p>
          <p className="text-[10px]" style={{ color: '#5C606C' }}>Campaign Portal</p>
        </div>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
          Preview
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5">
        <p className="text-[10px] font-medium uppercase tracking-wider px-2 mb-1.5" style={{ color: '#5C606C' }}>Workspace</p>
        {LINKS.map(n => {
          const active = pathname === n.href
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

export function MobileTopBar() {
  const pathname = usePathname()

  return (
    <header
      className="lg:hidden sticky top-0 z-10 px-4 py-3"
      style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <Image src="/logo.png" alt="Higher Level" width={180} height={42} className="h-10 w-auto" priority />
        <span className="text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
          Preview
        </span>
      </div>
      <nav className="flex items-center gap-0 overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {LINKS.map(n => {
          const active = pathname === n.href
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
        <Link prefetch={false} href="/logout" className="px-3 py-2 text-sm font-medium ml-auto flex-shrink-0" style={{ color: '#5C606C' }}>
          Sign out
        </Link>
      </nav>
    </header>
  )
}
