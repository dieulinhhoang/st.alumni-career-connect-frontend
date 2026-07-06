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
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);

  // 5 năm gần nhất tính từ năm hiện tại
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const filteredOptions = React.useMemo(() => {
    if (!selectedYear) return surveyOptions;
    return surveyOptions.filter((o) => {
      const y = o.year ?? extractYearFromLabel(o.label);
      return y === selectedYear;
    });
  }, [surveyOptions, selectedYear]);

  // Khi đổi năm, reset surveyId nếu survey hiện tại không thuộc năm mới
  const handleYearChange = (y: number | null) => {
    setSelectedYear(y);
    const stillValid = filteredOptions.some((o) => o.value === surveyId);
    if (!stillValid && filteredOptions.length > 0) {
      onSurveyChange(filteredOptions[0].value);
    }
  };

  return (
    <div className="rp-page-header">

      {/* TRÁI: title + subtitle */}
      <div className="rp-page-header__left">
        <h1 className="rp-page-header__title">{title}</h1>
        <span className="rp-page-header__subtitle">{subtitle}</span>
      </div>

      {/* PHẢI: Hạn nộp / Năm / Đợt KS */}
      <div className="rp-page-header__right">
        {deadline && (
          <div className="rp-deadline-notice">
            Hạn nộp: <strong>{formatDeadline(deadline)}</strong>
          </div>
        )}

        <div className="rp-filter-row">
          {years.length > 1 && (
            <div className="rp-filter-item">
              <span className="rp-filter-label rp-filter-label--large">Năm tốt nghiệp</span>
              <Select
                value={selectedYear ?? undefined}
                onChange={(v) => handleYearChange(v ?? null)}
                style={{ width: 130 }}
                size="middle"
                placeholder="Tất cả"
                allowClear
              >
                {years.map((y) => (
                  <Option key={y} value={y}>{y}</Option>
                ))}
              </Select>
            </div>
          )}

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
              {filteredOptions.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

    </div>
  );
};

function extractYearFromLabel(label: string): number | null {
  const m = label.match(/\b(20\d{2})\b/);
  return m ? parseInt(m[1], 10) : null;
}
