import React, { useState, useEffect } from 'react';
import { Button, Spin, Empty, Typography, Tag, Row, Col, message } from 'antd';
import {
  ArrowLeftOutlined, UserOutlined, MailOutlined,
  IdcardOutlined, BankOutlined, CalendarOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  BookOutlined, EditOutlined, CloseOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBatchById } from '../../../feature/alumni/api';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import AdminLayout from '../../../components/layout/AdminLayout';
import { KHOA_OPTIONS, NGANH_OPTIONS } from '../../../feature/alumni/constants';
import { SurveyPreview } from '../Form/Preview';

const { Text, Title } = Typography;

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: React.ReactNode }> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ color: '#2563eb', fontSize: 14, marginTop: 1, flexShrink: 0 }}>{icon}</span>
    <Text type="secondary" style={{ fontSize: 13, width: 150, flexShrink: 0 }}>{label}</Text>
    <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{value ?? <span style={{ color: '#cbd5e1' }}>—</span>}</span>
  </div>
);

export const ResponseDetail: React.FC = () => {
  const { id, responseId } = useParams<{ id: string; responseId: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEdit = pathname.endsWith('/edit');

  const [batch,   setBatch]   = useState<SurveyBatch | null>(null);
  const [response, setResponse] = useState<AlumniResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { if (id) load(); }, [id, responseId]);

  const load = async () => {
    try {
      const b = await getBatchById(Number(id));
      setBatch(b);
      if (responseId) {
        const r = b.responses.find(x => String(x.id) === responseId);
        setResponse(r ?? null);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (answers: Record<string, any>) => {
    setSaving(true);
    try {
      // TODO: await updateResponse(Number(id), Number(responseId), { answers });
      message.success('Đã lưu chỉnh sửa!');
      navigate(`/admin/alumni/batches/${id}/responses/${responseId}`);
    } catch {
      message.error('Lưu thất bại, thử lại.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    </AdminLayout>
  );

  if (!batch || !response) return (
    <AdminLayout>
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Empty description="Không tìm thấy dữ liệu phản hồi" />
        <Button style={{ marginTop: 16 }} onClick={() => navigate(`/admin/alumni/batches/${id}/responses`)}>
          Quay lại danh sách
        </Button>
      </div>
    </AdminLayout>
  );

  const khoaLabel   = KHOA_OPTIONS.find(k => k.value === (response as any).khoa)?.label;
  const nganhLabel  = (NGANH_OPTIONS[(response as any).khoa] ?? []).find((o: any) => o.value === (response as any).nganh)?.label;
  const answers     = (response as any)?.answers ?? {};
  const answerEntries = Object.entries(answers) as [string, any][];
  const questions   = (batch as any).formSnapshot?.questions ?? [];
  const formSnapshot = (batch as any).formSnapshot ?? null;

  const ProfileCard = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
        <div style={{ fontWeight: 600, color: '#374151', fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined style={{ color: '#2563eb' }} /> Thông tin sinh viên
        </div>
        <InfoRow icon={<IdcardOutlined />} label="Mã sinh viên" value={<Text style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{response.studentId}</Text>} />
        <InfoRow icon={<UserOutlined />}   label="Họ và tên"    value={response.studentName} />
        <InfoRow icon={<MailOutlined />}   label="Email"        value={response.studentEmail} />
        <InfoRow icon={<BankOutlined />}   label="Khoa"         value={khoaLabel} />
        <InfoRow icon={<BookOutlined />}   label="Ngành"        value={nganhLabel} />
        <InfoRow icon={<BookOutlined />}   label="Lớp"          value={(response as any).lop} />
      </div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
        <div style={{ fontWeight: 600, color: '#374151', fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ color: '#2563eb' }} /> Thông tin phản hồi
        </div>
        <InfoRow icon={<CheckCircleOutlined />} label="Trạng thái" value={
          response.status === 'submitted'
            ? <Tag color="success" icon={<CheckCircleOutlined />}>Đã hoàn thành</Tag>
            : <Tag color="default">Chưa phản hồi</Tag>
        } />
        <InfoRow icon={<ClockCircleOutlined />} label="Ngày phản hồi" value={
          response.submittedAt
            ? new Date(response.submittedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : undefined
        } />
        <InfoRow icon={<CalendarOutlined />} label="Năm tốt nghiệp" value={batch.year} />
        <InfoRow icon={<BankOutlined />}     label="Đợt tốt nghiệp" value={batch.graduationPeriod} />
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div style={{ padding: 24, background: '#f8fafc', minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} size="small" style={{ borderRadius: 6 }}
            onClick={() => navigate(`/admin/alumni/batches/${id}/responses`)}>
            Quay lại
          </Button>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            <span style={{ color: '#2563eb', cursor: 'pointer' }} onClick={() => navigate('/admin/alumni/batches')}>Khảo sát việc làm</span>
            {' / '}
            <span style={{ color: '#2563eb', cursor: 'pointer' }} onClick={() => navigate(`/admin/alumni/batches/${id}/responses`)}>{batch.title}</span>
            {' / '}
            <span style={{ color: '#475569' }}>{isEdit ? 'Chỉnh sửa phản hồi' : 'Chi tiết phản hồi'}</span>
          </div>
        </div>

        {/* Title + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0, color: '#111827' }}>
            {isEdit
              ? <><EditOutlined style={{ color: '#d97706', marginRight: 8 }} />Chỉnh sửa — {response.studentName}</>
              : response.studentName}
          </Title>
          {!isEdit ? (
            <Button icon={<EditOutlined />}
              style={{ borderRadius: 6, borderColor: '#d97706', color: '#d97706' }}
              onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${responseId}/edit`)}>
              Chỉnh sửa phản hồi
            </Button>
          ) : (
            <Button icon={<CloseOutlined />} style={{ borderRadius: 6 }}
              onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${responseId}`)}>
              Hủy chỉnh sửa
            </Button>
          )}
        </div>

        {/* VIEW MODE */}
        {!isEdit && (
          <Row gutter={20}>
            <Col span={9}>{ProfileCard}</Col>
            <Col span={15}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
                <div style={{ fontWeight: 600, color: '#374151', fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleOutlined style={{ color: '#2563eb' }} /> Nội dung phản hồi
                </div>
                {answerEntries.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                    {response.status === 'submitted' ? 'Không có dữ liệu câu trả lời' : 'Sinh viên chưa phản hồi'}
                  </div>
                ) : answerEntries.map(([qKey, answer], idx) => {
                  const q = questions.find((x: any) => x.id === qKey || x.key === qKey);
                  const label = q?.label ?? q?.title ?? q?.question ?? qKey;
                  return (
                    <div key={qKey} style={{ padding: '12px 0', borderBottom: idx < answerEntries.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>Câu {idx + 1}</div>
                      <div style={{ fontWeight: 500, fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</div>
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '7px 12px', fontSize: 13, color: '#1e40af', fontWeight: 500, display: 'inline-block' }}>
                        {Array.isArray(answer) ? answer.join(', ') : (answer || <span style={{ color: '#94a3b8' }}>Không có câu trả lời</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        )}

        {/* EDIT MODE */}
        {isEdit && (
          <Row gutter={20}>
            <Col span={7}>
              <div style={{ position: 'sticky', top: 24 }}>
                {ProfileCard}
              </div>
            </Col>
            <Col span={17}>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px 10px 0 0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, color: '#92400e', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <EditOutlined /> Đang chỉnh sửa — nhấn <b>Gửi</b> trong form để lưu
                </div>
                <Button size="small" icon={<CloseOutlined />} style={{ borderRadius: 6 }}
                  onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${responseId}`)}>
                  Hủy
                </Button>
              </div>
              <div style={{ border: '1px solid #fde68a', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', background: '#fff' }}>
                {formSnapshot ? (
                  <SurveyPreview
                    form={formSnapshot}
                    compact={false}
                    initialValues={answers}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                    Không có form snapshot
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </AdminLayout>
  );
};