import React, { useState, useEffect } from 'react';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, DashboardOutlined,
    TeamOutlined, LogoutOutlined, DownOutlined, AppstoreOutlined, FileTextOutlined,
    SafetyCertificateOutlined, BankOutlined, BarChartOutlined, FileSearchOutlined,
    SolutionOutlined, IdcardOutlined, UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Avatar, Space, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC<{ children?: React.ReactNode; onCollapse?: any }> = ({ children, onCollapse }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Handle responsive breakpoints
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileMenuOpen(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        {
            key: 'general-grp', label: 'QUẢN LÍ CHUNG', type: 'group',
            children: [
                { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Bảng điều khiển</Link> },
                { key: '/admin/faculties', icon: <TeamOutlined />, label: <Link to="/admin/faculties">Khoa</Link> },
            ],
        },
        { type: 'divider' },
        {
            key: 'enterprise-grp', label: 'DOANH NGHIỆP', type: 'group',
            children: [
                { key: '/admin/enterprises', icon: <BankOutlined />, label: <Link to="/admin/enterprises">Doanh nghiệp đối tác</Link> },
            ],
        },
        { type: 'divider' },
        {
            key: 'graduation-grp', label: 'TỐT NGHIỆP', type: 'group',
            children: [
                { key: '/admin/graduation', icon: <SolutionOutlined />, label: <Link to="/admin/graduation">Đợt tốt nghiệp</Link> },
            ],
        },
        { type: 'divider' },
        {
            key: 'survey-grp', label: 'KHẢO SÁT', type: 'group',
            children: [
                { key: '/admin/allforms', icon: <FileTextOutlined />, label: <Link to="/admin/allforms">Cấu hình Form</Link> },
                { key: '/admin/alumni', icon: <IdcardOutlined />, label: <Link to="/admin/alumni">Khảo sát việc làm</Link> },
            ],
        },
        { type: 'divider' },
        {
            key: 'report-grp', label: 'BÁO CÁO - THỐNG KÊ', type: 'group',
            children: [
                { key: '/admin/statistics', icon: <BarChartOutlined />, label: <Link to="/admin/statistics">Biểu đồ thống kê</Link> },
                { key: '/admin/reports', icon: <FileSearchOutlined />, label: <Link to="/admin/reports">Báo cáo tổng hợp</Link> },
            ],
        },
        { type: 'divider' },
        {
            key: 'system-grp', label: 'HỆ THỐNG', type: 'group',
            children: [
                { key: '/admin/accounts', icon: <UsergroupAddOutlined />, label: <Link to="/admin/accounts">Tài khoản</Link> },
                { key: '/admin/roles', icon: <SafetyCertificateOutlined />, label: <Link to="/admin/roles">Vai trò</Link> },
                { key: '/admin/users', icon: <AppstoreOutlined />, label: <Link to="/admin/users">Người dùng</Link> },
            ],
        },
    ];

    const renderMenu = () => (
        <Menu 
            theme="light" 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            items={menuItems}
            onClick={() => {
                if (isMobile) {
                    setMobileMenuOpen(false);
                }
            }}
        />
    );

    return (
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <style>{`
                .ant-menu-item, .ant-menu-submenu-title {
                    display: flex !important;
                    align-items: center !important;
                    margin: 2px 10px !important;
                    width: calc(100% - 20px) !important;
                    border-radius: 8px !important;
                    padding-left: 14px !important;
                    height: 38px !important;
                    line-height: 38px !important;
                    font-size: 13px !important;
                    color: #4b5563 !important;
                    font-weight: 500 !important;
                }
                .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
                    font-size: 15px !important;
                    color: #9ca3af !important;
                }
                .ant-menu-light .ant-menu-item-selected {
                    background: linear-gradient(90deg, #9f7aea 0%, #7f5af0 100%) !important;
                    color: #ffffff !important;
                    box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
                }
                .ant-menu-light .ant-menu-item-selected .anticon,
                .ant-menu-light .ant-menu-item-selected a {
                    color: #ffffff !important;
                    font-weight: 600 !important;
                }
                .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover {
                    background: #f9fafb !important;
                    color: #111827 !important;
                }
                .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover .anticon {
                    color: #6b7280 !important;
                }
                .ant-menu-item-group-title {
                    padding-left: 20px !important;
                    font-size: 10px !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.06em !important;
                    color: #d1d5db !important;
                    margin-top: 12px !important;
                }
                .ant-menu-inline { border-right: none !important; }
                .ant-menu-item a { color: inherit !important; }
                
                /* Responsive styles */
                @media (max-width: 768px) {
                    .ant-layout-content {
                        margin: 16px !important;
                        padding: 16px !important;
                    }
                    .ant-layout-header {
                        padding: 0 16px !important;
                    }
                    .admin-header-title {
                        display: none !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .ant-layout-content {
                        margin: 12px !important;
                        padding: 12px !important;
                    }
                    .admin-avatar-text {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={256}
                    style={{
                        background: '#fff',
                        borderRight: '1px solid #f3f4f6',
                        position: 'fixed',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        zIndex: 100,
                        overflowY: 'auto',
                    }}
                >
                    {/* Logo */}
                    <div style={{ 
                        height: 64, 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '0 20px', 
                        borderBottom: '1px solid #f3f4f6',
                        justifyContent: collapsed ? 'center' : 'flex-start'
                    }}>
                        <Avatar 
                            shape="square" 
                            size={32} 
                            src="https://dtntmuongcha.dienbien.edu.vn/uploads/news/2023_03/3.jpg" 
                            style={{ borderRadius: 8, flexShrink: 0 }} 
                        />
                        {!collapsed && (
                            <span style={{ 
                                marginLeft: 10, 
                                fontWeight: 800, 
                                fontSize: 14, 
                                color: '#111827', 
                                letterSpacing: -0.3,
                                whiteSpace: 'nowrap'
                            }}>
                                VNUA SURVEY
                            </span>
                        )}
                    </div>

                    {renderMenu()}
                </Sider>
            )}

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                closable={true}
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                            shape="square" 
                            size={32} 
                            src="https://dtntmuongcha.dienbien.edu.vn/uploads/news/2023_03/3.jpg" 
                            style={{ borderRadius: 8 }} 
                        />
                        <span style={{ marginLeft: 10, fontWeight: 800, fontSize: 14, color: '#111827' }}>
                            VNUA SURVEY
                        </span>
                    </div>
                }
            >
                {renderMenu()}
            </Drawer>

            <Layout style={{ 
                marginLeft: (!isMobile && !collapsed) ? 256 : (!isMobile && collapsed) ? 80 : 0,
                transition: 'all 0.2s'
            }}>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 64,
                    borderBottom: '1px solid #f3f4f6',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Mobile menu button */}
                        {isMobile && (
                            <Button
                                type="text"
                                icon={mobileMenuOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                style={{ fontSize: 15, width: 36, height: 36, color: '#6b7280' }}
                            />
                        )}
                        
                        {/* Desktop collapse button */}
                        {!isMobile && (
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => { 
                                    setCollapsed(!collapsed); 
                                    onCollapse?.(!collapsed); 
                                }}
                                style={{ fontSize: 15, width: 36, height: 36, color: '#6b7280' }}
                            />
                        )}

                        {/* Mobile logo text */}
                        {isMobile && (
                            <span style={{ fontWeight: 800, fontSize: 14, color: '#111827' }}>
                                VNUA SURVEY
                            </span>
                        )}
                    </div>

                    <Dropdown trigger={['click']} menu={{
                        items: [
                            { key: '1', icon: <UserOutlined />, label: 'Thông tin' },
                            { key: 'logout', icon: <LogoutOutlined />, label: 'Thoát', danger: true },
                        ],
                    }}>
                        <Button type="text" style={{ height: 44, borderRadius: 8 }}>
                            <Space size={8}>
                                <Avatar size={28} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                                <span className="admin-avatar-text" style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                                    Quản trị viên
                                </span>
                                <DownOutlined style={{ fontSize: 9, color: '#9ca3af' }} />
                            </Space>
                        </Button>
                    </Dropdown>
                </Header>

                <Content style={{ 
                    margin: 24, 
                    background: '#fff', 
                    borderRadius: 14, 
                    padding: 24, 
                    border: '1px solid #f3f4f6',
                    overflowX: 'auto'
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;