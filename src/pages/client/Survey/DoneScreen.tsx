import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { fetchEnterprises, fetchJobsByEnterprise } from '../../../feature/enterprise/api'
import type { Job, Enterprise } from '../../../feature/enterprise/type'

interface JobWithEnterprise extends Job {
  enterpriseName?: string
  enterpriseAbbr?: string
  enterpriseColor?: string
}

interface ApplyFormData {
  fullName: string
  email: string
  phone: string
  message: string
}

async function submitApplication(jobId: string, data: ApplyFormData) {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/job-applications`, {
    jobId,
    ...data,
  })
  return res.data
}

//  Fireworks ─
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
      decay: number; friction: number; gravity: number
    }
    type Rocket = {
      x: number; y: number; vx: number; vy: number
      targetY: number; color: string
    }
    let particles: Particle[] = []
    let rockets: Rocket[] = []

    const PALETTES = [
      ['#FDE68A','#FCA5A5','#FFFFFF'],
      ['#BFDBFE','#C7D2FE','#FFFFFF'],
      ['#A7F3D0','#BBF7D0','#FFFFFF'],
      ['#FBCFE8','#FDE2E4','#FFFFFF'],
    ]

    function burst(x: number, y: number, color: string) {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      const count   = 40 + Math.floor(Math.random() * 20)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
        const speed = 0.8 + Math.random() * 2.4
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          alpha: 0.85, color: Math.random() > 0.5 ? color : palette[Math.floor(Math.random() * palette.length)],
          size: 0.8 + Math.random() * 1.4,
          decay: 0.008 + Math.random() * 0.01,
          friction: 0.97, gravity: 0.035,
        })
      }
    }

    function launch(fromLeft: boolean) {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      const startX = fromLeft
        ? canvas.width * (0.05 + Math.random() * 0.08)
        : canvas.width * (0.87 + Math.random() * 0.08)
      rockets.push({
        x: startX, y: canvas.height,
        vx: (fromLeft ? 1 : -1) * (0.5 + Math.random() * 0.7),
        vy: -(5 + Math.random() * 2),
        targetY: canvas.height * (0.25 + Math.random() * 0.25),
        color: palette[0],
      })
    }

    const fireRockets = () => {
      ;[true,false,true,false].forEach((fromLeft,i) => setTimeout(() => launch(fromLeft), i*850))
    }
    fireRockets()
    const t2 = setTimeout(fireRockets, 2600)

    function loop() {
      ctx.fillStyle = 'rgba(8,15,26,0.14)'
      ctx.fillRect(0,0,canvas.width,canvas.height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = rockets.length-1; i >= 0; i--) {
        const r = rockets[i]
        r.x += r.vx; r.y += r.vy; r.vy += 0.02
        if (r.y <= r.targetY || r.vy >= 0) {
          burst(r.x, r.y, r.color)
          rockets.splice(i,1); continue
        }
        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.fillStyle   = r.color
        ctx.shadowColor = r.color
        ctx.shadowBlur  = 6
        ctx.beginPath(); ctx.arc(r.x, r.y, 1.6, 0, Math.PI*2); ctx.fill()
        ctx.restore()
      }

      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay
        if (p.alpha <= 0) { particles.splice(i,1); continue }
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle   = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur  = p.alpha * 6
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size*(p.alpha*1.1), 0, Math.PI*2); ctx.fill()
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

//  Global CSS ─
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
@keyframes giftFade {
  0%   { opacity:1; transform: scale(1); }
  100% { opacity:0; transform: scale(0.6) translateY(-20px); }
}
@keyframes glowPulse {
  0%,100% { opacity:0.25; transform: scale(1); }
  50%      { opacity:0.45; transform: scale(1.1); }
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
@keyframes heroIn {
  0%   { opacity:0; transform: translateY(-16px); }
  100% { opacity:1; transform: translateY(0); }
}
@keyframes checkPop {
  0%   { transform: scale(0); opacity:0; }
  60%  { transform: scale(1.12); opacity:1; }
  100% { transform: scale(1); opacity:1; }
}
@keyframes checkDraw {
  from { stroke-dashoffset: 32; }
  to   { stroke-dashoffset: 0; }
}
@keyframes ringPulse {
  0%   { box-shadow: 0 0 0 0 rgba(52,211,153,0.35); }
  100% { box-shadow: 0 0 0 22px rgba(52,211,153,0); }
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
.gift-fade  { animation: giftFade 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }

.hero-in     { animation: heroIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
.check-pop   { animation: checkPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both, ringPulse 1.8s ease-out 0.75s; }
.check-path  { stroke-dasharray: 32; stroke-dashoffset: 32; animation: checkDraw 0.5s ease-out 0.45s forwards; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22);
  border-radius: 100px; padding: 6px 16px; margin-bottom: 22px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;
  color: rgba(255,255,255,0.9);
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

.job-card {
  background: #ffffff;
  border: 1px solid rgba(255,255,255,0.6);
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
  background: radial-gradient(ellipse at 90% 10%, var(--eg, rgba(29,158,117,0.14)) 0%, transparent 65%);
  opacity: 0; transition: opacity 0.35s ease; pointer-events: none; z-index: 0;
}
.job-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(6,40,30,0.22) !important;
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
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
  animation: shimmer 1.6s infinite;
}
`

//  Skeleton 
function SkeletonCard() {
  return (
    <div className="skeleton-shimmer" style={{
      background: '#ffffff', border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: 20, padding: 24, height: 200,
    }}>
      <div style={{ height:11, width:'32%', background:'rgba(15,23,42,0.06)', borderRadius:6, marginBottom:14 }}/>
      <div style={{ height:20, width:'80%', background:'rgba(15,23,42,0.08)', borderRadius:6, marginBottom:10 }}/>
      <div style={{ height:13, width:'52%', background:'rgba(15,23,42,0.05)', borderRadius:6, marginBottom:22 }}/>
      <div style={{ display:'flex', gap:8 }}>
        <div style={{ height:24, width:72, borderRadius:10, background:'rgba(15,23,42,0.04)' }}/>
        <div style={{ height:24, width:88, borderRadius:10, background:'rgba(15,23,42,0.04)' }}/>
      </div>
    </div>
  )
}

// ApplyModal
function ApplyModal({ job, onClose }: { job: JobWithEnterprise; onClose: () => void }) {
  const [form, setForm] = useState<ApplyFormData>({ fullName: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof ApplyFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) return
    setStatus('loading')
    try {
      await submitApplication(job.id, form)
      setStatus('success')
    } catch {
      setErrorMsg('Gửi không thành công, vui lòng thử lại.')
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 13px', borderRadius: 10,
    border: '1.5px solid rgba(15,23,42,0.12)', fontSize: 13,
    background: '#f8fafc', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, display: 'block',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(8,15,26,0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480,
        boxShadow: '0 32px 64px rgba(0,0,0,0.25)', overflow: 'hidden',
        animation: 'heroIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1D9E75, #15805f)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 4 }}>
                {job.enterpriseName}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                {job.title}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ×
            </button>
          </div>
          {(job.location || job.salary) && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {job.location && <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 10px', borderRadius: 8 }}>{job.location}</span>}
              {job.salary && <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 10px', borderRadius: 8 }}>{job.salary}</span>}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 20px' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#34d399,#059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Đã gửi hồ sơ!</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                Doanh nghiệp sẽ liên hệ với bạn qua email hoặc số điện thoại đã cung cấp.
              </div>
              <button onClick={onClose} style={{ marginTop: 20, padding: '10px 28px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} placeholder="Nguyễn Văn A" value={form.fullName} onChange={set('fullName')} required />
              </div>
              <div>
                <label style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} type="email" placeholder="example@gmail.com" value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label style={labelStyle}>Số điện thoại <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} placeholder="0912 345 678" value={form.phone} onChange={set('phone')} required />
              </div>
              <div>
                <label style={labelStyle}>Lời nhắn <span style={{ color: '#94a3b8', fontWeight: 400 }}>(tùy chọn)</span></label>
                <textarea style={{ ...inputStyle, resize: 'none', height: 90 }} placeholder="Giới thiệu ngắn về bản thân hoặc lý do ứng tuyển..." value={form.message} onChange={set('message')} />
              </div>
              {status === 'error' && (
                <div style={{ fontSize: 12, color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: 8 }}>{errorMsg}</div>
              )}
              <button type="submit" disabled={status === 'loading'} style={{
                padding: '12px', background: status === 'loading' ? '#94a3b8' : '#1D9E75',
                color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700,
                fontSize: 14, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}>
                {status === 'loading' ? 'Đang gửi...' : 'Gửi hồ sơ ứng tuyển'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

//  JobCard ─
function JobCard({ job, delay=0, onApply }: { job: JobWithEnterprise; delay?: number; onApply: (job: JobWithEnterprise) => void }) {
  const fmt = (s: string|null) => {
    if (!s) return null
    const d = new Date(s)
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }

  const color = '#1D9E75'
  const {r,g,b} = {r:29,g:158,b:117}

  return (
    <div
      className="job-card"
      style={{
        animation: `cardIn 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        boxShadow: `0 12px 28px rgba(6,40,30,0.12)`,
        ['--ec' as any]: color,
        ['--eg' as any]: `rgba(${r},${g},${b},0.14)`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 24px 48px rgba(${r},${g},${b},0.22)`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 12px 28px rgba(6,40,30,0.12)`}
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

        <div style={{ fontSize:16, fontWeight:700, color:'#0f172a', lineHeight:1.4, flex:1 }}>
          {job.title}
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
          {job.location && (
            <span style={{ fontSize:11.5, padding:'4px 11px', background:'rgba(15,23,42,0.04)', color:'#475569', border:'1px solid rgba(15,23,42,0.06)', borderRadius:10, display:'inline-flex', alignItems:'center', gap:5 }}>
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
            <span key={tag} style={{ fontSize:11, padding:'4px 10px', background:'rgba(15,23,42,0.03)', color:'#94a3b8', border:'1px solid rgba(15,23,42,0.05)', borderRadius:10 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding:'12px 22px 16px', borderTop:'1px solid rgba(15,23,42,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(15,23,42,0.02)', position:'relative', zIndex:1 }}>
        <span style={{ fontSize:11, color:'#94a3b8' }}>
          {job.postedAt ? `Đăng ${fmt(job.postedAt)}` : ''}
        </span>
        <span className="cta-btn" onClick={() => onApply(job)} style={{ fontSize:11.5, padding:'6px 14px', background:'rgba(15,23,42,0.04)', color:'#334155', borderRadius:9, fontWeight:600, border:'1px solid rgba(15,23,42,0.07)', transition:'all 0.25s ease', cursor:'pointer' }}>
          Ứng tuyển →
        </span>
      </div>
    </div>
  )
}

//  SuccessHero ─
function SuccessHero() {
  return (
    <div className="hero-in" style={{
      width:'100%', maxWidth:680, margin:'0 auto', textAlign:'center',
      padding:'72px 24px 8px', position:'relative', zIndex:2,
    }}>
      <span className="hero-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z"/> */}
        </svg>
        Học viện Nông nghiệp Việt Nam
      </span>

      <div className="check-pop" style={{
        width:84, height:84, margin:'0 auto 26px', borderRadius:'50%',
        background:'linear-gradient(160deg, rgba(52,211,153,0.22), rgba(52,211,153,0.04))',
        border:'1px solid rgba(52,211,153,0.35)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <img src="/logovua.png" alt="Logo" style={{ width:48, height:48, objectFit:'contain' }}/>
        {/* <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path className="check-path" d="M20 6L9 17l-5-5"/>
        </svg> */}
      </div>

      <h1 style={{ fontSize:34, fontWeight:800, color:'#f8fafc', margin:'0 0 14px', letterSpacing:'-0.5px', lineHeight:1.25 }}>
        Cảm ơn bạn đã hoàn thành khảo sát!
      </h1>
      <p style={{ fontSize:15, color:'rgba(203,213,225,0.85)', margin:'0 auto', maxWidth:520, lineHeight:1.75 }}>
        Mỗi câu trả lời của bạn đều góp phần giúp Học viện nâng cao chất lượng đào tạo
        và kết nối tốt hơn với cộng đồng cựu sinh viên. Cảm ơn bạn đã dành thời gian!
      </p>
    </div>
  )
}

//  GiftBox ─
const DOT_COLORS = ['#EF4444','#F59E0B','#3B82F6','#A855F7','#EC4899','#FFFFFF','#FDE68A']

function GiftBox({ jobs, loading }: { jobs: JobWithEnterprise[]; loading: boolean }) {
  const [clicks, setClicks] = useState(0)
  const [phase,  setPhase]  = useState<'idle'|'shaking'|'opening'|'open'>('idle')
  const [applyJob, setApplyJob] = useState<JobWithEnterprise | null>(null)
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
        position:'relative', minHeight:'62vh',
      }}
    >
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

      {/* Dot burst layer */}
      <div ref={confettiRef} style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:10 }} />

      {/*  GIFT AREA  */}
      {!isOpen && (
        <div
          className={isOpening ? 'gift-fade' : ''}
          style={{
            display:'flex', flexDirection:'column', alignItems:'center',
            position:'relative', zIndex:5,
          }}
        >
          {/* Ambient glow ring */}
          <div style={{
            position:'absolute', width:280, height:280, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(252,211,77,0.25) 0%, transparent 70%)',
            top:-60, zIndex:0, pointerEvents:'none',
            animation:'glowPulse 3s ease-in-out infinite',
          }}/>

          <div
            ref={giftRef}
            className={phase==='idle' ? 'gift-idle' : phase==='shaking' ? 'gift-shake' : ''}
            onClick={handleClick}
            style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', userSelect:'none', zIndex:2 }}
          >
            {/* Bow */}
            <div
              className={isOpening ? 'bow-fly' : ''}
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
              className={isOpening ? 'lid-fly' : ''}
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
              background:'linear-gradient(160deg, #F87171 0%, #B91C1C 100%)',
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
            color:'#ffffff', background:'rgba(255,255,255,0.12)',
            border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:100, padding:'7px 18px',
            letterSpacing:'0.2px',
          }}>
            {hintText}
          </div>
        </div>
      )}

      {/*  JOB CARDS  */}
      {isOpen && (
        <div
          style={{
            width:'100%', marginTop:24,
            animation:'cardsRise 0.75s cubic-bezier(0.34,1.56,0.64,1) both',
            display:'flex', flexDirection:'column', gap:24, zIndex:2,
          }}
        >
          {/* Section header */}
          <div style={{ textAlign:'center', marginBottom:4 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:100, padding:'5px 16px', marginBottom:16 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span style={{ fontSize:11, fontWeight:700, color:'#ffffff', letterSpacing:'0.8px', textTransform:'uppercase' }}>Cơ hội dành riêng cho bạn</span>
            </div>
            <h3 style={{ fontSize:28, fontWeight:800, color:'#f8fafc', margin:'0 0 8px', letterSpacing:'-0.5px' }}>
              Các vị trí đang tuyển dụng
            </h3>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.8)', margin:0 }}>
              Từ các doanh nghiệp đối tác của Học viện Nông nghiệp Việt Nam
            </p>
          </div>

          {loading ? (
            <div className="jobs-grid">{[1,2,3].map(i => <SkeletonCard key={i}/>)}</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign:'center', padding:'64px 24px', background:'rgba(255,255,255,0.06)', border:'1px dashed rgba(255,255,255,0.2)', borderRadius:20, color:'rgba(255,255,255,0.7)', fontSize:15 }}>
              Hiện chưa có vị trí mới nào đang mở. Vui lòng quay lại sau!
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job,i) => <JobCard key={job.id} job={job} delay={i*70} onApply={setApplyJob}/>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

//  DoneScreen 
export function DoneScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [jobs,      setJobs]      = useState<JobWithEnterprise[]>([])
  const [loading,   setLoading]   = useState(true)
  const [fireworks, setFireworks] = useState(true)

  useEffect(() => {
    if (!sessionStorage.getItem(`survey_done_${id}`)) {
      navigate(`/survey/${id}`, { replace: true })
    }
  }, [id, navigate])

  useEffect(() => {
    const t = setTimeout(() => setFireworks(false), 6000)
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
      background:'linear-gradient(180deg, #1D9E75 0%, #15805f 100%)',
      overflowX:'hidden', display:'flex', flexDirection:'column', width:'100%',
    }}>
      <style>{GLOBAL_STYLE}</style>
      <Fireworks active={fireworks}/>
      <SuccessHero/>
      <GiftBox jobs={jobs} loading={loading}/>
    </div>
  )
}