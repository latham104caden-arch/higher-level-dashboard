'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const W = 800
const H = 420

const GOOD = [
  { label: 'ROAS', pts: 150, color: '#21D19F', emoji: '📈' },
  { label: 'CTR', pts: 100, color: '#45B69C', emoji: '🎯' },
  { label: 'CPM↓', pts: 80, color: '#A0A4B8', emoji: '💰' },
  { label: 'SCALE', pts: 200, color: '#FFB800', emoji: '🚀' },
  { label: '3x', pts: 175, color: '#21D19F', emoji: '🔥' },
  { label: 'LEADS', label2: '', pts: 120, color: '#45B69C', emoji: '✅' },
]

const BAD = [
  { label: 'NO PIXEL', color: '#EF4444', emoji: '💀' },
  { label: 'BAD OBJ', color: '#EF4444', emoji: '☠️' },
  { label: 'NO TRACK', color: '#DC2626', emoji: '🚫' },
  { label: 'LOW BID', color: '#EF4444', emoji: '📉' },
  { label: 'NO CTA', color: '#DC2626', emoji: '❌' },
  { label: 'BAD ADS', color: '#EF4444', emoji: '💸' },
]

const MAX_LIVES = 3
const BASE_SPAWN = 1600 // ms between spawns
const R = 38 // target radius

interface Target {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  good: boolean
  label: string
  pts?: number
  color: string
  emoji: string
  born: number
  hit: boolean
  hitTime?: number
  hitGood?: boolean
  alpha: number
  scale: number
}

interface Particle {
  x: number; y: number; vx: number; vy: number
  color: string; text: string; life: number; maxLife: number
}

let uid = 0

export function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef({ x: W / 2, y: H / 2 })
  const stateRef = useRef({
    started: false,
    alive: true,
    score: 0,
    highScore: 0,
    lives: MAX_LIVES,
    targets: [] as Target[],
    particles: [] as Particle[],
    frame: 0,
    lastSpawn: 0,
    spawnInterval: BASE_SPAWN,
    raf: 0,
    lastTime: 0,
    shotFlash: null as null | { x: number; y: number; t: number },
  })
  const [ui, setUi] = useState({ score: 0, best: 0, lives: MAX_LIVES, phase: 'idle' as 'idle' | 'play' | 'dead' })

  function spawnTarget(now: number) {
    const s = stateRef.current
    const good = Math.random() > 0.38
    const src = good ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)]

    const x = R + Math.random() * (W - R * 2)
    const vy = -(4 + Math.random() * 3.5)
    const vx = (Math.random() - 0.5) * 2.5

    s.targets.push({
      id: uid++,
      x, y: H + R,
      vx, vy,
      r: R,
      good,
      label: src.label,
      pts: (src as any).pts,
      color: src.color,
      emoji: src.emoji,
      born: now,
      hit: false,
      alpha: 1,
      scale: 1,
    })
  }

  function addParticles(x: number, y: number, color: string, text: string, good: boolean) {
    const s = stateRef.current
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * (2 + Math.random() * 2),
        vy: Math.sin(angle) * (2 + Math.random() * 2) - 1,
        color, text: i === 0 ? text : '',
        life: 50, maxLife: 50,
      })
    }
  }

  function handleShot(cx: number, cy: number) {
    const s = stateRef.current
    if (!s.alive) { restart(); return }
    if (!s.started) { s.started = true; s.alive = true; setUi(u => ({ ...u, phase: 'play' })) }

    s.shotFlash = { x: cx, y: cy, t: 8 }

    let hit = false
    for (const t of s.targets) {
      if (t.hit) continue
      const dx = cx - t.x, dy = cy - t.y
      if (Math.sqrt(dx * dx + dy * dy) < t.r) {
        t.hit = true
        t.hitTime = performance.now()
        t.hitGood = t.good
        hit = true

        if (t.good) {
          s.score += t.pts || 100
          addParticles(t.x, t.y, t.color, `+${t.pts}`, true)
          setUi(u => ({ ...u, score: s.score }))
        } else {
          s.lives = Math.max(0, s.lives - 1)
          addParticles(t.x, t.y, '#EF4444', '-LIFE', false)
          if (s.lives <= 0) {
            s.alive = false
            const sc = s.score
            if (sc > s.highScore) {
              s.highScore = sc
              try { localStorage.setItem('hl_shooter_hs', String(sc)) } catch {}
            }
            setUi(u => ({ ...u, lives: 0, phase: 'dead', score: sc, best: s.highScore }))
          } else {
            setUi(u => ({ ...u, lives: s.lives }))
          }
        }
        break
      }
    }
  }

  function restart() {
    const s = stateRef.current
    s.alive = true; s.score = 0; s.lives = MAX_LIVES
    s.targets = []; s.particles = []; s.frame = 0
    s.lastSpawn = 0; s.spawnInterval = BASE_SPAWN
    setUi(u => ({ ...u, score: 0, lives: MAX_LIVES, phase: 'play' }))
  }

  const getCanvasXY = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const s = stateRef.current
    try { s.highScore = parseInt(localStorage.getItem('hl_shooter_hs') || '0') } catch {}
    setUi(u => ({ ...u, best: s.highScore }))

    function draw(now: number) {
      const dt = now - (s.lastTime || now)
      s.lastTime = now
      ctx.clearRect(0, 0, W, H)

      if (!s.started) {
        drawIdle(ctx)
        s.raf = requestAnimationFrame(draw)
        return
      }

      if (s.alive) {
        s.frame++
        // Increase speed over time
        s.spawnInterval = Math.max(600, BASE_SPAWN - Math.floor(s.score / 500) * 80)

        // Spawn
        if (now - s.lastSpawn > s.spawnInterval) {
          spawnTarget(now)
          s.lastSpawn = now
        }

        // Update targets
        for (const t of s.targets) {
          if (!t.hit) {
            t.x += t.vx
            t.y += t.vy
            t.vy += 0.12 // gravity arc
            // Fade near top
            if (t.y < 60) t.alpha = Math.max(0, t.y / 60)
          } else {
            // Exploding animation
            const age = now - (t.hitTime || now)
            t.scale = t.hitGood ? 1 + age / 120 : 1 + age / 200
            t.alpha = Math.max(0, 1 - age / 300)
          }
        }

        // Remove old targets
        s.targets = s.targets.filter(t => {
          if (t.hit && now - (t.hitTime || now) > 350) return false
          if (!t.hit && t.y > H + R * 2) return false
          return true
        })

        // Particles
        s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life-- })
        s.particles = s.particles.filter(p => p.life > 0)
      }

      // Draw targets
      for (const t of s.targets) drawTarget(ctx, t, now)

      // Draw particles
      for (const p of s.particles) {
        ctx.save()
        ctx.globalAlpha = p.life / p.maxLife
        if (p.text) {
          ctx.fillStyle = p.color
          ctx.font = 'bold 16px system-ui'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.text, p.x, p.y)
        } else {
          ctx.fillStyle = p.color
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill()
        }
        ctx.restore()
      }

      // Shot flash
      if (s.shotFlash && s.shotFlash.t > 0) {
        const f = s.shotFlash
        ctx.save()
        ctx.globalAlpha = f.t / 8
        ctx.strokeStyle = '#E8ECFF'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(f.x, f.y, 14, 0, Math.PI * 2); ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(f.x - 6, f.y); ctx.lineTo(f.x + 6, f.y)
        ctx.moveTo(f.x, f.y - 6); ctx.lineTo(f.x, f.y + 6)
        ctx.stroke()
        ctx.restore()
        f.t--
      }

      // Dead overlay
      if (!s.alive && s.started) {
        ctx.save()
        ctx.fillStyle = 'rgba(8,11,20,0.82)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#EF4444'
        ctx.font = 'bold 20px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('💀  CAMPAIGN KILLED', W / 2, H / 2 - 22)
        ctx.fillStyle = '#7B82A0'
        ctx.font = '13px system-ui'
        ctx.fillText('Click to run it back', W / 2, H / 2 + 8)
        ctx.restore()
      }

      s.raf = requestAnimationFrame(draw)
    }

    function drawIdle(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = '#7B82A0'
      ctx.font = 'bold 15px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Click to start', W / 2, H / 2 - 20)
      ctx.font = '11px system-ui'
      ctx.fillStyle = '#484D6D'
      ctx.fillText('Shoot 📈 ROAS · 🎯 CTR · 🚀 SCALE    Avoid 💀 NO PIXEL · ☠️ BAD OBJ · 🚫 NO TRACK', W / 2, H / 2 + 8)
    }

    function drawTarget(ctx: CanvasRenderingContext2D, t: Target, now: number) {
      ctx.save()
      ctx.globalAlpha = t.alpha
      ctx.translate(t.x, t.y)
      ctx.scale(t.scale, t.scale)

      // Glow
      ctx.shadowColor = t.color
      ctx.shadowBlur = t.hit ? 30 : 16

      // Circle
      ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2)
      ctx.fillStyle = t.good ? `${t.color}18` : 'rgba(239,68,68,0.1)'
      ctx.fill()
      ctx.strokeStyle = t.color
      ctx.lineWidth = t.hit ? 2.5 : 1.8
      ctx.stroke()
      ctx.shadowBlur = 0

      // Emoji
      ctx.font = `${t.hit ? 22 : 20}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(t.emoji, 0, -8)

      // Label
      ctx.fillStyle = t.color
      ctx.font = `bold 8.5px system-ui`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(t.label, 0, 14)

      // Pulse ring on non-hit
      if (!t.hit) {
        const pulse = (Math.sin(now / 300) + 1) / 2
        ctx.globalAlpha = t.alpha * pulse * 0.3
        ctx.strokeStyle = t.color
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(0, 0, t.r + 6, 0, Math.PI * 2); ctx.stroke()
      }

      ctx.restore()
    }

    s.raf = requestAnimationFrame(draw)

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); if (!s.started) { s.started = true; setUi(u => ({ ...u, phase: 'play' })) } }
    }
    window.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(s.raf); window.removeEventListener('keydown', onKey) }
  }, [])

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
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Ad Slayer 🎯</p>
          <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>
            Shoot good metrics · avoid bad settings · 3 lives
          </p>
        </div>
        <div className="flex items-center gap-8">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} style={{ opacity: i < ui.lives ? 1 : 0.2, fontSize: '18px' }}>❤️</span>
            ))}
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#484D6D' }}>Score</p>
            <p className="font-black text-xl" style={{ color: '#21D19F' }}>{ui.score}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#484D6D' }}>Best</p>
            <p className="font-black text-xl" style={{ color: '#7B82A0' }}>{ui.best}</p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full block"
        style={{ cursor: 'crosshair' }}
        onMouseMove={e => {
          const { x, y } = getCanvasXY(e)
          cursorRef.current = { x, y }
        }}
        onClick={e => {
          const { x, y } = getCanvasXY(e)
          handleShot(x, y)
        }}
      />
    </div>
  )
}
