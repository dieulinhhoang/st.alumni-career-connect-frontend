import { useEffect, useState } from 'react'
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

export function DoneScreen({ batch: _batch }: Props) {
  const [jobs, setJobs] = useState<JobWithEnterprise[]>([])
  const [loading, setLoading] = useState(true)

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
                enterpriseName: ent.name,
                enterpriseAbbr: ent.abbr,
                enterpriseColor: ent.color,
              }))
          })
        )
        // Sort by postedAt desc
        allJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        setJobs(allJobs.slice(0, 6))
      } catch {
        // fail silently — jobs section just won't show
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f0fdf7',
      fontFamily: "'DM Sans', -apple-system, sans-serif", padding: '40px 16px',
    }}>
      {/* Thank you card */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 8px 32px rgba(0,0,0,.08)', textAlign: 'center',
        maxWidth: 420, width: '100%', margin: '0 auto',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D9E75, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 32, color: '#fff',
          boxShadow: '0 8px 24px #1D9E7540',
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          Đã gửi thành công!
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
          Cảm ơn bạn đã hoàn thành phiếu khảo sát.
          <br />
          Thông tin của bạn đã được ghi nhận.
        </p>
        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0',
          fontSize: 13, color: '#166534',
        }}>
          Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!
        </div>
      </div>

      {/* Job listings section */}
      <div style={{ maxWidth: 860, margin: '40px auto 0' }}>
        <h3 style={{
          fontSize: 18, fontWeight: 700, color: '#0f172a',
          marginBottom: 4, textAlign: 'center',
        }}>
          Cơ hội việc làm dành cho bạn
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>
          Các vị trí tuyển dụng đang mở từ doanh nghiệp đối tác
        </p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                background: '#fff', borderRadius: 12, padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,.06)',
              }}>
                <div style={{ height: 14, width: '60%', background: '#e2e8f0', borderRadius: 4, marginBottom: 10 }} />
                <div style={{ height: 12, width: '40%', background: '#f1f5f9', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 12, width: '80%', background: '#f1f5f9', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? null : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {jobs.map(job => (
              <div key={job.id} style={{
                background: '#fff', borderRadius: 12, padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,.06)',
                border: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', gap: 8,
                transition: 'box-shadow 0.2s',
              }}>
                {/* Enterprise badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: job.enterpriseColor ?? '#1D9E75',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {job.enterpriseAbbr?.slice(0, 2).toUpperCase() ?? '??'}
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                    {job.enterpriseName}
                  </span>
                </div>

                {/* Job title */}
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {job.title}
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {job.location && (
                    <span style={{
                      fontSize: 11, padding: '2px 8px',
                      background: '#f0fdf4', color: '#166534',
                      borderRadius: 99, border: '1px solid #bbf7d0', fontWeight: 500,
                    }}>
                      📍 {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span style={{
                      fontSize: 11, padding: '2px 8px',
                      background: '#fffbeb', color: '#92400e',
                      borderRadius: 99, border: '1px solid #fde68a', fontWeight: 500,
                    }}>
                      💰 {job.salary}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {job.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {job.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontSize: 11, padding: '2px 8px',
                        background: '#f1f5f9', color: '#475569',
                        borderRadius: 99,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deadline */}
                {job.deadline && (
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 'auto', paddingTop: 4 }}>
                    Hạn nộp: {formatDate(job.deadline)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
