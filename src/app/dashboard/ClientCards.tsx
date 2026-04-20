'use client'

import Link from 'next/link'
import { Client } from '@/lib/clients'

export function ClientCards({ clients }: { clients: Client[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clients.map(client => (
        <Link key={client.id} href={`/dashboard/${client.id}`}>
          <div
            className="rounded-2xl p-6 cursor-pointer group relative overflow-hidden transition-all duration-200"
            style={{
              background: 'rgba(20, 23, 40, 0.8)',
              border: '1px solid rgba(168, 174, 210, 0.08)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.border = '1px solid rgba(33, 209, 159, 0.2)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(33, 209, 159, 0.08)'
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.border = '1px solid rgba(168, 174, 210, 0.08)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'
            }}
          >
            {/* Background glow */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
              style={{ background: client.color }}
            />

            <div className="flex items-start justify-between mb-5 relative">
              <div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 font-bold text-sm"
                  style={{ background: client.color, color: 'white' }}
                >
                  {client.name.charAt(0)}
                </div>
                <h2 className="font-bold text-lg" style={{ color: '#D8DDEF' }}>{client.name}</h2>
                <p className="text-sm capitalize" style={{ color: '#A0A4B8' }}>{client.type} · Meta Ads</p>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
              >
                LIVE
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs mb-5" style={{ color: '#484D6D' }}>
              <span>{client.accountId}</span>
            </div>

            <div
              className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2"
              style={{ color: '#21D19F' }}
            >
              View Report <span>→</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
