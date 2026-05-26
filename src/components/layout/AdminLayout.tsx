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

const { Header, Sider, Content } = Layout;

/* Map route -> tiêu đề tiếng Việt cho breadcrumb */
const ROUTE_TITLE_VI: Record<string, string> = {
  '/admin/dashboard': 'Bảng điều khiển',
  '/admin/faculties': 'Khoa',
  '/admin/enterprises': 'Doanh nghiệp đối tác',
  '/admin/graduation': 'Đợt tốt nghiệp',
  '/admin/allforms': 'Cấu hình form',
  '/admin/alumni/batches': 'Khảo sát việc làm',
  '/admin/statistics': 'Biểu đồ thống kê',
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

  { key: '/admin/allforms', icon: <FileTextOutlined />, label: <Link to="/admin/allforms">Cấu hình form</Link> },
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
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? 0 : '0 16px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      gap: 10,
      flexShrink: 0,
    }}
  >
    {/* Thay src bằng đường dẫn logo VNUA thật của bạn */}
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

  const pageLabel = ROUTE_TITLE_VI[location.pathname] ?? 'Trang hiện tại';

  const userDropdownMenu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '2px 0 4px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Quản trị viên</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>admin@example.com</div>
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
      else if (key === 'logout') navigate('/');
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

      {/* Drawer mobile */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={260}
        bodyStyle={{ padding: 0, background: '#001529' }}
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
        {/* Header – KHÔNG còn thanh tìm kiếm */}
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
              <Tooltip title={collapsed } placement="bottom">
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
                icon={<BellOutlined style={{ fontSize: 16, color: '#64748b' }} />}
                style={{ width: 36, height: 36, borderRadius: 999 }}
              />
            </Badge>

            <Dropdown trigger={['click']} menu={userDropdownMenu}>
              <Button
                type="text"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0 10px 0 4px',
                  height: 40,
                  borderRadius: 999,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Avatar
                  size={26}
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminPro"
                />
                <span
                  className="al-avatar-name"
                  style={{ fontWeight: 600, fontSize: 13.5, color: '#0f172a' }}
                >
                  Quản trị viên
                </span>
                <DownOutlined style={{ fontSize: 9, color: '#94a3b8' }} />
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: 24 }}>
          {/* Breadcrumb tiếng Việt */}
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              fontWeight: 500,
              color: '#94a3b8',
            }}
          >
            <HomeOutlined style={{ fontSize: 13, color: '#94a3b8' }} />
            <span style={{ color: '#64748b' }}>Trang quản trị</span>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 700 }}>{pageLabel}</span>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: 24,
              border: '1px solid #f1f5f9',
              minHeight: 400,
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