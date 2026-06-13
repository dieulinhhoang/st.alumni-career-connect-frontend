import React from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Table,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import FilterContainer from '../../../components/common/FilterContainer'

interface IRole {
  id: string | number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

interface IRoleQuery {
  page: number
  size: number
  name?: string
}

interface RoleListViewProps {
  query: IRoleQuery
  setQuery: React.Dispatch<React.SetStateAction<IRoleQuery>>
  listData: {
    items?: IRole[]
    total?: number
  }
  loading: boolean
  onCreate: () => void
  onEdit: (role: IRole) => void
  onView: (role: IRole) => void
  onDelete: (id: string) => void
  onTableChange: (pagination: any) => void
}

const RoleListView: React.FC<RoleListViewProps> = ({
  query,
  setQuery,
  listData,
  loading,
  onCreate,
  onEdit,
  onView,
  onDelete,
  onTableChange,
}) => {
  const columns: ColumnsType<IRole> = [
    {
      title: 'STT',
      width: 70,
      align: 'center',
      render: (_: any, __: IRole, index: number) =>
        index + 1 + query.page * query.size,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      render: (value: string) => (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>{value || '--'}</span>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (value: string) => (
        <span style={{ color: '#4b5563' }}>{value || '--'}</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value: string) =>
        value ? new Date(value).toLocaleString('vi-VN') : '--',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      render: (value: string) =>
        value ? new Date(value).toLocaleString('vi-VN') : '--',
    },
    {
      title: 'Hành động',
      width: 150,
      align: 'center',
      render: (_: any, record: IRole) => (
        <Space size={14}>
          <Tooltip title="Xem">
            <EyeOutlined
              onClick={() => onView(record)}
              style={{ fontSize: 18, cursor: 'pointer', color: '#16a34a' }}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <EditOutlined
              onClick={() => onEdit(record)}
              style={{ fontSize: 18, cursor: 'pointer', color: '#16a34a' }}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa vai trò?"
            onConfirm={() => onDelete(String(record.id))}
          >
            <DeleteOutlined
              style={{ fontSize: 18, cursor: 'pointer', color: '#ef4444' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const inputStyle: React.CSSProperties = {
    height: 40,
    borderRadius: 8,
    border: '1px solid #d9e1ec',
    background: '#fff',
    minWidth: 240,
  }

  return (
    <>
      <FilterContainer
        onFilterChange={(values: any) => {
          const { name = '' } = values || {}
          setQuery((prev) => ({
            ...prev,
            page: 0,
            name,
          }))
        }}
        onResetFields={() => {
          setQuery((prev) => ({
            ...prev,
            page: 0,
            name: '',
          }))
        }}
      >
        {() => (
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input placeholder="Tìm theo tên vai trò" style={inputStyle} />
          </Form.Item>
        )}
      </FilterContainer>

      <Row justify="end" style={{ marginBottom: 16, marginTop: 8 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
            style={{
              borderRadius: 8,
              height: 40,
              paddingInline: 18,
              fontWeight: 500,
              background: '#16a34a',
              borderColor: '#16a34a',
            }}
          >
            Thêm vai trò
          </Button>
        </Col>
      </Row>
{/* 
      <Card
        style={{
          borderRadius: 14,
          border: '1px solid #e8edf3',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      > */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={listData?.items ?? []}
          loading={loading}
          pagination={{
            current: query.page + 1,
            pageSize: query.size,
            total: listData?.total ?? 0,
            showSizeChanger: true,
             showTotal: (total: number, range: [number, number]) =>
              `${range[0]}–${range[1]} / ${total} bản ghi`,
            pageSizeOptions: ['10', '20', '50'],
            locale: { items_per_page: '/ trang' },
          }}
          onChange={onTableChange}
            scroll={{ x: 900 }}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      {/* </Card> */}
    </>
  )
}

export default RoleListView