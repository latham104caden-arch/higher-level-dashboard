'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_ID = 'bHu1YS9aUbY'
const DURATION = 235
const CURVE = 0.35

function fmt(s: number) {
  s = Math.max(0, Math.floor(s))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r < 10 ? '0' : ''}${r}`
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function PrecallClient() {
  const playerRef = useRef<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const [coverHidden, setCoverHidden] = useState(false)

  useEffect(() => {
    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    const updateProgress = () => {
      const p = playerRef.current
      if (!p || !p.getCurrentTime) return
      const t = p.getCurrentTime()
      const linear = Math.min(t / DURATION, 1)
      const fake = Math.pow(linear, CURVE)
      if (fillRef.current) fillRef.current.style.width = `${fake * 100}%`
      if (timeRef.current) timeRef.current.textContent = fmt(t)
    }
    const startTimer = () => {
      stopTimer()
      timerRef.current = setInterval(updateProgress, 250)
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player('precall-player', {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: (e: any) => { e.target.playVideo(); startTimer() },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) startTimer()
            else stopTimer()
            if (e.data === window.YT.PlayerState.ENDED) {
              if (fillRef.current) fillRef.current.style.width = '100%'
              if (timeRef.current) timeRef.current.textContent = fmt(DURATION)
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }

    return () => {
      stopTimer()
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy()
    }
  }, [])

  const handleUnmute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (playerRef.current && playerRef.current.unMute) playerRef.current.unMute()
    setCoverHidden(true)
  }

  const handleToggle = () => {
    const p = playerRef.current
    if (!p) return
    const state = p.getPlayerState()
    if (state === window.YT.PlayerState.PLAYING) p.pauseVideo()
    else p.playVideo()
  }

  return (
    <div className="precall-root">
      <style>{styles}</style>

      <header className="pc-header">
        <div className="pc-wrap pc-header-inner">
          <div className="pc-logo">HL</div>
          <div>
            <span className="pc-brand">Higher Level</span>
            <span className="pc-brand-sub">Paid Ads Agency</span>
          </div>
        </div>
      </header>

      <main className="pc-wrap">
        <section className="pc-hero">
          <div className="pc-eyebrow">Before our call · 5 minutes</div>
          <h1>Watch this before we hop on.</h1>
          <p className="pc-lede">
            Most agencies spend the call pitching themselves. We don&apos;t. This covers who we are, who
            we work with, and the kind of results we get — so the call can be 100% about your business.
          </p>

          <div className="pc-video-wrap">
            <div id="precall-player" />
            <div className="pc-play-toggle" onClick={handleToggle} />
            <div className={`pc-video-cover${coverHidden ? ' pc-hidden' : ''}`} onClick={handleUnmute}>
              <div className="pc-unmute-pill">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                Tap to unmute
              </div>
            </div>
          </div>

          <div className="pc-progress-bar">
            <div className="pc-progress-fill" ref={fillRef} />
          </div>
          <div className="pc-progress-meta">
            <span ref={timeRef}>0:00</span>
            <span>3:55</span>
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">Who we are</div>
          <h2>A paid ads agency. That&apos;s it.</h2>
          <p className="pc-body">
            We don&apos;t do SEO. Or websites. Or social management. Or email. We run paid advertising
            on three platforms — and because that&apos;s the only thing we do, we&apos;re very good at it.
          </p>
          <div className="pc-platforms">
            <div className="pc-pill">Meta</div>
            <div className="pc-pill">Google</div>
            <div className="pc-pill">TikTok</div>
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">Who we serve</div>
          <h2>Local pros. The trades, clinics, and services.</h2>
          <p className="pc-body">
            If you serve a community and need a steady stream of qualified leads, we&apos;ve probably
            worked with someone like you.
          </p>
          <div className="pc-niches">
            {['Plumbers','HVAC','Roofers','Electricians','Dentists','Med Spas','Law Firms','Landscapers'].map(n => (
              <div key={n} className="pc-niche">{n}</div>
            ))}
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">Who we&apos;re looking for</div>
          <h2>We&apos;re selective on purpose.</h2>
          <p className="pc-body">
            We work with a small number of clients and go deep with each one. The right fit gets
            exceptional results. The wrong fit just wastes everyone&apos;s time.
          </p>
          <div className="pc-traits">
            <div className="pc-trait">
              <div className="pc-trait-label">Growth-minded</div>
              <div className="pc-trait-body">Actively trying to grow — not just hold position.</div>
            </div>
            <div className="pc-trait">
              <div className="pc-trait-label">Communicative</div>
              <div className="pc-trait-body">Real partner. Responds, gives feedback, shows up.</div>
            </div>
            <div className="pc-trait">
              <div className="pc-trait-label">Ready</div>
              <div className="pc-trait-body">Has the budget, capacity, and infrastructure to scale.</div>
            </div>
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">What makes us different</div>
          <h2>One client per niche. Per area.</h2>
          <p className="pc-body">
            When we take you on, we close that niche in your geography. No competitor in your market
            becomes our client while you&apos;re with us.
          </p>
          <div className="pc-differentiator">
            <div className="pc-diff-big">Your market.<br />Locked.</div>
            <div className="pc-diff-small">
              We won&apos;t take on a competitor in your area for as long as you&apos;re a client. Period.
            </div>
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">Past results</div>
          <h2>$1 in. $4 out. On average.</h2>
          <p className="pc-body">
            Across our entire portfolio of active campaigns. Not a cherry-picked case study.
          </p>
          <div className="pc-stat-block">
            <div className="pc-stat-num">4×</div>
            <div className="pc-stat-label">Average return on ad spend</div>
            <div className="pc-stat-sub">Portfolio-wide. Active campaigns only.</div>
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">Real campaigns · Real numbers</div>
          <h2>What good actually looks like.</h2>
          <div className="pc-cases">
            <div className="pc-case">
              <div className="pc-case-tag">HVAC · 60 days</div>
              <div className="pc-case-num">$87 → $19</div>
              <div className="pc-case-metric">Cost per lead</div>
              <div className="pc-case-desc">Cut CPL 78% with creative + audience overhaul.</div>
            </div>
            <div className="pc-case">
              <div className="pc-case-tag">Roofer · 90 days</div>
              <div className="pc-case-num">12 → 91</div>
              <div className="pc-case-metric">Leads per month</div>
              <div className="pc-case-desc">Opened a second territory after pipeline tripled.</div>
            </div>
            <div className="pc-case">
              <div className="pc-case-tag">Med Spa · 6 months</div>
              <div className="pc-case-num">$2.1M</div>
              <div className="pc-case-metric">Revenue generated</div>
              <div className="pc-case-desc">From paid ads alone. 4.6× ROAS sustained.</div>
            </div>
          </div>
          <div className="pc-cases-foot">
            On the call, we&apos;ll dig into the campaigns most relevant to your industry.
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">On our call</div>
          <h2>We want to learn about your business.</h2>
          <p className="pc-body">
            Before we agree to work together, we need to understand what you&apos;re building, where
            you&apos;re stuck, and whether we can actually move the needle. This isn&apos;t a pitch —
            it&apos;s a conversation.
          </p>
          <div className="pc-num-list">
            {[
              ['1','Your business','What you sell, your market, your team.'],
              ['2','Your goals','Where you want to be in 6–12 months.'],
              ['3','Your ad history',"What's worked, what hasn't, and why."],
              ['4','The fit','Whether your niche and area are open.'],
            ].map(([n,t,b]) => (
              <div key={n} className="pc-num-item">
                <div className="pc-num">{n}</div>
                <div>
                  <div className="pc-num-title">{t}</div>
                  <div className="pc-num-body">{b}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pc-block">
          <div className="pc-eyebrow pc-label">Before you join</div>
          <h2>Come ready to talk numbers.</h2>
          <p className="pc-body">A few things that&apos;ll make our call ten times more useful:</p>
          <div className="pc-bring-list">
            {[
              ['Your monthly revenue',"Roughly. We're not auditing — we're sizing the play."],
              ['Your current ad spend',"What you spend, where, and what you're getting back."],
              ['Your top 1–2 services','What drives revenue and what you want more of.'],
              ['Your service area','Cities, zip codes, or radius — wherever you take work.'],
            ].map(([t,b]) => (
              <div key={t} className="pc-bring">
                <div className="pc-bring-title">{t}</div>
                <div className="pc-bring-body">{b}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="pc-footer">
        <div className="pc-wrap">
          <h3>See you soon.</h3>
          <p>
            Check your calendar invite for the call link. If anything changes on your end, just text us —
            direct numbers are in the confirmation email.
          </p>
          <div className="pc-domain">higherleveladz.com</div>
        </div>
      </footer>
    </div>
  )
}

const styles = `
.precall-root{--pc-bg:#0a0a0a;--pc-surface:#131313;--pc-surface-2:#1c1c1c;--pc-border:#262626;--pc-text:#fafafa;--pc-muted:#8a8a8a;--pc-dim:#5a5a5a;--pc-accent:#d4a04a;background:var(--pc-bg);color:var(--pc-text);min-height:100vh;line-height:1.5;font-family:var(--font-sans),-apple-system,BlinkMacSystemFont,sans-serif}
.precall-root *,.precall-root *::before,.precall-root *::after{box-sizing:border-box;margin:0;padding:0}
.pc-wrap{max-width:920px;margin:0 auto;padding:0 24px}
.pc-eyebrow{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--pc-accent)}
.pc-header{padding:32px 0;border-bottom:1px solid var(--pc-border)}
.pc-header-inner{display:flex;align-items:center;gap:14px}
.pc-logo{width:40px;height:40px;border:1.5px solid var(--pc-accent);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;letter-spacing:.05em;color:var(--pc-accent)}
.pc-brand{font-weight:700;font-size:15px;letter-spacing:.02em}
.pc-brand-sub{color:var(--pc-muted);font-weight:400;font-size:13px;margin-left:8px}
.pc-hero{padding:64px 0 24px;text-align:center}
.pc-hero h1{font-size:clamp(32px,5vw,52px);font-weight:800;letter-spacing:-.02em;line-height:1.05;margin:18px auto;max-width:720px}
.pc-lede{color:var(--pc-muted);font-size:17px;max-width:560px;margin:0 auto 40px}
.pc-video-wrap{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 1px var(--pc-border)}
#precall-player{position:absolute;inset:0;width:100%;height:100%}
.pc-video-cover{position:absolute;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:opacity .3s}
.pc-video-cover.pc-hidden{opacity:0;pointer-events:none}
.pc-unmute-pill{display:inline-flex;align-items:center;gap:10px;padding:14px 24px;background:#fff;color:#000;border-radius:100px;font-weight:700;font-size:14px;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 10px 40px rgba(0,0,0,.5)}
.pc-unmute-pill svg{width:18px;height:18px}
.pc-play-toggle{position:absolute;inset:0;z-index:3;cursor:pointer}
.pc-progress-bar{margin-top:18px;height:6px;background:var(--pc-surface-2);border-radius:100px;overflow:hidden;position:relative}
.pc-progress-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--pc-accent) 0%,#e8c374 100%);border-radius:100px;transition:width .25s linear;box-shadow:0 0 12px rgba(212,160,74,.4)}
.pc-progress-meta{display:flex;justify-content:space-between;font-variant-numeric:tabular-nums;font-size:12px;color:var(--pc-muted);margin-top:8px;letter-spacing:.02em}
.pc-block{padding:80px 0;border-top:1px solid var(--pc-border)}
.pc-block .pc-label{margin-bottom:14px}
.pc-block h2{font-size:clamp(28px,4vw,40px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:20px;max-width:680px}
.pc-block .pc-body{color:var(--pc-muted);font-size:16px;max-width:620px}
.pc-platforms{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px}
.pc-pill{padding:24px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:10px;text-align:center;font-weight:600;font-size:15px;transition:border-color .2s}
.pc-pill:hover{border-color:var(--pc-accent)}
.pc-niches{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:36px}
.pc-niche{padding:18px 14px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:8px;text-align:center;font-weight:500;font-size:14px}
.pc-traits{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:36px}
.pc-trait{padding:28px 24px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:10px}
.pc-trait-label{font-size:11px;font-weight:700;letter-spacing:.16em;color:var(--pc-accent);text-transform:uppercase;margin-bottom:10px}
.pc-trait-body{color:var(--pc-muted);font-size:14px;line-height:1.55}
.pc-stat-block{margin-top:36px;padding:48px 32px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:12px;text-align:center}
.pc-stat-num{font-size:clamp(64px,10vw,120px);font-weight:800;letter-spacing:-.04em;line-height:1;color:var(--pc-accent)}
.pc-stat-label{margin-top:14px;font-size:15px;font-weight:500}
.pc-stat-sub{margin-top:8px;font-size:13px;color:var(--pc-muted)}
.pc-cases{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px}
.pc-case{padding:28px 22px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:10px}
.pc-case-tag{font-size:10px;font-weight:700;letter-spacing:.16em;color:var(--pc-accent);text-transform:uppercase}
.pc-case-num{margin-top:14px;font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.pc-case-metric{margin-top:4px;font-size:12px;color:var(--pc-muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.pc-case-desc{margin-top:14px;font-size:14px;color:var(--pc-muted);line-height:1.5}
.pc-cases-foot{margin-top:18px;font-size:13px;color:var(--pc-dim);font-style:italic}
.pc-num-list{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:36px}
.pc-num-item{padding:24px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:10px;display:flex;gap:18px;align-items:flex-start}
.pc-num{flex:0 0 32px;height:32px;border:1px solid var(--pc-accent);border-radius:50%;color:var(--pc-accent);font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center}
.pc-num-title{font-weight:600;font-size:15px}
.pc-num-body{color:var(--pc-muted);font-size:13px;margin-top:4px;line-height:1.55}
.pc-bring-list{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:36px}
.pc-bring{padding:22px;background:var(--pc-surface);border:1px solid var(--pc-border);border-radius:10px}
.pc-bring-title{font-weight:600;font-size:15px}
.pc-bring-body{color:var(--pc-muted);font-size:13px;margin-top:6px;line-height:1.5}
.pc-differentiator{margin-top:36px;padding:60px 40px;background:linear-gradient(135deg,rgba(212,160,74,.08) 0%,rgba(212,160,74,.02) 100%);border:1px solid rgba(212,160,74,.25);border-radius:12px;text-align:center}
.pc-diff-big{font-size:clamp(36px,6vw,64px);font-weight:800;letter-spacing:-.03em;line-height:1.05}
.pc-diff-small{margin-top:16px;color:var(--pc-muted);max-width:520px;margin:16px auto 0;font-size:15px}
.pc-footer{padding:80px 0 60px;border-top:1px solid var(--pc-border);text-align:center}
.pc-footer h3{font-size:clamp(28px,4vw,38px);font-weight:800;letter-spacing:-.02em;margin-bottom:16px}
.pc-footer p{color:var(--pc-muted);max-width:520px;margin:0 auto 28px;font-size:15px}
.pc-domain{color:var(--pc-accent);font-weight:600;letter-spacing:.04em;font-size:14px;text-transform:uppercase}
@media(max-width:720px){
  .pc-platforms{grid-template-columns:1fr}
  .pc-niches{grid-template-columns:repeat(2,1fr)}
  .pc-traits{grid-template-columns:1fr}
  .pc-cases{grid-template-columns:1fr}
  .pc-num-list{grid-template-columns:1fr}
  .pc-bring-list{grid-template-columns:1fr}
  .pc-block{padding:60px 0}
  .pc-hero{padding:48px 0 16px}
  .pc-differentiator{padding:40px 24px}
  .pc-stat-block{padding:36px 20px}
}
`
