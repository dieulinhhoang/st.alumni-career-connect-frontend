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
  Form
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons'

 import FilterContainer from '../../../components/common/FilterContainer'
 import { havePermission } from '../../../global/hooks/usePermission'
 import { PermissionEnum } from '../../../feature/auth/type'
import type { IRole, IRoleQuery } from '../../../feature/role/type'
import CustomTable from '../../../components/common/customTable'

interface RoleListViewProps {
  query: IRoleQuery
  setQuery: React.Dispatch<React.SetStateAction<IRoleQuery>>
  listData: any
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
  onTableChange
}) => {

  // const canCreate = havePermission(PermissionEnum.ROLE_CREATE)
  // const canUpdate = havePermission(PermissionEnum.ROLE_UPDATE)
  // const canDelete = havePermission(PermissionEnum.ROLE_DELETE)
  // const canView = havePermission(PermissionEnum.ROLE_READ)
  const canCreate = true
  const canUpdate = true
  const canDelete = true
  const canView = true
  const columns = [
    {
      title: 'STT',
      width: 70,
      align: 'center' as const,
      render: (_: any, __: IRole, index: number) =>
        index + 1 + query.page * query.size
    },
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      render: (code: string) => (
        <span style={{ fontWeight: 600, color: '#111827' }}>{code}</span>
      )
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      render: (name: string) => (
        <span style={{ color: '#374151' }}>{name}</span>
      )
    },
    {
      title: 'Người cập nhật gần nhất',
      render: (_: any, record: IRole) => {
        if (record.updatedBy?.fullName) return record.updatedBy.fullName
        if (record.createdBy?.fullName) return record.createdBy.fullName
        return '--'
      }
    },
    {
      title: 'Ngày cập nhật gần nhất',
      dataIndex: 'updatedAt',
      render: (value: string) =>
        value ? new Date(value).toLocaleString('vi-VN') : '--'
    },
    {
      title: 'Hành động',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: IRole) => {
        if (!canView && !canUpdate && !canDelete) return null

        return (
          <Space size={14}>
            {canView && (
              <Tooltip title="Xem">
                <EyeOutlined
                  onClick={() => onView(record)}
                  style={{
                    fontSize: 18,
                    cursor: 'pointer',
                    color: 'rgba(60, 173, 54, 0.85)'
                  }}
                />
              </Tooltip>
            )}

            {canUpdate && (
              <Tooltip title="Chỉnh sửa">
                <EditOutlined
                  onClick={() => onEdit(record)}
                  style={{
                    fontSize: 18,
                    cursor: 'pointer',
                    color: 'rgba(37, 99, 235, 0.85)'
                  }}
                />
              </Tooltip>
            )}

            {canDelete && (
              <Popconfirm
                title="Xoá vai trò?"
                onConfirm={() => onDelete(record._id)}
              >
                <DeleteOutlined
                  style={{
                    fontSize: 18,
                    cursor: 'pointer',
                    color: 'rgba(239, 68, 68, 0.9)'
                  }}
                />
              </Popconfirm>
            )}
          </Space>
        )
      }
    }
  ]

  const inputStyle: React.CSSProperties = {
    height: 38,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fafafa',
    minWidth: 220
  }

  return (
    <>
      <FilterContainer
        onFilterChange={(values: any) => {
          const { code = '', name = '' } = values || {}
          setQuery((prev) => ({
            ...prev,
            page: 0,
            code,
            name
          }))
        }}
        onResetFields={() => {
          setQuery((prev) => ({
            ...prev,
            page: 0,
            code: '',
            name: ''
          }))
        }}
      >
        {(form) => (
          <>
            <Form.Item name="code" style={{ marginBottom: 12 }}>
              <Input
                placeholder="Mã vai trò"
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item name="name" style={{ marginBottom: 12 }}>
              <Input
                placeholder="Tên vai trò"
                style={inputStyle}
              />
            </Form.Item>
          </>
        )}
      </FilterContainer>

      <Row
        justify="end"
        align="middle"
        style={{ marginBottom: 16, marginTop: 4 }}
      >
        {canCreate && (
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
              style={{
                borderRadius: 8,
                paddingInline: 18,
                height: 40,
                fontSize: 14,
                fontWeight: 500
              }}
            >
              Thêm vai trò
            </Button>
          </Col>
        )}
      </Row>

      <Card
        style={{
          borderRadius: 12,
          border: '1px solid #eef0f3',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
      >
        <CustomTable
          columns={columns}
          data={listData}
          filter={query}
          loading={loading}
          handleTableChange={onTableChange}
          minHeight={430}
          rowKey="_id"
        />
      </Card>
    </>
  )
}

export default RoleListView