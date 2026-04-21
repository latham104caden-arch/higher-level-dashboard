'use client'

import Link from 'next/link'
import { Client } from '@/lib/clients'

export function ClientCards({ clients }: { clients: Client[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clients.map(client => (
        <Link key={client.id} href={`/dashboard/${client.id}`}>
          <div
            className="relative rounded-2xl p-7 cursor-pointer overflow-hidden group transition-all duration-300 glass-accent"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.border = '1px solid rgba(33,209,159,0.25)'
              e.currentTarget.style.background = 'rgba(33,209,159,0.04)'
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            {/* Large ghost initial */}
            <span
              className="ghost-text"
              style={{ right: '-10px', bottom: '-40px', fontSize: '140px', opacity: 1 }}
            >
              {client.name.charAt(0)}
            </span>

            {/* Color glow */}
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: client.color }}
            />

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${client.color}22, ${client.color}44)`,
                    border: `1px solid ${client.color}44`,
                    color: client.color,
                  }}
                >
                  {client.name.charAt(0)}
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    background: 'rgba(33,209,159,0.08)',
                    color: '#21D19F',
                    border: '1px solid rgba(33,209,159,0.2)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  LIVE
                </span>
              </div>

              <h2 className="font-black text-xl mb-1 tracking-tight" style={{ color: '#E8ECFF' }}>
                {client.name}
              </h2>
              <p className="text-sm capitalize mb-6" style={{ color: '#7B82A0' }}>
                {client.type} · Meta Ads
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: '#484D6D' }}>
                  {client.accountId}
                </span>
                <span
                  className="text-sm font-bold flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{ color: '#21D19F' }}
                >
                  View Report →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
