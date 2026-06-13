import React from 'react'
import { Avatar, Card, Space, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import type { IAdminProfile } from '../../../../feature/adminProfile/type'

const { Text } = Typography

interface Props {
  profile: IAdminProfile
  avatarUrl?: string
  displayName: string
}

const ProfileSidebar: React.FC<Props> = ({ profile, avatarUrl, displayName }) => {
  return (
    <Card
      style={{
        textAlign: 'center',
        borderRadius: 12,
        borderColor: '#f0f0f0',
      }}
      styles={{ body: { padding: 24 } }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          margin: '0 auto 16px',
          borderRadius: '50%',
          border: '3px solid #7c3aed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar
          size={64}
          src={avatarUrl}
          icon={!avatarUrl ? <UserOutlined /> : undefined}
          style={{ background: '#ffffff', color: '#7c3aed' }}
        />
      </div>

      <Text strong style={{ display: 'block', marginBottom: 4 }}>
        {displayName}
      </Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        @{profile.userName}
      </Text>

      <div
        style={{
          marginTop: 8,
          padding: 16,
          borderRadius: 12,
          background: '#f9fafb',
          border: '1px solid #f1f5f9',
          textAlign: 'left',
        }}
      >
        <Text
          type="secondary"
          style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}
        >
          Nhóm quyền
        </Text>

        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {(profile.roles ?? []).map((role) => (
            <div
              key={role}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: '#f5f3ff',
                color: '#7c3aed',
                fontSize: 13,
                fontWeight: 500,
                display: 'inline-block',
              }}
            >
              {role}
            </div>
          ))}
        </Space>
      </div>
    </Card>
  )
}

export default ProfileSidebar