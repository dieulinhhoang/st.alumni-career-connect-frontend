import { useState } from 'react'
import { Tooltip } from 'antd'
import { AppstoreOutlined, BgColorsOutlined, NodeIndexOutlined } from '@ant-design/icons'
import type { Question, Section } from '../../../../../feature/form/types'
import { BankPanel } from './BankPanel'
import { ThemePanel } from './ThemePanel'
import { LogicPanel } from './LogicPanel'

interface LogicRule {
  id: string
  sourceQuestionId: string
  operator: 'equals' | 'notequals' | 'contains'
  value: string
  action: 'show' | 'hide' | 'skip' | 'require'
  targetQuestionId: string
}

const TABS = [
  { key: 'bank',   icon: <AppstoreOutlined />,    label: 'Thư viện' },
  { key: 'theme',  icon: <BgColorsOutlined />,    label: 'Giao diện' },
  { key: 'logic',  icon: <NodeIndexOutlined />,   label: 'Logic' },
] as const

type Tab = typeof TABS[number]['key']

interface RightPanelProps {
  questions: Question[]
  sections: Section[]
  accent: string
  activeTheme: string
  logoSize: number
  logicRules: LogicRule[]
  onAddBlank: (type: string) => void
  onDropFromBank: (question: Question) => void
  onThemeChange: (key: string, color: string) => void
  onLogoSizeChange: (size: number) => void
  onLogicRulesChange: (rules: LogicRule[]) => void
  defaultTab?: Tab
}

export function RightPanel({
  questions, sections, accent, activeTheme, logoSize, logicRules,
  onAddBlank, onDropFromBank, onThemeChange, onLogoSizeChange, onLogicRulesChange,
  defaultTab = 'bank',
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  const tabBtn = (tab: typeof TABS[number]) => {
    const isActive = activeTab === tab.key
    return (
      <Tooltip key={tab.key} title={tab.label} placement="bottom">
        <button
          onClick={() => setActiveTab(tab.key)}
          aria-label={tab.label}
          aria-selected={isActive}
          role="tab"
          style={{ flex: 1, height: 40, border: 'none', background: isActive ? '#fff' : 'transparent', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, color: isActive ? accent : '#94a3b8', transition: 'all .15s', fontSize: 11, fontWeight: isActive ? 700 : 500, fontFamily: 'inherit', boxShadow: isActive ? '0 1px 4px rgba(0,0,0,.08)' : 'none' }}>
          <span style={{ fontSize: 15 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      </Tooltip>
    )
  }

  return (
    <div style={{ width: 260, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eaecf0', background: '#fafbfc', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div role="tablist" aria-label="Panel tabs" style={{ display: 'flex', gap: 4, padding: '6px 8px', borderBottom: '1px solid #eaecf0', background: '#f3f4f6' }}>
        {TABS.map(tabBtn)}
      </div>

      {/* Panel content */}
      <div role="tabpanel" aria-label={TABS.find((t) => t.key === activeTab)?.label} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'bank' && (
          <BankPanel accent={accent} onAddBlank={onAddBlank} onDropFromBank={onDropFromBank} />
        )}
        {activeTab === 'theme' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <ThemePanel accent={accent} activeTheme={activeTheme} logoSize={logoSize} onThemeChange={onThemeChange} onLogoSizeChange={onLogoSizeChange} />
          </div>
        )}
        {activeTab === 'logic' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <LogicPanel questions={questions} logicRules={logicRules} accent={accent} onRulesChange={onLogicRulesChange} />
          </div>
        )}
      </div>
    </div>
  )
}
