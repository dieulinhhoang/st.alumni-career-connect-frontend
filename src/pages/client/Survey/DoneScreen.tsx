import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchEnterprises, fetchJobsByEnterprise } from '../../../feature/enterprise/api'
import type { Job, Enterprise } from '../../../feature/enterprise/type'

interface JobWithEnterprise extends Job {
  enterpriseName?: string
  enterpriseAbbr?: string
  enterpriseColor?: string
  enterprise?: Enterprise
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    type Piece = {
      x: number; y: number; vx: number; vy: number
      rot: number; vrot: number; w: number; h: number
      color: string; alpha: number; gravity: number
    }

    const COLORS = ['#1D9E75','#34d399','#FCD34D','#F87171','#60A5FA','#C084FC','#FFFFFF','#FB923C']
    const pieces: Piece[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2.5 + Math.random() * 3.5,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.15,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.85 + Math.random() * 0.15,
      gravity: 0.06 + Math.random() * 0.04,
    }))

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let done = true
      for (const p of pieces) {
        p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.rot += p.vrot
        if (p.y < canvas.height + 20) done = false
        if (p.y > canvas.height + 20) continue
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y); ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      if (!done) rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

// ─── Global Style ──────────────────────────────────────────────────────────────
const STYLE = `
*, *::before, *::after { font-family: 'Inter', system-ui, sans-serif !important; box-sizing: border-box; }

@keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes float     { 0%,100% { transform:translateY(0)rotate(-1deg); } 50% { transform:translateY(-10px)rotate(1deg); } }
@keyframes shake     { 0%,100%{transform:translateX(0)rotate(0)} 20%{transform:translateX(-8px)rotate(-3deg)} 40%{transform:translateX(8px)rotate(3deg)} 60%{transform:translateX(-5px)rotate(-1.5deg)} 80%{transform:translateX(3px)rotate(1deg)} }
@keyframes lidPop    { 0%{transform:translateY(0)rotate(0)scale(1);opacity:1} 30%{transform:translateY(-30px)rotate(-10deg)scale(1.05);opacity:1} 100%{transform:translateY(-220px)rotate(-45deg)scale(0.5);opacity:0} }
@keyframes bowPop    { 0%{transform:translateX(-50%)translateY(0);opacity:1} 100%{transform:translateX(-50%)translateY(-180px)scale(0.2);opacity:0} }
@keyframes burst     { 0%{opacity:1;transform:translate(0,0)scale(1)} 100%{opacity:0;transform:translate(var(--bx),var(--by))scale(0)} }
@keyframes boxFade   { to{opacity:0;transform:scale(0.88)translateY(-16px)} }
@keyframes cardsIn   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes cardSlide { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer   { 100%{transform:translateX(100%)} }
@keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.08)} }
@keyframes badgePop  { from{opacity:0;transform:scale(0.9)translateY(-6px)} to{opacity:1;transform:scale(1)translateY(0)} }

.gift-float  { animation: float 3.2s ease-in-out infinite; }
.gift-shake  { animation: shake 0.45s ease both; }
.lid-pop     { animation: lidPop 0.65s cubic-bezier(0.2,1,0.4,1) forwards; }
.bow-pop     { animation: bowPop 0.5s cubic-bezier(0.2,1,0.4,1) forwards; }
.box-fade    { animation: boxFade 0.4s cubic-bezier(0.4,0,0.2,1) forwards; }

.job-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  display: flex; flex-direction: column;
  overflow: hidden; cursor: default; position: relative;
  transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1), border-color 0.2s;
}
.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 44px rgba(15,23,42,0.11) !important;
  border-color: rgba(29,158,117,0.3);
}
.job-card:hover .apply-btn {
  background: #1D9E75 !important;
  color: #fff !important;
  border-color: transparent !important;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 18px; width: 100%;
}

.skeleton-shimmer { position: relative; overflow: hidden; background: #f1f5f9; }
.skeleton-shimmer::after {
  content:''; position:absolute; inset:0; transform:translateX(-100%);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent);
  animation:shimmer 1.5s infinite;
}

.step-dot { animation: pulseDot 1.8s ease-in-out infinite; }

@media (max-width:600px) {
  .jobs-grid { grid-template-columns: 1fr !important; }
}
`

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-shimmer" style={{ borderRadius: 16, padding: 22, height: 186, border: '1.5px solid #e2e8f0' }}>
      <div style={{ height: 10, width: '30%', background: '#e2e8f0', borderRadius: 6, marginBottom: 14 }}/>
      <div style={{ height: 18, width: '75%', background: '#e2e8f0', borderRadius: 6, marginBottom: 10 }}/>
      <div style={{ height: 12, width: '50%', background: '#e2e8f0', borderRadius: 6, marginBottom: 24 }}/>
      <div style={{ display: 'flex', gap: 8 }}>
        {[64, 80].map(w => <div key={w} style={{ height: 24, width: w, borderRadius: 8, background: '#e2e8f0' }}/>)}
      </div>
    </div>
  )
}

// ─── Job Detail Modal (JD + liên hệ doanh nghiệp) ──────────────────────────────
function JobDetailModal({ job, onClose }: { job: JobWithEnterprise; onClose: () => void }) {
  const ent = job.enterprise
  const contactRows = [
    { label: 'Điện thoại', value: ent?.phone, href: ent?.phone ? `tel:${ent.phone}` : undefined },
    { label: 'Email', value: ent?.email, href: ent?.email ? `mailto:${ent.email}` : undefined },
    { label: 'Website', value: ent?.website, href: ent?.website },
  ].filter(r => r.value)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460, boxShadow: '0 32px 72px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1D9E75,#0f7a57)', padding: '20px 24px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                {job.enterpriseName}
              </p>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{job.title}</h3>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >×</button>
          </div>
          {(job.location || job.salary) && (
            <div style={{ display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>
              {job.location && <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.18)', color: '#fff', padding: '3px 9px', borderRadius: 7 }}>{job.location}</span>}
              {job.salary  && <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.18)', color: '#fff', padding: '3px 9px', borderRadius: 7 }}>{job.salary}</span>}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px 24px' }}>
          {job.tags && job.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {job.tags.map(t => (
                <span key={t} style={{ fontSize: 11.5, padding: '3px 10px', background: '#f1f5f9', color: '#475569', borderRadius: 8 }}>{t}</span>
              ))}
            </div>
          )}

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Liên hệ ứng tuyển
          </div>
          {contactRows.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Doanh nghiệp chưa cập nhật thông tin liên hệ.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contactRows.map(r => (
                <div key={r.label} style={{ display: 'flex', gap: 10, fontSize: 13.5, alignItems: 'baseline' }}>
                  <span style={{ width: 78, flexShrink: 0, color: '#94a3b8', fontWeight: 600 }}>{r.label}</span>
                  {r.href ? (
                    <a href={r.href} target={r.label === 'Website' ? '_blank' : undefined} rel="noreferrer" style={{ color: '#0f7a57', fontWeight: 600, wordBreak: 'break-word' }}>
                      {r.value}
                    </a>
                  ) : (
                    <span style={{ color: '#0f172a', wordBreak: 'break-word' }}>{r.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p style={{ margin: '16px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            Hãy chủ động liên hệ trực tiếp với doanh nghiệp để ứng tuyển vị trí này.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Enterprise Modal ──────────────────────────────────────────────────────────
function EnterpriseModal({ job, onClose }: { job: JobWithEnterprise; onClose: () => void }) {
  const ent = job.enterprise
  const rows = [
    { label: 'Ngành', value: ent?.industry },
    { label: 'Quy mô', value: ent?.size },
    { label: 'Địa chỉ', value: ent?.address },
    { label: 'Điện thoại', value: ent?.phone },
    { label: 'Email', value: ent?.email },
    { label: 'Website', value: ent?.website },
  ].filter(r => r.value)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, boxShadow: '0 32px 72px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ background: 'linear-gradient(135deg,#1D9E75,#0f7a57)', padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{job.enterpriseName}</h3>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >×</button>
          </div>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {ent?.description && (
            <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#475569', lineHeight: 1.7 }}>{ent.description}</p>
          )}
          {rows.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Chưa có thêm thông tin về doanh nghiệp này.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rows.map(r => (
                <div key={r.label} style={{ display: 'flex', gap: 10, fontSize: 13.5 }}>
                  <span style={{ width: 84, flexShrink: 0, color: '#94a3b8', fontWeight: 600 }}>{r.label}</span>
                  <span style={{ color: '#0f172a', wordBreak: 'break-word' }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, delay = 0, onShowDetail, onShowEnterprise }: { job: JobWithEnterprise; delay?: number; onShowDetail: (j: JobWithEnterprise) => void; onShowEnterprise: (j: JobWithEnterprise) => void }) {
  const fmt = (s: string | null) => {
    if (!s) return null
    const d = new Date(s)
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }

  return (
    <div
      className="job-card"
      style={{ animation: `cardSlide 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`, boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: 'linear-gradient(90deg,#1D9E75,#34d399)', flexShrink: 0 }}/>

      <div style={{ padding: '18px 20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span
            onClick={(e) => { e.stopPropagation(); onShowEnterprise(job) }}
            style={{
              fontSize: 11, fontWeight: 800, color: '#0f7a57', textTransform: 'uppercase',
              letterSpacing: '0.5px', lineHeight: 1.2, flex: 1, minWidth: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent',
              textUnderlineOffset: '3px', transition: 'text-decoration-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecorationColor = '#0f7a57' }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecorationColor = 'transparent' }}
            title={`Xem chi tiết ${job.enterpriseName}`}
          >
            {job.enterpriseName}
          </span>
          {job.deadline && (
            <span style={{ fontSize: 10.5, fontWeight: 600, color: '#ea580c', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '2px 8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              Hạn: {fmt(job.deadline)}
            </span>
          )}
        </div>

        <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, flex: 1 }}>
          {job.title}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
          {job.location && (
            <span style={{ fontSize: 11.5, padding: '3px 10px', background: '#f1f5f9', color: '#475569', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location}
            </span>
          )}
          {job.salary && (
            <span style={{ fontSize: 11.5, padding: '3px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {job.salary}
            </span>
          )}
          {job.tags?.slice(0, 1).map(t => (
            <span key={t} style={{ fontSize: 11, padding: '3px 9px', background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 8 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 20px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          {job.postedAt ? `Đăng ${fmt(job.postedAt)}` : ''}
        </span>
        <button
          className="apply-btn"
          onClick={() => onShowDetail(job)}
          style={{ fontSize: 12, padding: '6px 14px', background: '#f8fafc', color: '#334155', border: '1.5px solid #e2e8f0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', transition: 'all 0.22s ease' }}
        >
          Xem & liên hệ →
        </button>
      </div>
    </div>
  )
}

// ─── Gift Box ──────────────────────────────────────────────────────────────────
const BURST_COLORS = ['#1D9E75','#34d399','#FCD34D','#F87171','#60A5FA','#C084FC','#FB923C']

function GiftBox({ jobs, loading }: { jobs: JobWithEnterprise[]; loading: boolean }) {
  const [clicks,   setClicks]   = useState(0)
  const [phase,    setPhase]    = useState<'idle'|'shaking'|'opening'|'open'>('idle')
  const [detailJob, setDetailJob] = useState<JobWithEnterprise | null>(null)
  const [entJob,   setEntJob]   = useState<JobWithEnterprise | null>(null)
  const [search,   setSearch]   = useState('')
  const sceneRef  = useRef<HTMLDivElement>(null)
  const giftRef   = useRef<HTMLDivElement>(null)
  const burstRef  = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (phase === 'open' || phase === 'opening') return
    const next = clicks + 1
    setClicks(next)
    if (next < 3) {
      setPhase('shaking')
      setTimeout(() => setPhase('idle'), 480)
    } else {
      setPhase('opening')
      spawnBurst()
      setTimeout(() => setPhase('open'), 440)
    }
  }

  const spawnBurst = () => {
    if (!sceneRef.current || !giftRef.current || !burstRef.current) return
    const sr = sceneRef.current.getBoundingClientRect()
    const gr = giftRef.current.getBoundingClientRect()
    const cx = gr.left - sr.left + gr.width / 2
    const cy = gr.top  - sr.top  + gr.height / 2
    for (let i = 0; i < 42; i++) {
      const el   = document.createElement('div')
      const size = 6 + Math.random() * 10
      const ang  = (i / 42) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
      const dist = 70 + Math.random() * 140
      el.style.cssText = `
        position:absolute;border-radius:50%;
        width:${size}px;height:${size}px;
        background:${BURST_COLORS[i % BURST_COLORS.length]};
        left:${cx}px;top:${cy}px;opacity:0;pointer-events:none;
        --bx:${Math.cos(ang)*dist}px;--by:${Math.sin(ang)*dist - 50}px;
        animation:burst 0.8s cubic-bezier(0.1,0.8,0.3,1) ${i*8}ms forwards;
      `
      burstRef.current.appendChild(el)
      setTimeout(() => el.remove(), i * 8 + 900)
    }
  }

  const hints = ['Chạm vào hộp quà ✨', 'Đang lung lay rồi...', 'Thêm một cái nữa!']

  const q = search.trim().toLowerCase()
  const filteredJobs = q
    ? jobs.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.enterpriseName?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
      )
    : jobs.slice(0, 6)

  return (
    <>
    <div ref={sceneRef} style={{ position: 'relative', width: '100%', maxWidth: 1080, margin: '0 auto', padding: phase === 'open' ? '0 24px' : '0 24px 80px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: phase === 'open' ? 0 : '50vh' }}>
      {detailJob && <JobDetailModal job={detailJob} onClose={() => setDetailJob(null)} />}
      {entJob && <EnterpriseModal job={entJob} onClose={() => setEntJob(null)} />}
      <div ref={burstRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}/>

      {/* ── Gift area ── */}
      {phase !== 'open' && (
        <div className={phase === 'opening' ? 'box-fade' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5, paddingTop: 8 }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <div
                key={i}
                className={i === clicks ? 'step-dot' : ''}
                style={{
                  width: i < clicks ? 10 : 8, height: i < clicks ? 10 : 8,
                  borderRadius: '50%',
                  background: i < clicks ? '#1D9E75' : i === clicks ? '#1D9E75' : '#e2e8f0',
                  transition: 'all 0.2s',
                  boxShadow: i === clicks ? '0 0 0 4px rgba(29,158,117,0.18)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Gift visual */}
          <div
            ref={giftRef}
            className={phase === 'idle' ? 'gift-float' : phase === 'shaking' ? 'gift-shake' : ''}
            onClick={handleClick}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', userSelect: 'none', filter: 'drop-shadow(0 20px 32px rgba(0,0,0,0.28))' }}
          >
            {/* Bow */}
            <div className={phase === 'opening' ? 'bow-pop' : ''} style={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', width: 80, height: 42, zIndex: 4 }}>
              <svg width="80" height="42" viewBox="0 0 80 42" fill="none">
                <defs>
                  <linearGradient id="bl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/>
                  </linearGradient>
                  <linearGradient id="br" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/>
                  </linearGradient>
                </defs>
                <path d="M40 28C20 6 2 12 6 23C9 33 26 30 40 28Z" fill="url(#bl)"/>
                <path d="M40 28C60 6 78 12 74 23C71 33 54 30 40 28Z" fill="url(#br)"/>
                <ellipse cx="40" cy="26" rx="10" ry="10" fill="#F59E0B"/>
                <ellipse cx="40" cy="26" rx="5.5" ry="5.5" fill="#FDE68A" opacity="0.7"/>
              </svg>
            </div>

            {/* Lid */}
            <div className={phase === 'opening' ? 'lid-pop' : ''} style={{ width: 176, height: 46, position: 'relative', zIndex: 3 }}>
              <div style={{ width: 176, height: 46, background: 'linear-gradient(180deg,#f87171 0%,#dc2626 100%)', borderRadius: '10px 10px 3px 3px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 14px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 22, background: 'linear-gradient(90deg,rgba(255,255,255,0.5),rgba(255,255,255,0.8) 50%,rgba(255,255,255,0.5))' }}/>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.2) 0%,transparent 60%)', pointerEvents: 'none' }}/>
              </div>
            </div>

            {/* Body */}
            <div style={{ width: 160, height: 124, background: 'linear-gradient(160deg,#fca5a5 0%,#ef4444 50%,#b91c1c 100%)', borderRadius: '0 0 16px 16px', borderTop: 'none', position: 'relative', overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,0.3), 0 6px 14px rgba(0,0,0,0.2)', zIndex: 2 }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 22, background: 'linear-gradient(90deg,rgba(255,255,255,0.35),rgba(255,255,255,0.65) 50%,rgba(255,255,255,0.35))' }}/>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '30%', height: 20, background: 'rgba(255,255,255,0.25)' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,rgba(255,255,255,0.18) 0%,transparent 50%)', pointerEvents: 'none', zIndex: 1 }}/>
            </div>
          </div>

          {/* Hint */}
          <p style={{ marginTop: 24, fontSize: 13, fontWeight: 500, color: '#64748b', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 100, padding: '6px 18px', letterSpacing: '0.1px' }}>
            {hints[Math.min(clicks, 2)]}
          </p>
          <button
            onClick={() => setPhase('open')}
            style={{ marginTop: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Bỏ qua, xem ngay →
          </button>
        </div>
      )}
    </div>

    {/* ── Job recommendations sheet ── */}
    {phase === 'open' && (
      <div style={{ width: '100%', boxSizing: 'border-box', marginTop: 28, background: '#f1f5f9', borderRadius: '32px 32px 0 0', boxShadow: '0 -12px 36px rgba(0,0,0,0.12)', animation: 'cardsIn 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 64px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 100, padding: '5px 16px', marginBottom: 14, animation: 'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', letterSpacing: '0.7px', textTransform: 'uppercase' }}>Cơ hội dành riêng cho bạn</span>
            </span>
            <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
              Các vị trí đang tuyển dụng
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              Từ các doanh nghiệp đối tác của Học viện Nông nghiệp Việt Nam
            </p>
          </div>

          {!loading && jobs.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm theo vị trí, doanh nghiệp, địa điểm..."
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 38px',
                    fontSize: 13.5, border: '1.5px solid #e2e8f0', borderRadius: 12,
                    background: '#fff', color: '#0f172a', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {loading ? (
            <div className="jobs-grid">{[1,2,3].map(i => <SkeletonCard key={i}/>)}</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 24px', background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 16, color: '#94a3b8', fontSize: 14 }}>
              Hiện chưa có vị trí mới nào đang mở. Vui lòng quay lại sau!
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 24px', background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 16, color: '#94a3b8', fontSize: 14 }}>
              Không tìm thấy vị trí phù hợp với "{search}".
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job, i) => <JobCard key={job.id} job={job} delay={i * 65} onShowDetail={setDetailJob} onShowEnterprise={setEntJob}/>)}
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '72px 24px 16px', position: 'relative', zIndex: 2, animation: 'fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both' }}>
      {/* School badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100, padding: '5px 16px 5px 8px', marginBottom: 28 }}>
        <img src="/logovua.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: '50%' }}/>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.4px' }}>
          Học viện Nông nghiệp Việt Nam
        </span>
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', margin: '28px 0 14px', letterSpacing: '-0.6px', lineHeight: 1.2, textShadow: '0 2px 20px rgba(0,0,0,0.12)' }}>
        Cảm ơn bạn đã hoàn thành khảo sát!
      </h1>
      <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.82)', margin: '0 auto', maxWidth: 500, lineHeight: 1.75 }}>
        Mỗi câu trả lời của bạn góp phần giúp Học viện nâng cao chất lượng đào tạo
        và kết nối tốt hơn với cộng đồng cựu sinh viên.
      </p>
    </div>
  )
}

// ─── DoneScreen ────────────────────────────────────────────────────────────────
export function DoneScreen() {
  const { id }      = useParams<{ id: string }>()
  const navigate    = useNavigate()
  const [jobs,      setJobs]      = useState<JobWithEnterprise[]>([])
  const [loading,   setLoading]   = useState(true)
  const [confetti,  setConfetti]  = useState(true)

  useEffect(() => {
    if (!sessionStorage.getItem(`survey_done_${id}`)) {
      navigate(`/survey/${id}`, { replace: true })
    }
  }, [id, navigate])

  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 6000)
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
            ...j, enterpriseName: ent.name, enterpriseAbbr: ent.abbr, enterpriseColor: ent.color, enterprise: ent,
          }))
        }))
        all.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        if (mounted) setJobs(all.slice(0, 30))
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
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1D9E75 0%, #15805f 40%, #0f6348 100%)',
      overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <style>{STYLE}</style>
      <Confetti active={confetti}/>
      <Hero/>
      {/* Không có job đang tuyển thì ẩn hẳn hộp quà, chỉ giữ lời cảm ơn */}
      {!loading && jobs.length > 0 && <GiftBox jobs={jobs} loading={loading}/>}
    </div>
  )
}

export default DoneScreen
