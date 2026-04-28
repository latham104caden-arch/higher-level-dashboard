'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface SpendChartProps {
  data: any[]
  clientType: string
  color: string
}

export function SpendChart({ data, clientType, color }: SpendChartProps) {
  const chartData = data.map((d: any) => {
    const purchases = d.actions?.find((a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase')
    const leads = d.actions?.find((a: any) => a.action_type === 'lead')
    const revenue = d.action_values?.find((a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase')
    return {
      date: d.date_start?.slice(5),
      Spend: parseFloat(d.spend || 0),
      Revenue: parseFloat(revenue?.value || 0),
      Purchases: parseFloat(purchases?.value || 0),
      Leads: parseFloat(leads?.value || 0),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5E6AD2" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#5E6AD2" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#21D19F" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#21D19F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5C606C' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#5C606C' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: '#15161A', fontSize: 12, color: '#F4F5F8' }}
          formatter={(v: any) => [`$${parseFloat(v).toFixed(2)}`]}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8A8F98' }} />
        <Area type="monotone" dataKey="Spend" stroke="#5E6AD2" strokeWidth={2} fill="url(#colorSpend)" dot={false} />
        {clientType === 'ecommerce' && (
          <Area type="monotone" dataKey="Revenue" stroke="#21D19F" strokeWidth={2} fill="url(#colorRevenue)" dot={false} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
