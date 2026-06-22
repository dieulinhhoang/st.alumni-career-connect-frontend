import React, { useState, useEffect } from 'react';
import { Button, Spin, Empty, Typography, Tag, Row, Col, message } from 'antd';
import {
  ArrowLeftOutlined, UserOutlined, MailOutlined,
  IdcardOutlined, BankOutlined, CalendarOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  BookOutlined, EditOutlined, CloseOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBatchById, getBatchResponses, updateResponse, createResponseByAdmin } from '../../../feature/alumni/api';
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

  useEffect(() => { if (id) load(); }, [id, responseId]);

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
    set(5, gradStudent.citizen_identification);
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
      </div>
    </AdminLayout>
  );
};