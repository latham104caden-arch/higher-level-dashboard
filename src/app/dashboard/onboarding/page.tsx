import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'

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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2" style={{ color: '#F4F5F8' }}>Onboarding Submissions</h1>
            <p style={{ color: '#8A8F98' }}>
              {submissions.length === 0 ? 'No submissions yet.' : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''} received`}
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-lg p-12 text-center glass"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-5xl mb-4">📋</div>
              <p className="font-bold mb-2" style={{ color: '#F4F5F8' }}>No submissions yet</p>
              <p className="text-sm mb-6" style={{ color: '#8A8F98' }}>Share the onboarding link with new clients to get started.</p>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-md text-sm font-bold"
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
  )
}

function SubmissionCard({ s }: { s: any }) {
  const date = new Date(s.submittedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#15161A' }}>
      {/* Card header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(33,209,159,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h2 className="font-semibold text-base" style={{ color: '#F4F5F8' }}>{s.businessName || 'Unnamed Business'}</h2>
          <p className="text-sm" style={{ color: '#8A8F98' }}>{s.legalName}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}>
            New
          </div>
          <p className="text-xs mt-1" style={{ color: '#5C606C' }}>{date}</p>
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
      <p className="text-xs font-semibold  mb-3" style={{ color: '#21D19F' }}>{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs" style={{ color: '#5C606C' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: highlight ? '#21D19F' : '#F4F5F8' }}>{value || '—'}</p>
    </div>
  )
}
