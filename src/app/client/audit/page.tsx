import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { AuditClient } from './AuditClient'
import { ClientNav } from '../ClientNav'

export default async function ClientAuditPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="page-content">
        <ClientNav client={client} active="Site Audit" />

        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Website Health</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>Site Audit</h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              A full scan of <span style={{ color: '#E8ECFF', fontWeight: 700 }}>{client.website}</span> — speed, trust signals, conversion elements, and ad readiness.
            </p>
          </div>

          <AuditClient website={client.website} clientColor={client.color} clientName={client.name} />
        </main>
      </div>
    </div>
  )
}
