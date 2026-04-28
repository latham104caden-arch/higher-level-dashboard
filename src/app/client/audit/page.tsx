import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { AuditClient } from './AuditClient'

export default async function ClientAuditPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      <div className="mb-10">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Website Health</p>
        <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Site Audit</h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>
          A full scan of <span style={{ color: '#F4F5F8', fontWeight: 600 }}>{client.website}</span> — speed, trust signals, conversion elements, and ad readiness.
        </p>
      </div>

      <AuditClient website={client.website} clientColor={client.color} clientName={client.name} />
    </main>
  )
}
