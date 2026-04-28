'use client'

import { useState } from 'react'

const STEPS = ['Business Info', 'Ad History', 'Business Details', 'Setup Videos', 'Book a Call']

const ACCENT = '#21D19F'

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoWatched1, setVideoWatched1] = useState(false)
  const [videoWatched2, setVideoWatched2] = useState(false)

  const [form, setForm] = useState({
    // Step 1
    businessName: '',
    legalName: '',
    mainService: '',
    serviceForAds: '',
    website: '',
    targetArea: '',
    phone: '',
    // Step 2
    hasRunAds: '',
    adPlatforms: [] as string[],
    hasAdAccount: '',
    adAccountId: '',
    // Step 3
    avgJobPrice: '',
    jobsPerWeek: '',
    monthlyBudget: '',
    hearAboutUs: '',
    // Assets note (acknowledged)
    assetsAcknowledged: false,
  })

  function update(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function togglePlatform(platform: string) {
    setForm(prev => ({
      ...prev,
      adPlatforms: prev.adPlatforms.includes(platform)
        ? prev.adPlatforms.filter(p => p !== platform)
        : [...prev.adPlatforms, platform],
    }))
  }

  function canAdvance() {
    if (step === 0) return form.businessName && form.legalName && form.mainService && form.serviceForAds && form.targetArea && form.phone
    if (step === 1) return form.hasRunAds !== ''
    if (step === 2) return form.avgJobPrice && form.jobsPerWeek && form.monthlyBudget
    if (step === 3) return videoWatched1 && videoWatched2
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, videoWatched1, videoWatched2 }),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0C0F' }}>
        <div className="relative z-10 text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ background: 'rgba(33,209,159,0.1)', border: '1px solid rgba(33,209,159,0.3)' }}>
            ✓
          </div>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: '#F4F5F8' }}>You're all set.</h1>
          <p className="mb-8" style={{ color: '#8A8F98' }}>
            We have everything we need. Check your calendar invite for your onboarding call — we'll go over all of this together and get everything set up before launch.
          </p>
          <p className="text-sm" style={{ color: '#5C606C' }}>Higher Level Agency · We'll see you on the call.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-md flex items-center justify-center font-semibold text-base mb-4"
            style={{ background: 'rgba(94,106,210,0.12)', border: '1px solid rgba(94,106,210,0.25)', color: '#5E6AD2' }}>
            HL
          </div>
          <h1 className="font-serif italic text-3xl tracking-tight mb-1" style={{ color: '#F4F5F8' }}>Client Onboarding</h1>
          <p className="text-sm" style={{ color: '#5C606C' }}>Higher Level Agency · Let's get you set up</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center" style={{ width: `${100 / STEPS.length}%` }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-1 transition-all"
                  style={{
                    background: i < step ? ACCENT : i === step ? 'rgba(33,209,159,0.2)' : 'rgba(255,255,255,0.05)',
                    border: i <= step ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.1)',
                    color: i < step ? '#080B14' : i === step ? ACCENT : '#5C606C',
                  }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-center hidden sm:block" style={{ fontSize: '10px', color: i === step ? ACCENT : '#5C606C' }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full transition-all duration-500"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, background: `linear-gradient(90deg, ${ACCENT}, #45B69C)` }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-lg p-8 glass-accent"
          style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

          {/* STEP 1: Business Info */}
          {step === 0 && (
            <div className="space-y-5">
              <StepHeader title="Business Info" subtitle="Tell us about your business" />
              <Field label="Business Name" value={form.businessName} onChange={v => update('businessName', v)} placeholder="e.g. Shine Bright Window Cleaning" />
              <Field label="Legal Company Name" value={form.legalName} onChange={v => update('legalName', v)} placeholder="e.g. Shine Bright LLC" />
              <Field label="Main Service You Offer" value={form.mainService} onChange={v => update('mainService', v)} placeholder="e.g. Residential window cleaning" />
              <Field label="Service You Want to Run Ads For" value={form.serviceForAds} onChange={v => update('serviceForAds', v)} placeholder="e.g. Exterior window cleaning packages" />
              <Field label="Website (if you have one)" value={form.website} onChange={v => update('website', v)} placeholder="e.g. shinebrightokc.com" required={false} />
              <Field label="Target Service Area / Location" value={form.targetArea} onChange={v => update('targetArea', v)} placeholder="e.g. Oklahoma City metro, 30 mile radius" />
              <Field label="Phone Number" value={form.phone} onChange={v => update('phone', v)} placeholder="e.g. (405) 555-0123" />
            </div>
          )}

          {/* STEP 2: Ad History */}
          {step === 1 && (
            <div className="space-y-6">
              <StepHeader title="Ad History" subtitle="Help us understand where you're starting from" />

              <div>
                <Label text="Have you run ads before?" />
                <div className="flex gap-3 mt-2">
                  {['Yes', 'No'].map(opt => (
                    <button key={opt} onClick={() => update('hasRunAds', opt)}
                      className="flex-1 py-3 rounded-md font-bold text-sm transition-all"
                      style={{
                        background: form.hasRunAds === opt ? 'rgba(33,209,159,0.15)' : 'rgba(255,255,255,0.04)',
                        border: form.hasRunAds === opt ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
                        color: form.hasRunAds === opt ? ACCENT : '#8A8F98',
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {form.hasRunAds === 'Yes' && (
                <>
                  <div>
                    <Label text="Which platforms?" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Meta (Facebook/Instagram)', 'Google', 'TikTok', 'Snapchat', 'Other'].map(p => (
                        <button key={p} onClick={() => togglePlatform(p)}
                          className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                          style={{
                            background: form.adPlatforms.includes(p) ? 'rgba(33,209,159,0.15)' : 'rgba(255,255,255,0.04)',
                            border: form.adPlatforms.includes(p) ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
                            color: form.adPlatforms.includes(p) ? ACCENT : '#8A8F98',
                          }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label text="Do you have a Meta Ad Account?" />
                    <div className="flex gap-3 mt-2">
                      {['Yes', 'No'].map(opt => (
                        <button key={opt} onClick={() => update('hasAdAccount', opt)}
                          className="flex-1 py-3 rounded-md font-bold text-sm transition-all"
                          style={{
                            background: form.hasAdAccount === opt ? 'rgba(33,209,159,0.15)' : 'rgba(255,255,255,0.04)',
                            border: form.hasAdAccount === opt ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
                            color: form.hasAdAccount === opt ? ACCENT : '#8A8F98',
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.hasAdAccount === 'Yes' && (
                    <Field label="Ad Account ID (if you know it)" value={form.adAccountId} onChange={v => update('adAccountId', v)} placeholder="e.g. act_123456789" required={false} />
                  )}
                </>
              )}

              {form.hasRunAds === 'No' && (
                <div className="rounded-md p-4" style={{ background: 'rgba(33,209,159,0.05)', border: '1px solid rgba(33,209,159,0.15)' }}>
                  <p className="text-sm" style={{ color: '#8A8F98' }}>
                    No problem — we'll walk you through setting everything up from scratch on the call. Watch the setup videos in Step 4 before we meet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Business Details */}
          {step === 2 && (
            <div className="space-y-5">
              <StepHeader title="Business Details" subtitle="Help us understand your numbers" />
              <Field label="Average Job Price ($)" value={form.avgJobPrice} onChange={v => update('avgJobPrice', v)} placeholder="e.g. $350" type="text" />
              <Field label="Number of Jobs Per Week Currently" value={form.jobsPerWeek} onChange={v => update('jobsPerWeek', v)} placeholder="e.g. 8-10 jobs/week" />
              <Field label="Monthly Ad Budget You're Looking to Spend" value={form.monthlyBudget} onChange={v => update('monthlyBudget', v)} placeholder="e.g. $1,500/month" />
              <div>
                <Label text="How did you hear about Higher Level?" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Referral', 'Instagram', 'Facebook', 'Google', 'Cold Outreach', 'Other'].map(opt => (
                    <button key={opt} onClick={() => update('hearAboutUs', opt)}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        background: form.hearAboutUs === opt ? 'rgba(33,209,159,0.15)' : 'rgba(255,255,255,0.04)',
                        border: form.hearAboutUs === opt ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
                        color: form.hearAboutUs === opt ? ACCENT : '#8A8F98',
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Setup Videos */}
          {step === 3 && (
            <div className="space-y-6">
              <StepHeader title="Setup Videos" subtitle="Watch both videos before your call — this will save us a ton of time" />

              <VideoCard
                title="How to Add Meta Admin Access"
                description="Grant Higher Level admin access to your Facebook page and ad account so we can get campaigns live fast."
                url="https://youtu.be/GDXGgyz_Zp8"
                checked={videoWatched1}
                onCheck={() => setVideoWatched1(!videoWatched1)}
              />

              <VideoCard
                title="Full Business Manager Setup"
                description="Set up your Meta Business Portfolio from scratch. Follow along step by step — this is required before we can run ads."
                url="https://youtu.be/3AynmEhh8Ro"
                checked={videoWatched2}
                onCheck={() => setVideoWatched2(!videoWatched2)}
              />

              <div className="rounded-md p-4" style={{ background: 'rgba(33,209,159,0.05)', border: '1px solid rgba(33,209,159,0.15)' }}>
                <p className="text-sm font-bold mb-1" style={{ color: ACCENT }}>Photos & Videos</p>
                <p className="text-sm" style={{ color: '#8A8F98' }}>
                  We'll share a Google Drive folder with you to upload any photos, videos, or brand assets. Have them ready — we'll go over everything on the call and get them into your ads.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Book a Call */}
          {step === 4 && (
            <div className="space-y-6">
              <StepHeader title="Book Your Onboarding Call" subtitle="One last step — pick a time that works for you" />

              <div className="rounded-md p-6 text-center" style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-4xl mb-4">📅</div>
                <p className="font-bold mb-2" style={{ color: '#F4F5F8' }}>Schedule your onboarding call</p>
                <p className="text-sm mb-6" style={{ color: '#8A8F98' }}>
                  We'll go over everything you just submitted, walk through your ad account setup, and get a launch plan in place before we hang up.
                </p>
                <div className="rounded-md p-4 mb-6" style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)' }}>
                  <p className="text-sm font-bold" style={{ color: '#F59E0B' }}>Booking link coming soon</p>
                  <p className="text-xs mt-1" style={{ color: '#8A8F98' }}>We'll send you a scheduling link via text or email to lock in your call time.</p>
                </div>
                <p className="text-xs" style={{ color: '#5C606C' }}>Questions? Reach out directly — we'll get you sorted.</p>
              </div>

              <div className="rounded-md p-4" style={{ background: 'rgba(33,209,159,0.05)', border: '1px solid rgba(33,209,159,0.15)' }}>
                <p className="text-sm font-bold mb-2" style={{ color: ACCENT }}>What to expect on the call</p>
                <ul className="space-y-2">
                  {[
                    'Review your business info and goals',
                    'Set up or verify your Meta Business Portfolio',
                    'Grant admin access to Higher Level',
                    'Go over your photos, videos, and brand assets',
                    'Build your launch plan and set a go-live date',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#8A8F98' }}>
                      <span style={{ color: ACCENT, marginTop: '2px' }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 rounded-md font-bold text-sm transition-all"
                style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)', color: '#8A8F98' }}>
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}
                className="flex-1 py-4 rounded-md font-semibold text-sm tracking-wider transition-all disabled:opacity-40"
                style={{
                  background: canAdvance() ? 'linear-gradient(135deg, #21D19F, #45B69C)' : 'rgba(255,255,255,0.06)',
                  color: canAdvance() ? '#080B14' : '#5C606C',
                  boxShadow: canAdvance() ? '0 0 30px rgba(33,209,159,0.3)' : 'none',
                }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-4 rounded-md font-semibold text-sm tracking-wider transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #21D19F, #45B69C)',
                  color: '#080B14',
                  boxShadow: '0 0 30px rgba(33,209,159,0.3)',
                }}>
                {loading ? 'Submitting...' : 'Submit & Finish →'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#2A2D40' }}>Higher Level Agency · Confidential</p>
      </div>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-semibold mb-1" style={{ color: '#F4F5F8' }}>{title}</h2>
      <p className="text-sm" style={{ color: '#8A8F98' }}>{subtitle}</p>
      <div className="h-px mt-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(33,209,159,0.3), transparent)' }} />
    </div>
  )
}

function Label({ text }: { text: string }) {
  return (
    <label className="block text-xs font-bold  mb-1" style={{ color: '#8A8F98' }}>
      {text}
    </label>
  )
}

function Field({ label, value, onChange, placeholder, required = true, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean; type?: string
}) {
  return (
    <div>
      <Label text={`${label}${required ? '' : ' (optional)'}`} />
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md text-sm outline-none transition-all"
        style={{
          background: '#15161A',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F4F5F8',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'rgba(33,209,159,0.4)'}
        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  )
}

function VideoCard({ title, description, url, checked, onCheck }: {
  title: string; description: string; url: string; checked: boolean; onCheck: () => void
}) {
  return (
    <div className="rounded-md p-5 transition-all"
      style={{ background: checked ? 'rgba(33,209,159,0.05)' : 'rgba(255,255,255,0.03)', border: checked ? '1px solid rgba(33,209,159,0.25)' : '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-start gap-4">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="w-12 h-12 rounded-md flex items-center justify-center text-xl flex-shrink-0 transition-all hover:scale-105"
          style={{ background: 'rgba(255,0,0,0.12)', border: '1px solid rgba(255,0,0,0.2)' }}>
          ▶
        </a>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-1" style={{ color: '#F4F5F8' }}>{title}</p>
          <p className="text-xs mb-3" style={{ color: '#8A8F98' }}>{description}</p>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold underline" style={{ color: '#21D19F' }}>
            Watch on YouTube →
          </a>
        </div>
      </div>
      <button onClick={onCheck}
        className="mt-4 flex items-center gap-2 text-sm font-bold transition-all"
        style={{ color: checked ? '#21D19F' : '#5C606C' }}>
        <div className="w-5 h-5 rounded flex items-center justify-center text-xs"
          style={{ background: checked ? 'rgba(33,209,159,0.2)' : 'rgba(255,255,255,0.05)', border: checked ? '1px solid #21D19F' : '1px solid rgba(255,255,255,0.1)' }}>
          {checked ? '✓' : ''}
        </div>
        {checked ? 'Watched' : 'Mark as watched'}
      </button>
    </div>
  )
}
