'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const W = 800
const H = 200
const GROUND = 160
const PW = 28
const PH = 38
const PX = 90
const GRAVITY = 0.65
const JUMP = -14
const OW = 64
const OH = 52

const OBSTACLES = ['NO PIXEL', 'WRONG OBJ', 'BAD BUDGET', 'NO TRACKING', 'BROAD ADS', 'NO CTA', 'LOW BID']
const COINS = [
  { label: 'ROAS', pts: 100, color: '#21D19F' },
  { label: 'CTR', pts: 75, color: '#45B69C' },
  { label: 'CPM', pts: 50, color: '#A0A4B8' },
  { label: '3x', pts: 150, color: '#21D19F' },
  { label: 'SCALE', pts: 200, color: '#FFB800' },
]

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    started: false,
    alive: true,
    score: 0,
    highScore: 0,
    speed: 4,
    frame: 0,
    player: { x: PX, y: GROUND - PH, vy: 0, ground: true },
    obs: [] as any[],
    coins: [] as any[],
    floats: [] as any[],
    raf: 0,
  })
  const [ui, setUi] = useState({ score: 0, best: 0, phase: 'idle' as 'idle' | 'play' | 'dead' })

  const doJump = useCallback(() => {
    const s = stateRef.current
    if (!s.started) { s.started = true; s.alive = true; setUi(u => ({ ...u, phase: 'play' })) }
    if (!s.alive) { restart(); return }
    if (s.player.ground) { s.player.vy = JUMP; s.player.ground = false }
  }, [])

  function restart() {
    const s = stateRef.current
    s.alive = true; s.score = 0; s.speed = 4; s.frame = 0
    s.player = { x: PX, y: GROUND - PH, vy: 0, ground: true }
    s.obs = []; s.coins = []; s.floats = []
    setUi(u => ({ ...u, score: 0, phase: 'play' }))
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const s = stateRef.current
    try { s.highScore = parseInt(localStorage.getItem('hl_hs') || '0') } catch {}
    setUi(u => ({ ...u, best: s.highScore }))

    function tick() {
      ctx.clearRect(0, 0, W, H)

      // Ground line
      ctx.save()
      ctx.strokeStyle = 'rgba(33,209,159,0.25)'
      ctx.lineWidth = 1
      ctx.setLineDash([10, 10])
      ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Idle
      if (!s.started) {
        drawPlayer(ctx, s)
        ctx.fillStyle = '#7B82A0'
        ctx.font = 'bold 14px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('SPACE or tap to start', W / 2, H / 2 - 16)
        ctx.font = '11px system-ui'
        ctx.fillStyle = '#484D6D'
        ctx.fillText('Jump over bad ad settings · collect ROAS, CTR & CPM', W / 2, H / 2 + 4)
        s.raf = requestAnimationFrame(tick)
        return
      }

      if (s.alive) {
        s.frame++
        s.score++
        s.speed = 4 + Math.floor(s.score / 400) * 0.6

        // Spawn
        const gap = Math.max(90, 160 - Math.floor(s.score / 300) * 12)
        if (s.frame % gap === 0) {
          s.obs.push({ x: W + 10, y: GROUND - OH, label: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)] })
        }
        if (s.frame % 80 === 40) {
          const c = COINS[Math.floor(Math.random() * COINS.length)]
          s.coins.push({ x: W + 10, y: GROUND - OH - 20 - Math.random() * 50, ...c, done: false })
        }

        // Physics
        const p = s.player
        p.vy += GRAVITY; p.y += p.vy
        if (p.y >= GROUND - PH) { p.y = GROUND - PH; p.vy = 0; p.ground = true } else { p.ground = false }

        // Move
        s.obs = s.obs.filter(o => o.x > -OW - 10)
        s.obs.forEach(o => o.x -= s.speed)
        s.coins = s.coins.filter(c => c.x > -30)
        s.coins.forEach(c => c.x -= s.speed)

        // Hit obstacle
        const px = p.x - PW / 2 + 5, py = p.y + 5, pw = PW - 8, ph = PH - 8
        for (const o of s.obs) {
          if (px < o.x + OW - 6 && px + pw > o.x + 6 && py < o.y + OH - 4 && py + ph > o.y + 4) {
            s.alive = false
            const sc = Math.floor(s.score / 10)
            if (sc > s.highScore) { s.highScore = sc; try { localStorage.setItem('hl_hs', String(sc)) } catch {} }
            setUi({ score: sc, best: s.highScore, phase: 'dead' })
            break
          }
        }

        // Collect coin
        for (const c of s.coins) {
          if (!c.done) {
            const dx = (p.x) - c.x, dy = (p.y + PH / 2) - c.y
            if (Math.sqrt(dx * dx + dy * dy) < 24) {
              c.done = true
              s.score += c.pts * 10
              s.floats.push({ x: c.x, y: c.y, text: `+${c.pts}`, color: c.color, life: 55, vy: -1.8 })
            }
          }
        }
        s.coins = s.coins.filter(c => !c.done)
        s.floats.forEach(f => { f.y += f.vy; f.life-- })
        s.floats = s.floats.filter(f => f.life > 0)

        setUi(u => ({ ...u, score: Math.floor(s.score / 10) }))
      }

      // Draw obstacles
      for (const o of s.obs) {
        ctx.save()
        ctx.shadowColor = '#EF4444'; ctx.shadowBlur = 12
        ctx.fillStyle = 'rgba(239,68,68,0.08)'
        ctx.strokeStyle = 'rgba(239,68,68,0.65)'
        ctx.lineWidth = 1.5
        rr(ctx, o.x, o.y, OW, OH, 8); ctx.fill(); ctx.stroke()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#EF4444'
        ctx.font = 'bold 8px system-ui'
        ctx.textAlign = 'center'
        const words = o.label.split(' ')
        if (words.length > 1) {
          ctx.fillText(words[0], o.x + OW / 2, o.y + OH / 2 - 6)
          ctx.fillText(words[1], o.x + OW / 2, o.y + OH / 2 + 6)
        } else {
          ctx.fillText(o.label, o.x + OW / 2, o.y + OH / 2)
        }
        ctx.restore()
      }

      // Draw coins
      for (const c of s.coins) {
        ctx.save()
        ctx.shadowColor = c.color; ctx.shadowBlur = 14
        ctx.fillStyle = c.color + '22'
        ctx.strokeStyle = c.color
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(c.x, c.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.shadowBlur = 0
        ctx.fillStyle = c.color
        ctx.font = 'bold 7.5px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(c.label, c.x, c.y)
        ctx.restore()
      }

      // Draw floats
      for (const f of s.floats) {
        ctx.save()
        ctx.globalAlpha = f.life / 55
        ctx.fillStyle = f.color
        ctx.font = 'bold 13px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(f.text, f.x, f.y)
        ctx.restore()
      }

      // Draw player
      drawPlayer(ctx, s)

      // Dead overlay
      if (!s.alive && s.started) {
        ctx.save()
        ctx.fillStyle = 'rgba(8,11,20,0.75)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#EF4444'
        ctx.font = 'bold 17px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('💀  AD ACCOUNT SUSPENDED', W / 2, H / 2 - 16)
        ctx.fillStyle = '#7B82A0'
        ctx.font = '12px system-ui'
        ctx.fillText('SPACE or tap to try again', W / 2, H / 2 + 10)
        ctx.restore()
      }

      s.raf = requestAnimationFrame(tick)
    }

    function drawPlayer(ctx: CanvasRenderingContext2D, s: any) {
      const p = s.player
      const bob = p.ground ? Math.sin(s.frame * 0.18) * 2 : 0
      ctx.font = `${PH + 4}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('🏃', p.x - PW / 2, p.y + bob - 2)
    }

    s.raf = requestAnimationFrame(tick)

    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); doJump() } }
    window.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(s.raf); window.removeEventListener('keydown', onKey) }
  }, [doJump])

  return (
    <div
      className="rounded-2xl overflow-hidden glass-accent mt-8"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Ad Manager Run 🎮</p>
          <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>
            Jump over bad settings · collect ROAS, CTR &amp; CPM
          </p>
        </div>
        <div className="flex items-center gap-8">
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

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={doJump}
        className="w-full cursor-pointer block"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  )
}
