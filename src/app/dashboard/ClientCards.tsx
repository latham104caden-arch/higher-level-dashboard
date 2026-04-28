'use client'

import Link from 'next/link'
import { Client } from '@/lib/clients'

export function ClientCards({ clients }: { clients: Client[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {clients.map(client => (
        <Link key={client.id} href={`/dashboard/${client.id}`} className="card card-hover p-6 block">
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center font-semibold text-base"
              style={{
                background: '#1A1B20',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F4F5F8',
              }}
            >
              {client.name.charAt(0)}
            </div>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5"
              style={{
                background: 'rgba(33,209,159,0.08)',
                color: '#21D19F',
                border: '1px solid rgba(33,209,159,0.18)',
              }}
            >
              <span className="w-1 h-1 rounded-full bg-current" />
              Live
            </span>
          </div>

          <h2 className="font-semibold text-base mb-1 tracking-tight" style={{ color: '#F4F5F8' }}>
            {client.name}
          </h2>
          <p className="text-xs capitalize mb-5" style={{ color: '#8A8F98' }}>
            {client.type} · Meta Ads
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tnum" style={{ color: '#5C606C' }}>
              {client.accountId}
            </span>
            <span className="text-sm font-medium" style={{ color: '#5E6AD2' }}>
              View Report →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
