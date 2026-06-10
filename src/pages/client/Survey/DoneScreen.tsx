import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchEnterprises, fetchJobsByEnterprise } from '../../../feature/enterprise/api'
import type { Job, Enterprise } from '../../../feature/enterprise/type'

interface JobWithEnterprise extends Job {
  enterpriseName?: string
  enterpriseAbbr?: string
  enterpriseColor?: string
}

// ── Fireworks ─────────────────────────────────────────────────────────────────
function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    type Particle = {
      x: number; y: number; vx: number; vy: number
      alpha: number; color: string; size: number
      decay: number; friction: number; gravity: number; flicker: boolean
    }
    let particles: Particle[] = []

    const PALETTES = [
      ['#FFD700','#FFA500','#FF8C00'],
      ['#FF2A6D','#05D9E8','#ffffff'],
      ['#A78BFA','#F472B6','#F43F5E'],
      ['#34D399','#059669','#6EE7B7'],
      ['#38BDF8','#818CF8','#C084FC'],
    ]

    function burst(x: number, y: number) {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      const count   = 120 + Math.floor(Math.random() * 60)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
        const speed = 1.5 + Math.random() * 6.5
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.8,
          alpha: 1, color: palette[Math.floor(Math.random() * palette.length)],
          size: 1 + Math.random() * 1.8,
          decay: 0.006 + Math.random() * 0.009,
          friction: 0.96, gravity: 0.07,
          flicker: Math.random() > 0.4,
        })
      }
    }

    const fireBursts = () => {
      const P = [[0.25,0.3],[0.75,0.25],[0.5,0.35],[0.15,0.45],[0.85,0.4]]
      P.forEach(([px,py],i) => setTimeout(() => burst(canvas.width*px, canvas.height*py), i*280))
    }
    fireBursts()
    const t2 = setTimeout(fireBursts, 1600)

    function loop() {
      ctx.fillStyle = 'rgba(8,15,26,0.18)'
      ctx.fillRect(0,0,canvas.width,canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay
        if (p.alpha <= 0) { particles.splice(i,1); continue }
        ctx.save()
        let a = p.alpha
        if (p.flicker && p.alpha < 0.7) a = Math.random() > 0.3 ? p.alpha : p.alpha * 0.2
        ctx.globalAlpha = a
        ctx.fillStyle   = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur  = p.alpha * 10
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size*(p.alpha*1.2), 0, Math.PI*2); ctx.fill()
        ctx.restore()
      }
      ctx.globalCompositeOperation = 'source-over'
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(t2); window.removeEventListener('resize', resize) }
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none' }} />
}

// ── Global CSS ─────────────────────────────────────────────────────────────────
const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important; box-sizing: border-box; }

@keyframes floatIdle {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-12px) rotate(0.8deg); }
}
@keyframes giftShake {
  0%,100% { transform: translateX(0) rotate(0); }
  15%  { transform: translateX(-9px) rotate(-4deg); }
  30%  { transform: translateX(7px) rotate(3deg); }
  50%  { transform: translateX(-5px) rotate(-2deg); }
  70%  { transform: translateX(3px) rotate(1deg); }
  85%  { transform: translateX(-1px) rotate(-0.3deg); }
}
@keyframes lidFly {
  0%   { transform: translateY(0) rotate(0) scale(1); opacity:1; }
  25%  { transform: translateY(-24px) rotate(-8deg) scale(1.04); opacity:1; }
  100% { transform: translateY(-180px) rotate(-38deg) scale(0.7); opacity:0; filter:blur(3px); }
}
@keyframes bowFly {
  0%   { transform: translateX(-50%) translateY(0) scale(1); opacity:1; }
  100% { transform: translateX(-50%) translateY(-150px) scale(0.2); opacity:0; }
}
@keyframes dotBurst {
  0%   { opacity:1; transform: translate(0,0) scale(1); }
  100% { opacity:0; transform: translate(var(--bx),var(--by)) scale(0.2); }
}
@keyframes cardsRise {
  0%   { opacity:0; transform: translateY(48px) scale(0.97); }
  60%  { opacity:1; }
  100% { opacity:1; transform: translateY(0) scale(1); }
}
@keyframes cardIn {
  0%   { opacity:0; transform: translateY(20px); }
  100% { opacity:1; transform: translateY(0); }
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
@keyframes glowPulse {
  0%,100% { opacity:0.25; transform: scale(1); }
  50%      { opacity:0.45; transform: scale(1.1); }
}
@keyframes hintPop {
  0%,100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-3px) scale(1.02); }
}

.gift-idle  { animation: floatIdle 3.5s ease-in-out infinite; }
.gift-shake { animation: giftShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
.lid-fly    { animation: lidFly 0.7s cubic-bezier(0.2, 1, 0.4, 1) forwards; }
.bow-fly    { animation: bowFly 0.55s cubic-bezier(0.2, 1, 0.4, 1) forwards; }
.hint-pop   { animation: hintPop 2.5s ease-in-out infinite; }

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

.job-card {
  background: rgba(15, 26, 46, 0.6);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  display: flex; flex-direction: column;
  overflow: hidden; cursor: pointer; position: relative;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
              border-color 0.25s ease;
}
.job-card::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 90% 10%, var(--eg, rgba(29,158,117,0.18)) 0%, transparent 65%);
  opacity: 0; transition: opacity 0.35s ease; pointer-events: none; z-index: 0;
}
.job-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 28px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08) !important;
}
.job-card:hover::after { opacity: 1; }
.job-card:hover .cta-btn {
  background: var(--ec, #1D9E75) !important;
  color: #fff !important; border-color: transparent !important;
  letter-spacing: 0.2px;
}

.skeleton-shimmer { position: relative; overflow: hidden; }
.skeleton-shimmer::after {
  content: ''; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
  animation: shimmer 1.6s infinite;
}
`

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-shimmer" style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 20, padding: 24, height: 200,
    }}>
      <div style={{ height:11, width:'32%', background:'rgba(255,255,255,0.05)', borderRadius:6, marginBottom:14 }}/>
      <div style={{ height:20, width:'80%', background:'rgba(255,255,255,0.07)', borderRadius:6, marginBottom:10 }}/>
      <div style={{ height:13, width:'52%', background:'rgba(255,255,255,0.04)', borderRadius:6, marginBottom:22 }}/>
      <div style={{ display:'flex', gap:8 }}>
        <div style={{ height:24, width:72, borderRadius:10, background:'rgba(255,255,255,0.03)' }}/>
        <div style={{ height:24, width:88, borderRadius:10, background:'rgba(255,255,255,0.03)' }}/>
      </div>
    </div>
  )
}

// ── JobCard ───────────────────────────────────────────────────────────────────
function JobCard({ job, delay=0 }: { job: JobWithEnterprise; delay?: number }) {
  const fmt = (s: string|null) => {
    if (!s) return null
    const d = new Date(s)
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }

  const color = job.enterpriseColor ?? '#1D9E75'
  const getRgb = (hex: string) => {
    const fb = {r:29,g:158,b:117}
    if (!hex || hex.length < 7) return fb
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
    return isNaN(r)||isNaN(g)||isNaN(b) ? fb : {r,g,b}
  }
  const {r,g,b} = getRgb(color)

  return (
    <div
      className="job-card"
      style={{
        animation: `cardIn 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        boxShadow: `0 12px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)`,
        ['--ec' as any]: color,
        ['--eg' as any]: `rgba(${r},${g},${b},0.22)`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 44px rgba(${r},${g},${b},0.14), inset 0 1px 0 rgba(255,255,255,0.1)`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)`}
    >
      {/* Accent strip */}
      <div style={{ height:3, background:`linear-gradient(90deg, ${color}, transparent)`, opacity:0.7 }}/>

      <div style={{ padding:'20px 22px 16px', flex:1, display:'flex', flexDirection:'column', gap:10, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
          <span style={{ fontSize:11, fontWeight:700, color, letterSpacing:'0.7px', textTransform:'uppercase', lineHeight:1 }}>
            {job.enterpriseName}
          </span>
          {job.deadline && (
            <span style={{ fontSize:11, fontWeight:600, color:'#fb923c', background:'rgba(251,146,60,0.1)', border:'1px solid rgba(251,146,60,0.2)', borderRadius:7, padding:'3px 9px', flexShrink:0 }}>
              {fmt(job.deadline)}
            </span>
          )}
        </div>

        <div style={{ fontSize:16, fontWeight:700, color:'#f8fafc', lineHeight:1.4, flex:1 }}>
          {job.title}
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
          {job.location && (
            <span style={{ fontSize:11.5, padding:'4px 11px', background:'rgba(255,255,255,0.04)', color:'#cbd5e1', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, display:'inline-flex', alignItems:'center', gap:5 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location}
            </span>
          )}
          {job.salary && (
            <span style={{ fontSize:11.5, padding:'4px 11px', background:`rgba(${r},${g},${b},0.1)`, color, border:`1px solid rgba(${r},${g},${b},0.2)`, borderRadius:10, fontWeight:600, display:'inline-flex', alignItems:'center', gap:5 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              {job.salary}
            </span>
          )}
          {job.tags?.slice(0,1).map(tag => (
            <span key={tag} style={{ fontSize:11, padding:'4px 10px', background:'rgba(255,255,255,0.02)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.04)', borderRadius:10 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding:'12px 22px 16px', borderTop:'1px solid rgba(255,255,255,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(8,15,28,0.3)', position:'relative', zIndex:1 }}>
        <span style={{ fontSize:11, color:'rgba(148,163,184,0.7)' }}>
          {job.postedAt ? `Đăng ${fmt(job.postedAt)}` : ''}
        </span>
        <span className="cta-btn" style={{ fontSize:11.5, padding:'6px 14px', background:'rgba(255,255,255,0.05)', color:'#e2e8f0', borderRadius:9, fontWeight:600, border:'1px solid rgba(255,255,255,0.07)', transition:'all 0.25s ease', cursor:'pointer' }}>
          Xem chi tiết →
        </span>
      </div>
    </div>
  )
}

// ── GiftBox ───────────────────────────────────────────────────────────────────
const DOT_COLORS = ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#F97316','#EC4899']

function GiftBox({ jobs, loading }: { jobs: JobWithEnterprise[]; loading: boolean }) {
  const [clicks, setClicks] = useState(0)
  const [phase,  setPhase]  = useState<'idle'|'shaking'|'opening'|'open'>('idle')
  const sceneRef    = useRef<HTMLDivElement>(null)
  const giftRef     = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (phase === 'open' || phase === 'opening') return
    const next = clicks + 1
    setClicks(next)
    if (next < 3) {
      setPhase('shaking')
      setTimeout(() => setPhase('idle'), 520)
    } else {
      setPhase('opening')
      launchDots()
      setTimeout(() => setPhase('open'), 420)
    }
  }

  const launchDots = () => {
    if (!sceneRef.current || !giftRef.current || !confettiRef.current) return
    const sr = sceneRef.current.getBoundingClientRect()
    const gr = giftRef.current.getBoundingClientRect()
    const cx = gr.left - sr.left + gr.width / 2
    const cy = gr.top  - sr.top  + gr.height / 2
    for (let i = 0; i < 36; i++) {
      const el    = document.createElement('div')
      const size  = 5 + Math.random() * 9
      const angle = (i / 36) * Math.PI * 2 + (Math.random()-0.5) * 0.5
      const dist  = 80 + Math.random() * 130
      el.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        background:${DOT_COLORS[i % DOT_COLORS.length]};
        left:${cx}px; top:${cy}px; opacity:0;
        --bx:${Math.cos(angle)*dist}px;
        --by:${(Math.sin(angle)*dist - 40)}px;
        animation:dotBurst 0.75s cubic-bezier(0.1,0.8,0.3,1) ${i*10}ms forwards;
      `
      confettiRef.current.appendChild(el)
      setTimeout(() => el.remove(), i*10 + 900)
    }
  }

  const isOpen    = phase === 'open'
  const isOpening = phase === 'opening'

  const hintMap = ['Chạm vào hộp quà ✨', 'Lung lay rồi...', 'Thêm một cái nữa!']
  const hintText = hintMap[Math.min(clicks, 2)]

  return (
    <div
      ref={sceneRef}
      style={{
        width:'100%', maxWidth:1100, margin:'0 auto',
        padding:'24px 24px 80px',
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center',
        justifyContent: isOpen ? 'flex-start' : 'center',
        position:'relative', minHeight:'100vh',
      }}
    >
      {/* Dot burst layer */}
      <div ref={confettiRef} style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:10 }} />

      {/* ── GIFT AREA ── */}
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        position: isOpen ? 'absolute' : 'relative',
        top: isOpen ? 20 : undefined,
        zIndex:5,
        opacity:    isOpening||isOpen ? 0.12 : 1,
        transform:  isOpening||isOpen ? 'scale(0.55) translateY(-30px)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: isOpen ? 'none' : 'auto',
      }}>
        {/* Ambient glow ring */}
        {!isOpen && (
          <div style={{
            position:'absolute', width:280, height:280, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
            top:-60, zIndex:0, pointerEvents:'none',
            animation:'glowPulse 3s ease-in-out infinite',
          }}/>
        )}

        <div
          ref={giftRef}
          className={phase==='idle' ? 'gift-idle' : phase==='shaking' ? 'gift-shake' : ''}
          onClick={handleClick}
          style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', userSelect:'none', zIndex:2 }}
        >
          {/* Bow */}
          <div
            className={isOpening||isOpen ? 'bow-fly' : ''}
            style={{ position:'absolute', top:-28, left:'50%', transform:'translateX(-50%)', width:72, height:38, zIndex:4 }}
          >
            <svg width="72" height="38" viewBox="0 0 72 38" fill="none">
              <defs>
                <linearGradient id="bl" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A"/>
                  <stop offset="100%" stopColor="#F59E0B"/>
                </linearGradient>
                <linearGradient id="br" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A"/>
                  <stop offset="100%" stopColor="#D97706"/>
                </linearGradient>
                <linearGradient id="bk" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D"/>
                  <stop offset="100%" stopColor="#92400E"/>
                </linearGradient>
              </defs>
              <path d="M36 24C18 4 2 10 6 21C9 30 24 26 36 24Z" fill="url(#bl)"/>
              <path d="M36 24C54 4 70 10 66 21C63 30 48 26 36 24Z" fill="url(#br)"/>
              <ellipse cx="36" cy="22" rx="9" ry="9" fill="url(#bk)"/>
              <ellipse cx="36" cy="22" rx="5" ry="5" fill="#FCD34D" opacity="0.6"/>
            </svg>
          </div>

          {/* Lid */}
          <div
            className={isOpening||isOpen ? 'lid-fly' : ''}
            style={{ width:168, height:44, position:'relative', zIndex:3 }}
          >
            <div style={{
              width:168, height:44,
              background:'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)',
              borderRadius:'10px 10px 3px 3px',
              border:'1px solid rgba(255,255,255,0.12)',
              position:'relative', overflow:'hidden',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <div style={{ position:'absolute', top:0, bottom:0, left:'50%', transform:'translateX(-50%)', width:24, background:'linear-gradient(90deg, #FCD34D, #F59E0B 50%, #FCD34D)' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%)', pointerEvents:'none' }}/>
            </div>
          </div>

          {/* Body */}
          <div style={{
            width:152, height:116,
            background:'linear-gradient(160deg, #DC2626 0%, #7F1D1D 100%)',
            borderRadius:'0 0 16px 16px',
            border:'1px solid rgba(255,255,255,0.08)', borderTop:'none',
            position:'relative', overflow:'hidden',
            boxShadow:'0 20px 40px rgba(185,28,28,0.3), 0 8px 16px rgba(0,0,0,0.4)',
            zIndex:2,
          }}>
            <div style={{ position:'absolute', top:0, bottom:0, left:'50%', transform:'translateX(-50%)', width:24, background:'linear-gradient(90deg, #FCD34D, #F59E0B 50%, #FCD34D)' }}/>
            <div style={{ position:'absolute', left:0, right:0, top:'28%', height:22, background:'linear-gradient(180deg, #FCD34D, #D97706)' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 45%)', pointerEvents:'none', zIndex:1 }}/>
          </div>
        </div>

        {/* Hint pill */}
        <div className="hint-pop" style={{
          marginTop:22, fontSize:13, fontWeight:500,
          color:'#94a3b8', background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:100, padding:'7px 18px',
          letterSpacing:'0.2px',
        }}>
          {hintText}
        </div>
      </div>

      {/* ── JOB CARDS (rise up from below gift) ── */}
      {isOpen && (
        <div
          style={{
            width:'100%', marginTop:80,
            animation:'cardsRise 0.75s cubic-bezier(0.34,1.56,0.64,1) both',
            display:'flex', flexDirection:'column', gap:24, zIndex:2,
          }}
        >
          {/* Section header */}
          <div style={{ textAlign:'center', marginBottom:4 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.18)', borderRadius:100, padding:'5px 16px', marginBottom:16 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span style={{ fontSize:11, fontWeight:700, color:'#34d399', letterSpacing:'0.8px', textTransform:'uppercase' }}>Cơ hội dành riêng cho bạn</span>
            </div>
            <h3 style={{ fontSize:28, fontWeight:800, color:'#f8fafc', margin:'0 0 8px', letterSpacing:'-0.5px' }}>
              Các vị trí đang tuyển dụng
            </h3>
            <p style={{ fontSize:14, color:'rgba(148,163,184,0.8)', margin:0 }}>
              Từ các doanh nghiệp đối tác của Học viện Nông nghiệp Việt Nam
            </p>
          </div>

          {loading ? (
            <div className="jobs-grid">{[1,2,3].map(i => <SkeletonCard key={i}/>)}</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign:'center', padding:'64px 24px', background:'rgba(255,255,255,0.01)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:20, color:'#475569', fontSize:15 }}>
              Hiện chưa có vị trí mới nào đang mở. Vui lòng quay lại sau!
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job,i) => <JobCard key={job.id} job={job} delay={i*70}/>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── DoneScreen ────────────────────────────────────────────────────────────────
export function DoneScreen() {
  useParams<{ id: string }>()
  const [jobs,      setJobs]      = useState<JobWithEnterprise[]>([])
  const [loading,   setLoading]   = useState(true)
  const [fireworks, setFireworks] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setFireworks(false), 3500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const enterprises: Enterprise[] = await fetchEnterprises({ size: 50 })
        const all: JobWithEnterprise[]  = []
        await Promise.all(enterprises.map(async ent => {
          const list = await fetchJobsByEnterprise(ent.id)
          list.filter(j => j.status === 'active').forEach(j => all.push({
            ...j, enterpriseName: ent.name, enterpriseAbbr: ent.abbr, enterpriseColor: ent.color,
          }))
        }))
        all.sort((a,b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        if (mounted) setJobs(all.slice(0,6))
      } catch (err) {
        console.error('DoneScreen load error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div style={{
      minHeight:'100vh',
      backgroundImage:`linear-gradient(rgba(6,12,22,0.88), rgba(6,12,22,0.94)),
        url("https://sohanews.sohacdn.com/160588918557773824/2022/7/29/3-hoc-vien-nong-nghiep-viet-nam-16591074415901730271303.jpg")`,
      backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed',
      overflowX:'hidden', display:'flex', flexDirection:'column', width:'100%',
    }}>
      <style>{GLOBAL_STYLE}</style>
      <Fireworks active={fireworks}/>
      <GiftBox jobs={jobs} loading={loading}/>
    </div>
  )
}