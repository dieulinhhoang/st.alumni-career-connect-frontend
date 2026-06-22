import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Typography,
  message,
} from 'antd';
import { CheckCircleOutlined, ReloadOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useGetEmailConfig, useUpdateEmailConfig, useSendTestEmail } from '../../../feature/mail-settings/hooks/query';

const { Text } = Typography;

const EmailConfigTab: React.FC = () => {
  const [form] = Form.useForm();
  const [testEmail, setTestEmail] = useState('');
  const [messageApi, ctx] = message.useMessage();

  const { data: config, isLoading, refetch } = useGetEmailConfig();
  const updateConfig = useUpdateEmailConfig();
  const sendTest = useSendTestEmail();

  useEffect(() => {
    if (config) {
      form.setFieldsValue({
        mailer: config.mailer || 'smtp',
        host: config.host,
        port: config.port,
        account: config.account,
        senderName: config.senderName,
        isActive: config.isActive,
        password: '',
      });
    }
  }, [config, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateConfig.mutateAsync(values);
      messageApi.success('Lưu cấu hình email thành công');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Lưu cấu hình thất bại';
      messageApi.error(msg);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) return messageApi.warning('Vui lòng nhập email nhận thử');
    try {
      await sendTest.mutateAsync(testEmail);
      messageApi.success('Đã gửi email kiểm tra thành công');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gửi email kiểm tra thất bại';
      messageApi.error(msg);
    }
  };

  return (
    <>
      {ctx}
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>Cấu hình Email</div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Thiết lập máy chủ SMTP để hệ thống gửi email tự động.
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Tải lại
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={updateConfig.isPending}
              onClick={handleSave}
              style={{ background: '#4f46e5' }}
            >
              Lưu cấu hình
            </Button>
          </div>
        </div>

        <Form form={form} layout="vertical" disabled={isLoading}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Loại kết nối" name="mailer" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="smtp">SMTP</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Máy chủ" name="host" rules={[{ required: true, message: 'Nhập host SMTP' }]}>
                <Input placeholder="smtp.gmail.com" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Cổng" name="port" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="587" min={1} max={65535} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tài khoản" name="account" rules={[{ required: true, message: 'Nhập tài khoản email' }]}>
                <Input placeholder="your@gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu / Mật khẩu ứng dụng"
                name="password"
                extra="Để trống nếu không muốn đổi mật khẩu"
              >
                <Input.Password placeholder="Mật khẩu ứng dụng" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Tên người gửi" name="senderName" rules={[{ required: true, message: 'Nhập tên người gửi' }]}>
                <Input placeholder="Khoa Công nghệ Thông tin – Học viện Nông nghiệp Việt Nam" />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message={
              <span>
                Với Gmail, bạn cần dùng <strong>Mật khẩu ứng dụng</strong>, không dùng mật khẩu đăng nhập Google thông thường.
                Nếu Mật khẩu ứng dụng từng bị lộ, hãy thu hồi mật khẩu cũ và tạo mật khẩu mới.
              </span>
            }
          />

          <Divider />

          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            {/* Kích hoạt */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Trạng thái cấu hình</div>
              <Form.Item name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tắt" />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
                Nếu không kích hoạt, hệ thống sẽ dùng email mặc định từ biến môi trường.
              </Text>
            </div>

            {/* Gửi thử */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Email nhận thử</div>
              <Input
                placeholder="email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>
                Nên lưu cấu hình trước khi gửi thử.
              </Text>
              <Button
                icon={<SendOutlined />}
                loading={sendTest.isPending}
                onClick={handleSendTest}
                style={{ background: '#0ea5e9', color: '#fff', border: 'none' }}
              >
                Gửi thử
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EmailConfigTab;
