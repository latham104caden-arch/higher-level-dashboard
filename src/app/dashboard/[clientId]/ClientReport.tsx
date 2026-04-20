'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Client } from '@/lib/clients'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { AdTable } from '@/components/dashboard/AdTable'
import { SpendChart } from '@/components/dashboard/SpendChart'
import { FunnelViz } from '@/components/dashboard/FunnelViz'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import {
  getRoas, getPurchases, getLeads, getATC, getCheckouts, getLPV, adVerdict
} from '@/lib/meta'
import { fmtCurrency, fmtPct, fmtX, fmtInt, fmt } from '@/lib/utils'

type DatePreset = 'last_7d' | 'last_14d' | 'last_30d' | 'last_90d'

export function ClientReport({ client }: { client: Client }) {
  const [datePreset, setDatePreset] = useState<DatePreset>('last_7d')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/meta?clientId=${client.id}&datePreset=${datePreset}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load data'); setLoading(false) })
  }, [client.id, datePreset])

  const ai = data?.accountInsights
  const ads = data?.adInsights || []
  const daily = data?.dailyInsights || []
  const campaigns = data?.campaigns || []

  const spend = parseFloat(ai?.spend || 0)
  const impressions = parseFloat(ai?.impressions || 0)
  const clicks = parseFloat(ai?.clicks || 0)
  const ctr = parseFloat(ai?.ctr || 0)
  const cpc = parseFloat(ai?.cpc || 0)
  const cpm = parseFloat(ai?.cpm || 0)
  const roas = getRoas(ai)
  const purchases = getPurchases(ai)
  const leads = getLeads(ai)
  const atc = getATC(ai)
  const checkouts = getCheckouts(ai)
  const lpv = getLPV(ai)
  const revenue = roas * spend

  const kills = ads.filter((a: any) => adVerdict(a, client.type).label === 'KILL')
  const scales = ads.filter((a: any) => adVerdict(a, client.type).label === 'SCALE')
  const tests = ads.filter((a: any) => adVerdict(a, client.type).label === 'TEST')

  const funnelSteps = client.type === 'ecommerce'
    ? [
        { label: 'Impressions', value: impressions, color: '#6366F1' },
        { label: 'Clicks', value: clicks, color: '#8B5CF6' },
        { label: 'Page Views', value: lpv, color: '#A78BFA' },
        { label: 'Add to Cart', value: atc, color: '#F59E0B' },
        { label: 'Checkout', value: checkouts, color: '#EF4444' },
        { label: 'Purchases', value: purchases, color: '#22C55E' },
      ]
    : [
        { label: 'Impressions', value: impressions, color: '#6366F1' },
        { label: 'Clicks', value: clicks, color: '#8B5CF6' },
        { label: 'Page Views', value: lpv, color: '#A78BFA' },
        { label: 'Leads', value: leads, color: '#22C55E' },
      ]

  const presets: { label: string; value: DatePreset }[] = [
    { label: '7 Days', value: 'last_7d' },
    { label: '14 Days', value: 'last_14d' },
    { label: '30 Days', value: 'last_30d' },
    { label: '90 Days', value: 'last_90d' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
            <div className="w-px h-4 bg-gray-200" />
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs"
              style={{ background: client.color }}
            >
              {client.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{client.name}</p>
              <p className="text-xs text-gray-400">{client.accountId}</p>
            </div>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {presets.map(p => (
              <button
                key={p.value}
                onClick={() => setDatePreset(p.value)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={datePreset === p.value
                  ? { background: 'white', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                  : { color: '#6B7280' }
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Pulling live data from Meta...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Action Alerts */}
            {(kills.length > 0 || scales.length > 0 || tests.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {kills.length > 0 && (
                  <div className="rounded-xl p-4 border" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                    <p className="font-bold text-sm" style={{ color: '#DC2626' }}>🔴 Kill ({kills.length})</p>
                    <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{kills.map((a: any) => a.ad_name).join(', ')}</p>
                  </div>
                )}
                {scales.length > 0 && (
                  <div className="rounded-xl p-4 border" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                    <p className="font-bold text-sm" style={{ color: '#16A34A' }}>🟢 Scale ({scales.length})</p>
                    <p className="text-xs mt-1" style={{ color: '#22C55E' }}>{scales.map((a: any) => a.ad_name).join(', ')}</p>
                  </div>
                )}
                {tests.length > 0 && (
                  <div className="rounded-xl p-4 border" style={{ background: '#F5F3FF', borderColor: '#DDD6FE' }}>
                    <p className="font-bold text-sm" style={{ color: '#7C3AED' }}>🟣 Test with Budget ({tests.length})</p>
                    <p className="text-xs mt-1" style={{ color: '#8B5CF6' }}>{tests.map((a: any) => a.ad_name).join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Spend" value={fmtCurrency(spend)} />
              <MetricCard label="Impressions" value={fmtInt(impressions)} />
              <MetricCard label="CTR" value={fmtPct(ctr)} />
              <MetricCard label="CPM" value={fmtCurrency(cpm)} />
              {client.type === 'ecommerce' ? (
                <>
                  <MetricCard label="Revenue" value={fmtCurrency(revenue)} />
                  <MetricCard label="ROAS" value={fmtX(roas)} alert={roas > 0 && roas < 1} />
                  <MetricCard label="Purchases" value={fmtInt(purchases)} />
                  <MetricCard label="Cost/Purchase" value={purchases > 0 ? fmtCurrency(spend / purchases) : '—'} alert={purchases === 0 && spend > 50} />
                </>
              ) : (
                <>
                  <MetricCard label="Leads" value={fmtInt(leads)} />
                  <MetricCard label="Cost/Lead" value={leads > 0 ? fmtCurrency(spend / leads) : '—'} alert={leads === 0 && spend > 30} />
                  <MetricCard label="CPC" value={fmtCurrency(cpc)} />
                  <MetricCard label="Clicks" value={fmtInt(clicks)} />
                </>
              )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <p className="font-semibold text-gray-900 text-sm">Spend Over Time</p>
                  </CardHeader>
                  <CardBody>
                    <SpendChart data={daily} clientType={client.type} color={client.color} />
                  </CardBody>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <p className="font-semibold text-gray-900 text-sm">Conversion Funnel</p>
                  </CardHeader>
                  <CardBody>
                    <FunnelViz steps={funnelSteps} />
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Campaigns */}
            <Card>
              <CardHeader>
                <p className="font-semibold text-gray-900 text-sm">Campaigns</p>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Campaign</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Objective</th>
                      <th className="text-right py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Daily Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {campaigns.map((c: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-3 px-6 font-medium text-gray-900 max-w-xs truncate">{c.name}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            c.effective_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {c.effective_status || c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{c.objective}</td>
                        <td className="py-3 px-6 text-right text-gray-700">
                          {c.daily_budget ? `$${(parseInt(c.daily_budget) / 100).toFixed(0)}/day` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Ad Performance */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 text-sm">Ad Performance</p>
                <p className="text-xs text-gray-400">{ads.length} ads · sorted by spend</p>
              </CardHeader>
              <AdTable ads={ads} clientType={client.type} />
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
