import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Checkbox,
  Button,
  Spin,
  message,
  Typography,
  Space,
  Divider,
  Tag,
  Tooltip,
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons'
import axiosInstance from '../../../libs/axiosInstance'

const { Title, Text } = Typography

interface PermissionItem {
  id: number
  name: string
  code: string
  isGranted: boolean
}

interface PermissionGroup {
  id: number
  name: string
  code: string
  permissions: PermissionItem[]
}

const RolePermissionMatrix: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [groups, setGroups] = useState<PermissionGroup[]>([])
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [roleRes, permRes] = await Promise.all([
        axiosInstance.get(`/roles/${id}`),
        axiosInstance.get(`/roles/${id}/permissions`),
      ])
      setRoleName(roleRes.data?.name ?? '')
      const groupData: PermissionGroup[] = permRes.data ?? []
      setGroups(groupData)
      const initialChecked = new Set<number>()
      groupData.forEach((g) =>
        g.permissions.forEach((p) => {
          if (p.isGranted) initialChecked.add(p.id)
        }),
      )
      setChecked(initialChecked)
    } catch {
      message.error('Không thể tải dữ liệu quyền')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const togglePermission = (permId: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(permId) ? next.delete(permId) : next.add(permId)
      return next
    })
  }

  const toggleGroup = (group: PermissionGroup) => {
    const allGranted = group.permissions.every((p) => checked.has(p.id))
    setChecked((prev) => {
      const next = new Set(prev)
      group.permissions.forEach((p) =>
        allGranted ? next.delete(p.id) : next.add(p.id),
      )
      return next
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await axiosInstance.post(`/roles/${id}/permissions`, {
        permissionIds: Array.from(checked),
      })
      message.success('Lưu phân quyền thành công!')
    } catch {
      message.error('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  const totalChecked = checked.size
  const totalPerms = groups.reduce((acc, g) => acc + g.permissions.length, 0)

  return (
    <div style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Space>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            <LockOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Phân quyền: <Tag color="blue">{roleName}</Tag>
          </Title>
          <Text type="secondary">
            Đã chọn{' '}
            <strong>{totalChecked}</strong> / {totalPerms} quyền
          </Text>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
          size="large"
        >
          Lưu phân quyền
        </Button>
      </div>

      {/* Permission Groups */}
      {groups.map((group) => {
        const grantedCount = group.permissions.filter((p) => checked.has(p.id)).length
        const total = group.permissions.length
        const allChecked = grantedCount === total && total > 0
        const indeterminate = grantedCount > 0 && grantedCount < total

        return (
          <Card
            key={group.id}
            style={{ marginBottom: 16, borderRadius: 10, border: '1px solid #e8edf3' }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            {/* Group header with select-all checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                onChange={() => toggleGroup(group)}
                style={{ marginRight: 10 }}
              />
              <Text strong style={{ fontSize: 15 }}>
                {group.name}
              </Text>
              <Tag
                style={{ marginLeft: 10 }}
                color={grantedCount === total && total > 0 ? 'success' : grantedCount > 0 ? 'processing' : 'default'}
              >
                {grantedCount}/{total}
              </Tag>
            </div>

            <Divider style={{ margin: '8px 0 14px' }} />

            {/* Permissions grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px 16px',
              }}
            >
              {group.permissions.map((perm) => (
                <Tooltip key={perm.id} title={perm.code} placement="top">
                  <div
                    onClick={() => togglePermission(perm.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: checked.has(perm.id) ? '#eff6ff' : '#fafafa',
                      border: checked.has(perm.id) ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Checkbox
                      checked={checked.has(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1f2937' }}>
                        {perm.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#9ca3af',
                          fontFamily: 'monospace',
                          marginTop: 2,
                        }}
                      >
                        {perm.code}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          </Card>
        )
      })}

      {/* Bottom save */}
      <div style={{ textAlign: 'right', marginTop: 8 }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
          size="large"
        >
          Lưu phân quyền
        </Button>
      </div>
    </div>
  )
}

export default RolePermissionMatrix
