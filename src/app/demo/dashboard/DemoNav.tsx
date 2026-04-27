import Link from 'next/link'

const CLIENT = { name: 'Riverside Window Cleaning', initial: 'R', color: '#F59E0B' }

export function DemoNav({ active }: { active: string }) {
  const links = [
    { href: '/demo/dashboard', label: 'Overview' },
    { href: '/demo/dashboard/performance', label: 'Performance' },
    { href: '/demo/dashboard/grow', label: 'Grow' },
    { href: '/demo/dashboard/learn', label: 'Learn' },
  ]
  return (
    <header
      className="px-4 py-3 sticky top-0 z-10"
      style={{
        background: 'rgba(8,11,20,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${CLIENT.color}33, ${CLIENT.color}55)`,
                border: `1px solid ${CLIENT.color}44`,
                color: CLIENT.color,
              }}
            >
              {CLIENT.initial}
            </div>
            <div className="min-w-0">
              <p className="font-black text-xs leading-tight truncate" style={{ color: '#E8ECFF' }}>{CLIENT.name}</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>Campaign Portal</p>
            </div>
          </div>
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex-shrink-0 ml-2"
            style={{
              background: 'rgba(251,191,36,0.08)',
              color: '#FCD34D',
              border: '1px solid rgba(251,191,36,0.18)',
            }}
          >
            Preview
          </span>
        </div>
        <nav
          className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            scrollbarWidth: 'none',
          }}
        >
          {links.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0"
              style={n.label === active
                ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                : { color: '#7B82A0', border: '1px solid transparent' }
              }
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="px-3 py-1.5 rounded-lg text-xs font-bold ml-auto flex-shrink-0"
            style={{ color: '#484D6D', border: '1px solid transparent' }}
          >
            Sign out
          </Link>
        </nav>
      </div>
    </header>
  )
}
