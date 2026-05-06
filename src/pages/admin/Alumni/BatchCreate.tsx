import React, { useState, useEffect } from 'react';
import {
  Form, Input, DatePicker, Select, Button, Alert,
  message, Typography, Spin } from 'antd';
import {
  ArrowLeftOutlined, CopyOutlined, EyeOutlined,
  CalendarOutlined, FormOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getForms, type FormType } from '../../../feature/form/api';
import { useCreateBatch } from '../../../feature/alumni/hooks/useCreateBatch';
import PreviewModal from '../../../components/common/PreviewModal';

const { Title, Text } = Typography;

export default function BatchCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { creating, createBatch } = useCreateBatch();
  const [forms, setForms] = useState<FormType[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [previewForm, setPreviewForm] = useState<FormType | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setLoadingForms(true);
    getForms().then(setForms).finally(() => setLoadingForms(false));
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const batch = await createBatch({
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      });
      if (batch?.surveyLink) {
        form.setFieldValue('surveyLink', batch.surveyLink);
        setCopySuccess(false);
      }
      message.success('Tạo đợt khảo sát thành công!');
    } catch {
      message.error('Tạo thất bại, vui lòng thử lại!');
    }
  };

  const handleCopy = () => {
    const link = form.getFieldValue('surveyLink');
    if (link) {
      navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <Button
        icon={<ArrowLeftOutlined />} type="text"
        style={{ marginBottom: 16, color: '#6b7280', padding: '0 4px' }}
        onClick={() => navigate('/admin/alumni')}
      >
        Quay lại danh sách
      </Button>

      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Đợt khảo sát mới</Title>
        <Text type="secondary">Tạo đợt khảo sát việc làm cho sinh viên tốt nghiệp</Text>
      </div>

      <div style={{
        background: 'white', borderRadius: 16, padding: 28,
        border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên đợt khảo sát" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input prefix={<FormOutlined style={{ color: '#9ca3af' }} />} placeholder="VD: Khảo sát việc làm 2024" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Chọn ngày' }]}>
              <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} placeholder="Chọn ngày" />
            </Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Chọn ngày' }]}>
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
            </Form.Item>
          </div>

          <Form.Item name="formId" label="Mẫu khảo sát" rules={[{ required: true, message: 'Chọn mẫu' }]}>
            <Select
              placeholder={loadingForms ? 'Loading...' : 'Chọn mẫu khảo sát'}
              loading={loadingForms}
              onChange={id => setSelectedForm(forms.find(f => f.id === id) ?? null)}
              options={forms.map(f => ({ value: f.id, label: f.title }))}
            />
          </Form.Item>

          {selectedForm && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
              padding: '12px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleFilled style={{ color: '#16a34a' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{selectedForm.title}</div>
                  <div style={{ color: '#6b7280' }}>{selectedForm.sections?.length ?? 0} phần · {selectedForm.sections?.reduce((a: number, s: any) => a + (s.questions?.length ?? 0), 0) ?? 0} câu hỏi</div>
                </div>
              </div>
              <Button
                icon={<EyeOutlined />} size="small" type="link"
                onClick={() => setPreviewForm(selectedForm)}
              >
                Xem trước
              </Button>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={creating} block style={{ height: 42, borderRadius: 8 }}>
              Tạo đợt khảo sát
            </Button>
          </Form.Item>
        </Form>

        <Form.Item name="surveyLink" style={{ marginBottom: 0 }}>
          <div style={{ display: 'none' }} />
        </Form.Item>

        {form.getFieldValue('surveyLink') && (
          <Alert
            type="success"
            message={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Link khảo sát</div>
                  <div style={{ color: '#374151', wordBreak: 'break-all' }}>{form.getFieldValue('surveyLink')}</div>
                </div>
                <Button
                  icon={copySuccess ? <CheckCircleFilled style={{ color: '#16a34a' }} /> : <CopyOutlined />}
                  onClick={handleCopy} type="text"
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            }
          />
        )}
      </div>

      <PreviewModal
        open={!!previewForm}
        form={previewForm}
        onClose={() => setPreviewForm(null)}
      />
    </div>
  );
}
