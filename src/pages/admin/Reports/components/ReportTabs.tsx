import React from 'react';
import { Tabs } from 'antd';
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
import { DownloadToolbar } from './DownloadToolbar';

interface Props {
  majorRows: MajorSummaryRow[];
  graduateRows: GraduateRow[];
  responseRows: ResponseRow[];
  facultyRows: FacultySubmissionRow[];
  reportMeta: ReportMeta;
  orgLine1: string;
  orgLine2: string;
  signLabel: string;
  onDownload: (mau: 'mau01' | 'mau02' | 'mau03') => void;
  /** Switch to faculty scope view when admin clicks "Xem" in ProgressTable */
  onViewFaculty?: (facultyCode: string) => void;
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
  onViewFaculty,
}) => {
  const sharedProps = { orgLine1, orgLine2, signLabel };

  return (
    <div className="rp-table-card">
      <Tabs
        className="rp-tabs"
        items={[
          {
            key: 'progress',
            label: 'Tiến độ nộp',
            children: (
              <ProgressTable rows={facultyRows} onViewFaculty={onViewFaculty} />
            ),
          },
          {
            key: 'mau01',
            label: reportMeta.mau01Title,
            children: (
              <>
                <DownloadToolbar onDownload={() => onDownload('mau01')} />
                <Mau01Table rows={majorRows} {...sharedProps} />
              </>
            ),
          },
          {
            key: 'mau02',
            label: reportMeta.mau02Title,
            children: (
              <>
                <DownloadToolbar onDownload={() => onDownload('mau02')} />
                <Mau02Table rows={graduateRows} {...sharedProps} />
              </>
            ),
          },
          {
            key: 'mau03',
            label: reportMeta.mau03Title,
            children: (
              <>
                <DownloadToolbar onDownload={() => onDownload('mau03')} />
                <Mau03Table rows={responseRows} {...sharedProps} />
              </>
            ),
          },
        ]}
      />
    </div>
  );
};
