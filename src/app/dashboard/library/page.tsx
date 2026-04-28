import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import AdLibraryTool from './AdLibraryTool'

export default async function AdLibraryPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <header
        className="px-6 py-4 sticky top-0 z-10"
        style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-xs"
              style={{ background: 'rgba(94,106,210,0.12)', border: '1px solid rgba(94,106,210,0.25)', color: '#5E6AD2' }}
            >
              HL
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>Higher Level</p>
              <p className="text-xs" style={{ color: '#5C606C' }}>Agency Dashboard</p>
            </div>
          </div>
          <nav className="flex items-center gap-0">
            {[
              { href: '/dashboard', label: 'Clients' },
              { href: '/dashboard/audit', label: 'Site Audit' },
              { href: '/dashboard/library', label: 'Ad Library', active: true },
            ].map(n => (
              <Link key={n.href} href={n.href}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={(n as any).active
                  ? { background: 'rgba(94,106,210,0.12)', color: '#F4F5F8' }
                  : { color: '#8A8F98' }}>
                {n.label}
              </Link>
            ))}
            <Link href="/logout" className="px-3 py-1.5 rounded-md text-sm font-medium ml-2" style={{ color: '#5C606C' }}>
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="mb-10">
          <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Agency Tools</p>
          <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Ad Library</h1>
          <p className="text-base" style={{ color: '#8A8F98' }}>
            Search any competitor and launch into Meta Ad Library with filters pre-built — active, video, image, inactive, multi-country. Plus one-click intel for every client.
          </p>
        </div>

        <AdLibraryTool />
      </main>
    </div>
  )
}
