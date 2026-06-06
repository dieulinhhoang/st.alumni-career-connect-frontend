import React from 'react';
import { Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { SubmissionPill } from './SubmissionPill';
import type { SubmissionStatus, UserScope, FacultyOption, MajorOption } from '../../../../feature/reports/types';
import type { SurveyOption } from '../../../../feature/reports/api';

const { Option } = Select;

// Format deadline từ ISO string hoặc 'YYYY-MM-DD' → 'DD/MM/YYYY'
function formatDeadline(raw: string | null | undefined): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

interface Props {
  title: string;
  subtitle: string;
  scopeLabel: string;
  surveyId: string;
  surveyOptions: SurveyOption[];
  deadline: string;
  userIndex: number;
  scope: UserScope;
  submissionStatus: SubmissionStatus;
  onSurveyChange: (v: string) => void;
  onUserChange: (v: number) => void;
  onSubmit: () => void;
  onWithdraw: () => void;
  // Filter khoa / ngành
  facultyOptions: FacultyOption[];
  majorOptions: MajorOption[];
  facultyId: string;
  majorId: string;
  onFacultyChange: (v: string) => void;
  onMajorChange: (v: string) => void;
}

export const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  surveyId,
  surveyOptions,
  deadline,
  scope,
  submissionStatus,
  onSurveyChange,
  onSubmit,
  onWithdraw,
  facultyOptions,
  majorOptions,
  facultyId,
  majorId,
  onFacultyChange,
  onMajorChange,
}) => {
  const isFacultyLike = scope === 'faculty' || scope === 'major';

  return (
    <div className="rp-page-header">

      {/* TRÁI: title + subtitle + nút nộp */}
      <div className="rp-page-header__left">
        <h1 className="rp-page-header__title">{title}</h1>
        <span className="rp-page-header__subtitle">{subtitle}</span>

        {isFacultyLike && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <SubmissionPill status={submissionStatus} />
            {submissionStatus === 'draft' && (
              <Button size="small" type="primary" icon={<SendOutlined />} onClick={onSubmit}>
                Nộp báo cáo lên trường
              </Button>
            )}
            {submissionStatus === 'submitted' && (
              <Button size="small" danger onClick={onWithdraw}>
                Thu hồi
              </Button>
            )}
            {submissionStatus === 'returned' && (
              <Button size="small" type="primary" icon={<SendOutlined />} onClick={onSubmit}>
                Nộp lại lên trường
              </Button>
            )}
            {submissionStatus === 'approved' && (
              <span style={{ color: '#52c41a', fontSize: 13 }}>Trường đã duyệt báo cáo</span>
            )}
          </div>
        )}
      </div>

      {/* PHẢI: Hạn nộp / Đợt KS / Khoa / Ngành */}
      <div className="rp-page-header__right">
        {deadline && (
          <div className="rp-deadline-notice">
            Hạn nộp: <strong>{formatDeadline(deadline)}</strong>
          </div>
        )}

        <div className="rp-filter-row">
          <div className="rp-filter-item">
            <span className="rp-filter-label rp-filter-label--large">Đợt khảo sát</span>
            <Select
              value={surveyId || undefined}
              onChange={onSurveyChange}
              style={{ width: 260 }}
              size="middle"
              placeholder="Chọn đợt khảo sát"
              allowClear
            >
              {surveyOptions.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </div>

          {facultyOptions.length > 0 && (
            <div className="rp-filter-item">
              <span className="rp-filter-label rp-filter-label--large">Khoa</span>
              <Select
                value={facultyId || undefined}
                onChange={onFacultyChange}
                style={{ width: 200 }}
                size="middle"
                placeholder="Tất cả khoa"
                allowClear
              >
                {facultyOptions.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </div>
          )}

          {majorOptions.length > 0 && (
            <div className="rp-filter-item">
              <span className="rp-filter-label rp-filter-label--large">Ngành</span>
              <Select
                value={majorId || undefined}
                onChange={onMajorChange}
                style={{ width: 200 }}
                size="middle"
                placeholder="Tất cả ngành"
                allowClear
              >
                {majorOptions.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};