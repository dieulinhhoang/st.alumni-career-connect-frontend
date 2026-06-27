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
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { IResource, IResourceQuery } from '../../../feature/resources/type'
import FilterContainer from '../../../components/common/FilterContainer'
import { havePermission } from '../../../feature/auth/permission'
import { PermissionEnum } from '../../../feature/auth/type'

interface ResourceListViewProps {
  query: IResourceQuery
  setQuery: React.Dispatch<React.SetStateAction<IResourceQuery>>
  listData: any
  loading: boolean
  onCreate: () => void
  onEdit: (resource: IResource) => void
  onDelete: (id: string | number) => void
  onTableChange: (pagination: any) => void
}

const normalize = (s = '') =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

type ResourceRow = IResource & {
  _id: string
  id?: string | number
  code: string
  name: string
  actions: string[]
}

const ResourceListView: React.FC<ResourceListViewProps> = ({
  query,
  setQuery,
  listData,
  loading,
  onCreate,
  onEdit,
  onDelete,
  onTableChange
}) => {
  const canCreate = havePermission(PermissionEnum.ROLES_CREATE)
  const canUpdate = havePermission(PermissionEnum.ROLES_UPDATE)
  const canDelete = havePermission(PermissionEnum.ROLES_DELETE)

  const inputStyle: React.CSSProperties = {
    height: 38,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fafafa',
    minWidth: 220
  }

  const rows: ResourceRow[] = React.useMemo(() => {
    const source = Array.isArray(listData?.data)
      ? listData.data
      : Array.isArray(listData?.items)
      ? listData.items
      : []

    return source.map((r: any) => ({
      ...r,
      _id: String(r._id ?? r.id ?? ''),
      id: r.id,
      code: r.code ?? r.name ?? '',
      name: r.name ?? '',
      actions: Array.isArray(r.actions) ? r.actions : []
    }))
  }, [listData])

  const filteredRows = React.useMemo(() => {
    const codeKw = normalize(query.code || '')
    const actionKw = normalize((query as any).action || '')
    const nameKw = normalize((query as any).name || '')

    return rows.filter((r) => {
      const okCode = !codeKw || normalize(r.code).includes(codeKw)
      const okName = !nameKw || normalize(r.name || r.code).includes(nameKw)
      const okAction =
        !actionKw ||
        (r.actions || []).some((a) => normalize(a).includes(actionKw))

      return okCode && okName && okAction
    })
  }, [rows, query.code, (query as any).action, (query as any).name])

  const columns: ColumnsType<ResourceRow> = [
    {
      title: 'STT',
      width: 70,
      align: 'center',
      render: (_value, _record, index) =>
        index + 1 + (query.page || 0) * (query.size || 10)
    },
    {
      title: 'Mã tài nguyên',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <div style={{ fontWeight: 600, color: '#111827' }}>{code || '—'}</div>
      )
    },
    {
      title: 'Tên tài nguyên',
      dataIndex: 'name',
      key: 'name',
      render: (_name: string, item) => (
        <div style={{ fontWeight: 600, color: '#111827' }}>
          {item.name?.trim() || item.code || '—'}
        </div>
      )
    },
    {
      title: 'Chức năng',
      dataIndex: 'actions',
      key: 'actions',
      render: (actions: string[]) => (
        <Space wrap>
          {(actions || []).length > 0 ? (
            actions.map((action) => (
              <span
                key={action}
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: '#f3f4f6',
                  fontSize: 14,
                  color: '#374151'
                }}
              >
                {action}
              </span>
            ))
          ) : (
            <span style={{ color: '#9ca3af' }}>—</span>
          )}
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_value, record) => {
        if (!canUpdate && !canDelete) return null

        const recordId = record.id ?? record._id

        return (
          <Space size={14}>
            {canUpdate && (
              <Tooltip title="Chỉnh sửa">
                <EditOutlined
                  onClick={() => onEdit(record)}
                  style={{
                    fontSize: 18,
                    cursor: 'pointer',
                    color: '#16a34a'
                  }}
                />
              </Tooltip>
            )}

            {canDelete && (
              <Popconfirm
                title="Xoá tài nguyên?"
                onConfirm={() => onDelete(recordId)}
                okText="Xoá"
                cancelText="Hủy"
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

  return (
    <>
      <FilterContainer
        onFilterChange={(values: any) => {
          const { code = '', action = '', name = '' } = values || {}
          setQuery((prev) => ({
            ...prev,
            page: 0,
            code,
            action,
            name
          }))
        }}
        onResetFields={() => {
          setQuery((prev) => ({
            ...prev,
            page: 0,
            code: '',
            action: '',
            name: ''
          }))
        }}
      >
        {() => (
          <>
            <Form.Item name="code" style={{ marginBottom: 12 }}>
              <Input placeholder="Mã tài nguyên" style={inputStyle} />
            </Form.Item>

            <Form.Item name="name" style={{ marginBottom: 12 }}>
              <Input placeholder="Tên tài nguyên" style={inputStyle} />
            </Form.Item>

            <Form.Item name="action" style={{ marginBottom: 12 }}>
              <Input placeholder="Chức năng" style={inputStyle} />
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
                background: '#16a34a',
                borderColor: '#16a34a'
              }}
            >
              Thêm mới
            </Button>
          </Col>
        )}
      </Row>

      {/* <Card
        style={{
          borderRadius: 12,
          border: '1px solid #eef0f3',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
      > */}
        <Table<ResourceRow>
          columns={columns}
          dataSource={[...filteredRows]}
          loading={loading}
          rowKey={(record) => String(record._id || record.id || record.code)}
          onChange={onTableChange}
          pagination={{
            current: (query.page || 0) + 1,
            pageSize: query.size || 10,
            total:
              listData?.page?.total_elements ??
              listData?.total ??
              filteredRows.length,
            showSizeChanger: false,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}–${range[1]} / ${total} bản ghi`,
          }}
          scroll={{ x: 900 }}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      {/* </Card> */}
    </>
  )
}

export default ResourceListView