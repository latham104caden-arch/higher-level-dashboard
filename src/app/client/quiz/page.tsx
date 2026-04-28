import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { QuizGame } from './QuizGame'
import { ClientNav } from '../ClientNav'

export default async function QuizPage() {
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
        <ClientNav client={client} active="Quiz" />

        <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Test Your Knowledge</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
              {client.type === 'ecommerce' ? 'Ecommerce Growth Quiz' : 'Business Growth Quiz'}
            </h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              {client.type === 'ecommerce'
                ? 'How much do you know about scaling an ecommerce store? Real facts, real impact.'
                : 'How much do you know about turning leads into booked jobs? Real facts, real impact.'}
            </p>
          </div>

          <QuizGame clientType={client.type} />
        </main>
      </div>
    </div>
  )
}
