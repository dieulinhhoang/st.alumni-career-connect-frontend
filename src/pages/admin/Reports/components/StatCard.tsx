// src/pages/admin/Reports/components/StatCard.tsx
import React from 'react';
import { Col, Row } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { StatCardProps } from '../types';

export function StatCard({ label, value, sub, icon, accent, trend }: StatCardProps) {
  return (
    <div
      style={{
        background: '#1a1a2e',
        border: `1px solid ${accent}44`,
        borderRadius: 12,
        padding: '16px 20px',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <Row justify="space-between" align="top">
        <span style={{ color: '#aaa', fontSize: 13 }}>{label}</span>
        <span style={{ color: accent, fontSize: 22 }}>{icon}</span>
      </Row>
      <div style={{ color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      {(sub || trend !== undefined) && (
        <Row align="middle" style={{ gap: 6 }}>
          {trend !== undefined && (
            <span style={{ color: trend >= 0 ? '#52c41a' : '#ff4d4f', fontSize: 12 }}>
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend)}%
            </span>
          )}
          {sub && <span style={{ color: '#666', fontSize: 12 }}>{sub}</span>}
        </Row>
      )}
    </div>
  );
}

export function StatCardGrid({ cards }: { cards: StatCardProps[] }) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {cards.map((card, i) => (
        <Col key={i} xs={24} sm={12} lg={6}>
          <StatCard {...card} />
        </Col>
      ))}
    </Row>
  );
}
