import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { QuizGame } from './QuizGame'

export default async function QuizPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      <div className="mb-10">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Test Your Knowledge</p>
        <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>
          {client.type === 'ecommerce' ? 'Ecommerce Growth Quiz' : 'Business Growth Quiz'}
        </h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>
          {client.type === 'ecommerce'
            ? 'How much do you know about scaling an ecommerce store? Real facts, real impact.'
            : 'How much do you know about turning leads into booked jobs? Real facts, real impact.'}
        </p>
      </div>

      <QuizGame clientType={client.type} />
    </main>
  )
}
