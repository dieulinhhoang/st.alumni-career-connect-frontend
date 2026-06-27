import React from 'react'
import {
  Row,
  Col,
  Input,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Form,
} from 'antd'
import CustomTable from '../../../components/common/customTable'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import FilterContainer from '../../../components/common/FilterContainer'
import { havePermission } from '../../../feature/auth/permission'
import { PermissionEnum } from '../../../feature/auth/type'

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

          {havePermission(PermissionEnum.ROLES_UPDATE) && (
            <Tooltip title="Chỉnh sửa">
              <EditOutlined
                onClick={() => onEdit(record)}
                style={{ fontSize: 18, cursor: 'pointer', color: '#16a34a' }}
              />
            </Tooltip>
          )}

          {havePermission(PermissionEnum.ROLES_DELETE) && (
            <Popconfirm
              title="Xóa vai trò?"
              onConfirm={() => onDelete(String(record.id))}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteOutlined
                style={{ fontSize: 18, cursor: 'pointer', color: '#ef4444' }}
              />
            </Popconfirm>
          )}
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

      {havePermission(PermissionEnum.ROLES_CREATE) && (
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
      )}
{/* 
      <Card
        style={{
          borderRadius: 14,
          border: '1px solid #e8edf3',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      > */}
        <CustomTable<IRole>
          rowKey="id"
          columns={columns}
          data={listData ?? []}
          loading={loading}
          pagination={{
            current: query.page + 1,
            pageSize: query.size,
            total: listData?.total ?? 0,
            showSizeChanger: false,
          }}
          handleTableChange={onTableChange}
          scroll={{ x: 900 }}
        />
      {/* </Card> */}
    </>
  )
}

export default RoleListView