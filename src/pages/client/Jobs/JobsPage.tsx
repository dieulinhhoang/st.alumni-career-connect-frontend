import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// ── Types ────────────────────────────────────────────────────────────────────
interface JobPosting {
  id: string
  enterpriseId: string
  enterpriseName: string
  enterprisePhone?: string
  enterpriseEmail?: string
  enterpriseWebsite?: string
  title: string
  description?: string
  location: string
  salaryRange: string
  tags: string[]
  postedAt: string
  deadline?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (s?: string) => {
  if (!s) return null
  const d = new Date(s)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

const isExpired = (deadline?: string) => deadline ? new Date(deadline) < new Date() : false

// ── Global styles ─────────────────────────────────────────────────────────────
const STYLES = `
*, *::before, *::after { font-family:'Plus Jakarta Sans',system-ui,sans-serif !important; box-sizing:border-box; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 100%{transform:translateX(100%)} }
.job-card { transition:transform .25s ease,box-shadow .25s ease; cursor:pointer; }
.job-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(15,23,42,.12) !important; }
.job-card:hover .apply-btn { background:#1D9E75 !important; color:#fff !important; border-color:transparent !important; }
.sk { position:relative;overflow:hidden; }
.sk::after { content:'';position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);animation:shimmer 1.4s infinite; }
input:focus,textarea:focus { border-color:#1D9E75 !important; outline:none; }
`

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background:'#fff',borderRadius:16,padding:22,border:'1px solid #e2e8f0' }}>
      <div className="sk" style={{ height:10,width:'30%',background:'#f1f5f9',borderRadius:6,marginBottom:12 }}/>
      <div className="sk" style={{ height:18,width:'75%',background:'#f1f5f9',borderRadius:6,marginBottom:10 }}/>
      <div className="sk" style={{ height:10,width:'45%',background:'#f1f5f9',borderRadius:6,marginBottom:18 }}/>
      <div style={{ display:'flex',gap:8 }}>
        <div className="sk" style={{ height:24,width:70,borderRadius:8,background:'#f1f5f9' }}/>
        <div className="sk" style={{ height:24,width:90,borderRadius:8,background:'#f1f5f9' }}/>
      </div>
    </div>
  )
}

// ── JobDetailModal (JD + liên hệ doanh nghiệp) ─────────────────────────────────
function JobDetailModal({ job, onClose }: { job: JobPosting; onClose: () => void }) {
  const contactRows = [
    { label: 'Điện thoại', value: job.enterprisePhone, href: job.enterprisePhone ? `tel:${job.enterprisePhone}` : undefined },
    { label: 'Email', value: job.enterpriseEmail, href: job.enterpriseEmail ? `mailto:${job.enterpriseEmail}` : undefined },
    { label: 'Website', value: job.enterpriseWebsite, href: job.enterpriseWebsite },
  ].filter(r => r.value)

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed',inset:0,zIndex:200,background:'rgba(15,23,42,.55)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}
    >
      <div style={{ background:'#fff',borderRadius:20,width:'100%',maxWidth:460,boxShadow:'0 32px 64px rgba(0,0,0,.2)',overflow:'hidden',animation:'fadeUp .3s ease both' }}>
        <div style={{ background:'linear-gradient(135deg,#1D9E75,#15805f)',padding:'20px 24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:4 }}>{job.enterpriseName}</div>
              <div style={{ fontSize:16,fontWeight:800,color:'#fff',lineHeight:1.3 }}>{job.title}</div>
              {(job.location || job.salaryRange) && (
                <div style={{ display:'flex',gap:8,marginTop:8,flexWrap:'wrap' }}>
                  {job.location && <span style={{ fontSize:11,background:'rgba(255,255,255,.15)',color:'#fff',padding:'3px 10px',borderRadius:8 }}>{job.location}</span>}
                  {job.salaryRange && <span style={{ fontSize:11,background:'rgba(255,255,255,.15)',color:'#fff',padding:'3px 10px',borderRadius:8 }}>{job.salaryRange}</span>}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,.15)',border:'none',color:'#fff',width:32,height:32,borderRadius:'50%',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>×</button>
          </div>
        </div>

        <div style={{ padding:'24px 24px 24px' }}>
          {job.tags && job.tags.length > 0 && (
            <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:16 }}>
              {job.tags.map(t => (
                <span key={t} style={{ fontSize:11.5,padding:'3px 10px',background:'#f1f5f9',color:'#475569',borderRadius:8 }}>{t}</span>
              ))}
            </div>
          )}

          {job.description && job.description.trim() && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:10 }}>
                Mô tả công việc
              </div>
              <div style={{ fontSize:13.5,color:'#334155',lineHeight:1.7,whiteSpace:'pre-wrap' }}>
                {job.description}
              </div>
            </div>
          )}

          <div style={{ fontSize:12,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:10 }}>
            Liên hệ ứng tuyển
          </div>
          {contactRows.length === 0 ? (
            <p style={{ margin:0,fontSize:13,color:'#94a3b8' }}>Doanh nghiệp chưa cập nhật thông tin liên hệ.</p>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {contactRows.map(r => (
                <div key={r.label} style={{ display:'flex',gap:10,fontSize:13.5,alignItems:'baseline' }}>
                  <span style={{ width:78,flexShrink:0,color:'#94a3b8',fontWeight:600 }}>{r.label}</span>
                  {r.href ? (
                    <a href={r.href} target={r.label === 'Website' ? '_blank' : undefined} rel="noreferrer" style={{ color:'#0f7a57',fontWeight:600,wordBreak:'break-word' }}>
                      {r.value}
                    </a>
                  ) : (
                    <span style={{ color:'#0f172a',wordBreak:'break-word' }}>{r.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p style={{ margin:'16px 0 0',fontSize:12,color:'#94a3b8',lineHeight:1.6 }}>
            Hãy chủ động liên hệ trực tiếp với doanh nghiệp để ứng tuyển vị trí này.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── JobCard ───────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, valueColor='#0f172a' }: { icon: React.ReactNode; label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
      <span style={{ width:28,height:28,borderRadius:8,flexShrink:0,background:'#f1f5f9',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center' }}>{icon}</span>
      <span style={{ fontSize:12,color:'#94a3b8',fontWeight:600,width:74,flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13,color:valueColor,fontWeight:700,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{value}</span>
    </div>
  )
}

function JobCard({ job, onShowDetail, delay=0 }: { job: JobPosting; onShowDetail: () => void; delay?: number }) {
  const expired = isExpired(job.deadline)
  const initial = (job.enterpriseName || '?').trim().charAt(0).toUpperCase()
  return (
    <div
      className="job-card"
      onClick={onShowDetail}
      style={{ background:'#fff',borderRadius:18,border:'1px solid #eef2f6',overflow:'hidden',animation:`fadeUp .5s ease ${delay}ms both`,boxShadow:'0 1px 3px rgba(15,23,42,.05)',display:'flex',flexDirection:'column' }}
    >
      <div style={{ padding:'18px 20px 14px',display:'flex',flexDirection:'column',gap:14,flex:1 }}>
        {/* Logo + doanh nghiệp + hạn */}
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:46,height:46,borderRadius:13,flexShrink:0,background:'linear-gradient(135deg,#1D9E75,#0f7a57)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,boxShadow:'0 4px 12px rgba(29,158,117,.28)' }}>
            {initial}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:700,color:'#0f7a57',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }} title={job.enterpriseName}>
              {job.enterpriseName}
            </div>
            <div style={{ fontSize:11,color:'#94a3b8',marginTop:2 }}>Doanh nghiệp đối tác</div>
          </div>
          {job.deadline && (
            <span style={{ fontSize:10.5,fontWeight:700,padding:'4px 10px',borderRadius:20,whiteSpace:'nowrap',background:expired?'#fef2f2':'#fff7ed',color:expired?'#ef4444':'#ea580c',flexShrink:0,border:`1px solid ${expired?'#fecaca':'#fed7aa'}` }}>
              {expired ? 'Hết hạn' : `Hạn ${fmtDate(job.deadline)}`}
            </span>
          )}
        </div>

        {/* Tiêu đề */}
        <div style={{ fontSize:17,fontWeight:800,color:'#0f172a',lineHeight:1.38,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:47 }} title={job.title}>
          {job.title}
        </div>

        {/* Mô tả ngắn */}
        {job.description && job.description.trim() && (
          <div style={{ fontSize:13,color:'#64748b',lineHeight:1.55,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>
            {job.description}
          </div>
        )}

        {/* Thông tin dạng JD */}
        <div style={{ display:'flex',flexDirection:'column',gap:9,padding:'12px 0',borderTop:'1px solid #f1f5f9',borderBottom:'1px solid #f1f5f9' }}>
          <InfoRow
            label="Địa điểm"
            value={job.location || 'Đang cập nhật'}
            valueColor={job.location ? '#0f172a' : '#94a3b8'}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
          />
          <InfoRow
            label="Mức lương"
            value={job.salaryRange || 'Thỏa thuận'}
            valueColor={job.salaryRange ? '#15803d' : '#94a3b8'}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
          <InfoRow
            label="Hạn nộp"
            value={job.deadline ? fmtDate(job.deadline) : 'Không giới hạn'}
            valueColor={expired ? '#ef4444' : (job.deadline ? '#0f172a' : '#94a3b8')}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          />
        </div>

        {/* Kỹ năng / tag */}
        {job.tags && job.tags.length > 0 && (
          <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
            <span style={{ fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.4px' }}>Kỹ năng / lĩnh vực</span>
            <div style={{ display:'flex',flexWrap:'wrap',gap:7 }}>
              {job.tags.slice(0,5).map(t => (
                <span key={t} style={{ fontSize:11.5,padding:'4px 11px',background:'#f0fdf9',border:'1px solid #cdeee0',borderRadius:20,color:'#0f7a57',fontWeight:600 }}>{t}</span>
              ))}
              {job.tags.length > 5 && (
                <span style={{ fontSize:11.5,padding:'4px 11px',color:'#94a3b8',fontWeight:600 }}>+{job.tags.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ padding:'14px 20px',borderTop:'1px solid #f1f5f9',background:'#fcfdfe',marginTop:'auto' }}>
        <button
          className="apply-btn"
          onClick={e => { e.stopPropagation(); onShowDetail() }}
          style={{ width:'100%',fontSize:13,padding:'10px 16px',borderRadius:11,border:'1.5px solid #1D9E75',background:'transparent',color:'#1D9E75',fontWeight:700,cursor:'pointer',transition:'all .25s ease' }}
        >
          Xem chi tiết &amp; liên hệ →
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [detailJob, setDetailJob] = useState<JobPosting | null>(null)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 12

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    try {
      const params: Record<string, any> = { page: p, size: PAGE_SIZE, status: 'active' }
      if (search.trim()) params.title = search.trim()
      if (location.trim()) params.location = location.trim()
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, { params })
      const items: JobPosting[] = (res.data?.items ?? []).map((j: any) => ({
        id: String(j.id),
        enterpriseId: String(j.enterpriseId),
        enterpriseName: j.enterprise?.name ?? j.enterpriseName ?? '',
        enterprisePhone: j.enterprise?.phone,
        enterpriseEmail: j.enterprise?.email,
        enterpriseWebsite: j.enterprise?.website,
        title: j.title,
        description: j.description,
        location: j.location,
        salaryRange: j.salary,
        tags: j.tags ?? [],
        postedAt: j.postedAt,
        deadline: j.deadline,
      }))
      setJobs(items)
      setTotal(res.data?.total ?? 0)
      setPage(p)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [search, location])

  useEffect(() => { load(0) }, [])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(0) }

  const LOCATIONS = ['Hà Nội','TP.HCM','Đà Nẵng','Hải Phòng','Cần Thơ','Toàn quốc','Làm từ xa']

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc' }}>
      <style>{STYLES}</style>
      {detailJob && <JobDetailModal job={detailJob} onClose={() => setDetailJob(null)} />}

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#1D9E75 0%,#15805f 100%)', padding:'52px 24px 40px', textAlign:'center' }}>
        <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.25)',borderRadius:100,padding:'5px 16px',marginBottom:18 }}>
          <span style={{ fontSize:11,fontWeight:700,color:'#fff',letterSpacing:'.7px',textTransform:'uppercase' }}>Cơ hội việc làm</span>
        </div>
        <h1 style={{ fontSize:32,fontWeight:800,color:'#fff',margin:'0 0 10px',letterSpacing:'-.5px' }}>Tìm kiếm việc làm phù hợp</h1>
        <p style={{ fontSize:14,color:'rgba(255,255,255,.8)',margin:'0 auto 28px',maxWidth:480 }}>
          Từ các doanh nghiệp đối tác của Học viện Nông nghiệp Việt Nam
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ maxWidth:580,margin:'0 auto',display:'flex',gap:10,flexWrap:'wrap' }}>
          <div style={{ flex:1,position:'relative',minWidth:200 }}>
            <svg style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên vị trí..."
              style={{ width:'100%',padding:'12px 14px 12px 38px',borderRadius:12,border:'none',fontSize:14,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,.1)' }}
            />
          </div>
          <select
            value={location} onChange={e => { setLocation(e.target.value); }}
            style={{ padding:'12px 14px',borderRadius:12,border:'none',fontSize:14,background:'#fff',minWidth:140,cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,.1)' }}
          >
            <option value="">Tất cả địa điểm</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          {/* Nút submit ẩn: Enter trong ô tìm kiếm vẫn gửi form */}
          <button type="submit" style={{ display:'none' }} aria-hidden="true" tabIndex={-1} />
        </form>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'32px 20px' }}>
        {/* Result count */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <div style={{ fontSize:14,color:'#64748b' }}>
            {loading ? 'Đang tải...' : <><strong style={{ color:'#0f172a' }}>{total}</strong> vị trí đang tuyển</>}
          </div>
          {!loading && total > PAGE_SIZE && (
            <div style={{ display:'flex',gap:8 }}>
              <button disabled={page===0} onClick={() => load(page-1)} style={{ padding:'6px 14px',borderRadius:8,border:'1px solid #e2e8f0',background:page===0?'#f8fafc':'#fff',cursor:page===0?'not-allowed':'pointer',fontSize:12,color:'#475569' }}>← Trước</button>
              <span style={{ padding:'6px 14px',fontSize:12,color:'#64748b' }}>{page+1} / {Math.ceil(total/PAGE_SIZE)}</span>
              <button disabled={page>=Math.ceil(total/PAGE_SIZE)-1} onClick={() => load(page+1)} style={{ padding:'6px 14px',borderRadius:8,border:'1px solid #e2e8f0',background:page>=Math.ceil(total/PAGE_SIZE)-1?'#f8fafc':'#fff',cursor:page>=Math.ceil(total/PAGE_SIZE)-1?'not-allowed':'pointer',fontSize:12,color:'#475569' }}>Tiếp →</button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:18 }}>
            {Array.from({length:6}).map((_,i) => <SkeletonCard key={i}/>)}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign:'center',padding:'64px 0',color:'#94a3b8' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            <div style={{ fontSize:15,fontWeight:600,marginBottom:6 }}>Không tìm thấy vị trí nào</div>
            <div style={{ fontSize:13 }}>Thử thay đổi từ khoá hoặc địa điểm</div>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:18 }}>
            {jobs.map((job,i) => (
              <JobCard key={job.id} job={job} delay={i*40} onShowDetail={() => setDetailJob(job)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
