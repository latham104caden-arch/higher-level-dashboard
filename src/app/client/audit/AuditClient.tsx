'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  website: string
  clientColor: string
  clientName: string
}

interface AuditResult {
  grade: string
  gradeColor: string
  scores: {
    speed: number
    seo: number
    conversion: number
    trust: number
    tracking: number
    adReadiness: number
    overall: number
  }
  topFixes: { priority: number; fix: string; impact: string }[]
  categories: Record<string, { score: number; label: string; findings: { label: string; status: string; detail: string }[] }>
  detectedElements: Record<string, boolean | number>
  businessType: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SCORE_LABELS: Record<string, string> = {
  speed: 'Page Speed',
  seo: 'SEO',
  conversion: 'Conversion',
  trust: 'Trust',
  tracking: 'Ad Tracking',
  adReadiness: 'Ad Readiness',
}

const SCORE_COLORS = (s: number) =>
  s >= 80 ? '#21D19F' : s >= 60 ? '#F59E0B' : '#EF4444'

const STARTER_QUESTIONS = [
  'Why is my conversion score low?',
  'What should I fix first to improve my ads?',
  'How do I improve my trust score?',
  'Is my site ready to run Meta ads?',
  'What does my speed score mean for my business?',
]

export function AuditClient({ website, clientColor, clientName }: Props) {
  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-run audit on mount
  useEffect(() => {
    runAudit()
  }, [])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function runAudit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: website }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Audit failed')
      setAudit(data)
    } catch (err: any) {
      setError(err.message || 'Could not complete audit')
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || chatLoading || !audit) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setChatLoading(true)

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/client/audit-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, auditData: audit }),
      })
      if (!res.ok) throw new Error('Chat failed')
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch (err: any) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: err?.message?.includes('503')
            ? 'AI chat isn\'t configured yet — your agency needs to add the API key to the server.'
            : 'Something went wrong. Try again in a moment.',
        }
        return updated
      })
    } finally {
      setChatLoading(false)
    }
  }

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: `${clientColor}12`, border: `1px solid ${clientColor}25` }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${clientColor}40`, borderTopColor: clientColor }}
            />
          </div>
        </div>
        <p className="font-black text-lg mb-1" style={{ color: '#E8ECFF' }}>Scanning {website}</p>
        <p className="text-sm" style={{ color: '#484D6D' }}>Checking speed, trust signals, tracking, and ad readiness…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <p className="font-black text-lg mb-2" style={{ color: '#EF4444' }}>Audit Failed</p>
        <p className="text-sm mb-5" style={{ color: '#7B82A0' }}>{error}</p>
        <button
          onClick={runAudit}
          className="px-6 py-3 rounded-xl font-black text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!audit) return null

  const scoreEntries = Object.entries(audit.scores).filter(([k]) => k !== 'overall')

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Overall grade + score ring */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: audit.gradeColor }} />
        <div className="flex items-center gap-8 relative">
          {/* Grade circle */}
          <div
            className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
            style={{
              background: `${audit.gradeColor}12`,
              border: `2px solid ${audit.gradeColor}40`,
            }}
          >
            <p className="text-4xl sm:text-5xl font-black leading-none" style={{ color: audit.gradeColor }}>{audit.grade}</p>
            <p className="text-xs font-bold mt-1" style={{ color: audit.gradeColor + 'aa' }}>{audit.scores.overall}/100</p>
          </div>

          <div className="flex-1">
            <p className="font-black text-xl mb-1" style={{ color: '#E8ECFF' }}>
              {audit.scores.overall >= 80 ? 'Your site is in good shape.' : audit.scores.overall >= 60 ? 'Your site has room to grow.' : 'Your site needs attention.'}
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#7B82A0' }}>
              {audit.scores.overall >= 80
                ? `${website} is well-optimised for ads. Focus on the top fixes below to squeeze out more conversions.`
                : audit.scores.overall >= 60
                ? `There are a few things holding ${website} back. The fixes below will directly improve your ad results.`
                : `${website} has several issues affecting your ad performance. Addressing the top fixes could significantly improve your ROAS or CPL.`}
            </p>
            <button
              onClick={runAudit}
              className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#484D6D', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Re-run Audit
            </button>
          </div>
        </div>
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {scoreEntries.map(([key, score]) => {
          const s = score as number
          const color = SCORE_COLORS(s)
          return (
            <div
              key={key}
              className="rounded-xl p-4 text-center relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full blur-xl opacity-20" style={{ background: color }} />
              <p className="text-xl font-black mb-0.5" style={{ color }}>{s}</p>
              <p className="text-xs font-bold" style={{ color: '#484D6D' }}>{SCORE_LABELS[key] || key}</p>
              {/* Bar */}
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${s}%`, background: color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Top Fixes */}
      {audit.topFixes.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>What to Fix First</p>
            <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>Prioritised by impact on your ad performance</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {audit.topFixes.map((fix, i) => {
              const isPriority1 = fix.priority === 1
              return (
                <div key={i} className="px-7 py-5 flex items-start gap-4">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5"
                    style={isPriority1
                      ? { background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }
                      : fix.priority === 2
                      ? { background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }
                      : { background: 'rgba(160,164,184,0.08)', color: '#A0A4B8', border: '1px solid rgba(160,164,184,0.15)' }
                    }
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm mb-1" style={{ color: '#E8ECFF' }}>{fix.fix}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{fix.impact}</p>
                  </div>
                  {isPriority1 && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                      Critical
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(audit.categories).map(([key, cat]) => {
          const catScore = cat.score as number
          const color = SCORE_COLORS(catScore)
          const fails = cat.findings.filter(f => f.status === 'fail')
          const passes = cat.findings.filter(f => f.status === 'pass')
          return (
            <div
              key={key}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-15" style={{ background: color }} />
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{cat.label}</p>
                <p className="text-xl font-black" style={{ color }}>{catScore}</p>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${catScore}%`, background: color }} />
              </div>
              {/* Failing checks */}
              <div className="space-y-1.5">
                {fails.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#EF4444' }} />
                    <p className="text-xs" style={{ color: '#7B82A0' }}>{f.label}</p>
                  </div>
                ))}
                {passes.slice(0, 2).map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#21D19F' }} />
                    <p className="text-xs" style={{ color: '#484D6D' }}>{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Chat */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        {/* Chat header */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs"
            style={{ background: 'linear-gradient(135deg, rgba(33,209,159,0.2), rgba(69,182,156,0.1))', border: '1px solid rgba(33,209,159,0.25)', color: '#21D19F' }}
          >
            AI
          </div>
          <div>
            <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Ask About Your Site</p>
            <p className="text-xs" style={{ color: '#484D6D' }}>I know your full audit — ask me anything</p>
          </div>
        </div>

        {/* Starter questions (shown before any messages) */}
        {messages.length === 0 && (
          <div className="px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#484D6D' }}>Common questions</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={chatLoading}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: '#A0A4B8',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="px-6 py-5 space-y-5 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(33,209,159,0.1)', border: '1px solid rgba(33,209,159,0.2)', color: '#21D19F' }}
                  >
                    AI
                  </div>
                )}
                <div
                  className="max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === 'user'
                    ? { background: 'rgba(255,255,255,0.07)', color: '#E8ECFF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px 18px 4px 18px' }
                    : { background: 'rgba(33,209,159,0.05)', color: '#C8CCDF', border: '1px solid rgba(33,209,159,0.1)', borderRadius: '18px 18px 18px 4px' }
                  }
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4" style={{ borderTop: messages.length > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input) }}
            className="flex gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your site…"
              disabled={chatLoading}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#E8ECFF',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || chatLoading}
              className="px-5 py-3 rounded-xl font-black text-sm transition-all"
              style={{
                background: !input.trim() || chatLoading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #21D19F, #45B69C)',
                color: !input.trim() || chatLoading ? '#484D6D' : '#080B14',
                cursor: !input.trim() || chatLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {chatLoading ? '…' : 'Ask'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
