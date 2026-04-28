import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { Sidebar, MobileTopBar } from './Sidebar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <Sidebar client={{ name: client.name }} />
      <MobileTopBar client={{ name: client.name }} />
      <div className="lg:pl-60">
        {children}
      </div>
    </div>
  )
}
