import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { ClientCards } from './ClientCards'
import { MiniGame } from './MiniGame'
import { UpcomingCampaigns } from './UpcomingCampaigns'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <div className="mb-12">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Agency View</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl tracking-tight mb-3" style={{ color: '#F4F5F8' }}>
          Active Clients
        </h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>
          Select a client to view their live campaign intelligence
        </p>
      </div>

      <ClientCards clients={Object.values(CLIENTS)} />
      <UpcomingCampaigns />
      <MiniGame />
    </main>
  )
}
