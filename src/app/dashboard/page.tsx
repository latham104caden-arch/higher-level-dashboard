import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#6366F1' }}>
              <span className="text-white font-bold text-xs">HL</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Higher Level</p>
              <p className="text-xs text-gray-400">Agency Dashboard</p>
            </div>
          </div>
          <Link href="/logout" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Sign out
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Active Clients</h1>
          <p className="text-gray-400 text-sm mt-1">Select a client to view their full campaign report</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(CLIENTS).map(client => (
            <Link key={client.id} href={`/dashboard/${client.id}`}>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white font-bold text-sm"
                      style={{ background: client.color }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg">{client.name}</h2>
                    <p className="text-gray-400 text-sm capitalize">{client.type} · Meta Ads</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{client.accountId}</span>
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: '#6366F1' }}>
                  View Report <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
