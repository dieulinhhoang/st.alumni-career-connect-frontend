import React from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'antd'
import {
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

import type { IUser, IUserQuery } from '../../../feature/user/type'
import FilterContainer from '../../../components/common/FilterContainer'

interface UserListViewProps {
  query: IUserQuery
  setQuery: React.Dispatch<React.SetStateAction<IUserQuery>>
  listData: any
  loading: boolean
  onCreate: () => void
  onEdit: (user: IUser) => void
  onView: (user: IUser) => void
  onDelete: (id: string) => void
  onTableChange: (pagination: any) => void
  onToggleStatus: (record: IUser, checked: boolean) => void
}

const UserListView: React.FC<UserListViewProps> = ({
  query,
  setQuery,
  listData,
  loading,
  onEdit,
  onView,
  onTableChange,
  onToggleStatus,
}) => {
  const canUpdate = true
  const canView = true

  const columns: ColumnsType<IUser> = [
    {
      title: 'STT',
      width: 70,
      align: 'center',
      render: (_: any, __: IUser, index: number) =>
        index + 1 + query.page * query.size,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      render: (fullName: string, record: IUser) => (
        <span
          style={{
            color:
              record.status === 'inactive'
                ? 'rgba(182, 176, 173, 0.9)'
                : '#111827',
            fontWeight: 500,
          }}
        >
          {fullName || '-'}
        </span>
      ),
    },
    {
      title: 'Mã người dùng',
      dataIndex: 'code',
      render: (code: string, record: IUser) => (
        <span
          style={{
            color:
              record.status === 'inactive'
                ? 'rgba(182, 176, 173, 0.9)'
                : '#111827',
          }}
        >
          {code || '-'}
        </span>
      ),
    },
    {
      title: 'Loại người dùng',
      dataIndex: 'type',
      render: (type: string, record: IUser) => (
        <span
          style={{
            color:
              record.status === 'inactive'
                ? 'rgba(182, 176, 173, 0.9)'
                : '#111827',
          }}
        >
          {type || '-'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string, record: IUser) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => onToggleStatus(record, checked)}
          disabled={!canUpdate}
        />
      ),
    },
    {
      title: 'Hành động',
      width: 140,
      align: 'center',
      render: (_: any, record: IUser) => {
        if (!canView && !canUpdate) return null

        return (
          <Space size={12}>
            {canView && (
              <Tooltip title="Xem">
                <Button
                  type="text"
                  icon={
                    <EyeOutlined
                      style={{
                        fontSize: 18,
                        color: 'rgba(60,173,54,0.85)',
                      }}
                    />
                  }
                  onClick={() => onView(record)}
                />
              </Tooltip>
            )}

            {canUpdate && (
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={
                    <EditOutlined
                      style={{
                        fontSize: 18,
                        color:
                          record.status === 'inactive'
                            ? 'rgba(182, 176, 173, 0.9)'
                            : 'rgba(37,99,235,0.85)',
                      }}
                    />
                  }
                  onClick={() => onEdit(record)}
                  disabled={record.status === 'inactive'}
                />
              </Tooltip>
            )}
          </Space>
        )
      },
    },
  ]

  const inputStyle: React.CSSProperties = {
    height: 38,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fafafa',
    minWidth: 220,
  }

  return (
    <>
      <FilterContainer
        onFilterChange={(values: any) => {
          const {
            sso_id = '',
            fullName = '',
            code = '',
            status = '',
            type = '',
          } = values || {}

          setQuery((prev) => ({
            ...prev,
            page: 0,
            sso_id,
            fullName,
            code,
            status,
            type,
          }))
        }}
        onResetFields={() => {
          setQuery((prev) => ({
            ...prev,
            page: 0,
            sso_id: '',
            fullName: '',
            code: '',
            status: '',
            type: '',
          }))
        }}
      >
        {() => (
          <>
            <Form.Item name="fullName" style={{ marginBottom: 12 }}>
              <Input placeholder="Họ và tên" style={inputStyle} />
            </Form.Item>

            <Form.Item name="code" style={{ marginBottom: 12 }}>
              <Input placeholder="Mã người dùng" style={inputStyle} />
            </Form.Item>

            <Form.Item name="status" style={{ marginBottom: 12 }}>
              <Select
                allowClear
                placeholder="Trạng thái"
                style={inputStyle}
                options={[
                  { label: 'Hoạt động', value: 'active' },
                  { label: 'Ngưng hoạt động', value: 'inactive' },
                ]}
              />
            </Form.Item>
          </>
        )}
      </FilterContainer>

      <br />

      <Card
        style={{
          borderRadius: 12,
          border: '1px solid #eef0f3',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Table
          columns={columns}
          dataSource={listData?.items ?? []}
          loading={loading}
          rowKey="id"
          pagination={{
            current: query.page + 1,
            pageSize: query.size,
            total: listData?.total ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          onChange={onTableChange}
        />
      </Card>
    </>
  )
}

export default UserListView