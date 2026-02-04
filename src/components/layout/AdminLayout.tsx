import React, { useState } from 'react';
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
    SettingOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Avatar, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout: React.FC<{ children?: React.ReactNode, onCollapse?: any }> = ({ children, onCollapse }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Bảng điều khiển</Link>,
        },
        {
            key: '/admin/stafflist',
            icon: <TeamOutlined />,
            label: <Link to="/admin/stafflist">Nhân viên</Link>,
        },
        {
            key: 'org',
            icon: <BankOutlined />,
            label: 'Doanh nghiệp',
        },
        {
            key: '/admin/studentlist',
            icon: <UserOutlined />,
            label: <Link to="/admin/studentlist">Sinh viên</Link>,
        },
        {
            key: '/admin/allforms',
            icon: <FileTextOutlined />,
            label: <Link to="/admin/allforms">Form câu hỏi tự động</Link>,
        },
        { type: 'divider' },
        { 
            key: 'settings-grp', 
            label: 'CÀI ĐẶT', 
            type: 'group',
            children: [
                {
                    key: 'categories',
                    icon: <AppstoreOutlined />,
                    label: 'Danh mục',
                    children: [
                        { key: '/admin/stats', label: <Link to="/admin/statistics">Thống kê</Link> },
                    ]
                }
            ]
        },
        {
            key: 'permissions',
            icon: <SafetyCertificateOutlined />,
            label: 'Phân quyền',
            children: [
                { key: '/admin/approvescore', label: <Link to="/admin/approvescore">Phê duyệt điểm</Link> },
            ]
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <style>
                {`
                     .ant-menu-item, .ant-menu-submenu-title {
                        display: flex !important;
                        align-items: center !important;
                        margin: 4px 12px !important;
                        width: calc(100% - 24px) !important;
                        border-radius: 10px !important;
                        padding-left: 16px !important; /* Đẩy vào cho cân */
                    }

                    .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
                        font-size: 18px !important;
                        margin-right: 12px !important; /* Khoảng cách icon và chữ */
                    }

                    /* Hiệu ứng Active tím lịm tìm sim */
                    .ant-menu-light .ant-menu-item-selected {
                        background: linear-gradient(90deg, #9f7aea 0%, #7f5af0 100%) !important;
                        color: #ffffff !important;
                        box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
                    }

                    .ant-menu-light .ant-menu-item-selected .anticon, 
                    .ant-menu-light .ant-menu-item-selected a {
                        color: #ffffff !important;
                    }

                     .ant-menu-item-group-title {
                        padding-left: 24px !important;
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        color: #cbd5e0 !important;
                        margin-top: 16px !important;
                    }

                    .ant-menu-inline { border-right: none !important; }
                `}
            </style>

            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed} 
                width={280}
                style={{
                    background: '#fff',
                    borderRight: '1px solid #edf2f7',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    zIndex: 100
                }}
            >
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
                    <Avatar shape="square" size="large" src="https://dtntmuongcha.dienbien.edu.vn/uploads/news/2023_03/3.jpg" />
                    {!collapsed && (
                        <span style={{ marginLeft: '12px', fontWeight: 800, fontSize: '16px', color: '#1a202c' }}>
                            VNUA SURVEY
                        </span>
                    )}
                </div>

                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                />
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'all 0.2s' }}>
                <Header style={{ 
                    padding: '0 24px', 
                    background: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    height: '72px',
                    borderBottom: '1px solid #edf2f7',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => {
                            setCollapsed(!collapsed);
                            onCollapse?.(!collapsed);
                        }}
                        style={{ fontSize: '18px', width: 40, height: 40 }}
                    />

                    <Dropdown trigger={['click']} menu={{ items: [
                        { key: '1', icon: <UserOutlined />, label: 'Thông tin' },
                        { key: 'logout', icon: <LogoutOutlined />, label: 'Thoát', danger: true }
                    ]}}>
                        <Button type="text" style={{ height: '48px' }}>
                            <Space>
                                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                                <span style={{ fontWeight: 600 }}>Quản trị viên</span>
                                <DownOutlined style={{ fontSize: '10px' }} />
                            </Space>
                        </Button>
                    </Dropdown>
                </Header>

                <Content style={{ margin: '24px' }}>
                    <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', minHeight: 'calc(100vh - 170px)' }}>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;