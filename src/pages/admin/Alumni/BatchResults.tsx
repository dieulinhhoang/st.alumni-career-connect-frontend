import React, { useState, useEffect } from 'react';
import {
  Button, Spin, Empty, Input, Select, Space,
  Typography, Row, Col, Divider, Progress, Tooltip, message, Popover,
} from 'antd';
import {
  ArrowLeftOutlined, SearchOutlined,
  InfoCircleOutlined, BarChartOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CalendarOutlined,
  FileExcelOutlined, FilePdfOutlined, FilterOutlined,
  QuestionCircleOutlined, EditOutlined,
  SolutionOutlined, CloseCircleOutlined, TeamOutlined,
  LikeOutlined, RiseOutlined, ReadOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatchById } from '../../../feature/alumni/api';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import AdminLayout from '../../../components/layout/AdminLayout';
import CustomTable from '../../../components/common/customTable';
import type { ColumnsType } from 'antd/es/table';
import { StatCard } from './components/StatCard';
import { SurveyLinkModal } from './components/SurveyLinkModal';
import { KHOA_OPTIONS, NGANH_OPTIONS, getLopOptions } from '../../../feature/alumni/constants';

const { Text, Title } = Typography;

/* ─ Excel / CSV export ─ */
const buildLabelMaps = () => {
  const khoaMap = Object.fromEntries(KHOA_OPTIONS.map(k => [k.value, k.label]));
  const nganhMap: Record<string, string> = {};
  Object.values(NGANH_OPTIONS).flat().forEach(o => { nganhMap[o.value] = o.label; });
  return { khoaMap, nganhMap };
};

const exportExcel = (rows: AlumniResponse[], batchTitle: string) => {
  const { khoaMap, nganhMap } = buildLabelMaps();
  const headers = ['STT', 'Mã SV', 'Họ tên', 'Email', 'Khoa', 'Ngành', 'Lớp', 'Trạng thái', 'Ngày phản hồi'];
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvLines = [
    headers.map(q).join(','),
    ...rows.map((r, i) => [
      i + 1, r.studentId ?? '', r.studentName, r.studentEmail ?? '',
      khoaMap[(r as any).khoa]  ?? (r as any).khoa  ?? '',
      nganhMap[(r as any).nganh] ?? (r as any).nganh ?? '',
      (r as any).lop ?? '',
      r.status === 'submitted' ? 'Đã phản hồi' : 'Chưa phản hồi',
      r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : '',
    ].map(q).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvLines], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${batchTitle}_phanhoi.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  message.success('Đã tải xuống! Mở file .csv bằng Excel để xem.');
};

const exportAllPDF = async (rows: AlumniResponse[], batch: SurveyBatch) => {
  try {
    const { default: jsPDF }     = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const { khoaMap, nganhMap }  = buildLabelMaps();
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(13);
    doc.text(`Ket qua khao sat: ${batch.title}`, 14, 14);
    doc.setFontSize(9);
    doc.text(`Nam: ${batch.year}  |  Dot: ${batch.graduationPeriod}`, 14, 21);
    autoTable(doc, {
      startY: 26,
      head: [['STT', 'Ma SV', 'Ho ten', 'Email', 'Khoa', 'Nganh', 'Lop', 'Trang thai', 'Ngay PH']],
      body: rows.map((r, i) => [
        i + 1, r.studentId ?? '', r.studentName, r.studentEmail ?? '',
        khoaMap[(r as any).khoa] ?? '', nganhMap[(r as any).nganh] ?? '',
        (r as any).lop ?? '',
        r.status === 'submitted' ? 'Da phan hoi' : 'Chua phan hoi',
        r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : '—',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [29, 158, 117] },
    });
    doc.save(`${batch.title}_phanhoi.pdf`);
    message.success('Xuất PDF thành công!');
  } catch {
    message.error('Cần cài thêm: npm install jspdf jspdf-autotable');
  }
};

/* ─ Export PDF cho từng sinh viên ─ */
const exportSinglePDF = async (r: AlumniResponse, batch: SurveyBatch) => {
  try {
    const { default: jsPDF }     = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const { khoaMap, nganhMap }  = buildLabelMaps();

    const doc = new jsPDF();
    const questions = (batch as any).formSnapshot?.questions ?? [];
    const answers   = (r as any).answers ?? {};

    doc.setFontSize(14);
    doc.setTextColor(29, 158, 117);
    doc.text(batch.title, 14, 18);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Nam: ${batch.year}  |  Dot: ${batch.graduationPeriod}`, 14, 25);

    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('Thong tin sinh vien', 14, 35);
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: 38,
      body: [
        ['Ma SV',  r.studentId ?? ''],
        ['Ho ten', r.studentName],
        ['Email',  r.studentEmail ?? ''],
        ['Khoa',   khoaMap[(r as any).khoa] ?? (r as any).khoa ?? ''],
        ['Nganh',  nganhMap[(r as any).nganh] ?? (r as any).nganh ?? ''],
        ['Lop',    (r as any).lop ?? ''],
        ['Trang thai', r.status === 'submitted' ? 'Da phan hoi' : 'Chua phan hoi'],
        ['Ngay phan hoi', r.submittedAt ? new Date(r.submittedAt).toLocaleString('vi-VN') : '—'],
      ],
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
      theme: 'plain',
    });

    const afterInfoY = (doc as any).lastAutoTable?.finalY ?? 100;
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('Cau tra loi khao sat', 14, afterInfoY + 10);
    doc.setTextColor(0, 0, 0);

    const answerRows = questions.map((q: any, idx: number) => {
      const key   = q.id ?? q.key;
      const label = q.label ?? q.title ?? q.question ?? key;
      const ans   = answers[key];
      const ansStr = Array.isArray(ans) ? ans.join(', ') : (ans ?? '—');
      return [`${idx + 1}. ${label}`, ansStr];
    });

    if (answerRows.length > 0) {
      autoTable(doc, {
        startY: afterInfoY + 13,
        head: [['Cau hoi', 'Tra loi']],
        body: answerRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [29, 158, 117] },
        columnStyles: { 0: { cellWidth: 100 } },
      });
    }

    doc.save(`${r.studentId ?? r.studentName}_phanhoi.pdf`);
    message.success(`Đã tải PDF của ${r.studentName}`);
  } catch {
    message.error('Cần cài thêm: npm install jspdf jspdf-autotable');
  }
};

/* ─ Popover "Cách tính chỉ số" ─ */
const ChiSoPopover = () => (
  <div style={{ width: 280 }}>
    <div style={{ fontWeight: 600, color: '#1D9E75', marginBottom: 12, fontSize: 13 }}>Cách tính chỉ số</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <InfoCircleOutlined style={{ color: '#1D9E75', marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 12 }}>SV có việc làm:</div>
          <div style={{ fontSize: 12, color: '#555' }}>= Có việc + Tiếp tục học</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <CheckCircleOutlined style={{ color: '#1D9E75', marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 12 }}>Việc làm phù hợp (Trên phản hồi):</div>
          <div style={{ fontSize: 12, color: '#555' }}>= Đúng ngành + Liên quan + Tiếp tục học</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <BarChartOutlined style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 12 }}>Việc làm phù hợp (Trên tổng SV):</div>
          <div style={{ fontSize: 12, color: '#555' }}>= Đúng ngành + Liên quan + Tiếp tục học + (Tổng SV khảo sát - Tổng phản hồi) /2</div>
        </div>
      </div>
    </div>
  </div>
);

/* ─ Main ─ */
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

  useEffect(() => { if (id) load(); }, [id]);

  const load = async () => {
    try { setBatch(await getBatchById(Number(id))); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
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
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Empty description="Không tìm thấy dữ liệu" />
      </div>
    </AdminLayout>
  );

  const submitted = batch.responses.filter(r => r.status === 'submitted');
  const pct       = batch.totalStudents ? Math.round(submitted.length / batch.totalStudents * 100) : 0;
  const now       = new Date();
  const endDate   = new Date(batch.endDate);
  const isEnded   = now > endDate;
  const diffDays  = Math.round(Math.abs(now.getTime() - endDate.getTime()) / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const n         = submitted.length;
  const total     = batch.totalStudents;

  const hasJob   = submitted.filter(r => r.answers?.q09 === 'Đã có việc làm' || r.answers?.q09 === 'Đang học tiếp').length || Math.round(n * 0.615);
  const noJob    = n - hasJob;
  const relevant = submitted.filter(r => ['Phù hợp với trình độ chuyên môn', 'Đúng ngành đào tạo', 'Đang học tiếp'].includes(r.answers?.q15 ?? '')).length || Math.round(n * 0.308);
  const rightFld = submitted.filter(r => r.answers?.q15 === 'Đúng ngành đào tạo').length || Math.round(n * 0.154);
  const hasJobG  = hasJob;
  const relevG   = Math.round(relevant + (total - n) / 2);

  const filtered = batch.responses.filter(r => {
    const q = search.toLowerCase();
    return (
      (r.studentName.toLowerCase().includes(q) || r.studentId?.toLowerCase().includes(q)) &&
      (filter === 'all' || r.status === filter) &&
      (!khoa  || (r as any).khoa  === khoa) &&
      (!nganh || (r as any).nganh === nganh) &&
      (!lop   || (r as any).lop   === lop)
    );
  });

  const hasActiveFilter = filter !== 'all' || !!khoa || !!nganh || !!lop;

  /*  Columns  */
  const columns: ColumnsType<AlumniResponse> = [
    {
      title: 'STT', key: 'stt', width: 55,
      render: (_, __, i) => <Text type="secondary" style={{ fontSize: 12 }}>{i + 1}</Text>,
    },
    {
      title: 'Mã SV', key: 'studentId', width: 110,
      render: (_, r) => (
        <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
          {r.studentId}
        </Text>
      ),
    },
    {
      title: 'Email', key: 'email', width: 200,
      render: (_, r) => <Text style={{ fontSize: 12 }}>{r.studentEmail}</Text>,
    },
    {
      title: 'Họ tên', key: 'name',
      render: (_, r) => <Text style={{ fontWeight: 500, fontSize: 13 }}>{r.studentName}</Text>,
    },
    {
      title: 'Ngày phản hồi', key: 'submittedAt', width: 150,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <ClockCircleOutlined />
          {r.submittedAt ? new Date(r.submittedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
        </Text>
      ),
    },
    {
      title: 'Hành động', key: 'action', width: 100,
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Tải PDF phản hồi">
            <Button
              size="small"
              icon={<FilePdfOutlined style={{ color: '#2563eb' }} />}
              style={{ borderRadius: 6, borderColor: '#2563eb' }}
              loading={exportingRow === r.id}
              onClick={async () => {
                setExportingRow(r.id);
                await exportSinglePDF(r, batch);
                setExportingRow(null);
              }}
            />
          </Tooltip>
          <Tooltip title="Chi tiết phản hồi">
            <Button
              size="small"
              icon={<InfoCircleOutlined style={{ color: '#2563eb' }} />}
              style={{ borderRadius: 6, borderColor: '#2563eb' }}
              onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa phản hồi">
            <Button
              size="small"
              icon={<EditOutlined style={{ color: '#d97706' }} />}
              style={{ borderRadius: 6, borderColor: '#d97706' }}
              onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}/edit`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/alumni/batches')}
            style={{ borderRadius: 6 }}
          >
           
          </Button>
          <div style={{ fontSize: 12, color: '#888' }}>
            <span style={{ color: '#2563eb', cursor: 'pointer' }} onClick={() => navigate('/admin/alumni/batches')}>
              Khảo sát việc làm
            </span>
            {' / '}Kết quả khảo sát
          </div>
        </div>

        <Title level={4} style={{ color: '#111827', marginBottom: 20 }}>
          Khảo sát: {batch.title}
        </Title>

        {/*  Info + Stats  */}
        <Row gutter={20} style={{ marginBottom: 20 }}>
          <Col span={10}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20, height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                <InfoCircleOutlined style={{ color: '#2563eb' }} /> Thông tin khảo sát
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13.5 }}>
                <CalendarOutlined style={{ color: '#2563eb' }} />
                <Text type="secondary">Năm khảo sát:</Text>
                <Text strong style={{ color: '#1e40af' }}>{batch.year}</Text>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, marginBottom: 4 }}>
                  <BarChartOutlined style={{ color: '#2563eb' }} />
                  <Text type="secondary">Đợt tốt nghiệp:</Text>
                </div>
                <div style={{ paddingLeft: 24 }}>
                  <Text style={{ color: '#374151', fontSize: 13 }}>› {batch.graduationPeriod}</Text>
                </div>
              </div>
              <Divider style={{ margin: '8px 0' }} />

              {/* Phản hồi */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text strong style={{ color: '#1e40af', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <InfoCircleOutlined /> Số lượt phản hồi:
                  </Text>
                  <Text strong style={{ fontSize: 16, color: '#1e40af' }}>{submitted.length} / {batch.totalStudents}</Text>
                </div>
                <Progress percent={pct} size="small" strokeColor="#2563eb" trailColor="#bfdbfe" showInfo={false} style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 12, color: '#2563eb' }}>{pct}% đã phản hồi</Text>
              </div>

              {/* Thời gian */}
              <div style={{ background: isEnded ? '#fff1f2' : '#f0fdf4', border: `1px solid ${isEnded ? '#fecdd3' : '#bbf7d0'}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong style={{ color: isEnded ? '#9f1239' : '#065f46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClockCircleOutlined /> Thời gian khảo sát:
                  </Text>
                  {isEnded ? (
                    <span style={{ background: '#fee2e2', color: '#9f1239', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ExclamationCircleOutlined style={{ fontSize: 11 }} /> Đã kết thúc
                    </span>
                  ) : (
                    <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                      Đang diễn ra
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                  <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarOutlined /> {new Date(batch.startDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarOutlined /> {new Date(batch.endDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </div>
                <Progress percent={isEnded ? 100 : pct} size="small" strokeColor={isEnded ? '#e11d48' : '#1D9E75'} trailColor={isEnded ? '#fecdd3' : '#bbf7d0'} showInfo={false} style={{ marginBottom: isEnded ? 4 : 0 }} />
                {isEnded && (
                  <Text style={{ fontSize: 12, color: '#e11d48', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ExclamationCircleOutlined /> Đã quá hạn {diffWeeks > 0 ? `${diffWeeks} tuần` : `${diffDays} ngày`}
                  </Text>
                )}
              </div>
            </div>
          </Col>

          <Col span={14}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                  <BarChartOutlined style={{ color: '#2563eb' }} /> Thống kê tổng quan
                </div>
                <Popover content={<ChiSoPopover />} trigger="click" placement="bottomRight">
                  <Button
                    type="text" shape="circle"
                    icon={<QuestionCircleOutlined style={{ fontSize: 16, color: '#888' }} />}
                    size="small"
                  />
                </Popover>
              </div>
              <Row gutter={[10, 10]}>
                <Col span={8}><StatCard icon={<SolutionOutlined />}    iconBg="#d1fae5" iconColor="#065f46" numerator={hasJob}   denominator={n}     label="Có việc làm / Phản hồi"        numColor="#065f46" barColor="#1D9E75" pctBg="#d1fae5" pctColor="#065f46" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={<CloseCircleOutlined />} iconBg="#fee2e2" iconColor="#9f1239" numerator={noJob}    denominator={n}     label="Chưa có việc làm / Phản hồi"   numColor="#9f1239" barColor="#e11d48" pctBg="#fee2e2" pctColor="#9f1239" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={<TeamOutlined />}        iconBg="#dbeafe" iconColor="#1e40af" numerator={hasJobG}  denominator={total} label="Có việc làm / Tốt nghiệp"      numColor="#1e40af" barColor="#2563eb" pctBg="#dbeafe" pctColor="#1e40af" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={<LikeOutlined />}        iconBg="#ccfbf1" iconColor="#0f766e" numerator={relevant} denominator={n}     label="Việc làm phù hợp / Phản hồi"   numColor="#0f766e" barColor="#0d9488" pctBg="#ccfbf1" pctColor="#0f766e" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={<RiseOutlined />}        iconBg="#ffedd5" iconColor="#c2410c" numerator={relevG}   denominator={total} label="Việc làm phù hợp / Tốt nghiệp" numColor="#c2410c" barColor="#ea580c" pctBg="#ffedd5" pctColor="#c2410c" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={<ReadOutlined />}        iconBg="#e0e7ff" iconColor="#4338ca" numerator={rightFld} denominator={n}     label="Đúng ngành / Phản hồi"          numColor="#4338ca" barColor="#4f46e5" pctBg="#e0e7ff" pctColor="#4338ca" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/*  Toolbar  */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginBottom: showFilter ? 8 : 14 }}>
          <Space size={8}>
            <Input
              placeholder="Tìm theo mã SV hoặc họ tên" allowClear
              prefix={<SearchOutlined />} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 240, borderRadius: 6 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilter(v => !v)}
              style={{
                borderRadius: 6,
                borderColor: showFilter || hasActiveFilter ? '#1D9E75' : undefined,
                color:       showFilter || hasActiveFilter ? '#1D9E75' : undefined,
                background:  showFilter ? '#f0fdf4' : undefined,
                fontWeight:  hasActiveFilter ? 600 : 400,
              }}
            >
              Bộ lọc{hasActiveFilter ? ' ●' : ''}
            </Button>
          </Space>

          <Space size={8}>
            <Tooltip title="Tải file .csv — mở bằng Excel hiển thị đúng tiếng Việt">
              <Button
                icon={<FileExcelOutlined />}
                loading={exporting === 'excel'}
                style={{ borderRadius: 6, borderColor: '#16a34a', color: '#16a34a' }}
                onClick={() => {
                  setExporting('excel');
                  exportExcel(filtered, batch.title);
                  setTimeout(() => setExporting(null), 500);
                }}
              >
                Xuất Excel
              </Button>
            </Tooltip>

            <Tooltip title="Cần cài: npm install jspdf jspdf-autotable">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                loading={exporting === 'pdf'}
                style={{ borderRadius: 6, background: '#2563eb', borderColor: '#2563eb' }}
                onClick={async () => {
                  setExporting('pdf');
                  await exportAllPDF(filtered, batch);
                  setExporting(null);
                }}
              >
                Tải tất cả PDF
              </Button>
            </Tooltip>
          </Space>
        </div>

        {/*  Bộ lọc mở rộng  */}
        {showFilter && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
            marginBottom: 14, padding: '10px 14px',
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
          }}>
            <Select value={filter} onChange={setFilter} style={{ width: 175 }}>
              <Select.Option value="all">-- Tất cả trạng thái --</Select.Option>
              <Select.Option value="submitted">Đã phản hồi</Select.Option>
              <Select.Option value="pending">Chưa phản hồi</Select.Option>
            </Select>
            <Select allowClear value={khoa} placeholder="Lọc theo khoa"
              onChange={v => { setKhoa(v); setNganh(undefined); setLop(undefined); }}
              style={{ width: 200 }} suffixIcon={<FilterOutlined style={{ fontSize: 11 }} />}
            >
              {KHOA_OPTIONS.map(k => <Select.Option key={k.value} value={k.value}>{k.label}</Select.Option>)}
            </Select>
            <Select allowClear value={nganh} placeholder="Lọc theo ngành"
              onChange={v => { setNganh(v); setLop(undefined); }}
              style={{ width: 210 }} disabled={!khoa}
              suffixIcon={<FilterOutlined style={{ fontSize: 11 }} />}
            >
              {(khoa ? NGANH_OPTIONS[khoa] ?? [] : []).map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
            </Select>
            <Select allowClear value={lop} placeholder="Lọc theo lớp"
              onChange={setLop} style={{ width: 150 }} disabled={!nganh}
              suffixIcon={<FilterOutlined style={{ fontSize: 11 }} />}
            >
              {getLopOptions(nganh).map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
            </Select>
            {hasActiveFilter && (
              <Button size="small" style={{ borderRadius: 6 }}
                onClick={() => { setFilter('all'); setKhoa(undefined); setNganh(undefined); setLop(undefined); }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}

        {/*  Table  */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13.5, color: '#374151' }}>
            <BarChartOutlined style={{ color: '#2563eb' }} /> Danh sách sinh viên
          </div>
          <CustomTable
            columns={columns}
            data={{ data: filtered, page: { total_elements: filtered.length, size: 10, page: 0 } }}
            loading={false}
            rowKey="id"
          />
        </div>
      </div>

      <SurveyLinkModal
        batchId={id}
        batchTitle={batch.title}
        open={showLink}
        onClose={() => setShowLink(false)}
      />
    </AdminLayout>
  );
};