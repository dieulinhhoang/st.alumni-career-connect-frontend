import React, { useState, useEffect } from 'react';
import {
  Button, Spin, Empty, Input, Select, Space,
  Typography, Progress, Tooltip, message, Divider
} from 'antd';
import {
  ArrowLeftOutlined, SearchOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined, CalendarOutlined,
  FileExcelOutlined, FilePdfOutlined, FilterOutlined,
  EditOutlined, PlusCircleOutlined, CloseCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatchById, getBatchResponses } from '../../../feature/alumni/api';
import { useGraduationStudents } from '../../../feature/graduation/hooks/useGraduation';
import type { GraduationStudent } from '../../../feature/graduation/type';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import AdminLayout from '../../../components/layout/AdminLayout';
import CustomTable from '../../../components/common/customTable';
import type { ColumnsType } from 'antd/es/table';
import { SurveyLinkModal } from './components/SurveyLinkModal';
import { useExportAllPDF, domToPdfBlob } from '../../../feature/alumni/hooks/useExportAllPDF';
import type { ExportItem } from '../../../feature/alumni/hooks/useExportAllPDF';
import SurveyPreview from '../Form/Preview';
import { havePermission, getEffectiveFacultyId, getCurrentUser } from '../../../feature/auth/permission';
import { PermissionEnum } from '../../../feature/auth/type';
import { exportBatchExcel } from '../../../feature/alumni/exportBatchExcel';

const { Text, Title } = Typography;

// --- MAIN COMPONENT ---
export const BatchResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [batch,        setBatch]        = useState<SurveyBatch | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('all');
  const [khoa,         setKhoa]         = useState<string | undefined>(undefined);
  const [nganh,        setNganh]        = useState<string | undefined>(undefined);
  const [lop,          setLop]          = useState<string | undefined>(undefined);
  const [showLink,     setShowLink]     = useState(false);
  const [exporting,    setExporting]    = useState<'excel' | 'pdf' | null>(null);
  const [showFilter,   setShowFilter]   = useState(false);
  const [exportingRow, setExportingRow] = useState<number | string | null>(null);

  // Export toàn bộ PDF → ZIP
  const { exporting: exportingAll, progress: exportProgress, exportAll } = useExportAllPDF();
  // Ref tới container ẩn dùng để render SurveyPreview cho từng response
  const hiddenContainerRef = React.useRef<HTMLDivElement>(null);

  // Hook lấy toàn bộ sinh viên của đợt tốt nghiệp (không phân trang, load hết)
  const { data: gradStudents } = useGraduationStudents(batch?.graduationId ?? 0, 1, 9999);

  // Cán bộ khoa chỉ xem SV khoa mình. Admin xem toàn bộ, hoặc phạm vi khoa đang "đóng vai".
  const facultyScope = getEffectiveFacultyId() ?? undefined;

  const scopedGradStudents = React.useMemo(() => {
    if (!facultyScope) return gradStudents;
    return gradStudents.filter(
      s => String((s as any).faculty_id ?? (s as any).facultyId ?? '') === facultyScope
    );
  }, [gradStudents, facultyScope]);

  // Derive khoa + ngành trực tiếp từ scopedGradStudents
  const khoaOptions = React.useMemo(() => {
    const seen = new Map<string, string>();
    scopedGradStudents.forEach(s => {
      const id   = String((s as any).faculty_id ?? (s as any).facultyId ?? '');
      const name = (s as any).faculty_name ?? (s as any).facultyName ?? id;
      if (id && !seen.has(id)) seen.set(id, name);
    });
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [scopedGradStudents]);

  const nganhOptions = React.useMemo(() => {
    const seen = new Map<string, string>();
    scopedGradStudents.forEach(s => {
      const studentFacultyId = String((s as any).faculty_id ?? (s as any).facultyId ?? '');
      if (khoa && studentFacultyId !== khoa) return;
      const id   = String(s.training_industry_id ?? (s as any).trainingIndustryId ?? '');
      const name = s.training_industry_name ?? (s as any).trainingIndustryName ?? s.training_industry_code ?? id;
      if (id && !seen.has(id)) seen.set(id, name);
    });
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [scopedGradStudents, khoa]);

  useEffect(() => { if (id) load(); }, [id]);

  /**
   * mergedRows — merge gradStudents với responses:
   * - SV đã phản hồi: lấy response + thêm faculty/industry từ gradStudent
   * - SV chưa phản hồi: tạo row pending từ student data
   */
  const mergedRows: AlumniResponse[] = React.useMemo(() => {
    if (!batch) return [];
    const responses = batch.responses ?? [];
    if (scopedGradStudents.length === 0) {
      // Không có dữ liệu SV tốt nghiệp khớp khoa — cán bộ khoa không thấy phản hồi của khoa khác
      return facultyScope
        ? responses.filter(r => String((r as any).faculty_id ?? (r as any).facultyId ?? '') === facultyScope)
        : responses;
    }
    const responseByCode = new Map<string, AlumniResponse>();
    responses.forEach(r => { if (r.studentId) responseByCode.set(r.studentId, r); });
    return scopedGradStudents.map(gs => {
      const existing = responseByCode.get(gs.code);
      if (existing) return {
        ...existing,
        faculty_id: (gs as any).faculty_id,
        faculty_name: (gs as any).faculty_name,
        training_industry_id: gs.training_industry_id,
        training_industry_name: gs.training_industry_name,
        training_industry_code: gs.training_industry_code,
      } as AlumniResponse;
      return {
        id: -(gs.id),
        batchId: batch.id,
        studentId: gs.code,
        studentName: gs.full_name ?? `${gs.last_name ?? ''} ${gs.first_name ?? ''}`.trim(),
        studentEmail: gs.email ?? '',
        answers: {},
        submittedAt: '',
        status: 'pending' as any,
        faculty_id: (gs as any).faculty_id,
        faculty_name: (gs as any).faculty_name,
        training_industry_id: gs.training_industry_id,
        training_industry_name: gs.training_industry_name,
        training_industry_code: gs.training_industry_code,
      } as AlumniResponse;
    });
  }, [batch, scopedGradStudents, facultyScope]);

  const load = async () => {
    try {
      const [batchData, responses] = await Promise.all([
        getBatchById(Number(id)),
        getBatchResponses(Number(id)),
      ]);
      const mergedBatch = { ...batchData, responses: responses ?? [] };
      setBatch(mergedBatch);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export toàn bộ phản hồi đã submit thành từng PDF → đóng ZIP tải xuống.
   * Dùng chính SurveyPreview (readOnly) để render — đảm bảo PDF y hệt giao diện xem thật.
   */
  const handleExportAllPDF = async () => {
    if (!batch || !hiddenContainerRef.current) return;

    const formSnapshot = (batch as any).formSnapshot ?? null;
    if (!formSnapshot) {
      message.warning('Không tìm thấy form snapshot để xuất PDF.');
      return;
    }

    const submittedRows = filtered.filter(r => r.status === 'submitted');
    if (!submittedRows.length) {
      message.warning('Không có phản hồi nào để xuất.');
      return;
    }

    const container = hiddenContainerRef.current;
    const { createRoot } = await import('react-dom/client');

    const items: ExportItem[] = [];

    for (const row of submittedRows) {
      // Tạo div tạm, width 794px = A4
      const slot = document.createElement('div');
      slot.style.cssText = 'width:794px;background:#fff;position:relative;';
      container.appendChild(slot);

      await new Promise<void>(resolve => {
        createRoot(slot).render(
          <SurveyPreview
            form={formSnapshot}
            initialValues={(row as any).answers ?? {}}
            compact={true}
          />
        );
        // Đợi React render + ảnh logo load
        setTimeout(resolve, 200);
      });

      // Đợi thêm nếu có ảnh chưa load xong
      await Promise.all(
        Array.from(slot.querySelectorAll<HTMLImageElement>('img')).map(img =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); })
        )
      );

      const safe = (row.studentName ?? row.studentId ?? 'unknown')
        .replace(/[^\w\u00C0-\u024F\u1E00-\u1EFF ]/g, '')
        .trim()
        .replace(/\s+/g, '_');
      const filename = `${row.studentId}_${safe}.pdf`;
      items.push({ filename, el: slot });
    }

    const zipName = `${batch.title.replace(/\s+/g, '_')}_phan-hoi.zip`;
    await exportAll(items, zipName);

    // Dọn sạch sau khi export xong
    container.innerHTML = '';
  };

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    </AdminLayout>
  );

  if (!batch) return (
    <AdminLayout>
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Empty description="Không tìm thấy dữ liệu" />
      </div>
    </AdminLayout>
  );

  // Đếm phản hồi theo đúng cohort đang hiển thị (mergedRows), KHÔNG đếm cả
  // batch.responses thô — vì response của SV không thuộc đợt tốt nghiệp (VD dữ liệu
  // test SV00099) sẽ không hiện trong bảng nhưng vẫn bị cộng vào tiến độ → lệch số.
  const n          = mergedRows.filter(r => r.status === 'submitted').length;

  // FIX: Ưu tiên gradStudents.length (thực tế đã load),
  // fallback về batch.totalStudents nếu gradStudents chưa load xong
  const total = gradStudents.length > 0
    ? gradStudents.length
    : (batch.totalStudents || 0);

  const pct        = total > 0 ? Math.round(n / total * 100) : 0;
  const now        = new Date();
  const endDate    = new Date(batch.endDate);
  const isEnded    = now > endDate;
  // Admin toàn quyền → vẫn sửa/thêm được sau khi hết hạn; các vai trò khác thì bị khóa
  const lockEdit   = isEnded && !getCurrentUser().isAdmin;
  const diffDays   = Math.round(Math.abs(now.getTime() - endDate.getTime()) / 86400000);

  // Filter client-side
  const filtered = mergedRows.filter(r => {
    const q = search.toLowerCase();
    return (
      (r.studentName.toLowerCase().includes(q) || r.studentId?.toLowerCase().includes(q)) &&
      (filter === 'all' || r.status === filter) &&
      (!khoa  || String((r as any).faculty_id) === khoa) &&
      (!nganh || String((r as any).training_industry_id) === nganh) &&
      (!lop   || (r as any).class_name === lop || (r as any).lop === lop)
    );
  });

  const hasActiveFilter = filter !== 'all' || !!khoa || !!nganh || !!lop;

  const columns: ColumnsType<AlumniResponse> = [
    {
      title: 'STT', key: 'stt', width: 60, align: 'center',
      render: (_, __, i) => <Text type="secondary">{i + 1}</Text>,
    },
    {
      title: 'Mã SV', key: 'studentId', width: 120, align: 'center',
      render: (_, r) => <Text style={{ fontFamily: 'monospace' }}>{r.studentId}</Text>,
    },
    {
      title: 'Họ tên', key: 'name', align: 'center', width: 150,
      render: (_, r) => <Text>{r.studentName}</Text>,
    },
    {
      title: 'Trạng thái', key: 'status', width: 140, align: 'center',
      render: (_, r) => r.status === 'submitted'
        ? <span> Đã phản hồi</span>
        : <span> Chưa phản hồi</span>,
    },
    {
      title: 'Ngày phản hồi', key: 'submittedAt', width: 160, align: 'center',
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {r.submittedAt
            ? new Date(r.submittedAt).toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
            : ''}
        </Text>
      ),
    },
    {
      title: 'Thao tác', key: 'action', width: 110, align: 'center',
      render: (_, r) => (
        <Space size={8}>
          <Tooltip title="Tải PDF">
            <Button
              size="small" type="text"
              icon={<FilePdfOutlined style={{ color: '#e53e3e', fontSize: 16 }} />}
              loading={exportingRow === r.id}
              disabled={r.status !== 'submitted'}
              onClick={async () => {
                if (!batch || !(batch as any).formSnapshot) return;
                const container = hiddenContainerRef.current;
                if (!container) return;
                setExportingRow(r.id);
                try {
                  const { createRoot } = await import('react-dom/client');

                  const slot = document.createElement('div');
                  slot.style.cssText = 'width:794px;background:#fff;';
                  container.appendChild(slot);

                  await new Promise<void>(res => {
                    createRoot(slot).render(
                      <SurveyPreview
                        form={(batch as any).formSnapshot}
                        initialValues={(r as any).answers ?? {}}
                        compact={true}
                      />
                    );
                    setTimeout(res, 200);
                  });

                  await Promise.all(
                    Array.from(slot.querySelectorAll<HTMLImageElement>('img')).map(img =>
                      img.complete ? Promise.resolve()
                        : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); })
                    )
                  );

                  const blob = await domToPdfBlob(slot);
                  const safe = (r.studentName ?? r.studentId ?? 'sv')
                    .replace(/[^\w\u00C0-\u024F\u1E00-\u1EFF ]/g, '').trim().replace(/\s+/g, '_');
                  const url = URL.createObjectURL(blob);
                  const a   = document.createElement('a');
                  a.href = url; a.download = `phanhoi_${r.studentId}_${safe}.pdf`;
                  document.body.appendChild(a); a.click();
                  document.body.removeChild(a); URL.revokeObjectURL(url);
                  container.innerHTML = '';
                } finally {
                  setExportingRow(null);
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
              size="small" type="text"
              icon={<InfoCircleOutlined style={{ color: '#2563eb', fontSize: 16 }} />}
              onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}`)}
            />
          </Tooltip>
          {havePermission(PermissionEnum.SURVEYS_UPDATE) && (
            r.status === 'pending' ? (
              <Tooltip title={lockEdit ? 'Đợt khảo sát đã kết thúc' : 'Thêm phản hồi'}>
                <Button
                  size="small" type="text"
                  disabled={lockEdit}
                  icon={<PlusCircleOutlined style={{ color: lockEdit ? '#cbd5e1' : '#1D9E75', fontSize: 16 }} />}
                  onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}/edit`)}
                />
              </Tooltip>
            ) : (
              <Tooltip title={lockEdit ? 'Đợt khảo sát đã kết thúc' : 'Sửa phản hồi'}>
                <Button
                  size="small" type="text"
                  disabled={lockEdit}
                  icon={<EditOutlined style={{ color: lockEdit ? '#cbd5e1' : '#d97706', fontSize: 16 }} />}
                  onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}/edit`)}
                />
              </Tooltip>
            )
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <style>{`
        .ant-table-thead > tr > th {
          font-size: 14px !important;
          font-weight: 600 !important;
        }
      `}</style>

      <div style={{ padding: 24 }}>

        {/* Header điều hướng */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/alumni/batches')} />
          <div>
            <div style={{ fontSize: 12, color: '#888' }}>
              <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => navigate('/admin/alumni/batches')}>
                Khảo sát việc làm
              </span>
              {' / '}Kết quả khảo sát
            </div>
            <Title level={4} style={{ margin: 0 }}>{batch.title}</Title>
          </div>
        </div>

        {/* Khối thông tin khảo sát */}
        <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 24, maxWidth: 600 }}>
          <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
            <div><Text type="secondary">Đợt tốt nghiệp:</Text> <Text strong>{batch.graduationPeriod}</Text></div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <Text type="secondary">Tiến độ phản hồi</Text>
              <Text strong>
                {n} / {total > 0 ? total : (gradStudents.length > 0 ? gradStudents.length : '...')} ({pct}%)
              </Text>
            </div>
            <Progress percent={pct} size="small" showInfo={false} strokeColor="#1677ff" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#555' }}>
            <div><ClockCircleOutlined style={{ color: '#11c223' }} /> <Text type="secondary">Bắt đầu:</Text> {new Date(batch.startDate).toLocaleDateString('vi-VN')}</div>
            <div><ClockCircleOutlined style={{ color: '#d10d0d' }} /> <Text type="secondary">Kết thúc:</Text> {new Date(batch.endDate).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space size={8}>
            <Input
              placeholder="Tìm theo mã SV hoặc họ tên" allowClear
              prefix={<SearchOutlined />} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 260 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilter(v => !v)}
              type={hasActiveFilter ? 'primary' : 'default'}
              ghost={hasActiveFilter}
            >
              Bộ lọc
            </Button>
          </Space>

          <Space size={8}>
            <Button
              icon={<FileExcelOutlined style={{ color: '#16a34a' }} />}
              loading={exporting === 'excel'}
              onClick={async () => {
                const questions = (batch as any).formSnapshot?.questions ?? [];

                const formatAnswer = (raw: any, q: any): string => {
                  if (raw == null || raw === '') return '';
                  if ((q.type === 'address' || q.type === 'address-province') && typeof raw === 'object') {
                    return Object.values(raw).filter(Boolean).join(', ');
                  }
                  if (q.type === 'cccd' && typeof raw === 'object') {
                    const v = raw as any;
                    return [v.number, v.issueDate, v.issuePlace].filter(Boolean).join(' / ');
                  }
                  if (Array.isArray(raw)) return raw.join(', ');
                  return String(raw);
                };

                const dataRows = filtered.map((r, i) => [
                  i + 1,
                  r.studentId ?? '',
                  r.studentName ?? '',
                  (r as any).faculty_name ?? '',
                  (r as any).training_industry_name ?? '',
                  r.status === 'submitted' ? 'Đã phản hồi' : 'Chưa phản hồi',
                  r.submittedAt ? new Date(r.submittedAt).toLocaleString('vi-VN') : '',
                  ...questions.map((q: any) => formatAnswer(r.answers?.[q.id], q)),
                ]);

                setExporting('excel');
                try {
                  await exportBatchExcel({
                    batchTitle: batch.title,
                    graduationPeriod: batch.graduationPeriod,
                    progressText: `${n} / ${total} (${pct}%)`,
                    startDate: new Date(batch.startDate).toLocaleDateString('vi-VN'),
                    endDate: new Date(batch.endDate).toLocaleDateString('vi-VN'),
                    questionTitles: questions.map((q: any) => q.title ?? ''),
                    rows: dataRows,
                  });
                } catch (e) {
                  console.error('[exportBatchExcel]', e);
                  message.error('Xuất Excel thất bại.');
                } finally {
                  setExporting(null);
                }
              }}
            >
              Xuất Excel
            </Button>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              loading={exportingAll}
              onClick={handleExportAllPDF}
            >
              {exportingAll
                ? `Đang xuất... ${exportProgress}%`
                : 'Xuất PDF (ZIP)'}
            </Button>
          </Space>
        </div>

        {/* Bộ lọc ẩn/hiện */}
        {showFilter && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
            marginBottom: 16, padding: 12, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6
          }}>
            {/* Lọc trạng thái */}
            <Select value={filter} onChange={setFilter} style={{ width: 160 }}>
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="submitted">Đã phản hồi</Select.Option>
              <Select.Option value="pending">Chưa phản hồi</Select.Option>
            </Select>

            {/* Lọc Khoa — cán bộ khoa đã bị khóa theo khoa mình, không cần chọn */}
            {!facultyScope && (
              <Select
                allowClear
                value={khoa}
                placeholder="Lọc theo khoa"
                onChange={v => { setKhoa(v); setNganh(undefined); setLop(undefined); }}
                style={{ width: 200 }}
              >
                {khoaOptions.map(k => (
                  <Select.Option key={k.value} value={k.value}>{k.label}</Select.Option>
                ))}
              </Select>
            )}

            {/* Lọc Ngành — phụ thuộc khoa đã chọn */}
            <Select
              allowClear
              value={nganh}
              placeholder="Lọc theo ngành"
              onChange={v => { setNganh(v); setLop(undefined); }}
              style={{ width: 220 }}
              disabled={!khoa}
            >
              {nganhOptions.map(o => (
                <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
              ))}
            </Select>

            {hasActiveFilter && (
              <Button size="small" type="link" danger
                onClick={() => { setFilter('all'); setKhoa(undefined); setNganh(undefined); setLop(undefined); }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}

        {/* Bảng danh sách */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Danh sách sinh viên ({filtered.length})</Text>
          </div>
          <div id="alumni-table">
          <CustomTable
            columns={columns}
            data={filtered}
            loading={false}
            rowKey="id"
          />
          </div>
        </div>
      </div>

      <SurveyLinkModal
        batchId={id}
        batchTitle={batch.title}
        open={showLink}
        onClose={() => setShowLink(false)}
      />

      {/* Progress overlay khi đang xuất PDF */}
      {exportingAll && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px 48px',
            textAlign: 'center', minWidth: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
            <FilePdfOutlined style={{ fontSize: 36, color: '#e53e3e', marginBottom: 16 }} />
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
              Đang xuất PDF...
            </div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
              Đang xử lý {filtered.filter(r => r.status === 'submitted').length} phản hồi
            </div>
            <Progress percent={exportProgress} strokeColor="#e53e3e" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Vui lòng không đóng trang này</div>
          </div>
        </div>
      )}

      {/* Container ẩn dùng để render SurveyPreview khi export */}
      <div
        ref={hiddenContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          width: 794,
          background: '#fff',
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      />
    </AdminLayout>
  );
};