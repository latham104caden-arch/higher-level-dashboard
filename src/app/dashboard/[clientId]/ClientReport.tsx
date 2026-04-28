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

const POLL_INTERVAL = 60_000 // 60 seconds

export function ClientReport({ client }: { client: Client }) {
  const [datePreset, setDatePreset] = useState<DatePreset>('last_7d')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  function fetchData(silent = false) {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    fetch(`/api/meta?clientId=${client.id}&datePreset=${datePreset}&t=${Date.now()}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLastUpdated(new Date())
        setLoading(false)
        setRefreshing(false)
      })
      .catch(() => {
        setError('Failed to load data')
        setLoading(false)
        setRefreshing(false)
      })
  }

  // Initial load + reload on preset change
  useEffect(() => {
    fetchData(false)
  }, [client.id, datePreset])

  // Auto-refresh every 60s (silent — no full loading spinner)
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), POLL_INTERVAL)
    return () => clearInterval(interval)
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
        { label: 'Impressions', value: impressions, color: '#5C606C' },
        { label: 'Clicks', value: clicks, color: '#8A8F98' },
        { label: 'Page Views', value: lpv, color: '#F4F5F8' },
        { label: 'Add to Cart', value: atc, color: '#5E6AD2' },
        { label: 'Checkout', value: checkouts, color: '#21D19F' },
        { label: 'Purchases', value: purchases, color: '#21D19F' },
      ]
    : [
        { label: 'Impressions', value: impressions, color: '#5C606C' },
        { label: 'Clicks', value: clicks, color: '#8A8F98' },
        { label: 'Page Views', value: lpv, color: '#F4F5F8' },
        { label: 'Leads', value: leads, color: '#21D19F' },
      ]

  return (
    <>
      <header
        className="px-4 sm:px-6 py-3 sticky top-0 z-20"
        style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/dashboard" className="text-xs flex-shrink-0" style={{ color: '#8A8F98' }}>
                ← Back
              </Link>
              <div className="w-px h-4 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-xs flex-shrink-0"
                style={{ background: '#1A1B20', border: '1px solid rgba(255,255,255,0.08)', color: '#F4F5F8' }}
              >
                {client.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm tracking-tight truncate" style={{ color: '#F4F5F8' }}>{client.name}</p>
                <p className="text-xs font-mono tnum truncate" style={{ color: '#5C606C' }}>{client.accountId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {lastUpdated && (
                <span className="text-xs hidden sm:inline" style={{ color: '#5C606C' }}>
                  {refreshing ? 'Refreshing…' : `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </span>
              )}
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)', color: refreshing ? '#5C606C' : '#8A8F98' }}
                title="Refresh data"
              >
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: refreshing ? 'rotate(360deg)' : 'none', transition: refreshing ? 'transform 1s linear' : 'none' }}
                >
                  <path d="M10 6A4 4 0 1 1 6 2a4 4 0 0 1 2.83 1.17L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M10 2v2H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-0 flex-shrink-0">
              {TABS.map(t => (
                <button
                  key={t.value}
                  onClick={() => setActiveTab(t.value)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  style={activeTab === t.value
                    ? { background: 'rgba(94,106,210,0.12)', color: '#F4F5F8' }
                    : { color: '#8A8F98' }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            {(activeTab === 'overview' || activeTab === 'decisions') && (
              <div className="flex gap-0 p-0.5 rounded-md flex-shrink-0" style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)' }}>
                {PRESETS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setDatePreset(p.value)}
                    className="px-2.5 py-1 rounded text-xs font-medium transition-colors tnum whitespace-nowrap"
                    style={datePreset === p.value
                      ? { background: '#1A1B20', color: '#F4F5F8' }
                      : { color: '#8A8F98' }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div
                className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
                style={{ borderColor: 'rgba(94,106,210,0.2)', borderTopColor: '#5E6AD2' }}
              />
              <p className="text-sm" style={{ color: '#8A8F98' }}>
                Pulling live data
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="card p-4 text-sm"
            style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)', color: '#F59E0B' }}
          >
            {error}
          </div>
        )}

        {!loading && !error && activeTab === 'decisions' && (
          <DecisionsTab ads={ads} clientType={client.type} />
        )}

        {!loading && !error && activeTab === 'competitors' && (
          <CompetitorTab clientId={client.id} />
        )}

        {!loading && !error && activeTab === 'angles' && (
          <AnglesTab clientId={client.id} ads={ads} />
        )}

        {!loading && !error && activeTab === 'overview' && (
          <>
            {(kills.length > 0 || scales.length > 0 || tests.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {kills.length > 0 && (
                  <div className="card p-4" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: '#F59E0B' }}>Kill ({kills.length})</p>
                    <p className="text-xs" style={{ color: '#8A8F98' }}>{kills.map((a: any) => a.ad_name).join(', ')}</p>
                  </div>
                )}
                {scales.length > 0 && (
                  <div className="card p-4" style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.18)' }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: '#21D19F' }}>Scale ({scales.length})</p>
                    <p className="text-xs" style={{ color: '#8A8F98' }}>{scales.map((a: any) => a.ad_name).join(', ')}</p>
                  </div>
                )}
                {tests.length > 0 && (
                  <div className="card p-4">
                    <p className="font-semibold text-sm mb-1" style={{ color: '#5E6AD2' }}>Test ({tests.length})</p>
                    <p className="text-xs" style={{ color: '#8A8F98' }}>{tests.map((a: any) => a.ad_name).join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <p className="font-semibold text-sm tracking-tight" style={{ color: '#F4F5F8' }}>Spend Over Time</p>
                  </CardHeader>
                  <CardBody>
                    <SpendChart data={daily} clientType={client.type} color={client.color} />
                  </CardBody>
                </Card>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <p className="font-semibold text-sm tracking-tight" style={{ color: '#F4F5F8' }}>Conversion Funnel</p>
                  </CardHeader>
                  <CardBody>
                    <FunnelViz steps={funnelSteps} />
                  </CardBody>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <p className="font-semibold text-sm tracking-tight" style={{ color: '#F4F5F8' }}>Campaigns</p>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left py-3 px-5 sm:px-6 text-xs font-medium" style={{ color: '#5C606C' }}>Campaign</th>
                      <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Status</th>
                      <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Objective</th>
                      <th className="text-right py-3 px-5 sm:px-6 text-xs font-medium" style={{ color: '#5C606C' }}>Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-3.5 px-5 sm:px-6 font-medium max-w-xs truncate" style={{ color: '#F4F5F8' }}>{c.name}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5"
                            style={c.effective_status === 'ACTIVE'
                              ? { background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.18)' }
                              : { background: '#1A1B20', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.08)' }
                            }
                          >
                            {c.effective_status === 'ACTIVE' && <span className="w-1 h-1 rounded-full bg-current" />}
                            {c.effective_status || c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs" style={{ color: '#8A8F98' }}>{c.objective}</td>
                        <td className="py-3.5 px-5 sm:px-6 text-right font-medium tnum" style={{ color: '#F4F5F8' }}>
                          {c.daily_budget ? `$${(parseInt(c.daily_budget) / 100).toFixed(0)}/day` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between">
                <p className="font-semibold text-sm tracking-tight" style={{ color: '#F4F5F8' }}>Ad Performance</p>
                <p className="text-xs font-mono tnum" style={{ color: '#5C606C' }}>{ads.length} ads · sorted by spend</p>
              </CardHeader>
              <AdTable ads={ads} clientType={client.type} />
            </Card>
          </>
        )}
      </main>
    </>
  )
}
