import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { UPCOMING_CLIENTS } from '@/app/dashboard/UpcomingCampaigns'
import { UpcomingReport } from './UpcomingReport'

export default async function UpcomingClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  const { clientId } = await params
  const client = UPCOMING_CLIENTS.find(c => c.id === clientId)
  if (!client) redirect('/dashboard')

  return <UpcomingReport client={client} />
}
