'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Client } from '@/lib/clients'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { AdTable } from '@/components/dashboard/AdTable'
import { SpendChart } from '@/components/dashboard/SpendChart'
import { FunnelViz } from '@/components/dashboard/FunnelViz'
import { CompetitorTab } from '@/components/dashboard/CompetitorTab'
import { AnglesTab } from '@/components/dashboard/AnglesTab'
import { DecisionsTab } from '@/components/dashboard/DecisionsTab'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import {
  getRoas, getPurchases, getLeads, getATC, getCheckouts, getLPV, adVerdict
} from '@/lib/meta'
import { fmtCurrency, fmtPct, fmtX, fmtInt } from '@/lib/utils'

type DatePreset = 'last_7d' | 'last_14d' | 'last_30d' | 'last_90d'
type Tab = 'overview' | 'decisions' | 'competitors' | 'angles'

const TABS: { label: string; value: Tab }[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Kill / Scale', value: 'decisions' },
  { label: 'Similar Brands', value: 'competitors' },
  { label: 'Ad Angles', value: 'angles' },
]

const PRESETS: { label: string; value: DatePreset }[] = [
  { label: '7D', value: 'last_7d' },
  { label: '14D', value: 'last_14d' },
  { label: '30D', value: 'last_30d' },
  { label: '90D', value: 'last_90d' },
]

export function ClientReport({ client }: { client: Client }) {
  const [datePreset, setDatePreset] = useState<DatePreset>('last_7d')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
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
        { label: 'Impressions', value: impressions, color: '#484D6D' },
        { label: 'Clicks', value: clicks, color: '#A0A4B8' },
        { label: 'Page Views', value: lpv, color: '#D8DDEF' },
        { label: 'Add to Cart', value: atc, color: '#45B69C' },
        { label: 'Checkout', value: checkouts, color: '#21D19F' },
        { label: 'Purchases', value: purchases, color: '#21D19F' },
      ]
    : [
        { label: 'Impressions', value: impressions, color: '#484D6D' },
        { label: 'Clicks', value: clicks, color: '#A0A4B8' },
        { label: 'Page Views', value: lpv, color: '#D8DDEF' },
        { label: 'Leads', value: leads, color: '#21D19F' },
      ]

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      {/* Background */}
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Ghost client initial */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-end pr-8 opacity-100">
        <span className="ghost-text" style={{ fontSize: '28vw', bottom: '-4vw', position: 'absolute', right: '-2vw' }}>
          {client.name.charAt(0)}
        </span>
      </div>

      <div className="page-content">
        {/* Header */}
        <header
          className="px-6 py-4 sticky top-0 z-20"
          style={{
            background: 'rgba(8,11,20,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="max-w-7xl mx-auto px-2 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xs transition-colors" style={{ color: '#484D6D' }}>
                ← Back
              </Link>
              <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: `linear-gradient(135deg, ${client.color}22, ${client.color}44)`,
                  border: `1px solid ${client.color}44`,
                  color: client.color,
                }}
              >
                {client.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>{client.name}</p>
                <p className="text-xs font-mono" style={{ color: '#484D6D' }}>{client.accountId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Tabs */}
              <div
                className="flex gap-1 p-1 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {TABS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={activeTab === t.value
                      ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                      : { color: '#7B82A0', border: '1px solid transparent' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Date presets */}
              {(activeTab === 'overview' || activeTab === 'decisions') && (
                <div
                  className="flex gap-1 p-1 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {PRESETS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setDatePreset(p.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={datePreset === p.value
                        ? { background: 'rgba(255,255,255,0.08)', color: '#E8ECFF', border: '1px solid rgba(255,255,255,0.12)' }
                        : { color: '#484D6D', border: '1px solid transparent' }
                      }
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-10 space-y-6">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-5"
                  style={{ borderColor: 'rgba(33,209,159,0.2)', borderTopColor: '#21D19F' }}
                />
                <p className="text-sm tracking-widest uppercase" style={{ color: '#484D6D' }}>
                  Pulling live data
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              className="rounded-2xl p-4 text-sm"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}
            >
              {error}
            </div>
          )}

          {/* Kill / Scale Decisions */}
          {!loading && !error && activeTab === 'decisions' && (
            <DecisionsTab ads={ads} clientType={client.type} />
          )}

          {/* Competitors */}
          {!loading && !error && activeTab === 'competitors' && (
            <CompetitorTab clientId={client.id} />
          )}

          {/* Angles */}
          {!loading && !error && activeTab === 'angles' && (
            <AnglesTab clientId={client.id} ads={ads} />
          )}

          {/* Overview */}
          {!loading && !error && activeTab === 'overview' && (
            <>
              {/* Action Alerts */}
              {(kills.length > 0 || scales.length > 0 || tests.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {kills.length > 0 && (
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <p className="font-black text-sm mb-1" style={{ color: '#EF4444' }}>🔴 Kill ({kills.length})</p>
                      <p className="text-xs" style={{ color: 'rgba(239,68,68,0.6)' }}>{kills.map((a: any) => a.ad_name).join(', ')}</p>
                    </div>
                  )}
                  {scales.length > 0 && (
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.15)' }}>
                      <p className="font-black text-sm mb-1" style={{ color: '#21D19F' }}>🟢 Scale ({scales.length})</p>
                      <p className="text-xs" style={{ color: 'rgba(33,209,159,0.6)' }}>{scales.map((a: any) => a.ad_name).join(', ')}</p>
                    </div>
                  )}
                  {tests.length > 0 && (
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="font-black text-sm mb-1" style={{ color: '#E8ECFF' }}>🟣 Test ({tests.length})</p>
                      <p className="text-xs" style={{ color: '#7B82A0' }}>{tests.map((a: any) => a.ad_name).join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>Spend Over Time</p>
                    </CardHeader>
                    <CardBody>
                      <SpendChart data={daily} clientType={client.type} color={client.color} />
                    </CardBody>
                  </Card>
                </div>
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>Conversion Funnel</p>
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
                  <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>Campaigns</p>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th className="text-left py-4 px-7 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Campaign</th>
                        <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Status</th>
                        <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Objective</th>
                        <th className="text-right py-4 px-7 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c: any, i: number) => (
                        <tr
                          key={i}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td className="py-4 px-7 font-bold max-w-xs truncate" style={{ color: '#E8ECFF' }}>{c.name}</td>
                          <td className="py-4 px-5">
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
                              style={c.effective_status === 'ACTIVE'
                                ? { background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                                : { background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }
                              }
                            >
                              {c.effective_status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                              {c.effective_status || c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs" style={{ color: '#7B82A0' }}>{c.objective}</td>
                          <td className="py-3 px-6 text-right font-bold" style={{ color: '#E8ECFF' }}>
                            {c.daily_budget ? `$${(parseInt(c.daily_budget) / 100).toFixed(0)}/day` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Ads */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>Ad Performance</p>
                  <p className="text-xs font-mono" style={{ color: '#484D6D' }}>{ads.length} ads · sorted by spend</p>
                </CardHeader>
                <AdTable ads={ads} clientType={client.type} />
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
