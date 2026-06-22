import React from 'react';
import { Badge, Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { EmailTemplate } from '../../../feature/mail-settings/types';
import { useGetAllTemplates } from '../../../feature/mail-settings/hooks/query';
import dayjs from 'dayjs';

const { Text } = Typography;

const EmailTemplateList: React.FC = () => {
  const navigate = useNavigate();
  const { data: templates = [], isLoading } = useGetAllTemplates();

  const columns = [
    {
      title: '#',
      width: 48,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Loại Email',
      dataIndex: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      render: (desc: string) => <Text type="secondary">{desc}</Text>,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      width: 120,
      render: (active: boolean) =>
        active ? (
          <Tag color="success">Kích Hoạt</Tag>
        ) : (
          <Tag color="default">Tắt</Tag>
        ),
    },
    {
      title: 'Cập Nhật',
      dataIndex: 'updatedAt',
      width: 160,
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {dayjs(v).format('DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Hành Động',
      width: 100,
      render: (_: any, row: EmailTemplate) => (
        <Space>
          <Tooltip title="Xem trước">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/mail-settings/templates/${row.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/mail-settings/templates/${row.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>Danh Sách Email Template</div>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Quản lý nội dung các email tự động hệ thống gửi đi.
        </Text>
      </div>

      <Table
        rowKey="id"
        dataSource={templates}
        columns={columns}
        loading={isLoading}
        pagination={false}
        size="middle"
        bordered={false}
      />
    </div>
  );
};

export default EmailTemplateList;
