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
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { IResource, IResourceQuery } from '../../../feature/resources/type'
import { havePermission } from '../../../global/hooks/usePermission'
import { PermissionEnum } from '../../../feature/auth/type'
import FilterContainer from '../../../components/common/FilterContainer'
import CustomTable from '../../../components/common/customTable'
 

interface ResourceListViewProps {
  query: IResourceQuery
  setQuery: React.Dispatch<React.SetStateAction<IResourceQuery>>
  listData: any
  loading: boolean
  onCreate: () => void
  onEdit: (resource: IResource) => void
  onDelete: (id: string) => void
  onTableChange: (pagination: any) => void
}

const normalize = (s = '') =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

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
  // const canCreate = havePermission(PermissionEnum.RESOURCE_CREATE)
  // const canUpdate = havePermission(PermissionEnum.RESOURCE_UPDATE)
  // const canDelete = havePermission(PermissionEnum.RESOURCE_DELETE)
const canCreate = true
const canUpdate = true
const canDelete = true
  const columns = [
    {
      title: 'STT',
      width: 70,
      align: 'center' as const,
      render: (_: any, __: IResource, index: number) =>
        index + 1 + (query.page || 0) * (query.size || 10)
    },
    {
      title: 'Mã tài nguyên',
      dataIndex: 'code',
      render: (code: string, item: IResource) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>{code}</div>
        </div>
      )
    },
    {
      title: 'Tên tài nguyên',
      dataIndex: 'name',
      render: (name: string, item: IResource) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>
            {item.name?.trim() || item.code}
          </div>
        </div>
      )
    },
    {
      title: 'Chức năng',
      dataIndex: 'actions',
      render: (actions: string[]) => (
        <Space wrap>
          {(actions || []).map((action) => (
            <span
              key={action}
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                background: '#f3f4f6',
                fontSize: 12,
                color: '#374151'
              }}
            >
              {action}
            </span>
          ))}
        </Space>
      )
    },
    {
      title: 'Hành động',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: IResource) => {
        if (!canUpdate && !canDelete) return null

        return (
          <Space size={14}>
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
              <Popconfirm title="Xoá tài nguyên?" onConfirm={() => onDelete(record._id)}>
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

  const filteredListData = React.useMemo(() => {
    const payload = listData ?? { data: [], page: { total_elements: 0 } }
    const items: IResource[] = Array.isArray(payload.data) ? payload.data : []

    const codeKw = normalize(query.code || '')
    const actionKw = normalize((query as any).action || '')
    const nameKw = normalize((query as any).name || '')
    if (!codeKw && !actionKw && !nameKw) return payload

    const filtered = items.filter((r) => {
      const okCode = !codeKw || normalize(r.code).includes(codeKw)
      const displayName = r.name || r.code || ''
      const okName = !nameKw || normalize(displayName).includes(nameKw)
      const okAction =
        !actionKw ||
        (r.actions || []).some((a) => {
          const en = normalize(a)
          const vi = normalize( '')
          return en.includes(actionKw) || vi.includes(actionKw)
        })

      return okCode && okName && okAction
    })

    return {
      ...payload,
      data: filtered,
      page: { ...(payload.page ?? {}), total_elements: filtered.length }
    }
  }, [listData, query.code, (query as any).action, (query as any).name])

  return (
    <>
      <FilterContainer
        onFilterChange={(values: any) => {
          const { code = '', action = '' } = values || {}
          setQuery((prev) => ({
            ...prev,
            page: 0,
            code,
            action,
            name: values.name || ''
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
              <Input placeholder="Chức năng " style={inputStyle} />
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
          data={filteredListData}
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

export default ResourceListView
