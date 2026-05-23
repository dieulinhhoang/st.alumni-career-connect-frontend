import { Button, Card, Col, Form, Input, Row, Select, Space, Switch, Tooltip } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { IUser, IUserQuery } from '../../../feature/user/type'
import FilterContainer from '../../../components/common/FilterContainer'
import CustomTable from '../../../components/common/customTable'

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
  onCreate,
  onEdit,
  onView,
  onDelete,
  onTableChange,
  onToggleStatus,
}) => {
  const canCreate = true
  const canUpdate = true
  const canDelete = true
  const canView = true

  const columns = [
    {
      title: 'STT',
      width: 70,
      align: 'center' as const,
      render: (_: any, __: IUser, index: number) =>
        index + 1 + query.page * query.size,
    },
    // {
    //   title: 'SSO ID',
    //   dataIndex: 'sso_id',
    //   render: (sso_id: string, record: IUser) => (
    //     <span style={{ fontWeight: 600, color: record.status === 'inactive' ? 'rgba(182, 176, 173, 0.9)' : '#111827' }}>
    //       {sso_id}
    //     </span>
    //   ),
    // },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      render: (fullName: string, record: IUser) => (
        <span style={{ color: record.status === 'inactive' ? 'rgba(182, 176, 173, 0.9)' : '#111827' }}>
          {fullName || '-'}
        </span>
      ),
    },
    {
      title: 'Mã người dùng',
      dataIndex: 'code',
      render: (code: string, record: IUser) => (
        <span style={{ color: record.status === 'inactive' ? 'rgba(182, 176, 173, 0.9)' : '#111827' }}>
          {code || '-'}
        </span>
      ),
    },
    {
      title: 'Loại người dùng',
      dataIndex: 'type',
      render: (type: string, record: IUser) => (
        <span style={{ color: record.status === 'inactive' ? 'rgba(182, 176, 173, 0.9)' : '#111827' }}>
          {type || '-'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
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
      align: 'center' as const,
      render: (_: any, record: IUser) => {
        if (!canView && !canUpdate && !canDelete) return null

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
                        cursor: 'pointer',
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
                        cursor: 'pointer',
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

            {/* Khi cần thì mở lại delete
            {canDelete && (
              <Popconfirm
                title="Xóa người dùng?"
                onConfirm={() => onDelete(String(record.id))}
              >
                <Button type="text" danger>
                  Xóa
                </Button>
              </Popconfirm>
            )}
            */}
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
            <Form.Item name="sso_id" style={{ marginBottom: 12 }}>
              <Input placeholder="SSO ID" style={inputStyle} />
            </Form.Item>

            <Form.Item name="fullName" style={{ marginBottom: 12 }}>
              <Input placeholder="Họ và tên" style={inputStyle} />
            </Form.Item>

            <Form.Item name="code" style={{ marginBottom: 12 }}>
              <Input placeholder="Mã người dùng" style={inputStyle} />
            </Form.Item>

            <Form.Item name="type" style={{ marginBottom: 12 }}>
              <Select
                allowClear
                placeholder="Loại người dùng"
                style={inputStyle}
                options={[
                  { label: 'Quản trị viên', value: 'admin' },
                  { label: 'Cán bộ', value: 'officer' },
                  { label: 'Giảng viên', value: 'teacher' },
                ]}
              />
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

      <Row justify="end" align="middle" style={{ marginBottom: 16, marginTop: 4 }}>
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
                fontWeight: 500,
                background: '#1677ff',
                borderColor: '#1677ff',
              }}
            >
              Thêm mới
            </Button>
          </Col>
        )}
      </Row>

      <Card
        style={{
          borderRadius: 12,
          border: '1px solid #eef0f3',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <CustomTable
            columns={columns}
            data={listData?.items ?? []}
            filter={{
                ...query,
                total: listData?.total ?? listData?.items?.length ?? 0,
            }}
            loading={loading}
            handleTableChange={onTableChange}
            minHeight={430}
            rowKey="id"
            />
      </Card>
    </>
  )
}

export default UserListView