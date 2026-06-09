import { useEffect, useState, useRef } from 'react'
import { fetchEnterprises, fetchJobsByEnterprise } from '../../../feature/enterprise/api'
import type { Job, Enterprise } from '../../../feature/enterprise/type'
import type { SurveyBatch } from '../../../feature/alumni/types'

interface JobWithEnterprise extends Job {
  enterpriseName?: string
  enterpriseAbbr?: string
  enterpriseColor?: string
}

interface Props {
  batch?: SurveyBatch | null
}

// ── Fireworks ──────────────────────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#1D9E75', '#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c', '#fff']

    // ── Types ──
    type Spark = {
      x: number; y: number
      vx: number; vy: number
      alpha: number; color: string
      r: number; tail: Array<[number,number]>
    }
    type Rocket = {
      x: number; y: number
      vy: number; targetY: number
      color: string; exploded: boolean
      trail: Array<[number,number]>
    }

    const sparks: Spark[]  = []
    const rockets: Rocket[] = []

    function explode(x: number, y: number, color: string) {
      const count = 60 + Math.floor(Math.random() * 40)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
        const speed = Math.random() * 5 + 1.5
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          r: Math.random() * 2.5 + 1,
          tail: [],
        })
      }
      // secondary sparkles (white)
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.8,
          color: '#fff',
          r: Math.random() * 1.5 + 0.5,
          tail: [],
        })
      }
    }

    function launchRocket() {
      const x = canvas.width * (0.15 + Math.random() * 0.7)
      rockets.push({
        x,
        y: canvas.height,
        vy: -(canvas.height * (0.45 + Math.random() * 0.35)) / 40,
        targetY: canvas.height * (0.15 + Math.random() * 0.35),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        exploded: false,
        trail: [],
      })
    }

    // Launch schedule: burst then trickle
    const launchTimes = [0, 300, 600, 900, 1200, 1800, 2400, 3000, 3800, 4600]
    launchTimes.forEach(t => setTimeout(launchRocket, t))

    let raf: number
    const draw = () => {
      // fade trail
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        if (r.exploded) { rockets.splice(i, 1); continue }
        r.trail.push([r.x, r.y])
        if (r.trail.length > 12) r.trail.shift()
        r.y += r.vy

        // draw trail
        r.trail.forEach(([tx, ty], idx) => {
          const alpha = (idx / r.trail.length) * 0.6
          ctx.beginPath()
          ctx.arc(tx, ty, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,200,80,${alpha})`
          ctx.fill()
        })

        // rocket head
        ctx.beginPath()
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color)
          r.exploded = true
        }
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.tail.push([s.x, s.y])
        if (s.tail.length > 5) s.tail.shift()

        s.x  += s.vx
        s.y  += s.vy
        s.vy += 0.08   // gravity
        s.vx *= 0.98
        s.alpha -= 0.016

        if (s.alpha <= 0) { sparks.splice(i, 1); continue }

        // tail
        if (s.tail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(s.tail[0][0], s.tail[0][1])
          s.tail.forEach(([tx, ty]) => ctx.lineTo(tx, ty))
          ctx.strokeStyle = s.color.replace(')', `,${s.alpha * 0.4})`).replace('rgb', 'rgba').replace('##', '#')
          ctx.lineWidth = s.r * 0.6
          ctx.stroke()
        }

        // particle
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = s.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    const timeout = setTimeout(() => {
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 6000)
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 999,
        background: 'rgba(0,0,0,0.5)',
      }}
    />
  )
}

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '20px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 2px 12px rgba(0,0,0,.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9' }} />
        <div>
          <div style={{ width: 80, height: 10, borderRadius: 4, background: '#f1f5f9', marginBottom: 6 }} />
          <div style={{ width: 55, height: 8, borderRadius: 4, background: '#f8fafc' }} />
        </div>
      </div>
      <div style={{ height: 14, width: '75%', background: '#f1f5f9', borderRadius: 4, marginBottom: 10 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ height: 20, width: 60, borderRadius: 99, background: '#f0fdf4' }} />
        <div style={{ height: 20, width: 72, borderRadius: 99, background: '#fffbeb' }} />
      </div>
    </div>
  )
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: JobWithEnterprise }) {
  const [hovered, setHovered] = useState(false)

  const formatDate = (s: string | null) => {
    if (!s) return null
    const d = new Date(s)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  }

  const color = job.enterpriseColor ?? '#1D9E75'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px',
        border: `1.5px solid ${hovered ? color + '55' : '#f1f5f9'}`,
        boxShadow: hovered
          ? `0 8px 24px ${color}18`
          : '0 2px 12px rgba(0,0,0,.05)',
        display: 'flex', flexDirection: 'column', gap: 10,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Header: logo + company */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff',
          letterSpacing: '0.5px',
          boxShadow: `0 4px 10px ${color}40`,
        }}>
          {job.enterpriseAbbr?.slice(0, 2).toUpperCase() ?? '??'}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>
            {job.enterpriseName}
          </div>
          {job.postedAt && (
            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
              Đăng {formatDate(job.postedAt)}
            </div>
          )}
        </div>
      </div>

      {/* Job title */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.35 }}>
        {job.title}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {job.location && (
          <span style={{
            fontSize: 11, padding: '3px 9px',
            background: '#f0fdf4', color: '#15803d',
            borderRadius: 99, border: '1px solid #bbf7d0', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
        )}
        {job.salary && (
          <span style={{
            fontSize: 11, padding: '3px 9px',
            background: '#fffbeb', color: '#92400e',
            borderRadius: 99, border: '1px solid #fde68a', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {job.salary}
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {job.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: '2px 8px',
              background: '#f8fafc', color: '#6b7280',
              borderRadius: 99, border: '1px solid #e5e7eb',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 'auto', paddingTop: 10,
        borderTop: '1px solid #f3f4f6',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {job.deadline ? (
          <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Hạn nộp: {formatDate(job.deadline)}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#9ca3af' }}>Không có hạn chót</span>
        )}
        <span style={{
          fontSize: 11, padding: '3px 10px',
          background: hovered ? color : '#f3f4f6',
          color: hovered ? '#fff' : '#6b7280',
          borderRadius: 99, fontWeight: 600,
          transition: 'all 0.2s',
        }}>
          Xem chi tiết →
        </span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function DoneScreen({ batch: _batch }: Props) {
  const [jobs, setJobs]         = useState<JobWithEnterprise[]>([])
  const [loading, setLoading]   = useState(true)
  const [showConfetti, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 6200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    async function loadJobs() {
      try {
        const enterprises: Enterprise[] = await fetchEnterprises({ size: 50 })
        const allJobs: JobWithEnterprise[] = []
        await Promise.all(
          enterprises.map(async (ent) => {
            const entJobs = await fetchJobsByEnterprise(ent.id)
            entJobs
              .filter(j => j.status === 'active')
              .forEach(j => allJobs.push({
                ...j,
                enterpriseName:  ent.name,
                enterpriseAbbr:  ent.abbr,
                enterpriseColor: ent.color,
              }))
          })
        )
        allJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        setJobs(allJobs.slice(0, 6))
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0fdf7 0%, #f8fafc 60%, #eff6ff 100%)',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: '48px 16px 64px',
    }}>
      {showConfetti && <Confetti />}

      {/* ── Hero card ── */}
      <div style={{
        maxWidth: 480, margin: '0 auto 56px',
        background: '#fff',
        borderRadius: 24,
        padding: '52px 40px 44px',
        boxShadow: '0 16px 48px rgba(0,0,0,.09)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative ring */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, #1D9E7515 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, #60a5fa10 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D9E75, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 12px 32px #1D9E7545',
        }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
          Đã gửi thành công!
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: '0 0 24px' }}>
          Cảm ơn Anh/Chị đã hoàn thành phiếu khảo sát.<br />
          Thông tin đã được ghi nhận và sẽ được sử dụng<br />
          để cải thiện chương trình đào tạo của nhà trường.
        </p>

        {/* Steps */}
        <div style={{
          display: 'flex', gap: 0,
          background: '#f8fafc', borderRadius: 12,
          padding: '16px 20px',
          textAlign: 'left',
        }}>
          {[
            {
              svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
              label: 'Phiếu đã ghi nhận',
            },
            {
              svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              label: 'Phân tích dữ liệu',
            },
            {
              svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
              label: 'Cải thiện đào tạo',
            },
          ].map((step, i, arr) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
              {i < arr.length - 1 && (
                <div style={{
                  position: 'absolute', top: 13, left: '50%', right: '-50%',
                  height: 2, background: '#e2e8f0', zIndex: 0,
                }} />
              )}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i === 0 ? '#1D9E75' : '#e2e8f0',
                color: i === 0 ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
              }}>
                {step.svg}
              </div>
              <span style={{ fontSize: 10, color: '#64748b', textAlign: 'center', lineHeight: 1.3 }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Jobs section ── */}
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#f0fdf4', borderRadius: 99, padding: '4px 14px',
            marginBottom: 10, border: '1px solid #bbf7d0',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              Cơ hội việc làm dành cho bạn
            </span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Các vị trí đang tuyển dụng
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Từ các doanh nghiệp đối tác của Học viện Nông nghiệp Việt Nam
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: '#fff', borderRadius: 16,
            border: '1px dashed #e2e8f0',
            color: '#94a3b8', fontSize: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            Chưa có vị trí tuyển dụng nào đang mở.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        {/* Footer note */}
        {!loading && jobs.length > 0 && (
          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 12, color: '#94a3b8',
          }}>
            Truy cập trang web để xem thêm cơ hội việc làm từ {jobs.length < 6 ? '' : '6+'} doanh nghiệp đối tác
          </p>
        )}
      </div>
    </div>
  )
}