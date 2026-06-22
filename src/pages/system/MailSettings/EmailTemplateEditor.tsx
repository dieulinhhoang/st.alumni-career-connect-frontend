import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Skeleton,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetTemplate,
  useGetTemplatePreview,
  useUpdateTemplate,
} from '../../../feature/mail-settings/hooks/query';
import { TEMPLATE_SECTIONS, TEMPLATE_VARIABLES } from '../../../feature/mail-settings/types';
import AdminLayout from '../../../components/layout/AdminLayout';

const { Text, Title } = Typography;

const EmailTemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const templateId = Number(id);
  const navigate = useNavigate();
  const [messageApi, ctx] = message.useMessage();

  const [form] = Form.useForm();
  const [showPreview, setShowPreview] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const { data: template, isLoading } = useGetTemplate(templateId);
  const updateTemplate = useUpdateTemplate(templateId);
  const { data: previewData, isLoading: previewLoading, refetch: refetchPreview } = useGetTemplatePreview(templateId, showPreview);

  const sections = template ? (TEMPLATE_SECTIONS[template.type] ?? []) : [];
  const variables = template ? (TEMPLATE_VARIABLES[template.type] ?? []) : [];

  useEffect(() => {
    if (template) {
      const fields: Record<string, string> = { subject: template.subject };
      sections.forEach((s) => {
        fields[`section_${s.key}`] = template.sections?.[s.key] ?? '';
      });
      form.setFieldsValue(fields);
      setIsActive(template.isActive);
    }
  }, [template]);

  const insertVariable = (varKey: string) => {
    const token = `{{${varKey}}}`;
    if (!focusedField) return;
    const ta = textareaRefs.current[focusedField];
    if (ta) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const current = form.getFieldValue(focusedField) || '';
      const next = current.slice(0, start) + token + current.slice(end);
      form.setFieldValue(focusedField, next);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + token.length, start + token.length);
      }, 0);
    } else {
      const current = form.getFieldValue(focusedField) || '';
      form.setFieldValue(focusedField, current + token);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newSections: Record<string, string> = {};
      sections.forEach((s) => {
        newSections[s.key] = values[`section_${s.key}`] ?? '';
      });
      await updateTemplate.mutateAsync({ subject: values.subject, sections: newSections, isActive });
      messageApi.success('Lưu template thành công');
      if (showPreview) refetchPreview();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Lưu thất bại';
      messageApi.error(msg);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Skeleton active paragraph={{ rows: 8 }} />
      </AdminLayout>
    );
  }

  if (!template) {
    return (
      <AdminLayout>
        <Alert type="error" message="Không tìm thấy template" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {ctx}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/mail-settings')}>
          Quay lại
        </Button>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0 }}>
            {template.name}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {template.description}
          </Text>
        </div>
        <Switch
          checked={isActive}
          onChange={setIsActive}
          checkedChildren="Kích hoạt"
          unCheckedChildren="Tắt"
        />
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setShowPreview((v) => !v);
            if (!showPreview) refetchPreview();
          }}
        >
          {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={updateTemplate.isPending}
          onClick={handleSave}
          style={{ background: '#4f46e5' }}
        >
          Lưu cấu hình
        </Button>
      </div>

      <Row gutter={20}>
        {/* Editor */}
        <Col span={showPreview ? 12 : 16}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tiêu đề email (Subject)"
              name="subject"
              rules={[{ required: true, message: 'Nhập tiêu đề email' }]}
            >
              <Input
                onFocus={() => setFocusedField('subject')}
              />
            </Form.Item>

            <Divider style={{ margin: '12px 0' }} />

            {sections.map((sec) => (
              <Form.Item key={sec.key} label={sec.label} name={`section_${sec.key}`}>
                {sec.multiline ? (
                  <Input.TextArea
                    rows={4}
                    ref={(el) => { textareaRefs.current[`section_${sec.key}`] = el?.resizableTextArea?.textArea ?? null; }}
                    onFocus={() => setFocusedField(`section_${sec.key}`)}
                  />
                ) : (
                  <Input
                    ref={(el) => { textareaRefs.current[`section_${sec.key}`] = el?.input ?? null; }}
                    onFocus={() => setFocusedField(`section_${sec.key}`)}
                  />
                )}
              </Form.Item>
            ))}
          </Form>
        </Col>

        {/* Variables panel + Preview */}
        <Col span={showPreview ? 12 : 8}>
          {/* Variables */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 10, color: '#0369a1' }}>
              Biến Có Thể Dùng
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
              Click vào biến để chèn vào vị trí con trỏ trong nội dung bên trái.
            </Text>
            {variables.map((v) => (
              <Tooltip key={v.key} title={v.desc} placement="left">
                <div
                  onClick={() => insertVariable(v.key)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    marginBottom: 6,
                    background: '#fff',
                    border: '1px solid #e0f2fe',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <Tag color="blue" style={{ fontFamily: 'monospace', margin: 0 }}>
                    {v.label}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {v.desc}
                  </Text>
                </div>
              </Tooltip>
            ))}
            {variables.length === 0 && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Không có biến cho loại template này.
              </Text>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#475569',
                }}
              >
                Xem trước email
              </div>
              {previewLoading ? (
                <div style={{ padding: 24 }}>
                  <Skeleton active paragraph={{ rows: 6 }} />
                </div>
              ) : (
                <iframe
                  srcDoc={previewData?.html ?? ''}
                  style={{ width: '100%', height: 480, border: 'none' }}
                  title="email-preview"
                  sandbox="allow-same-origin"
                />
              )}
            </div>
          )}
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default EmailTemplateEditor;
