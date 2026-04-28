import Link from 'next/link'

const CLIENT = { name: 'Riverside Window Cleaning', initial: 'R' }

export function DemoNav({ active }: { active: string }) {
  const links = [
    { href: '/demo/dashboard', label: 'Overview' },
    { href: '/demo/dashboard/performance', label: 'Performance' },
    { href: '/demo/dashboard/grow', label: 'Grow' },
    { href: '/demo/dashboard/learn', label: 'Learn' },
  ]
  return (
    <header
      className="px-4 sm:px-6 py-3 sticky top-0 z-10"
      style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs flex-shrink-0"
              style={{ background: '#1A1B20', border: '1px solid rgba(255,255,255,0.08)', color: '#F4F5F8' }}
            >
              {CLIENT.initial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#F4F5F8' }}>{CLIENT.name}</p>
              <p className="text-xs" style={{ color: '#5C606C' }}>Campaign Portal</p>
            </div>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ml-2"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            Preview
          </span>
        </div>
        <nav
          className="flex items-center gap-0 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {links.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 -mb-px border-b-2"
              style={n.label === active
                ? { color: '#F4F5F8', borderColor: '#5E6AD2' }
                : { color: '#8A8F98', borderColor: 'transparent' }
              }
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="px-3 py-2 text-sm font-medium ml-auto flex-shrink-0"
            style={{ color: '#5C606C' }}
          >
            Sign out
          </Link>
        </nav>
      </div>
    </header>
  )
}
