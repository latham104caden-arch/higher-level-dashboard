import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getSubmissions() {
  try {
    const file = path.join(process.cwd(), 'src/data/submissions.json')
    const data = await fs.readFile(file, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export default async function OnboardingSubmissionsPage() {
  const session = await getSession()
  if (!session || session.role !== 'agency') redirect('/')

  const submissions = await getSubmissions()

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      <div className="page-content relative z-10">
        {/* Header */}
        <header className="px-6 py-4 sticky top-0 z-10"
          style={{ background: 'rgba(8,11,20,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #21D19F22, #21D19F44)', border: '1px solid rgba(33,209,159,0.3)', color: '#21D19F' }}>
                HL
              </div>
              <span className="font-black text-sm tracking-wider" style={{ color: '#E8ECFF' }}>HIGHER LEVEL</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#7B82A0' }}>
                ← Dashboard
              </Link>
              <a href="/onboarding" target="_blank"
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #21D19F, #45B69C)', color: '#080B14' }}>
                View Form →
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2" style={{ color: '#E8ECFF' }}>Onboarding Submissions</h1>
            <p style={{ color: '#7B82A0' }}>
              {submissions.length === 0 ? 'No submissions yet.' : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''} received`}
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-2xl p-12 text-center glass"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-5xl mb-4">📋</div>
              <p className="font-bold mb-2" style={{ color: '#E8ECFF' }}>No submissions yet</p>
              <p className="text-sm mb-6" style={{ color: '#7B82A0' }}>Share the onboarding link with new clients to get started.</p>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(33,209,159,0.08)', border: '1px solid rgba(33,209,159,0.2)', color: '#21D19F' }}>
                higherleveladz.com/onboarding
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((s: any) => (
                <SubmissionCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function SubmissionCard({ s }: { s: any }) {
  const date = new Date(s.submittedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
      {/* Card header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(33,209,159,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h2 className="font-black text-lg" style={{ color: '#E8ECFF' }}>{s.businessName || 'Unnamed Business'}</h2>
          <p className="text-sm" style={{ color: '#7B82A0' }}>{s.legalName}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}>
            New
          </div>
          <p className="text-xs mt-1" style={{ color: '#484D6D' }}>{date}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Section title="Business Info">
          <Row label="Phone" value={s.phone} />
          <Row label="Website" value={s.website || '—'} />
          <Row label="Target Area" value={s.targetArea} />
          <Row label="Main Service" value={s.mainService} />
          <Row label="Service for Ads" value={s.serviceForAds} />
        </Section>

        <Section title="Ad History">
          <Row label="Run Ads Before" value={s.hasRunAds} />
          {s.adPlatforms?.length > 0 && <Row label="Platforms" value={s.adPlatforms.join(', ')} />}
          <Row label="Has Ad Account" value={s.hasAdAccount || '—'} />
          {s.adAccountId && <Row label="Account ID" value={s.adAccountId} />}
        </Section>

        <Section title="Business Details">
          <Row label="Avg Job Price" value={s.avgJobPrice} highlight />
          <Row label="Jobs/Week" value={s.jobsPerWeek} />
          <Row label="Monthly Budget" value={s.monthlyBudget} highlight />
          <Row label="Heard About Us" value={s.hearAboutUs || '—'} />
        </Section>

        <Section title="Setup Videos">
          <Row label="Meta Admin Access" value={s.videoWatched1 ? '✓ Watched' : '✗ Not watched'} highlight={s.videoWatched1} />
          <Row label="Business Manager Setup" value={s.videoWatched2 ? '✓ Watched' : '✗ Not watched'} highlight={s.videoWatched2} />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#21D19F' }}>{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs" style={{ color: '#484D6D' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: highlight ? '#21D19F' : '#E8ECFF' }}>{value || '—'}</p>
    </div>
  )
}
