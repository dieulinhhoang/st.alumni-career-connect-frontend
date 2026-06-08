import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  // Dashboard mode
  value?: string | number;
  sub?: string;
  icon?: ReactNode;
  trend?: string;
  // Alumni ratio mode
  numerator?: number;
  denominator?: number;
  // Shared
  accentColor?: string;
}

const DEFAULT_COLOR = '#16a34a';

export function KpiCard({
  label,
  value,
  sub,
  icon,
  trend,
  numerator,
  denominator,
  accentColor = DEFAULT_COLOR,
}: KpiCardProps) {
  // Ratio mode khi có numerator + denominator
  const isRatioMode = numerator !== undefined && denominator !== undefined;
  const pct = isRatioMode && denominator
    ? Math.round((numerator! / denominator) * 10000) / 100
    : null;
  const displayPct = pct !== null
    ? pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`
    : null;

  const isNegative = trend?.startsWith('-');
  const trendColor = isNegative ? '#ef4444' : '#16a34a';
  const trendBg = isNegative ? '#fff1f2' : '#f0fdf4';
  const trendArrow = isNegative ? '↓' : '↑';
  const iconBg = `${accentColor}18`;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 12,
        padding: '18px 20px',
        height: '100%',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 12px 28px rgba(0,0,0,0.08)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Row 1: icon + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {icon ? (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        ) : (
          <div />
        )}

        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              fontWeight: 600,
              color: trendColor,
              background: trendBg,
              padding: '3px 8px',
              borderRadius: 99,
            }}
          >
            {trendArrow} {trend}
          </span>
        )}
      </div>

      {/* Row 2: main value */}
      {isRatioMode ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, lineHeight: 1 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: accentColor, lineHeight: 1, letterSpacing: '-0.5px' }}>
            {numerator}
          </span>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>/ {denominator}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}
          >
            {value}
          </div>
        </div>
      )}

      {/* Row 3: label */}
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, lineHeight: 1.4 }}>
        {label}
      </div>

      {/* Row 4: sub text hoặc progress bar (ratio mode) */}
      {isRatioMode && pct !== null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              height: 5,
              background: 'rgba(0,0,0,0.07)',
              borderRadius: 99,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(pct, 100)}%`,
                background: accentColor,
                borderRadius: 99,
                transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span
              style={{
                background: `${accentColor}20`,
                color: accentColor,
                padding: '2px 9px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {displayPct}
            </span>
          </div>
        </div>
      ) : sub ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 3,
              height: 14,
              borderRadius: 99,
              background: accentColor,
              flexShrink: 0,
              opacity: 0.6,
            }}
          />
          <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{sub}</span>
        </div>
      ) : null}
    </div>
  );
}

export default KpiCard;