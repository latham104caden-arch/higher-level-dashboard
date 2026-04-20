import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { ClientReport } from './ClientReport'

export default async function ClientReportPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  const client = CLIENTS[clientId as keyof typeof CLIENTS]
  if (!client) notFound()

  return <ClientReport client={client} />
}
