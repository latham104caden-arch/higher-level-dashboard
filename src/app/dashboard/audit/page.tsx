import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AuditTool from './AuditTool'

export default async function AuditPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      <div className="mb-10">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Agency Tools</p>
        <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Website & Funnel Audit</h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>
          Paste any URL. Get a full breakdown of speed, SEO, conversion readiness, trust signals, tracking, and ad compatibility — with specific fixes ranked by impact.
        </p>
      </div>

      <AuditTool />
    </main>
  )
}
