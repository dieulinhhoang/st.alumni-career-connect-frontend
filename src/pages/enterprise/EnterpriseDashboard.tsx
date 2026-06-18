import { useState } from 'react'
import { Badge, Button, Modal, Spin, Tabs, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import EnterpriseLayout from '../../components/layout/EnterpriseLayout'
import { getEnterpriseSession } from '../../utils/jwt'
import { useEnterpriseDetail } from '../../feature/enterprise/hooks/useEnterpriseDetail'
import { useJobs } from '../../feature/enterprise/hooks/useJobs'
import { JobCard } from '../system/EnterpriseDetail/JobCard'
import { JobFormModal } from '../system/EnterpriseDetail/JobFormModal'
import { useFaculties } from '../../feature/faculty/hooks/useFaculties'
import { useApplicants } from './hooks/useApplicants'
import type { Job, JobFormValues } from '../../feature/enterprise/type'

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function EnterpriseDashboard() {
  const session = getEnterpriseSession()
  const enterpriseId = session?.enterpriseId

  const { enterprise: ent, loading: entLoading } = useEnterpriseDetail(enterpriseId)
  const { jobs, activeJobs, closedJobs, addJob, editJob, removeJob } = useJobs(enterpriseId)
  const { applicants, loading: appLoading } = useApplicants(enterpriseId)
  const { faculties } = useFaculties()

  const [jobModal, setJobModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null })

  if (entLoading) return (
    <EnterpriseLayout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>
    </EnterpriseLayout>
  )

  const ACCENT = ent?.color ?? '#1D9E75'

  const handleSaveJob = async (values: JobFormValues) => {
    if (jobModal.job) await editJob(jobModal.job.id, values as Partial<Job>)
    else await addJob(values)
  }

  return (
    <EnterpriseLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{ent?.name}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{ent?.industry} · {ent?.address}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard label="Tổng tin tuyển dụng" value={jobs.length} color={ACCENT} />
        <StatCard label="Đang tuyển" value={activeJobs.length} color="#059669" />
        <StatCard label="Đã đóng" value={closedJobs.length} color="#d97706" />
        <StatCard label="Tổng ứng viên" value={applicants.length} color="#7c3aed" />
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '0 24px 24px' }}>
        <Tabs
          defaultActiveKey="jobs"
          items={[
            {
              key: 'jobs',
              label: <span>Tin tuyển dụng <Badge count={activeJobs.length} style={{ background: ACCENT }} /></span>,
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <Button
                      type="primary" icon={<PlusOutlined />}
                      style={{ background: ACCENT, border: 'none' }}
                      onClick={() => setJobModal({ open: true, job: null })}
                    >
                      Đăng tin mới
                    </Button>
                  </div>
                  {jobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                      Chưa có tin tuyển dụng nào
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {jobs.map(j => (
                        <JobCard
                          key={j.id} job={j} entColor={ACCENT} faculties={faculties}
                          onEdit={job => setJobModal({ open: true, job })}
                          onDelete={removeJob}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'applicants',
              label: <span>Ứng viên <Badge count={applicants.length} style={{ background: '#7c3aed' }} /></span>,
              children: (
                <div>
                  {appLoading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                  ) : applicants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                      Chưa có ứng viên nào
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {applicants.map(a => (
                        <div key={a.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{a.fullName}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              <span>✉ {a.email}</span>
                              <span>📞 {a.phone}</span>
                            </div>
                            {a.message && (
                              <div style={{ fontSize: 12, color: '#475569', marginTop: 6, background: '#fff', padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0' }}>
                                {a.message}
                              </div>
                            )}
                          </div>
                          <div style={{ flexShrink: 0, textAlign: 'right' }}>
                            <Tag color="purple" style={{ margin: 0, marginBottom: 4 }}>{(a as any).job?.title ?? 'N/A'}</Tag>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                              {new Date(a.appliedAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      <JobFormModal
        open={jobModal.open}
        job={jobModal.job}
        entColor={ACCENT}
        faculties={faculties}
        onClose={() => setJobModal({ open: false, job: null })}
        onSave={handleSaveJob}
      />
    </EnterpriseLayout>
  )
}
