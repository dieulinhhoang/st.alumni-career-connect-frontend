import { useState } from 'react'
import { Badge, Button, Modal, Select, Spin, Tabs, Tag, Tooltip } from 'antd'
import { PlusOutlined, CheckOutlined, StarOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import EnterpriseLayout from '../../components/layout/EnterpriseLayout'
import { getEnterpriseSession } from '../../utils/jwt'
import { useEnterpriseDetail } from '../../feature/enterprise/hooks/useEnterpriseDetail'
import { useJobs } from '../../feature/enterprise/hooks/useJobs'
import { JobCard } from '../system/EnterpriseDetail/JobCard'
import { JobFormModal } from '../system/EnterpriseDetail/JobFormModal'
import { useFaculties } from '../../feature/faculty/hooks/useFaculties'
import { useApplicants, type ApplicationStatus } from './hooks/useApplicants'
import type { Job, JobFormValues } from '../../feature/enterprise/type'

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; antColor: string }> = {
  pending:     { label: 'Chờ xem xét', color: '#d97706', antColor: 'orange' },
  reviewed:    { label: 'Đã xem xét',  color: '#2563eb', antColor: 'blue' },
  shortlisted: { label: 'Tiềm năng',   color: '#059669', antColor: 'green' },
  rejected:    { label: 'Không phù hợp', color: '#dc2626', antColor: 'red' },
}

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
  const { applicants, loading: appLoading, updateStatus } = useApplicants(enterpriseId)
  const { faculties } = useFaculties()

  const [jobModal, setJobModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null })
  const [filterJobId, setFilterJobId] = useState<number | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | undefined>(undefined)
  const [detailApp, setDetailApp] = useState<typeof applicants[0] | null>(null)

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

  const filteredApplicants = applicants.filter(a => {
    if (filterJobId && a.job?.id !== filterJobId) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  const jobOptions = jobs.map(j => ({ label: j.title, value: j.id }))

  const pendingCount = applicants.filter(a => a.status === 'pending').length

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
              label: (
                <span>
                  Ứng viên{' '}
                  <Badge count={pendingCount} style={{ background: '#7c3aed' }} title="Chờ xem xét" />
                </span>
              ),
              children: (
                <div>
                  {/* Filters */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    <Select
                      allowClear
                      placeholder="Lọc theo tin tuyển dụng"
                      style={{ width: 240 }}
                      options={jobOptions}
                      value={filterJobId}
                      onChange={v => setFilterJobId(v)}
                    />
                    <Select
                      allowClear
                      placeholder="Lọc theo trạng thái"
                      style={{ width: 180 }}
                      value={filterStatus}
                      onChange={v => setFilterStatus(v)}
                      options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ label: v.label, value: k }))}
                    />
                    <span style={{ fontSize: 12, color: '#94a3b8', alignSelf: 'center' }}>
                      {filteredApplicants.length} / {applicants.length} ứng viên
                    </span>
                  </div>

                  {appLoading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                  ) : filteredApplicants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                      {applicants.length === 0 ? 'Chưa có ứng viên nào' : 'Không có ứng viên khớp bộ lọc'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {filteredApplicants.map(a => {
                        const sc = STATUS_CONFIG[a.status ?? 'pending']
                        return (
                          <div
                            key={a.id}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderLeft: `3px solid ${sc.color}`,
                              borderRadius: 12,
                              padding: '14px 18px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: 12,
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{a.fullName}</div>
                              <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <span>✉ {a.email}</span>
                                <span>📞 {a.phone}</span>
                              </div>
                              {a.message && (
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: '#475569',
                                    marginTop: 6,
                                    background: '#fff',
                                    padding: '6px 10px',
                                    borderRadius: 7,
                                    border: '1px solid #e2e8f0',
                                    maxHeight: 48,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  } as React.CSSProperties}
                                >
                                  {a.message}
                                </div>
                              )}
                            </div>

                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <Tag color="purple" style={{ margin: 0 }}>{a.job?.title ?? 'N/A'}</Tag>
                                <Tag color={sc.antColor} style={{ margin: 0 }}>{sc.label}</Tag>
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                {new Date(a.appliedAt).toLocaleDateString('vi-VN')}
                              </div>
                              {/* Action buttons */}
                              <div style={{ display: 'flex', gap: 4 }}>
                                <Tooltip title="Xem chi tiết">
                                  <Button
                                    size="small" type="text"
                                    icon={<EyeOutlined />}
                                    style={{ color: '#64748b' }}
                                    onClick={() => setDetailApp(a)}
                                  />
                                </Tooltip>
                                <Tooltip title="Đánh dấu tiềm năng">
                                  <Button
                                    size="small" type="text"
                                    icon={<StarOutlined />}
                                    style={{ color: a.status === 'shortlisted' ? '#059669' : '#94a3b8' }}
                                    onClick={() => updateStatus(a.id, 'shortlisted')}
                                    disabled={a.status === 'shortlisted'}
                                  />
                                </Tooltip>
                                <Tooltip title="Đánh dấu đã xem xét">
                                  <Button
                                    size="small" type="text"
                                    icon={<CheckOutlined />}
                                    style={{ color: a.status === 'reviewed' ? '#2563eb' : '#94a3b8' }}
                                    onClick={() => updateStatus(a.id, 'reviewed')}
                                    disabled={a.status === 'reviewed'}
                                  />
                                </Tooltip>
                                <Tooltip title="Không phù hợp">
                                  <Button
                                    size="small" type="text"
                                    icon={<CloseOutlined />}
                                    style={{ color: a.status === 'rejected' ? '#dc2626' : '#94a3b8' }}
                                    onClick={() => updateStatus(a.id, 'rejected')}
                                    disabled={a.status === 'rejected'}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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

      {/* Applicant detail modal */}
      <Modal
        open={!!detailApp}
        onCancel={() => setDetailApp(null)}
        footer={null}
        title="Chi tiết ứng viên"
        width={480}
      >
        {detailApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{detailApp.fullName}</div>
              <Tag color={STATUS_CONFIG[detailApp.status ?? 'pending'].antColor} style={{ marginTop: 6 }}>
                {STATUS_CONFIG[detailApp.status ?? 'pending'].label}
              </Tag>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              <span>✉ {detailApp.email}</span>
              <span>📞 {detailApp.phone}</span>
              <span>📋 Vị trí: <strong>{detailApp.job?.title ?? 'N/A'}</strong></span>
              <span>📅 Nộp ngày: {new Date(detailApp.appliedAt).toLocaleDateString('vi-VN')}</span>
            </div>
            {detailApp.message && (
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Lời nhắn:</div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#374151', whiteSpace: 'pre-wrap' }}>
                  {detailApp.message}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([k, v]) => (
                <Button
                  key={k}
                  size="small"
                  type={detailApp.status === k ? 'primary' : 'default'}
                  style={detailApp.status === k ? { background: v.color, borderColor: v.color } : {}}
                  disabled={detailApp.status === k}
                  onClick={async () => {
                    await updateStatus(detailApp.id, k)
                    setDetailApp(prev => prev ? { ...prev, status: k } : prev)
                  }}
                >
                  {v.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </EnterpriseLayout>
  )
}
