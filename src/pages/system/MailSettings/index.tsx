import React from 'react';
import { Tabs } from 'antd';
import { MailOutlined, FileTextOutlined } from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import EmailConfigTab from './EmailConfigTab';
import EmailTemplateList from './EmailTemplateList';

const MailSettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <Tabs
        defaultActiveKey="config"
        items={[
          {
            key: 'config',
            label: (
              <span>
                <MailOutlined /> Email
              </span>
            ),
            children: <EmailConfigTab />,
          },
          {
            key: 'templates',
            label: (
              <span>
                <FileTextOutlined /> Email template
              </span>
            ),
            children: <EmailTemplateList />,
          },
        ]}
      />
    </AdminLayout>
  );
};

export default MailSettingsPage;
