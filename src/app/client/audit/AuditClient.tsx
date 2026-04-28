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
  s >= 80 ? '#21D19F' : s >= 60 ? '#F59E0B' : '#F4F5F8'

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative mb-6">
          <div
            className="w-16 h-16 rounded-md flex items-center justify-center"
            style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(94,106,210,0.3)', borderTopColor: '#5E6AD2' }}
            />
          </div>
        </div>
        <p className="font-semibold text-base mb-1" style={{ color: '#F4F5F8' }}>Scanning {website}</p>
        <p className="text-sm" style={{ color: '#8A8F98' }}>Checking speed, trust signals, tracking, and ad readiness…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}>
        <p className="font-semibold text-base mb-2" style={{ color: '#F59E0B' }}>Audit Failed</p>
        <p className="text-sm mb-5" style={{ color: '#8A8F98' }}>{error}</p>
        <button
          onClick={runAudit}
          className="px-4 py-2 rounded-md font-medium text-sm"
          style={{ background: '#5E6AD2', color: '#F4F5F8' }}
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

      <div className="card p-6 sm:p-7">
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-md flex flex-col items-center justify-center flex-shrink-0"
            style={{ background: `${audit.gradeColor}10`, border: `1px solid ${audit.gradeColor}30` }}
          >
            <p className="text-4xl font-semibold leading-none tnum" style={{ color: audit.gradeColor }}>{audit.grade}</p>
            <p className="text-xs font-medium mt-1 tnum" style={{ color: audit.gradeColor }}>{audit.scores.overall}/100</p>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-lg mb-1" style={{ color: '#F4F5F8' }}>
              {audit.scores.overall >= 80 ? 'Your site is in good shape.' : audit.scores.overall >= 60 ? 'Your site has room to grow.' : 'Your site needs attention.'}
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#8A8F98' }}>
              {audit.scores.overall >= 80
                ? `${website} is well-optimised for ads. Focus on the top fixes below to squeeze out more conversions.`
                : audit.scores.overall >= 60
                ? `There are a few things holding ${website} back. The fixes below will directly improve your ad results.`
                : `${website} has several issues affecting your ad performance. Addressing the top fixes could significantly improve your ROAS or CPL.`}
            </p>
            <button
              onClick={runAudit}
              className="text-xs font-medium px-3 py-1.5 rounded-md"
              style={{ background: '#1A1B20', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Re-run Audit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {scoreEntries.map(([key, score]) => {
          const s = score as number
          const color = SCORE_COLORS(s)
          return (
            <div key={key} className="p-4 text-center" style={{ background: '#15161A' }}>
              <p className="text-xl font-semibold mb-0.5 tnum" style={{ color }}>{s}</p>
              <p className="text-xs font-medium" style={{ color: '#5C606C' }}>{SCORE_LABELS[key] || key}</p>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${s}%`, background: color }} />
              </div>
            </div>
          )
        })}
      </div>

      {audit.topFixes.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>What to Fix First</p>
            <p className="text-xs mt-0.5" style={{ color: '#5C606C' }}>Prioritised by impact on your ad performance</p>
          </div>
          <div>
            {audit.topFixes.map((fix, i) => {
              const isPriority1 = fix.priority === 1
              const badgeStyle = isPriority1
                ? { background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }
                : fix.priority === 2
                ? { background: 'rgba(94,106,210,0.1)', color: '#5E6AD2', border: '1px solid rgba(94,106,210,0.2)' }
                : { background: '#1A1B20', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.08)' }
              return (
                <div key={i} className="px-5 sm:px-6 py-4 flex items-start gap-3" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5 tnum"
                    style={badgeStyle}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: '#F4F5F8' }}>{fix.fix}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8A8F98' }}>{fix.impact}</p>
                  </div>
                  {isPriority1 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.18)' }}>
                      Critical
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(audit.categories).map(([key, cat]) => {
          const catScore = cat.score as number
          const color = SCORE_COLORS(catScore)
          const fails = cat.findings.filter(f => f.status === 'fail')
          const passes = cat.findings.filter(f => f.status === 'pass')
          return (
            <div key={key} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>{cat.label}</p>
                <p className="text-xl font-semibold tnum" style={{ color }}>{catScore}</p>
              </div>
              <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${catScore}%`, background: color }} />
              </div>
              <div className="space-y-1.5">
                {fails.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#F59E0B' }} />
                    <p className="text-xs" style={{ color: '#8A8F98' }}>{f.label}</p>
                  </div>
                ))}
                {passes.slice(0, 2).map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#21D19F' }} />
                    <p className="text-xs" style={{ color: '#5C606C' }}>{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 sm:px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center font-medium text-xs"
            style={{ background: 'rgba(94,106,210,0.1)', border: '1px solid rgba(94,106,210,0.2)', color: '#5E6AD2' }}
          >
            AI
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>Ask About Your Site</p>
            <p className="text-xs" style={{ color: '#5C606C' }}>I know your full audit — ask me anything</p>
          </div>
        </div>

        {messages.length === 0 && (
          <div className="px-5 sm:px-6 py-5">
            <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Common questions</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={chatLoading}
                  className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                  style={{
                    background: '#1A1B20',
                    color: '#8A8F98',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="px-5 sm:px-6 py-5 space-y-4 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(94,106,210,0.1)', border: '1px solid rgba(94,106,210,0.2)', color: '#5E6AD2' }}
                  >
                    AI
                  </div>
                )}
                <div
                  className="max-w-sm rounded-md px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === 'user'
                    ? { background: '#1A1B20', color: '#F4F5F8', border: '1px solid rgba(255,255,255,0.08)' }
                    : { background: 'rgba(94,106,210,0.05)', color: '#C8CBD3', border: '1px solid rgba(94,106,210,0.15)' }
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

        <div className="px-5 sm:px-6 py-4" style={{ borderTop: messages.length > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input) }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your site…"
              disabled={chatLoading}
              className="flex-1 px-4 py-2.5 rounded-md text-sm outline-none"
              style={{
                background: '#1A1B20',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F4F5F8',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || chatLoading}
              className="px-4 py-2.5 rounded-md font-medium text-sm transition-colors"
              style={{
                background: !input.trim() || chatLoading ? '#1A1B20' : '#5E6AD2',
                color: !input.trim() || chatLoading ? '#5C606C' : '#F4F5F8',
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
