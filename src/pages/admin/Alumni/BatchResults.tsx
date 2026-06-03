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
  EditOutlined, CloseCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatchById, getBatchResponses } from '../../../feature/alumni/api';
import { fetchGraduationStudents } from '../../../feature/graduation/api';
import type { GraduationStudent } from '../../../feature/graduation/type';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import AdminLayout from '../../../components/layout/AdminLayout';
import CustomTable from '../../../components/common/customTable';
import type { ColumnsType } from 'antd/es/table';
import { SurveyLinkModal } from './components/SurveyLinkModal';
import { KHOA_OPTIONS, NGANH_OPTIONS, getLopOptions } from '../../../feature/alumni/constants';

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
  const [gradStudents, setGradStudents] = useState<GraduationStudent[]>([]);

  useEffect(() => { if (id) load(); }, [id]);

  const mergedRows: AlumniResponse[] = React.useMemo(() => {
    if (!batch) return [];
    const responses = batch.responses ?? [];
    if (gradStudents.length === 0) return responses;
    const responseByCode = new Map<string, AlumniResponse>();
    responses.forEach(r => { if (r.studentId) responseByCode.set(r.studentId, r); });
    return gradStudents.map(gs => {
      const existing = responseByCode.get(gs.code);
      if (existing) return existing;
      return {
        id: -(gs.id),
        batchId: batch.id,
        studentId: gs.code,
        studentName: gs.full_name ?? `${gs.last_name ?? ''} ${gs.first_name ?? ''}`.trim(),
        studentEmail: gs.email ?? '',
        answers: {},
        submittedAt: '',
        status: 'pending' as any,
      } as AlumniResponse;
    });
  }, [batch, gradStudents]);

  const load = async () => {
    try {
      const [batchData, responses] = await Promise.all([
        getBatchById(Number(id)),
        getBatchResponses(Number(id)),
      ]);
      const mergedBatch = { ...batchData, responses: responses ?? [] };
      setBatch(mergedBatch);
      if (batchData.graduationId) {
        try {
          const studentsRes = await fetchGraduationStudents(batchData.graduationId, 1, 9999);
          setGradStudents(studentsRes.data);
        } catch (e) {
          console.warn('Không thể tải danh sách sinh viên tốt nghiệp:', e);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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

  const submitted  = (batch.responses ?? []).filter(r => r.status === 'submitted');
  const n          = submitted.length;
  const total      = batch.totalStudents ?? 0;
  const pct        = total ? Math.round(n / total * 100) : 0;
  const now        = new Date();
  const endDate    = new Date(batch.endDate);
  const isEnded    = now > endDate;
  const diffDays   = Math.round(Math.abs(now.getTime() - endDate.getTime()) / 86400000);
  const diffWeeks  = Math.floor(diffDays / 7);

  const filtered = mergedRows.filter(r => {
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
    // {
    //   title: 'Email', key: 'email', width: 220, align: 'center',
    //   render: (_, r) => <Text>{r.studentEmail || ''}</Text>,
    // },
    {
      title: 'Trạng thái', key: 'status', width: 140, align: 'center',
      render: (_, r) => r.status === 'submitted'
        ? <span > Đã phản hồi</span>
        : <span > Chưa phản hồi</span>,
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
          {/* ④ Icon màu rõ ràng */}
          <Tooltip title="Tải PDF">
            <Button
              size="small" type="text"
              icon={<FilePdfOutlined style={{ color: '#e53e3e', fontSize: 16 }} />}
              loading={exportingRow === r.id}
              onClick={async () => {
                // TODO: export single PDF
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
          <Tooltip title="Sửa">
            <Button
              size="small" type="text"
              icon={<EditOutlined style={{ color: '#d97706', fontSize: 16 }} />}
              onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}/edit`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      {/* ② Fix header bảng: đảm bảo font-size không bị override nhỏ */}
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
              <Text strong >{n} / {total}  ({pct}%)</Text>
            </div>
            <Progress percent={pct} size="small" showInfo={false} strokeColor="#1677ff" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#555' }}>
            <div><ClockCircleOutlined style={{ color: '#11c223' }} /> <Text type="secondary">Bắt đầu:</Text> {new Date(batch.startDate).toLocaleDateString('vi-VN')}</div>
            <div><ClockCircleOutlined style={{ color: '#d10d0d' }} /> <Text type="secondary">Kết thúc:</Text> {new Date(batch.endDate).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>

        {/* ③ Toolbar — giữ nút Xuất Excel / Xuất PDF nhưng chưa làm logic */}
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
              Bộ lọc{hasActiveFilter ? ' ●' : ''}
            </Button>
          </Space>

          <Space size={8}>
            <Button
              icon={<FileExcelOutlined style={{ color: '#16a34a' }} />}
              loading={exporting === 'excel'}
              onClick={() => {
                // TODO: export Excel
              }}
            >
              Xuất Excel
            </Button>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              loading={exporting === 'pdf'}
              onClick={() => {
                // TODO: export PDF
              }}
            >
              Xuất PDF
            </Button>
          </Space>
        </div>

        {/* Bộ lọc ẩn/hiện */}
        {showFilter && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
            marginBottom: 16, padding: 12, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6
          }}>
            <Select value={filter} onChange={setFilter} style={{ width: 160 }}>
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="submitted">Đã phản hồi</Select.Option>
              <Select.Option value="pending">Chưa phản hồi</Select.Option>
            </Select>
            <Select allowClear value={khoa} placeholder="Lọc theo khoa"
              onChange={v => { setKhoa(v); setNganh(undefined); setLop(undefined); }}
              style={{ width: 180 }}
            >
              {KHOA_OPTIONS.map(k => <Select.Option key={k.value} value={k.value}>{k.label}</Select.Option>)}
            </Select>
            <Select allowClear value={nganh} placeholder="Lọc theo ngành"
              onChange={v => { setNganh(v); setLop(undefined); }}
              style={{ width: 180 }} disabled={!khoa}
            >
              {(khoa ? NGANH_OPTIONS[khoa] ?? [] : []).map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
            </Select>
            <Select allowClear value={lop} placeholder="Lọc theo lớp"
              onChange={setLop} style={{ width: 140 }} disabled={!nganh}
            >
              {getLopOptions(nganh).map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
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