import React from 'react';

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
  pctBg,
  pctColor,
}) => {
  const pct = denominator ? Math.round((numerator / denominator) * 10000) / 100 : 0;
  const displayPct = pct % 1 === 0 ? pct : pct.toFixed(1);

  // Icon nền nhạt từ barColor
  const iconBg = `${barColor}18`;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid rgba(30, 41, 59, 0.10)',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)',
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        height: '100%',
        boxSizing: 'border-box',
        transition: 'box-shadow 160ms cubic-bezier(0.16,1,0.3,1), transform 160ms cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(30,41,59,0.09), 0 1px 4px rgba(30,41,59,0.05)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: iconBg,
          color: barColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 18,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {/* Hiển thị % trong icon */}
        <span style={{ fontSize: 12, fontWeight: 700 }}>{displayPct}%</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label + badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <span
            title={label}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#94a3b8',
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              flex: 1,
              wordBreak: 'break-word',
            }}
          >
            {label}
          </span>
          <span
            style={{
              background: pctBg,
              color: pctColor,
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.2px',
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {displayPct}%
          </span>
        </div>

        {/* Numerator / denominator */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1, marginBottom: 8 }}>
          <span style={{
            fontSize: 28,
            fontWeight: 700,
            color: numColor,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {numerator}
          </span>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>/ {denominator}</span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 5,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(pct, 100)}%`,
              background: barColor,
              borderRadius: 4,
              transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
