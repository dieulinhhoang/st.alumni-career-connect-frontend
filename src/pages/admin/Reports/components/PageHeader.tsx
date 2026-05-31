import React from 'react';
import { Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { SubmissionPill } from './SubmissionPill';
import type { SubmissionStatus, UserScope } from '../../../../feature/reports/types';
import type { SurveyOption } from '../../../../feature/reports/api';
import { USER_ROLE_OPTIONS } from '../../../../feature/reports/constants';

const { Option } = Select;

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
}

export const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  scopeLabel,
  surveyId,
  surveyOptions,
  deadline,
  userIndex,
  scope,
  submissionStatus,
  onSurveyChange,
  onUserChange,
  onSubmit,
  onWithdraw,
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

      {/* PHẢI: filter Vai trò / Đợt KS / Phạm vi */}
      <div className="rp-page-header__right">
        {deadline && (
          <div className="rp-deadline-notice">
            Hạn nộp: <strong>{deadline}</strong>
          </div>
        )}
        <div className="rp-filter-row">
          <div className="rp-filter-item">
            <span className="rp-filter-label rp-filter-label--large">Vai trò</span>
            <Select value={userIndex} onChange={onUserChange} style={{ width: 220 }} size="middle">
              {USER_ROLE_OPTIONS.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </div>

          <div className="rp-filter-item">
            <span className="rp-filter-label rp-filter-label--large">Đợt khảo sát</span>
            <Select value={surveyId} onChange={onSurveyChange} style={{ width: 260 }} size="middle">
              {surveyOptions.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </div>

          <div className="rp-filter-item">
            <span className="rp-filter-label rp-filter-label--large">Phạm vi</span>
            <div className="rp-scope-badge rp-scope-badge--large">{scopeLabel}</div>
          </div>
        </div>
      </div>

    </div>
  );
};
