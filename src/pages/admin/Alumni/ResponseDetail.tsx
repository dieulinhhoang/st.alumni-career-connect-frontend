import React, { useState, useEffect } from 'react';
import { Button, Spin, Empty, Typography, Tag, Row, Col, message } from 'antd';
import {
  ArrowLeftOutlined, UserOutlined, MailOutlined,
  IdcardOutlined, BankOutlined, CalendarOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  BookOutlined, EditOutlined, CloseOutlined, FilePdfOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBatchById } from '../../../feature/alumni/api';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import AdminLayout from '../../../components/layout/AdminLayout';
import { KHOA_OPTIONS, NGANH_OPTIONS } from '../../../feature/alumni/constants';
import { SurveyPreview } from '../Form/Preview';
import { PDFCanvas } from '../Form/builder/Form';
import { useExportPDF } from '../../../feature/alumni/hooks/Useexportpdf';

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

  const [batch,    setBatch]    = useState<SurveyBatch | null>(null);
  const [response, setResponse] = useState<AlumniResponse | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  const pdfFilename = batch && response
    ? `phanhoi_${response.studentId}_${batch.title.replace(/\s+/g, '_')}.pdf`
    : 'phanhoi.pdf';
  const { containerRef: pdfRef, exporting, exportPDF } = useExportPDF(pdfFilename);

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
          danh sách
        </Button>
      </div>
    </AdminLayout>
  );

  const khoaLabel  = KHOA_OPTIONS.find(k => k.value === (response as any).khoa)?.label;
  const nganhLabel = (NGANH_OPTIONS[(response as any).khoa] ?? []).find((o: any) => o.value === (response as any).nganh)?.label;
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
              ? <><EditOutlined style={{ color: '#d97706', marginRight: 8 }} />Chỉnh sửa </>
              : ""}
          </Title>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isEdit && (
              <Button
                icon={<FilePdfOutlined />}
                loading={exporting}
                style={{ borderRadius: 6, borderColor: '#2563eb', color: '#2563eb' }}
                onClick={exportPDF}
              >
                Xuất PDF
              </Button>
            )}
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
        </div>

        {/* Layout chung — cả view lẫn edit đều dùng 2 cột */}
        <Row gutter={20}>
          {/* Cột trái: profile */}
          <Col span={isEdit ? 7 : 9}>
            <div style={{ position: 'sticky', top: 24 }}>
              {ProfileCard}
            </div>
          </Col>

          {/* Cột phải: form */}
          <Col span={isEdit ? 17 : 15}>
            {/* Form */}
            <div style={{
              border: isEdit ? '1px solid #fde68a' : '1px solid #e5e7eb',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#fff',
            }}>
              {formSnapshot ? (
                /* Khi xem: bọc pointer-events:none để không cho tương tác */
                <div style={!isEdit ? { pointerEvents: 'none', userSelect: 'none', opacity: 0.92 } : undefined}>
                  <SurveyPreview
                    form={formSnapshot}
                    compact={false}
                    initialValues={answers}
                    onSubmit={isEdit ? handleSubmit : undefined}
                    submitLabel="Lưu"
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

      {/* Hidden div */}
      {formSnapshot && (
        <div
          ref={pdfRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '-9999px',
            width: 794,
            background: '#fff',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          <PDFCanvas
            surveyTitle={(formSnapshot as any).surveyTitle ?? batch.title}
            descriptionParagraphs={(formSnapshot as any).descriptionParagraphs ?? []}
            sections={(formSnapshot as any).sections ?? []}
            questions={(formSnapshot as any).questions ?? []}
            accent={(formSnapshot as any).accent ?? '#2563eb'}
            header={(formSnapshot as any).header ?? {}}
            footer={(formSnapshot as any).footer ?? {}}
            interactive={false}
            initialValues={answers}
          />
        </div>
      )}
    </AdminLayout>
  );
};