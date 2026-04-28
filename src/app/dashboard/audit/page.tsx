import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import AuditTool from './AuditTool'

export default async function AuditPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="page-content">
        {/* Header */}
        <header
          className="px-6 py-4 sticky top-0 z-10"
          style={{
            background: 'rgba(8,11,20,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: 'linear-gradient(135deg, #21D19F22, #21D19F44)',
                  border: '1px solid rgba(33,209,159,0.3)',
                  color: '#21D19F',
                }}
              >
                HL
              </div>
              <div>
                <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Higher Level</p>
                <p className="text-xs" style={{ color: '#484D6D' }}>Agency Dashboard</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Link
                href="/dashboard"
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ color: '#7B82A0', border: '1px solid transparent' }}
              >
                Clients
              </Link>
              <Link href="/dashboard/audit" className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}>
                Site Audit
              </Link>
              <Link href="/dashboard/library" className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ color: '#7B82A0', border: '1px solid transparent' }}>
                Ad Library
              </Link>
              <Link href="/logout" className="px-4 py-1.5 rounded-lg text-xs font-bold ml-2" style={{ color: '#484D6D', border: '1px solid transparent' }}>
                Sign out
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Agency Tools</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>Website & Funnel Audit</h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              Paste any URL. Get a full breakdown of speed, SEO, conversion readiness, trust signals, tracking, and ad compatibility — with specific fixes ranked by impact.
            </p>
          </div>

          <AuditTool />
        </main>
      </div>
    </div>
  )
}
