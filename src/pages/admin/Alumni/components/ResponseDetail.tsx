import React, { useState, useEffect } from 'react';
import {
  Button, Spin, Empty, Input, Select, Space,
  Typography, Row, Col, Divider, Progress,
} from 'antd';
import {
  SearchOutlined, InfoCircleOutlined, BarChartOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CalendarOutlined, MessageOutlined,
  UserOutlined, StarOutlined, BankOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatchById } from '../../../feature/alumni/api';
import type { SurveyBatch, AlumniResponse } from '../../../feature/alumni/types';
import AdminLayout from '../../../components/layout/AdminLayout';
import CustomTable from '../../../components/common/CustomTable';
import type { ColumnsType } from 'antd/es/table';
import { KHOA_OPTIONS, NGANH_OPTIONS } from './constants';
import { StatCard } from './components/StatCard';

const { Text, Title } = Typography;

//  Inline SVG icons for StatCard ─
const IcBriefcase  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IcXCircle    = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const IcGradCap    = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>;
const IcCheckCirc  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IcStar       = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcBuilding   = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;

export const ResponseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch,   setBatch]   = useState<SurveyBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [khoa,    setKhoa]    = useState<string | undefined>(undefined);
  const [nganh,   setNganh]   = useState<string | undefined>(undefined);

  useEffect(() => { if (id) load(); }, [id]);

  const load = async () => {
    try { setBatch(await getBatchById(Number(id))); }
    catch (err) { console.error(err); }
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
  const hasJob    = Math.round(n * 0.615);
  const noJob     = n - hasJob;
  const relevant  = Math.round(n * 0.308);
  const rightFld  = Math.round(n * 0.154);
  const hasJobG   = Math.round(total * 0.615);
  const relevG    = Math.round(total * 0.308);

  const filtered = batch.responses.filter(r => {
    const q = search.toLowerCase();
    return (
      (r.studentName.toLowerCase().includes(q) || r.studentId?.toLowerCase().includes(q)) &&
      (filter === 'all' || r.status === filter) &&
      (!khoa  || (r as any).khoa  === khoa) &&
      (!nganh || (r as any).nganh === nganh)
    );
  });

  const columns: ColumnsType<AlumniResponse> = [
    {
      title: 'Sinh viên', key: 'student',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{r.studentName}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.studentEmail}</Text>
        </div>
      ),
    },
    {
      title: 'Mã SV', key: 'studentId', width: 120,
      render: (_, r) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.studentId}</Text>,
    },
    {
      title: 'Khoa', key: 'khoa', width: 180,
      render: (_, r) => (
        <Text style={{ fontSize: 12 }}>
          {KHOA_OPTIONS.find(k => k.value === (r as any).khoa)?.label || '—'}
        </Text>
      ),
    },
    {
      title: 'Ngành', key: 'nganh', width: 190,
      render: (_, r) => {
        const opts = NGANH_OPTIONS[(r as any).khoa] || [];
        return (
          <Text style={{ fontSize: 12 }}>
            {opts.find(o => o.value === (r as any).nganh)?.label || '—'}
          </Text>
        );
      },
    },
    {
      title: 'Trạng thái', key: 'status', width: 145,
      render: (_, r) => r.status === 'submitted' ? (
        <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <CheckCircleOutlined style={{ fontSize: 12 }} /> Đã hoàn thành
        </span>
      ) : (
        <span style={{ background: '#f5f5f5', color: '#595959', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
          Chưa phản hồi
        </span>
      ),
    },
    {
      title: 'Ngày phản hồi', key: 'submittedAt', width: 140,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          <ClockCircleOutlined style={{ marginRight: 5 }} />
          {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : '—'}
        </Text>
      ),
    },
    {
      title: '', key: 'action', width: 80,
      render: (_, r) => (
        <Button type="link" size="small" style={{ color: '#1D9E75', padding: 0 }}
          onClick={() => navigate(`/admin/alumni/batches/${id}/responses/${r.id}`)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>

        <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
          <span style={{ color: '#1D9E75', cursor: 'pointer' }} onClick={() => navigate('/admin/alumni/batches')}>
            Khảo sát việc làm
          </span>
          {' / '}Kết quả khảo sát
        </div>

        <Title level={4} style={{ color: '#1D9E75', marginBottom: 20 }}>
          Khảo sát: {batch.title}
        </Title>

        <Row gutter={20} style={{ marginBottom: 20 }}>
          <Col span={10}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20, height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 600, color: '#1D9E75', fontSize: 14 }}>
                <InfoCircleOutlined /> Thông tin khảo sát
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13.5 }}>
                <CalendarOutlined style={{ color: '#1D9E75' }} />
                <Text type="secondary">Năm khảo sát:</Text>
                <Text strong style={{ color: '#1D9E75' }}>{batch.year}</Text>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, marginBottom: 4 }}>
                  <UserOutlined style={{ color: '#1D9E75' }} />
                  <Text type="secondary">Đợt tốt nghiệp:</Text>
                </div>
                <div style={{ paddingLeft: 24 }}>
                  <Text style={{ color: '#1D9E75', fontSize: 13 }}>› {batch.graduationPeriod}</Text>
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text strong style={{ color: '#065f46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageOutlined /> Số lượt phản hồi:
                  </Text>
                  <Text strong style={{ fontSize: 16, color: '#065f46' }}>{submitted.length} / {batch.totalStudents}</Text>
                </div>
                <Progress percent={pct} size="small" strokeColor="#1D9E75" trailColor="#bbf7d0" showInfo={false} style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 12, color: '#059669' }}>↗ {pct}% đã phản hồi</Text>
              </div>

              <div style={{ background: isEnded ? '#fff1f2' : '#f0fdf4', border: `1px solid ${isEnded ? '#fecdd3' : '#bbf7d0'}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong style={{ color: isEnded ? '#9f1239' : '#065f46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClockCircleOutlined /> Thời gian khảo sát:
                  </Text>
                  {isEnded ? (
                    <span style={{ background: '#fee2e2', color: '#9f1239', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ExclamationCircleOutlined style={{ fontSize: 12 }} /> Đã kết thúc
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#1D9E75', fontSize: 14 }}>
                  <BarChartOutlined /> Thống kê tổng quan
                </div>
              </div>
              <Row gutter={[10, 10]}>
                <Col span={8}><StatCard icon={IcBriefcase} iconBg="#d1fae5" iconColor="#065f46" numerator={hasJob}   denominator={n}     label="Có việc làm / Phản hồi"      numColor="#065f46" barColor="#1D9E75" pctBg="#ffffff" pctColor="#065f46" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={IcXCircle}   iconBg="#fee2e2" iconColor="#9f1239" numerator={noJob}    denominator={n}     label="Chưa có việc làm / Phản hồi" numColor="#9f1239" barColor="#e11d48" pctBg="#fee2e2" pctColor="#9f1239" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={IcGradCap}   iconBg="#dbeafe" iconColor="#1e40af" numerator={hasJobG}  denominator={total} label="Có việc làm / Tốt nghiệp"     numColor="#1e40af" barColor="#2563eb" pctBg="#dbeafe" pctColor="#1e40af" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={IcCheckCirc} iconBg="#ccfbf1" iconColor="#0f766e" numerator={relevant} denominator={n}     label="Việc làm phù hợp / Phản hồi"  numColor="#0f766e" barColor="#0d9488" pctBg="#ccfbf1" pctColor="#0f766e" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={IcStar}      iconBg="#ffedd5" iconColor="#c2410c" numerator={relevG}   denominator={total} label="Việc làm phù hợp / TN"         numColor="#c2410c" barColor="#ea580c" pctBg="#ffedd5" pctColor="#c2410c" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
                <Col span={8}><StatCard icon={IcBuilding}  iconBg="#e0e7ff" iconColor="#4338ca" numerator={rightFld} denominator={n}     label="Đúng ngành / Phản hồi"         numColor="#4338ca" barColor="#4f46e5" pctBg="#e0e7ff" pctColor="#4338ca" cardBg="#ffffff" cardBorder="#e5e7eb" /></Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/*  Filter bar  */}
        <Space wrap style={{ marginBottom: 12 }}>
          <Input
            placeholder="Tìm tên, mã sinh viên…" allowClear
            prefix={<SearchOutlined />} value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Select value={filter} onChange={setFilter} style={{ width: 150 }}>
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="submitted">Đã phản hồi</Select.Option>
            <Select.Option value="pending">Chưa phản hồi</Select.Option>
          </Select>
          <Select allowClear value={khoa}
            onChange={v => { setKhoa(v); setNganh(undefined); }}
            style={{ width: 200 }} placeholder="Lọc theo khoa"
          >
            {KHOA_OPTIONS.map(k => <Select.Option key={k.value} value={k.value}>{k.label}</Select.Option>)}
          </Select>
          <Select allowClear value={nganh} onChange={setNganh}
            style={{ width: 220 }} placeholder="Lọc theo ngành" disabled={!khoa}
          >
            {(khoa ? NGANH_OPTIONS[khoa] ?? [] : []).map(o => (
              <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
            ))}
          </Select>
          <Text type="secondary">{filtered.length} sinh viên</Text>
        </Space>

        <CustomTable
          columns={columns}
          data={{ data: filtered, page: { total_elements: filtered.length, size: 10, page: 0 } }}
          loading={false}
          rowKey="id"
        />
      </div>
    </AdminLayout>
  );
};