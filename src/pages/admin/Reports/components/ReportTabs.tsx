import React from 'react';
import { Tabs, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  PieChartOutlined,
  SendOutlined,
  DownloadOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import type {
  MajorSummaryRow,
  GraduateRow,
  ResponseRow,
  FacultySubmissionRow,
  ReportMeta,
} from '../../../../feature/reports/types';
import { Mau01Table } from './Mau01Table';
import { Mau02Table } from './Mau02Table';
import { Mau03Table } from './Mau03Table';
import { ProgressTable } from './ProgressTable';

interface Props {
  majorRows: MajorSummaryRow[];
  graduateRows: GraduateRow[];
  responseRows: ResponseRow[];
  facultyRows: FacultySubmissionRow[];
  reportMeta: ReportMeta | null;
  orgLine1: string;
  orgLine2: string;
  signLabel: string;
  onDownload: (mau: 'mau01' | 'mau02' | 'mau03') => void;
}

export const ReportTabs: React.FC<Props> = ({
  majorRows,
  graduateRows,
  responseRows,
  facultyRows,
  reportMeta,
  orgLine1,
  orgLine2,
  signLabel,
  onDownload,
}) => {
  const downloadMenu: MenuProps = {
    items: [
      { key: 'mau01', icon: <DownloadOutlined />, label: 'Mẫu 1 ' },
      { key: 'mau02', icon: <DownloadOutlined />, label: 'Mẫu 2 ' },
      { key: 'mau03', icon: <DownloadOutlined />, label: 'Mẫu 3 ' },
    ],
    onClick: ({ key }) => onDownload(key as 'mau01' | 'mau02' | 'mau03'),
  };

  const tabBarExtra = (
    <Dropdown menu={downloadMenu} trigger={['click']} placement="bottomRight">
      <Button size="small" icon={<DownloadOutlined />} title="Tải báo cáo">
        <EllipsisOutlined />
      </Button>
    </Dropdown>
  );

  return (
    <div className="rp-table-card">
      <Tabs
        defaultActiveKey="mau01"
        className="rp-tabs"
        tabBarExtraContent={{ right: tabBarExtra }}
        items={[
          {
            key: 'mau01',
            label: <span><FileTextOutlined /> Mẫu 1 </span>,
            children: (
              <Mau01Table
                rows={majorRows}
                orgLine1={orgLine1}
                orgLine2={orgLine2}
                title={reportMeta?.mau01Title ?? ''}
                note={reportMeta?.mau01Note}
                signLabel={signLabel}
              />
            ),
          },
          {
            key: 'mau02',
            label: <span><TeamOutlined /> Mẫu 2 </span>,
            children: (
              <Mau02Table
                rows={graduateRows}
                orgLine1={orgLine1}
                orgLine2={orgLine2}
                title={reportMeta?.mau02Title ?? ''}
                note={reportMeta?.mau02Note}
                signLabel={signLabel}
              />
            ),
          },
          {
            key: 'mau03',
            label: <span><PieChartOutlined /> Mẫu 3 </span>,
            children: (
              <Mau03Table
                rows={responseRows}
                orgLine1={orgLine1}
                orgLine2={orgLine2}
                title={reportMeta?.mau03Title ?? ''}
                note={reportMeta?.mau03Note}
                signLabel={signLabel}
              />
            ),
          },
          {
            key: 'progress',
            label: <span><SendOutlined /> Tiến độ nộp báo cáo</span>,
            children: <ProgressTable rows={facultyRows} />,
          },
        ]}
      />
    </div>
  );
};