import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export interface StatCardProps {
  numerator: number;
  denominator: number;
  label: string;
  numColor: string;
  barColor: string;
  pctBg: string;
  pctColor: string;
  cardBg: string;
  cardBorder: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  numerator,
  denominator,
  label,
  numColor,
  barColor,
  pctColor,
  cardBg,
}) => {
  const pct = denominator ? Math.round((numerator / denominator) * 10000) / 100 : 0;
  const displayPct = pct % 1 === 0 ? pct : pct.toFixed(1);

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 12px 28px rgba(0,0,0,0.08)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row: label */}
      <Text
        title={label}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#374151',
          lineHeight: 1.4,
          wordBreak: 'break-word',
        }}
      >
        {label}
      </Text>

      {/* Middle: big number + fraction */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, lineHeight: 1 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: numColor, lineHeight: 1, letterSpacing: '-0.5px' }}>
          {numerator}
        </span>
        <Text type="secondary" style={{ fontSize: 14 }}>
          / {denominator}
        </Text>
      </div>

      {/* Progress bar + pct badge in one row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            height: 6,
            background: 'rgba(0,0,0,0.07)',
            borderRadius: 99,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(pct, 100)}%`,
              background: barColor,
              borderRadius: 99,
              transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Pct badge — bottom right aligned */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span
            style={{
              background: `${barColor}20`,
              color: pctColor,
              padding: '2px 9px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.3px',
              lineHeight: 1.6,
              whiteSpace: 'nowrap',
            }}
          >
            {displayPct}%
          </span>
        </div>
      </div>
    </div>
  );
};
