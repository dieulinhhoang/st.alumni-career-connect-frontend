import React, { useState, useEffect } from 'react';
import {
  Form, Input, DatePicker, Select, Button, Alert,
  message, Typography, Spin,
} from 'antd';
import {
  ArrowLeftOutlined, CopyOutlined, EyeOutlined,
  CalendarOutlined, FormOutlined, CheckCircleFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getForms, type FormType } from '../../../feature/form/api';
import { useCreateBatch } from '../../../feature/alumni/hooks/useCreateBatch';
import { getGraduations, type GraduationOption } from '../../../feature/alumni/api';
import Preview from '../Form/Preview';
import AdminLayout from '../../../components/layout/AdminLayout';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export const BatchCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [publishedForms, setPublishedForms]   = useState<FormType[]>([]);
  const [selectedForm,   setSelectedForm]     = useState<FormType | null>(null);
  const [loadingForms,   setLoadingForms]     = useState(true);
  const [graduations,    setGraduations]      = useState<GraduationOption[]>([]);
  const [loadingGrads,   setLoadingGrads]     = useState(true);
  const { create, loading: creating } = useCreateBatch();

  useEffect(() => { loadPublishedForms(); loadGraduations(); }, []);

  const loadPublishedForms = async () => {
    try {
      const res = await getForms({ pageSize: 100 });
      setPublishedForms(res.data.filter((f: any) => f.status === 'published'));
    } catch {
      message.error('Không thể tải danh sách form');
    } finally {
      setLoadingForms(false);
    }
  };

  const loadGraduations = async () => {
    try {
      const data = await getGraduations();
      setGraduations(data);
    } catch {
      message.error('Không thể tải danh sách đợt tốt nghiệp');
    } finally {
      setLoadingGrads(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!selectedForm) { message.warning('Vui lòng chọn form khảo sát'); return; }
    const [s, e] = values.dateRange;

    // Lấy thông tin đợt tốt nghiệp đã chọn
    const grad = graduations.find(g => g.id === values.graduationId);
    if (!grad) { message.warning('Vui lòng chọn đợt tốt nghiệp'); return; }

    const newBatch = await create({
      title:            values.title,
      formId:           selectedForm.id!,
      formSnapshot:     { ...selectedForm, status: 'published' },
      startDate:        s.format('YYYY-MM-DD'),
      endDate:          e.format('YYYY-MM-DD'),
      graduationId:     grad.id,
      graduationPeriod: grad.name,
      year:             grad.schoolYear,   // kept for legacy display
      totalStudents:    grad.studentCount ?? 0,
      status:           'active',
    });
    if (newBatch) {
      message.success('Tạo đợt khảo sát thành công!');
      navigate('/admin/alumni/batches');
    }
  };

  const hasSelectedForm = !!selectedForm;

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/alumni/batches')} style={{ borderRadius: 6 }}>
           
          </Button>
          <Title level={4} style={{ margin: 0 }}>Tạo đợt khảo sát mới</Title>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: hasSelectedForm ? '1fr 1fr' : '1fr',
          gap: 20, alignItems: 'start',
          maxWidth: hasSelectedForm ? '100%' : 680,
        }}>

          {/*  Form card  */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1D9E75', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FormOutlined /> Thông tin đợt khảo sát
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="VD: Khảo sát tình hình việc làm của sinh viên tốt nghiệp năm 2025" style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item label="Thời gian khảo sát" name="dateRange" rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}>
                <RangePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%', borderRadius: 6 }} />
              </Form.Item>

              {/* Single graduation dropdown — replaces separate year + graduationPeriod */}
              <Form.Item
                label="Đợt tốt nghiệp"
                name="graduationId"
                rules={[{ required: true, message: 'Vui lòng chọn đợt tốt nghiệp' }]}
              >
                {loadingGrads ? (
                  <div style={{ textAlign: 'center', padding: '8px 0' }}><Spin size="small" /></div>
                ) : (
                  <Select
                    placeholder="Chọn đợt tốt nghiệp từ danh sách"
                    style={{ borderRadius: 6 }}
                    optionFilterProp="label"
                    showSearch
                    notFoundContent={
                      <div style={{ textAlign: 'center', color: '#bfbfbf', padding: 8 }}>
                        Không có đợt tốt nghiệp nào trong hệ thống
                      </div>
                    }
                  >
                    {graduations.map(g => (
                      <Select.Option key={g.id} value={g.id} label={g.name}>
                        <div style={{ lineHeight: 1.5 }}>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{g.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {g.schoolYear ? `Năm học ${g.schoolYear}` : ''}
                            {g.certificationDate ? ` · ${new Date(g.certificationDate).toLocaleDateString('vi-VN')}` : ''}
                          </div>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Alert
                message="Thông tin đợt tốt nghiệp không thể sửa sau khi tạo"
                type="warning" showIcon
                style={{ marginBottom: 16, borderRadius: 6 }}
              />

              {/* Form selector */}
              <Form.Item label="Chọn form khảo sát">
                <FormSelector
                  forms={publishedForms}
                  loading={loadingForms}
                  selected={selectedForm}
                  onSelect={setSelectedForm}
                />
              </Form.Item>

              <Button
                type="primary" htmlType="submit"
                loading={creating} disabled={!hasSelectedForm} block
                icon={<CopyOutlined />}
                style={{
                  background:   hasSelectedForm ? '#1D9E75' : undefined,
                  borderColor:  hasSelectedForm ? '#1D9E75' : undefined,
                  borderRadius: 6, fontWeight: 500, height: 40,
                }}
              >
                Tạo đợt &amp; nhân bản form
              </Button>
            </Form>
          </div>

          {/*  Preview pane  */}
          <div style={{ position: 'sticky', top: 24 }}>
            {selectedForm ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', borderBottom: '1px solid #f0f0f0',
                }}>
                  <Text strong style={{ fontSize: 14 }}>{selectedForm.name}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* <Text style={{ color: '#1D9E75', fontSize: 12, fontWeight: 500 }}>Đã xuất bản</Text> */}
                    <Button size="small" icon={<ArrowLeftOutlined />} onClick={() => setSelectedForm(null)} style={{ borderRadius: 5, fontSize: 12 }}>
                      Bỏ chọn
                    </Button>
                  </div>
                </div>
                <div style={{ padding: 16, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  <Preview form={selectedForm} compact />
                </div>
              </div>
            ) : (
              <div style={{
                background: '#fafafa', border: '1px dashed #d9d9d9',
                borderRadius: 10, height: 360,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <CalendarOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
                <Text type="secondary">Chọn form để xem trước</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

interface FormSelectorProps {
  forms: any[];
  loading: boolean;
  selected: any | null;
  onSelect: (form: any) => void;
}

const FormSelector: React.FC<FormSelectorProps> = ({ forms, loading, selected, onSelect }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 16 }}><Spin size="small" /></div>;
  }

  if (forms.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '24px 16px',
        border: '1px dashed #d9d9d9', borderRadius: 8, color: '#bfbfbf',
      }}>
        <FormOutlined style={{ fontSize: 20, display: 'block', marginBottom: 6 }} />
        Chưa có form nào được xuất bản
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
      {forms.map((f, i) => {
        const active = selected?.id === f.id;
        return (
          <div
            key={f.id}
            onClick={() => onSelect(f)}
            style={{
              padding: '10px 14px', cursor: 'pointer',
              background: active ? '#f0fdf4' : '#fff',
              borderBottom: i < forms.length - 1 ? '1px solid #f0f0f0' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'background .15s',
              borderLeft: active ? '3px solid #1D9E75' : '3px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {active
                ? <CheckCircleFilled style={{ color: '#1D9E75', fontSize: 15 }} />
                : <div style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid #d9d9d9' }} />
              }
              <div>
                <div style={{ fontSize: 10, color: '#1D9E75', fontWeight: 500, marginBottom: 1 }}>Khảo sát việc làm</div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{f.name}</div>
                <Text type="secondary" style={{ fontSize: 11 }}>{f.questions?.length || 0} câu hỏi</Text>
              </div>
            </div>
            <Button
              size="small" icon={<EyeOutlined />} style={{ borderRadius: 5 }}
              onClick={e => { e.stopPropagation(); onSelect(f); }}
            >
              Xem
            </Button>
          </div>
        );
      })}
    </div>
  );
};