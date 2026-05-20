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

type Tab = 'bank' | 'theme' | 'logic'

interface RightPanelProps {
  questions: Question[]
  sections: Section[]
  logoSize: number
  logicRules: LogicRule[]
  onAddBlank: (type: string) => void
  onDropFromBank: (question: Question) => void
  onLogoSizeChange: (size: number) => void
  onLogicRulesChange: (rules: LogicRule[]) => void
  defaultTab?: Tab
}

const TABS = [
  { key: 'bank'  as Tab, icon: <AppstoreOutlined />,  label: 'Thư viện'  },
  { key: 'theme' as Tab, icon: <BgColorsOutlined />,  label: 'Giao diện' },
  { key: 'logic' as Tab, icon: <NodeIndexOutlined />, label: 'Logic'     },
]

const STRIP_W        = 44   // tab icon strip
const PANEL_CONTENT_W = 256 // sliding content

export function RightPanel({
  questions, logoSize, logicRules,
  onAddBlank, onDropFromBank, onLogoSizeChange, onLogicRulesChange,
  defaultTab,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab | null>(defaultTab ?? null)
  const isOpen = activeTab !== null

  const toggle = (key: Tab) =>
    setActiveTab(prev => (prev === key ? null : key))

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      flexShrink: 0,
      borderLeft: '1px solid #e4e6ea',
      background: '#fff',
      overflow: 'hidden',
    }}>

      {/* ── Sliding content panel ── */}
      <div style={{
        width: isOpen ? PANEL_CONTENT_W : 0,
        minWidth: 0,
        overflow: 'hidden',
        transition: 'width .2s ease',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ width: PANEL_CONTENT_W, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTab === 'bank'  && <BankPanel onAddBlank={onAddBlank} onDropFromBank={onDropFromBank} />}
          {activeTab === 'theme' && <div style={{ flex: 1, overflowY: 'auto' }}><ThemePanel logoSize={logoSize} onLogoSizeChange={onLogoSizeChange} /></div>}
          {activeTab === 'logic' && <div style={{ flex: 1, overflowY: 'auto' }}><LogicPanel questions={questions} logicRules={logicRules} onRulesChange={onLogicRulesChange} /></div>}
        </div>
      </div>

      {/* ── Icon-only tab strip ── */}
      <div style={{
        width: STRIP_W,
        flexShrink: 0,
        borderLeft: '1px solid #e4e6ea',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 6,
        gap: 2,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key
          return (
            <Tooltip key={tab.key} title={tab.label} placement="left">
              <button
                onClick={() => toggle(tab.key)}
                aria-label={tab.label}
                aria-pressed={active}
                style={{
                  width: 36,
                  height: 36,
                  border: 'none',
                  borderRadius: 8,
                  background: active ? '#e2e8f0' : 'transparent',
                  color: active ? '#1e293b' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  transition: 'all .15s',
                  outline: 'none',
                  padding: 0,
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' } }}
              >
                {tab.icon}
              </button>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}