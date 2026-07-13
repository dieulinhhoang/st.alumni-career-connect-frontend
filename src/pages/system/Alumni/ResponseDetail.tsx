import React, { useState, useEffect } from 'react';
import { Button, Spin, Empty, Typography, Tag, Row, Col, message, Timeline, Modal } from 'antd';
import {
  ArrowLeftOutlined, UserOutlined, MailOutlined,
  IdcardOutlined, BankOutlined, CalendarOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  BookOutlined, EditOutlined, CloseOutlined,
  HistoryOutlined, PlusCircleOutlined, FormOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBatchById, getBatchResponses, updateResponse, createResponseByAdmin, getResponseHistory } from '../../../feature/alumni/api';
import type { ResponseHistoryEntry } from '../../../feature/alumni/api';
import { fetchGraduationStudents } from '../../../feature/graduation/api';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import type { GraduationStudent } from '../../../feature/graduation/type';
import AdminLayout from '../../../components/layout/AdminLayout';
import { SurveyPreview } from '../Form/Preview';
import { havePermission } from '../../../feature/auth/permission';
import { PermissionEnum } from '../../../feature/auth/type';

const { Text, Title } = Typography;

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: React.ReactNode }> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ color: '#2563eb', fontSize: 14, marginTop: 1, flexShrink: 0 }}>{icon}</span>
    <Text type="secondary" style={{ fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0, minWidth: 100, maxWidth: 110 }}>{label}</Text>
    <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', flex: 1, minWidth: 0, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value ?? <span style={{ color: '#cbd5e1' }}>—</span>}</span>
  </div>
);

/** Chuyển giá trị đáp án (string | array | object) về chuỗi dễ đọc cho lịch sử */
const formatAnswerValue = (v: any): string => {
  if (v === null || v === undefined || v === '') return '(trống)';
  if (Array.isArray(v)) return v.length ? v.map(formatAnswerValue).join(', ') : '(trống)';
  if (typeof v === 'object') {
    // Các dạng phổ biến: địa chỉ {address, city}, cccd {number}
    const parts = Object.values(v).filter(x => x !== null && x !== undefined && x !== '');
    return parts.length ? parts.map(formatAnswerValue).join(' — ') : '(trống)';
  }
  return String(v);
};

const ACTION_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  submit: { label: 'Sinh viên nộp phiếu', color: '#2563eb', icon: <CheckCircleOutlined /> },
  create: { label: 'Thêm phản hồi',        color: '#1D9E75', icon: <PlusCircleOutlined /> },
  update: { label: 'Chỉnh sửa phản hồi',   color: '#d97706', icon: <FormOutlined /> },
};

export const ResponseDetail: React.FC = () => {
  const { id, responseId } = useParams<{ id: string; responseId: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEdit = pathname.endsWith('/edit');

  const [batch,       setBatch]       = useState<SurveyBatch | null>(null);
  const [response,    setResponse]    = useState<AlumniResponse | null>(null);
  const [gradStudent, setGradStudent] = useState<GraduationStudent | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [history,     setHistory]     = useState<ResponseHistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => { if (id) load(); }, [id, responseId]);
  useEffect(() => { loadHistory(); }, [id, responseId]);

  const loadHistory = async () => {
    // Phản hồi chưa nộp (id âm) chưa tồn tại trong DB → không có lịch sử
    if (!id || !responseId || Number(responseId) < 0) { setHistory([]); return; }
    try {
      setHistory(await getResponseHistory(Number(id), Number(responseId)));
    } catch { setHistory([]); }
  };

  const load = async () => {
    try {
      const numId = Number(responseId);
      const [b, responses] = await Promise.all([
        getBatchById(Number(id)),
        getBatchResponses(Number(id)),
      ]);
      setBatch(b);

      if (numId < 0 && b.graduationId) {
        // ID âm = SV chưa submit → tìm trong gradStudents
        const studentsRes = await fetchGraduationStudents(b.graduationId, 1, 9999);
        const gs = studentsRes.data.find(s => Number(s.id) === -numId);
        if (gs) {
          setGradStudent(gs);
          setResponse({
            id: numId,
            batchId: b.id,
            studentId: gs.code,
            studentName: gs.full_name ?? '',
            studentEmail: gs.email ?? '',
            answers: {},
            submittedAt: '',
            status: 'pending' as any,
            training_industry_id: gs.training_industry_id,
            training_industry_name: gs.training_industry_name,
            training_industry_code: gs.training_industry_code,
          } as any);
        }
      } else {
        // Tìm response đã submit, rồi bổ sung thông tin ngành từ gradStudents
        const r = responses.find(x => String(x.id) === responseId);
        if (r && b.graduationId) {
          // Load gradStudents để lấy faculty_name + training_industry_name
          try {
            const studentsRes = await fetchGraduationStudents(b.graduationId, 1, 9999);
            const gs = studentsRes.data.find(s => s.code === r.studentId);
            if (gs) {
              setResponse({
                ...r,
                faculty_id: (gs as any).faculty_id,
                faculty_name: (gs as any).faculty_name,
                training_industry_id: gs.training_industry_id,
                training_industry_name: gs.training_industry_name,
                training_industry_code: gs.training_industry_code,
              } as any);
            } else {
              setResponse(r);
            }
          } catch {
            setResponse(r ?? null);
          }
        } else {
          setResponse(r ?? null);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const isPending = Number(responseId) < 0;

  // Build initial values từ data sinh viên, giống SurveyFillPage.buildInitialValues
  const adminInitialValues = React.useMemo(() => {
    if (!isPending || !gradStudent || !batch) return {};
    const snapshot = (batch as any).formSnapshot;
    if (!snapshot) return {};
    const sortedQs = [...(snapshot.questions ?? [])].sort(
      (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
    );
    const values: Record<string, any> = {};
    const set = (idx: number, val: any) => {
      if (sortedQs[idx] && val !== null && val !== undefined && val !== '') {
        values[sortedQs[idx].id] = val;
      }
    };
    const genderMap: Record<string, string> = { male: 'Nam', female: 'Nữ', other: 'Khác' };
    set(0, gradStudent.code);
    set(1, gradStudent.full_name);
    set(2, gradStudent.gender ? (genderMap[gradStudent.gender] ?? gradStudent.gender) : null);
    if (gradStudent.dob) {
      const d = new Date(gradStudent.dob);
      if (!isNaN(d.getTime())) set(3, d.toISOString().slice(0, 10));
    }
    set(4, gradStudent.training_industry_code);
    if (gradStudent.citizen_identification) {
      const q6 = sortedQs[5]
      set(5, q6?.type === 'cccd'
        ? { number: gradStudent.citizen_identification }
        : gradStudent.citizen_identification
      )
    }
    set(6, gradStudent.school_year_end);
    set(7, gradStudent.training_industry_name);
    set(8, gradStudent.phone);
    set(9, gradStudent.email);
    return values;
  }, [isPending, gradStudent, batch]);

  const handleSubmit = async (answers: Record<string, any>) => {
    if (!response) return;
    setSaving(true);
    try {
      if (isPending) {
        // SV chưa nộp — admin tạo mới thay
        const created = await createResponseByAdmin(Number(id), {
          studentId: response.studentId,
          studentName: response.studentName,
          studentEmail: response.studentEmail,
          answers,
        });
        message.success('Đã thêm phản hồi thành công!');
        navigate(`/admin/alumni/batches/${id}/responses/${created.id}`);
      } else {
        await updateResponse(Number(id), Number(responseId), answers);
        message.success('Đã lưu chỉnh sửa!');
        await Promise.all([load(), loadHistory()]);
        navigate(`/admin/alumni/batches/${id}/responses/${responseId}`);
      }
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
          Danh sách
        </Button>
      </div>
    </AdminLayout>
  );

  // Lấy tên khoa và ngành từ các field đã được enrich ở load()
  const khoaLabel  = (response as any)?.faculty_name as string | undefined;
  // Ưu tiên training_industry_name, fallback về training_industry_code
  const nganhLabel = (response as any)?.training_industry_name as string | undefined
    ?? (response as any)?.training_industry_code as string | undefined;

  const answers    = (response as any)?.answers ?? {};
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
        {/* Hiển thị Khoa nếu có dữ liệu */}
        {khoaLabel && (
          <InfoRow icon={<BankOutlined />} label="Khoa" value={khoaLabel} />
        )}
        {/* Hiển thị Ngành nếu có dữ liệu */}
        {nganhLabel && (
          <InfoRow icon={<BookOutlined />} label="Ngành" value={nganhLabel} />
        )}
        {/* Ẩn Lớp và Năm tốt nghiệp */}
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
        {/* Ẩn Năm tốt nghiệp (batch.year) */}
        <InfoRow icon={<BankOutlined />} label="Đợt tốt nghiệp" value={batch.graduationPeriod} />
        {!isPending && (
          <InfoRow
            icon={<HistoryOutlined />}
            label="Lịch sử thay đổi"
            value={
              <Button
                type="link"
                size="small"
                icon={<HistoryOutlined />}
                style={{ padding: 0, height: 'auto', fontSize: 13, fontWeight: 500 }}
                onClick={() => setHistoryOpen(true)}
              >
                Xem lịch sử{history.length > 0 ? ` (${history.length})` : ''}
              </Button>
            }
          />
        )}
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
            {isEdit ? 'Chỉnh sửa phản hồi' : 'Chi tiết phản hồi'}
          </Title>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isEdit ? (
              havePermission(PermissionEnum.SURVEYS_UPDATE) && (
                <Button
                  icon={<EditOutlined />}
                  style={{ borderRadius: 6, borderColor: isPending ? '#1D9E75' : '#d97706', color: isPending ? '#1D9E75' : '#d97706' }}
                  onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${responseId}/edit`)}
                >
                  {isPending ? 'Thêm phản hồi' : 'Chỉnh sửa'}
                </Button>
              )
            ) : (
              <Button icon={<CloseOutlined />} style={{ borderRadius: 6 }}
                onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${responseId}`)}>
                Hủy
              </Button>
            )}
          </div>
        </div>

        <Row gutter={20}>
          <Col span={9}>
            <div style={{ position: 'sticky', top: 24 }}>
              {ProfileCard}
            </div>
          </Col>

          <Col span={15}>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#fff',
            }}>
              {formSnapshot ? (
                <div style={!isEdit ? { pointerEvents: 'none', userSelect: 'none', opacity: 0.92 } : undefined}>
                  <SurveyPreview
                    form={formSnapshot}
                    compact={true}
                    initialValues={isPending && isEdit ? adminInitialValues : answers}
                    onSubmit={isEdit ? handleSubmit : undefined}
                    submitLabel={isPending ? 'Thêm phản hồi' : 'Lưu'}
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                  Không có form snapshot
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Lịch sử thao tác: ai, làm gì, sửa cái gì — hiển thị trong modal */}
        <Modal
          open={historyOpen}
          onCancel={() => setHistoryOpen(false)}
          footer={null}
          width={640}
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HistoryOutlined style={{ color: '#2563eb' }} /> Lịch sử thay đổi
            </span>
          }
        >
          <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingTop: 8 }}>
            {history.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 13 }}>Chưa có lịch sử thao tác nào.</Text>
            ) : (
              <Timeline
                items={history.map((h) => {
                  const meta = ACTION_META[h.action] ?? ACTION_META.update;
                  return {
                    color: meta.color,
                    dot: <span style={{ color: meta.color }}>{meta.icon}</span>,
                    children: (
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 600, color: meta.color, fontSize: 13 }}>{meta.label}</span>
                          <span style={{ fontSize: 13, color: '#1e293b' }}>
                            bởi <b>{h.actorName || 'Không rõ'}</b>
                          </span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>
                            {new Date(h.createdAt).toLocaleString('vi-VN', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {h.changes && h.changes.length > 0 && (
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {h.changes.map((c, i) => (
                              <div key={i} style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 6, padding: '6px 10px' }}>
                                <span style={{ fontWeight: 500, color: '#334155' }}>{c.questionTitle}</span>
                                <div style={{ marginTop: 2, wordBreak: 'break-word' }}>
                                  {h.action === 'update' ? (
                                    <>
                                      <span style={{ color: '#b91c1c', textDecoration: 'line-through' }}>{formatAnswerValue(c.before)}</span>
                                      <span style={{ color: '#94a3b8', margin: '0 6px' }}>→</span>
                                      <span style={{ color: '#15803d' }}>{formatAnswerValue(c.after)}</span>
                                    </>
                                  ) : (
                                    <span style={{ color: '#15803d' }}>{formatAnswerValue(c.after)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            )}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};