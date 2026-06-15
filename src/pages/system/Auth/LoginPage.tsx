import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Card, Space } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { loginWithSSO } from '../../../feature/auth/api';

const { Title, Paragraph } = Typography;

const ERROR_MESSAGES_VI: Record<string, string> = {
  access_denied: 'Tài khoản của bạn không có quyền truy cập hệ thống quản trị.',
  missing_code: 'Đăng nhập SSO không thành công, vui lòng thử lại.',
  failed_to_get_access_token: 'Không thể lấy access token từ SSO, vui lòng thử lại.',
  failed_to_get_user_info: 'Không thể lấy thông tin người dùng từ SSO, vui lòng thử lại.',
  sso_callback_failed: 'Đăng nhập SSO thất bại, vui lòng thử lại sau.',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  useEffect(() => {
    if (!error && localStorage.getItem('accessToken')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [error, navigate]);

  const message = error
    ? ERROR_MESSAGES_VI[error] ?? 'Đã có lỗi xảy ra trong quá trình đăng nhập, vui lòng thử lại.'
    : 'Bạn đã đăng xuất khỏi hệ thống.';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <Card style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>
            Hệ Thống Khảo Sát Việc Làm
          </Title>
          <Paragraph type={error ? 'danger' : 'secondary'} style={{ margin: 0 }}>
            {message}
          </Paragraph>
          <Button type="primary" icon={<LoginOutlined />} size="large" onClick={loginWithSSO} block>
            Đăng nhập với SSO
          </Button>
        </Space>
      </Card>
    </div>
  );
}
