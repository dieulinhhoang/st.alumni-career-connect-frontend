 
import { Button, Card, Col, Form, Input, Row, Select, Space, Switch, Tooltip } from "antd"
import {
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    KeyOutlined
} from '@ant-design/icons'
import { havePermission } from "../../../global/hooks/usePermission"
import { PermissionEnum } from "../../../feature/auth/type"
import type { IUser, IUserQuery } from "../../../feature/user/type"
import FilterContainer from "../../../components/common/FilterContainer"
import type { IRole } from "../../../feature/role/type"
import CustomTable from "../../../components/common/customTable"
 

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
    roleList: IRole[]
    onChangePassword: (user: IUser) => void
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
    roleList,
    onChangePassword,
    onToggleStatus
}) => {

    // const canCreate = havePermission(PermissionEnum.USERS_CREATE)
    // const canUpdate = havePermission(PermissionEnum.USERS_UPDATE)
    // const canDelete = havePermission(PermissionEnum.USERS_DELETE)
    // const canView = havePermission(PermissionEnum.USERS_READ)

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
                index + 1 + query.page * query.size
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'userName',
            render: (userName: string, record: IUser) => (
                <span style={{ fontWeight: 600, color: !record.isSuspended ? '#111827' : 'rgba(182, 176, 173, 0.9)' }}>
                    {userName}
                </span>
            )
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            render: (fullName: string, record: IUser) => (
                <span style={{ color: !record.isSuspended ? '#111827' : 'rgba(182, 176, 173, 0.9)' }}>
                    {fullName}
                </span>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (email: string, record: IUser) => (
                <span style={{ color: !record.isSuspended ? '#111827' : 'rgba(182, 176, 173, 0.9)' }}>
                    {email}
                </span>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'mobile',
            render: (mobile: string, record: IUser) => (
                <span style={{ color: !record.isSuspended ? '#111827' : 'rgba(182, 176, 173, 0.9)' }}>
                    {mobile}
                </span>
            )
        },
        // {
        //     title: 'Địa chỉ',
        //     dataIndex: 'address',
        //     ellipsis: true,
        //     render: (address: string, record: IUser) => (
        //         <span style={{ color: !record.isSuspended ? '#111827' : 'rgba(182, 176, 173, 0.9)' }}>
        //             {address}
        //         </span>
        //     )
        // },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            render: (roles: any[], record: IUser) => {
                if (!Array.isArray(roles) || roles.length === 0) return ''
                return (
                    <span style={{ color: !record.isSuspended ? '#111827' : 'rgba(182, 176, 173, 0.9)' }}>
                        {roles.map((r) => r?.name ?? r?._id).join(', ')}
                    </span>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isSuspended',
            key: 'isSuspended',
            align: 'center' as const,
            render: (isSuspended: boolean, record: IUser) => (
                <Switch
                    checked={!isSuspended}
                    onChange={(checked) => onToggleStatus(record, checked)}
                    disabled={!canUpdate}
                />
            )
        },
        {
            title: 'Hành động',
            width: 190,
            align: 'center' as const,
            render: (_: any, record: IUser) => {
                // Không có quyền gì thì khỏi render action
                if (!canView && !canUpdate && !canDelete) return null

                return (
                    <Space size={14}>
                        {canView && (
                            <Tooltip title="Xem">
                                <Button
                                    type="text"
                                    icon={
                                        <EyeOutlined
                                            style={{
                                                fontSize: 18,
                                                cursor: 'pointer',
                                                color: 'rgba(60,173,54,0.85)'
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
                                                color: !record.isSuspended
                                                    ? 'rgba(37,99,235,0.85)'
                                                    : 'rgba(182, 176, 173, 0.9)'
                                            }}
                                        />
                                    }
                                    onClick={() => onEdit(record)}
                                    disabled={record.isSuspended}
                                />
                            </Tooltip>
                        )}

                        {canUpdate && (
                            <Tooltip title="Đổi mật khẩu">
                                <Button
                                    type="text"
                                    icon={
                                        <KeyOutlined
                                            style={{
                                                fontSize: 18,
                                                cursor: 'pointer',
                                                color: !record.isSuspended
                                                    ? 'rgba(243,135,68,0.9)'
                                                    : 'rgba(182, 176, 173, 0.9)'
                                            }}
                                        />
                                    }
                                    onClick={() => onChangePassword(record)}
                                    disabled={record.isSuspended}
                                />
                            </Tooltip>
                        )}

                        {/* {canDelete && (
              <Popconfirm
                title="Xoá người dùng?"
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
            )} */}
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
                    const {
                        fullName = '',
                        userName = '',
                        email = '',
                        mobile = '',
                        address = '',
                        roles = '',
                        isSuspended = ''
                    } = values || {}
                    setQuery((prev) => ({
                        ...prev,
                        page: 0,
                        fullName,
                        userName,
                        email,
                        mobile,
                        address,
                        roleId: roles,
                        isSuspended
                    }))
                }}
                onResetFields={() => {
                    setQuery((prev) => ({
                        ...prev,
                        page: 0,
                        fullName: '',
                        userName: '',
                        email: '',
                        mobile: '',
                        address: '',
                        roleId: '',
                        isSuspended: ''
                    }))
                }}
            >
                {(form) => (
                    <>
                        <Form.Item name="fullName" style={{ marginBottom: 12 }}>
                            <Input placeholder="Họ và tên" style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="userName" style={{ marginBottom: 12 }}>
                            <Input placeholder="Tên đăng nhập" style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="email" style={{ marginBottom: 12 }}>
                            <Input placeholder="Email" style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="mobile" style={{ marginBottom: 12 }}>
                            <Input placeholder="Số điện thoại" style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="address" style={{ marginBottom: 12 }}>
                            <Input placeholder="Địa chỉ" style={inputStyle} />
                        </Form.Item>

                        <Form.Item name="roles" style={{ marginBottom: 12 }}>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Vai trò"
                                style={inputStyle}
                                optionFilterProp="label"
                                options={roleList?.map((r: IRole) => ({
                                    label: r.name,
                                    value: r._id
                                }))}
                            />
                        </Form.Item>

                        <Form.Item name="isSuspended" style={{ marginBottom: 12 }}>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Trạng thái"
                                style={inputStyle}
                                options={[
                                    { label: 'Hoạt động', value: false },
                                    { label: 'Đang khóa', value: true }
                                ]}
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
                            Thêm mới
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

export default UserListView
