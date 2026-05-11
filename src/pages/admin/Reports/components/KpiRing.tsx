// src/pages/admin/Reports/components/KpiRing.tsx
import React from 'react';
import { Col, Row } from 'antd';
import type { KpiRingProps } from '../types';

export function KpiRing({ label, value, color, desc }: KpiRingProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ textAlign: 'center', padding: '8px 16px' }}>
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={radius} fill="none" stroke="#2a2a3e" strokeWidth={8} />
        <circle
          cx={45}
          cy={45}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x={45} y={49} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
          {value}%
        </text>
      </svg>
      <div style={{ color: '#ccc', fontSize: 13, marginTop: 4 }}>{label}</div>
      {desc && <div style={{ color: '#666', fontSize: 11 }}>{desc}</div>}
    </div>
  );
}

export function KpiRingGroup({ rings }: { rings: KpiRingProps[] }) {
  return (
    <Row justify="space-around" style={{ background: '#12122a', borderRadius: 12, padding: '16px 0', marginBottom: 24 }}>
      {rings.map((ring, i) => (
        <Col key={i}>
          <KpiRing {...ring} />
        </Col>
      ))}
    </Row>
  );
}
