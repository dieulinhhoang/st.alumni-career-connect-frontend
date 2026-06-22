import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// ── Types ────────────────────────────────────────────────────────────────────
interface JobPosting {
  id: string
  enterpriseId: string
  enterpriseName: string
  title: string
  location: string
  salaryRange: string
  tags: string[]
  postedAt: string
  deadline?: string
}

interface ApplyForm {
  fullName: string
  email: string
  phone: string
  message: string
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

// ── ApplyModal ────────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: JobPosting; onClose: () => void }) {
  const [form, setForm] = useState<ApplyForm>({ fullName:'', email:'', phone:'', message:'' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const set = (k: keyof ApplyForm) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/job-applications`, { jobId: job.id, ...form })
      setStatus('success')
    } catch {
      setErrMsg('Gửi không thành công, vui lòng thử lại.')
      setStatus('error')
    }
  }

  const inp: React.CSSProperties = {
    width:'100%', padding:'10px 13px', borderRadius:10,
    border:'1.5px solid #e2e8f0', fontSize:13, background:'#f8fafc', transition:'border-color .2s',
  }

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

        <div style={{ padding:'24px 24px 20px' }}>
          {status === 'success' ? (
            <div style={{ textAlign:'center',padding:'16px 0' }}>
              <div style={{ width:56,height:56,background:'#dcfce7',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div style={{ fontSize:16,fontWeight:800,color:'#0f172a',marginBottom:8 }}>Đã gửi hồ sơ!</div>
              <div style={{ fontSize:13,color:'#64748b',lineHeight:1.6,marginBottom:20 }}>Doanh nghiệp sẽ liên hệ với bạn qua email hoặc số điện thoại đã cung cấp.</div>
              <button onClick={onClose} style={{ padding:'10px 28px',background:'#1D9E75',color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer' }}>Đóng</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:'#475569',display:'block',marginBottom:5 }}>Họ và tên <span style={{ color:'#ef4444' }}>*</span></label>
                <input style={inp} placeholder="Nguyễn Văn A" value={form.fullName} onChange={set('fullName')} required />
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                <div>
                  <label style={{ fontSize:12,fontWeight:700,color:'#475569',display:'block',marginBottom:5 }}>Email <span style={{ color:'#ef4444' }}>*</span></label>
                  <input style={inp} type="email" placeholder="email@gmail.com" value={form.email} onChange={set('email')} required />
                </div>
                <div>
                  <label style={{ fontSize:12,fontWeight:700,color:'#475569',display:'block',marginBottom:5 }}>Số điện thoại <span style={{ color:'#ef4444' }}>*</span></label>
                  <input style={inp} placeholder="0912 345 678" value={form.phone} onChange={set('phone')} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:'#475569',display:'block',marginBottom:5 }}>Lời nhắn <span style={{ fontSize:11,color:'#94a3b8',fontWeight:400 }}>(tùy chọn)</span></label>
                <textarea style={{ ...inp,resize:'none',height:84 }} placeholder="Giới thiệu ngắn về bản thân..." value={form.message} onChange={set('message')} />
              </div>
              {status === 'error' && <div style={{ fontSize:12,color:'#ef4444',background:'#fef2f2',padding:'8px 12px',borderRadius:8 }}>{errMsg}</div>}
              <button type="submit" disabled={status==='loading'} style={{ padding:12,background:status==='loading'?'#94a3b8':'#1D9E75',color:'#fff',border:'none',borderRadius:12,fontWeight:700,fontSize:14,cursor:status==='loading'?'not-allowed':'pointer',transition:'background .2s',marginTop:4 }}>
                {status==='loading' ? 'Đang gửi...' : 'Gửi hồ sơ ứng tuyển'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── JobCard ───────────────────────────────────────────────────────────────────
function JobCard({ job, onApply, delay=0 }: { job: JobPosting; onApply: () => void; delay?: number }) {
  const expired = isExpired(job.deadline)
  return (
    <div
      className="job-card"
      style={{ background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden',animation:`fadeUp .5s ease ${delay}ms both`,boxShadow:'0 2px 8px rgba(15,23,42,.06)' }}
    >
      <div style={{ height:3,background:'linear-gradient(90deg,#1D9E75,transparent)',opacity:.7 }}/>
      <div style={{ padding:'18px 20px 14px',display:'flex',flexDirection:'column',gap:10 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8 }}>
          <span style={{ fontSize:11,fontWeight:700,color:'#1D9E75',textTransform:'uppercase',letterSpacing:'.6px' }}>{job.enterpriseName}</span>
          {job.deadline && (
            <span style={{ fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:6,background:expired?'#fee2e2':'#fff7ed',color:expired?'#ef4444':'#f97316',flexShrink:0 }}>
              {expired ? 'Hết hạn' : `HSD: ${fmtDate(job.deadline)}`}
            </span>
          )}
        </div>

        <div style={{ fontSize:15,fontWeight:700,color:'#0f172a',lineHeight:1.4 }}>{job.title}</div>

        <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
          {job.location && (
            <span style={{ fontSize:11,padding:'3px 10px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:8,color:'#475569',display:'flex',alignItems:'center',gap:4 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location}
            </span>
          )}
          {job.salaryRange && (
            <span style={{ fontSize:11,padding:'3px 10px',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,color:'#15803d',fontWeight:600,display:'flex',alignItems:'center',gap:4 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {job.salaryRange}
            </span>
          )}
          {job.tags?.slice(0,2).map(t => (
            <span key={t} style={{ fontSize:11,padding:'3px 10px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:8,color:'#94a3b8' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ padding:'10px 20px 14px',borderTop:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ fontSize:11,color:'#94a3b8' }}>{fmtDate(job.postedAt) ? `Đăng ${fmtDate(job.postedAt)}` : ''}</span>
        <button
          className="apply-btn"
          onClick={onApply}
          disabled={expired}
          style={{ fontSize:12,padding:'7px 16px',borderRadius:9,border:'1.5px solid #1D9E75',background:'transparent',color:'#1D9E75',fontWeight:700,cursor:expired?'not-allowed':'pointer',opacity:expired?.5:1,transition:'all .25s ease' }}
        >
          Ứng tuyển →
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
  const [applyJob, setApplyJob] = useState<JobPosting | null>(null)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 12

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    try {
      const params: Record<string, any> = { page: p, size: PAGE_SIZE }
      if (search.trim()) params.search = search.trim()
      if (location.trim()) params.location = location.trim()
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/job-postings`, { params })
      setJobs(res.data?.items ?? [])
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
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

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
            value={location} onChange={e => setLocation(e.target.value)}
            style={{ padding:'12px 14px',borderRadius:12,border:'none',fontSize:14,background:'#fff',minWidth:140,cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,.1)' }}
          >
            <option value="">Tất cả địa điểm</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button type="submit" style={{ padding:'12px 22px',background:'#fff',color:'#1D9E75',border:'none',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,.1)' }}>
            Tìm kiếm
          </button>
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
              <JobCard key={job.id} job={job} delay={i*40} onApply={() => setApplyJob(job)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
