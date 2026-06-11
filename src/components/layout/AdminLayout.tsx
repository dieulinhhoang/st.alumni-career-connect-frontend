import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  DownOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  SolutionOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Avatar, Drawer, Badge, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetAdminProfile } from '../../feature/adminProfile/hook/query';

const { Header, Sider, Content } = Layout;

/* Map route -> tiêu đề tiếng Việt cho breadcrumb */
const ROUTE_TITLE_VI: Record<string, string> = {
  '/admin/dashboard': 'Bảng điều khiển',
  '/admin/faculties': 'Khoa',
  '/admin/enterprises': 'Doanh nghiệp đối tác',
  '/admin/graduation': 'Đợt tốt nghiệp',
  '/admin/forms': 'Cấu hình form',
  '/admin/alumni/batches': 'Khảo sát việc làm',
  '/admin/statistics': 'Biểu đồ thống kê',
  '/admin/employment-stats': 'Thống kê việc làm',
  '/admin/reports': 'Báo cáo tổng hợp',
  '/admin/resources': 'Tài nguyên',
  '/admin/roles': 'Vai trò',
  '/admin/users': 'Người dùng',
  '/admin/profile': 'Hồ sơ cá nhân',
};

/* Sidebar menu – phẳng, tiếng Việt */
const MENU_ITEMS = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Bảng điều khiển</Link> },
  { key: '/admin/faculties', icon: <TeamOutlined />, label: <Link to="/admin/faculties">Khoa</Link> },

  { type: 'divider' as const },

  { key: '/admin/enterprises', icon: <BankOutlined />, label: <Link to="/admin/enterprises">Doanh nghiệp đối tác</Link> },
  { key: '/admin/graduation', icon: <SolutionOutlined />, label: <Link to="/admin/graduation">Đợt tốt nghiệp</Link> },

  { type: 'divider' as const },

  { key: '/admin/forms', icon: <FileTextOutlined />, label: <Link to="/admin/forms">Cấu hình form</Link> },
  { key: '/admin/alumni/batches', icon: <IdcardOutlined />, label: <Link to="/admin/alumni/batches">Khảo sát việc làm</Link> },

  { type: 'divider' as const },

  { key: '/admin/statistics', icon: <BarChartOutlined />, label: <Link to="/admin/statistics">Biểu đồ thống kê</Link> },
  { key: '/admin/reports', icon: <FileSearchOutlined />, label: <Link to="/admin/reports">Báo cáo tổng hợp</Link> },

  { type: 'divider' as const },

  { key: '/admin/resources', icon: <AppstoreOutlined />, label: <Link to="/admin/resources">Tài nguyên</Link> },
  { key: '/admin/roles', icon: <SafetyCertificateOutlined />, label: <Link to="/admin/roles">Vai trò</Link> },
  { key: '/admin/users', icon: <UsergroupAddOutlined />, label: <Link to="/admin/users">Người dùng</Link> },
];

/* Global styles – chỉnh nhẹ menu, bỏ search */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');

  body { font-family: 'Be Vietnam Pro', sans-serif !important; }

  .al-sider { overflow-y: auto !important; overflow-x: hidden !important; }
  .al-sider::-webkit-scrollbar { width: 4px; }
  .al-sider::-webkit-scrollbar-track { background: transparent; }
  .al-sider::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 99px; }

  .al-menu.ant-menu-inline,
  .al-menu.ant-menu-inline-collapsed {
    border-right: none !important;
  }

  .al-menu .ant-menu-item {
    border-radius: 6px !important;
    margin: 2px 8px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 15px !important;
    font-weight: 500 !important;
  }

  @media (max-width: 480px) { .al-avatar-name { display: none !important; } }
`;

/* Logo VNUA */
const SiderLogo: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div
    style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      // Bug #1 fix: typo `justify` → `justifyContent`
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? 0 : '0 16px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      gap: 10,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <img
        src="/logovua.png"
        alt="VNUA"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
    {!collapsed && (
      <div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 17,
            color: '#ffffff',
            lineHeight: 1.1,
          }}
        >
         Bảng điều khiển
        </div>
      </div>
    )}
  </div>
);

const AdminLayout: React.FC<{ children?: React.ReactNode; onCollapse?: (v: boolean) => void }> = ({
  children,
  onCollapse,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { data: profile } = useGetAdminProfile();
  const displayName = profile?.fullName || profile?.userName || 'Người dùng';
  const displayRole = profile?.roleName || 'Quản trị viên';
  const displayEmail = profile?.email || '';
  const avatarLetter = displayName.trim().charAt(0).toUpperCase();

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);
  };

  const SIDER_W = 240;
  const SIDER_COLLAPSED = 80;
  const contentLeft = isMobile ? 0 : collapsed ? SIDER_COLLAPSED : SIDER_W;

  // Bug #8 fix: Breadcrumb hỗ trợ dynamic routes (không chỉ exact match)
  const getPageLabel = (pathname: string): string => {
    if (ROUTE_TITLE_VI[pathname]) return ROUTE_TITLE_VI[pathname];
    if (/^\/admin\/bao-cao\//.test(pathname)) return 'Báo cáo khoa';
    if (/^\/admin\/faculties\//.test(pathname)) return 'Chi tiết khoa';
    if (/^\/admin\/enterprises\//.test(pathname)) return 'Chi tiết doanh nghiệp';
    if (/^\/admin\/graduation\//.test(pathname)) return 'Chi tiết đợt tốt nghiệp';
    if (/^\/admin\/alumni\/batches\//.test(pathname)) return 'Chi tiết đợt khảo sát';
    if (/^\/admin\/statistics\//.test(pathname)) return 'Chỉ số thống kê';
    if (/^\/admin\/forms\//.test(pathname)) return 'Cấu hình form';
    return 'Trang hiện tại';
  };
  const pageLabel = getPageLabel(location.pathname);
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/sso/redirect`;
};
  const userDropdownMenu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '2px 0 4px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{displayName}</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{displayEmail}</div>
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' as const },
      { key: '/admin/profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === '/admin/profile') navigate('/admin/profile');
      else if (key === 'logout') handleLogout();
    },
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Sider dark */}
      {!isMobile && (
        <Sider
          className="al-sider"
          theme="dark"
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={SIDER_COLLAPSED}
          width={SIDER_W}
          style={{
            background: '#001529',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <SiderLogo collapsed={collapsed} />
          <Menu
            className="al-menu"
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={MENU_ITEMS}
            style={{ padding: '8px 0 16px' }}
          />
        </Sider>
      )}

      {/* Drawer mobile - Bug #6 fix: bodyStyle deprecated → styles.body */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={260}
        styles={{ body: { padding: 0, background: '#001529' } }}
      >
        <SiderLogo collapsed={false} />
        <Menu
          className="al-menu"
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={MENU_ITEMS}
          onClick={() => setDrawerOpen(false)}
          style={{ padding: '8px 0 16px' }}
        />
      </Drawer>

      {/* Main area */}
      <Layout
        style={{
          marginLeft: contentLeft,
          transition: 'margin-left 0.2s ease',
          background: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile ? (
              <>
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => setDrawerOpen(true)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 6,
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
                  Bảng điều khiển
                </span>
              </>
            ) : (
              <Tooltip title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"} placement="bottom">
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={toggleCollapse}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 6,
                  }}
                />
              </Tooltip>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge count={3} size="small" offset={[-4, 4]}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                style={{ width: 38, height: 38, borderRadius: 6 }}
              />
            </Badge>

            <Dropdown menu={userDropdownMenu} trigger={['click']} placement="bottomRight">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 8px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Avatar
                  size={32}
                  style={{
                    background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {avatarLetter}
                </Avatar>
                <div className="al-avatar-name" style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{displayRole}</div>
                </div>
                <DownOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: 24 }}>
          <div
            style={{
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 500,
              color: '#94a3b8',
            }}
          >
            <Link
              to="/admin/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#64748b',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              className="breadcrumb-link-hover"
            >
              <HomeOutlined style={{ fontSize: 13 }} />
              <span>Trang quản trị</span>
            </Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 700 }}>{pageLabel}</span>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: 42,
              border: '1px solid #f1f5f9',
              minHeight: 500,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            
            }}
          >
            {children}
          </div>
        </Content>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '12px 24px',
            fontSize: 12,
            color: '#94a3b8',
            fontWeight: 500,
          }}
        >
          © {new Date().getFullYear()} ST TEAM
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;