'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const W = 900
const H = 480
const R = 42

const GOOD = [
  { label: 'ROAS', pts: 150, color: '#21D19F', emoji: '📈', dmg: 0 },
  { label: 'CTR', pts: 100, color: '#45B69C', emoji: '🎯', dmg: 0 },
  { label: 'CPM↓', pts: 80, color: '#A0CFFF', emoji: '💰', dmg: 0 },
  { label: 'SCALE', pts: 200, color: '#FFB800', emoji: '🚀', dmg: 0 },
  { label: '3x ROAS', pts: 175, color: '#21D19F', emoji: '🔥', dmg: 0 },
  { label: 'LEADS', pts: 120, color: '#45B69C', emoji: '✅', dmg: 0 },
  { label: 'CONV%', pts: 90, color: '#A0CFFF', emoji: '⚡', dmg: 0 },
]

const BAD = [
  { label: 'NO PIXEL', pts: 0, color: '#EF4444', emoji: '💀', dmg: 22 },
  { label: 'BAD OBJ', pts: 0, color: '#EF4444', emoji: '☠️', dmg: 20 },
  { label: 'NO TRACK', pts: 0, color: '#DC2626', emoji: '🚫', dmg: 18 },
  { label: 'LOW BID', pts: 0, color: '#EF4444', emoji: '📉', dmg: 15 },
  { label: 'NO CTA', pts: 0, color: '#DC2626', emoji: '❌', dmg: 18 },
  { label: 'PAUSED', pts: 0, color: '#EF4444', emoji: '⛔', dmg: 20 },
  { label: 'BROAD', pts: 0, color: '#DC2626', emoji: '🎪', dmg: 15 },
]

interface Target {
  id: number
  x: number; y: number
  vx: number; vy: number
  r: number
  good: boolean
  label: string
  pts: number
  dmg: number
  color: string
  emoji: string
  born: number
  lifespan: number
  hit: boolean
  hitTime: number
  hitGood: boolean
  alpha: number
  scale: number
  wobble: number
}

interface FloatText {
  x: number; y: number; vy: number
  text: string; color: string
  life: number; maxLife: number; size: number
}

interface Burst {
  x: number; y: number; color: string
  particles: { angle: number; r: number; speed: number; life: number }[]
}

let uid = 0

const MAX_OPP = 100
const MISS_DMG = 18
const BASE_INTERVAL = 1400

export function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const s = useRef({
    phase: 'idle' as 'idle' | 'play' | 'dead',
    score: 0,
    highScore: 0,
    opp: MAX_OPP,
    targets: [] as Target[],
    floats: [] as FloatText[],
    bursts: [] as Burst[],
    frame: 0,
    lastSpawn: 0,
    interval: BASE_INTERVAL,
    raf: 0,
    lastTime: 0,
    shotFlashes: [] as { x: number; y: number; t: number }[],
  })
  const [ui, setUi] = useState({
    phase: 'idle' as 'idle' | 'play' | 'dead',
    score: 0, best: 0, opp: MAX_OPP,
  })

  function spawnTarget(now: number) {
    const st = s.current
    const good = Math.random() > 0.4
    const pool = good ? GOOD : BAD
    const src = pool[Math.floor(Math.random() * pool.length)]

    // Spawn from any edge
    let x = 0, y = 0, vx = 0, vy = 0
    const edge = Math.floor(Math.random() * 4)
    const speed = 1.8 + Math.random() * 1.6 + Math.floor(st.score / 800) * 0.3
    const cx = W / 2, cy = H / 2
    const wobble = (Math.random() - 0.5) * 0.8

    if (edge === 0) { x = Math.random() * W; y = -R }           // top
    else if (edge === 1) { x = Math.random() * W; y = H + R }   // bottom
    else if (edge === 2) { x = -R; y = Math.random() * H }      // left
    else { x = W + R; y = Math.random() * H }                   // right

    const ang = Math.atan2(cy - y, cx - x) + wobble
    vx = Math.cos(ang) * speed
    vy = Math.sin(ang) * speed

    st.targets.push({
      id: uid++, x, y, vx, vy, r: R,
      good, label: src.label,
      pts: (src as any).pts || 0,
      dmg: (src as any).dmg || 0,
      color: src.color, emoji: src.emoji,
      born: now, lifespan: 3800 + Math.random() * 1200,
      hit: false, hitTime: 0, hitGood: false,
      alpha: 1, scale: 1, wobble: Math.random() * Math.PI * 2,
    })
  }

  function addFloat(x: number, y: number, text: string, color: string, size = 16) {
    s.current.floats.push({ x, y, vy: -2.2, text, color, life: 65, maxLife: 65, size })
  }

  function addBurst(x: number, y: number, color: string) {
    s.current.bursts.push({
      x, y, color,
      particles: Array.from({ length: 10 }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2,
        r: 0, speed: 2 + Math.random() * 3,
        life: 30 + Math.random() * 20,
      })),
    })
  }

  const shoot = useCallback((cx: number, cy: number) => {
    const st = s.current
    if (st.phase !== 'play') return
    st.shotFlashes.push({ x: cx, y: cy, t: 10 })

    for (const t of st.targets) {
      if (t.hit) continue
      const dx = cx - t.x, dy = cy - t.y
      if (Math.sqrt(dx * dx + dy * dy) < t.r + 8) {
        t.hit = true; t.hitTime = performance.now(); t.hitGood = t.good

        if (t.good) {
          st.score += t.pts
          addFloat(t.x, t.y - 20, `+${t.pts}`, t.color, 18)
          addBurst(t.x, t.y, t.color)
          setUi(u => ({ ...u, score: st.score }))
        } else {
          st.opp = Math.max(0, st.opp - t.dmg)
          addFloat(t.x, t.y - 20, `-${t.dmg} OPP`, '#EF4444', 15)
          addBurst(t.x, t.y, '#EF4444')
          checkDead()
        }
        return
      }
    }
  }, [])

  function checkDead() {
    const st = s.current
    if (st.opp <= 0) {
      st.phase = 'dead'
      if (st.score > st.highScore) {
        st.highScore = st.score
        try { localStorage.setItem('hl_slayer_hs', String(st.highScore)) } catch {}
      }
      setUi(u => ({ ...u, phase: 'dead', opp: 0, score: st.score, best: st.highScore }))
    } else {
      setUi(u => ({ ...u, opp: st.opp }))
    }
  }

  function startGame() {
    const st = s.current
    st.phase = 'play'; st.score = 0; st.opp = MAX_OPP
    st.targets = []; st.floats = []; st.bursts = []
    st.frame = 0; st.lastSpawn = 0; st.interval = BASE_INTERVAL
    st.shotFlashes = []
    setUi(u => ({ ...u, phase: 'play', score: 0, opp: MAX_OPP }))
  }

  const getXY = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top) * (H / rect.height),
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const st = s.current
    try { st.highScore = parseInt(localStorage.getItem('hl_slayer_hs') || '0') } catch {}
    setUi(u => ({ ...u, best: st.highScore }))

    function frame(now: number) {
      ctx.clearRect(0, 0, W, H)

      if (st.phase === 'play') {
        st.frame++
        st.interval = Math.max(650, BASE_INTERVAL - Math.floor(st.score / 600) * 90)

        // Spawn
        if (now - st.lastSpawn > st.interval) {
          spawnTarget(now)
          if (st.score > 1000 && Math.random() > 0.6) spawnTarget(now)
          st.lastSpawn = now
        }

        // Update targets
        for (const t of st.targets) {
          if (!t.hit) {
            t.x += t.vx; t.y += t.vy
            t.wobble += 0.04
            t.vx += Math.sin(t.wobble) * 0.015
            const age = now - t.born
            const left = t.lifespan - age
            if (left < 600) t.alpha = Math.max(0, left / 600)
            if (age > t.lifespan) {
              // Expired
              if (t.good) {
                st.opp = Math.max(0, st.opp - MISS_DMG)
                addFloat(t.x, t.y, 'MISSED!', '#F59E0B', 13)
                checkDead()
              }
              t.hit = true; t.hitTime = now; t.hitGood = false
              t.alpha = 0
            }
          } else {
            const age2 = now - t.hitTime
            t.scale = t.hitGood ? 1 + age2 / 150 : 1 - age2 / 400
            t.alpha = Math.max(0, 1 - age2 / 350)
          }
        }
        st.targets = st.targets.filter(t => !(t.hit && now - t.hitTime > 400))

        // Bursts
        for (const b of st.bursts) {
          for (const p of b.particles) { p.r += p.speed; p.life-- }
          b.particles = b.particles.filter(p => p.life > 0)
        }
        st.bursts = st.bursts.filter(b => b.particles.length > 0)

        // Floats
        st.floats.forEach(f => { f.y += f.vy; f.life-- })
        st.floats = st.floats.filter(f => f.life > 0)

        // Shot flashes
        st.shotFlashes.forEach(f => f.t--)
        st.shotFlashes = st.shotFlashes.filter(f => f.t > 0)
      }

      // Draw targets
      for (const t of st.targets) drawTarget(ctx, t, now, st.frame)

      // Draw bursts
      for (const b of st.bursts) {
        for (const p of b.particles) {
          ctx.save()
          ctx.globalAlpha = p.life / 50
          ctx.fillStyle = b.color
          ctx.beginPath()
          ctx.arc(b.x + Math.cos(p.angle) * p.r, b.y + Math.sin(p.angle) * p.r, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // Draw float texts
      for (const f of st.floats) {
        ctx.save()
        ctx.globalAlpha = f.life / f.maxLife
        ctx.fillStyle = f.color
        ctx.font = `bold ${f.size}px system-ui`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = f.color; ctx.shadowBlur = 8
        ctx.fillText(f.text, f.x, f.y)
        ctx.restore()
      }

      // Shot flashes
      for (const f of st.shotFlashes) {
        ctx.save()
        ctx.globalAlpha = f.t / 10
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 1.5
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(f.x + Math.cos(a) * 10, f.y + Math.sin(a) * 10)
          ctx.lineTo(f.x + Math.cos(a) * 18, f.y + Math.sin(a) * 18)
          ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(f.x, f.y, 6, 0, Math.PI * 2)
        ctx.strokeStyle = '#21D19F'; ctx.stroke()
        ctx.restore()
      }

      // Idle / dead overlay
      if (st.phase === 'idle' || st.phase === 'dead') {
        ctx.save()
        ctx.fillStyle = 'rgba(8,11,20,0.88)'
        ctx.fillRect(0, 0, W, H)

        if (st.phase === 'dead') {
          ctx.fillStyle = '#EF4444'
          ctx.font = 'bold 26px system-ui'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = '#EF4444'; ctx.shadowBlur = 20
          ctx.fillText('💀  OPPORTUNITY SCORE: 0', W / 2, H / 2 - 60)
          ctx.shadowBlur = 0
          ctx.fillStyle = '#E8ECFF'
          ctx.font = 'bold 20px system-ui'
          ctx.fillText(`Score: ${st.score}`, W / 2, H / 2 - 18)
          if (st.score >= st.highScore && st.score > 0) {
            ctx.fillStyle = '#FFB800'
            ctx.font = 'bold 14px system-ui'
            ctx.fillText('🏆 NEW HIGH SCORE!', W / 2, H / 2 + 14)
          }
        } else {
          ctx.fillStyle = '#E8ECFF'
          ctx.font = 'bold 28px system-ui'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = '#21D19F'; ctx.shadowBlur = 20
          ctx.fillText('AD SLAYER 🎯', W / 2, H / 2 - 70)
          ctx.shadowBlur = 0
          ctx.fillStyle = '#7B82A0'
          ctx.font = '13px system-ui'
          ctx.fillText('Click 📈 ROAS  🎯 CTR  🚀 SCALE  🔥 3x', W / 2, H / 2 - 30)
          ctx.fillStyle = '#EF4444'
          ctx.fillText('Avoid 💀 NO PIXEL  ☠️ BAD OBJ  🚫 NO TRACK  📉 LOW BID', W / 2, H / 2 - 8)
          ctx.fillStyle = '#F59E0B'
          ctx.font = '12px system-ui'
          ctx.fillText('Missing good targets also drains your Opportunity Score', W / 2, H / 2 + 14)
        }
        ctx.restore()
      }

      st.raf = requestAnimationFrame(frame)
    }

    function drawTarget(ctx: CanvasRenderingContext2D, t: Target, now: number, frame: number) {
      ctx.save()
      ctx.globalAlpha = t.alpha
      ctx.translate(t.x, t.y)
      ctx.scale(t.scale, t.scale)

      // Outer glow ring pulse
      if (!t.hit) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 250 + t.wobble)
        ctx.globalAlpha = t.alpha * pulse * 0.25
        ctx.strokeStyle = t.color
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(0, 0, t.r + 10, 0, Math.PI * 2); ctx.stroke()
        ctx.globalAlpha = t.alpha
      }

      // Shadow/glow
      ctx.shadowColor = t.color
      ctx.shadowBlur = t.hit ? 35 : 18

      // Main circle
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, t.r)
      grad.addColorStop(0, t.color + '30')
      grad.addColorStop(1, t.color + '08')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2); ctx.fill()

      // Border
      ctx.strokeStyle = t.color
      ctx.lineWidth = t.hit ? 3 : 2
      ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2); ctx.stroke()
      ctx.shadowBlur = 0

      // Inner ring
      ctx.strokeStyle = t.color + '40'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, t.r * 0.7, 0, Math.PI * 2); ctx.stroke()

      // Emoji
      ctx.font = `${t.r * 0.9}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(t.emoji, 0, -6)

      // Label
      ctx.fillStyle = t.color
      ctx.font = `bold 8px system-ui`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.letterSpacing = '0.5px'
      ctx.fillText(t.label, 0, t.r * 0.55)

      ctx.restore()
    }

    st.raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(st.raf)
  }, [])

  const oppPct = ui.opp / MAX_OPP
  const oppColor = oppPct > 0.6 ? '#21D19F' : oppPct > 0.3 ? '#F59E0B' : '#EF4444'

  return (
    <div
      className="rounded-2xl overflow-hidden glass-accent mt-8"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div
        className="px-7 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>Ad Slayer 🎯</p>
            <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>
              Shoot good metrics · avoid bad settings · don't miss
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs mb-0.5" style={{ color: '#484D6D' }}>Score</p>
              <p className="font-black text-2xl leading-none" style={{ color: '#21D19F' }}>{ui.score}</p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-0.5" style={{ color: '#484D6D' }}>Best</p>
              <p className="font-black text-2xl leading-none" style={{ color: '#7B82A0' }}>{ui.best}</p>
            </div>
          </div>
        </div>

        {/* Opportunity score bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: oppColor }}>
              Opportunity Score
            </p>
            <p className="text-xs font-black" style={{ color: oppColor }}>{Math.round(ui.opp)}%</p>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${ui.opp}%`,
                background: `linear-gradient(90deg, ${oppColor}, ${oppColor}99)`,
                boxShadow: `0 0 8px ${oppColor}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Game canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full block"
          style={{ cursor: ui.phase === 'play' ? 'crosshair' : 'default' }}
          onClick={e => {
            if (ui.phase !== 'play') return
            const { x, y } = getXY(e)
            shoot(x, y)
          }}
        />

        {/* Start / Restart button overlay */}
        {(ui.phase === 'idle' || ui.phase === 'dead') && (
          <div className="absolute inset-0 flex items-end justify-center pb-14 pointer-events-none">
            <button
              className="pointer-events-auto font-black text-sm px-10 py-4 rounded-2xl transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #21D19F, #45B69C)',
                color: '#080B14',
                boxShadow: '0 0 30px rgba(33,209,159,0.4), 0 8px 32px rgba(0,0,0,0.4)',
                letterSpacing: '0.08em',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={startGame}
            >
              {ui.phase === 'dead' ? '↺  RUN IT BACK' : '▶  START GAME'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
