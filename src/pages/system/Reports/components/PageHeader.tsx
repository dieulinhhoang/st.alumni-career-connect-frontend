import React from 'react';
import { Select } from 'antd';
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
  surveyId: string;
  surveyOptions: SurveyOption[];
  deadline: string;
  onSurveyChange: (v: string) => void;
}

export const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  surveyId,
  surveyOptions,
  deadline,
  onSurveyChange,
}) => {
  return (
    <div className="rp-page-header">

      {/* TRÁI: title + subtitle */}
      <div className="rp-page-header__left">
        <h1 className="rp-page-header__title">{title}</h1>
        <span className="rp-page-header__subtitle">{subtitle}</span>
      </div>

      {/* PHẢI: Hạn nộp / Đợt KS */}
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
        </div>
      </div>

    </div>
  );
};
