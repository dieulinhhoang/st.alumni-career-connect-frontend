import { Button, Space } from 'antd'
import { ArrowLeftOutlined, FileOutlined } from '@ant-design/icons'
import type { Form, Question, Section, SurveyHeader, SurveyFooter } from '../../../feature/form/types'
 import { PDFCanvas } from './builder/form/PDFCanvas'
import { THEMES } from '../../../feature/form/constants'

 function getAccent(themeId?: string): string {
  const t = THEMES.find((t) => t.id === themeId)
  if (t) return t.accent
  if (themeId?.startsWith('#')) return themeId
  return THEMES[0].accent
}

function mapFormToCanvas(form: Form) {
  const sections: Section[] =
    (form as any).sections?.length > 0
      ? (form as any).sections
      : [{ id: 'default-section', title: 'Nội dung khảo sát', order: 0 }]
  const defaultSectionId = sections[0].id

  let order = 0
  const questions: Question[] = form.questions.map((q: any) => {
    const typeMap: Record<string, Question['type']> = {
      short: 'short', long: 'long', radio: 'radio', checkbox: 'checkbox',
      dropdown: 'select', select: 'select', date: 'date', address: 'address',
      email: 'email', tel: 'tel',
    }
    return {
      id: q.id, type: typeMap[q.type] ?? 'short', title: q.title,
      placeholder: q.type === 'short' ? 'Câu trả lời của bạn' : undefined,
      options: q.options?.map((o: any) => (typeof o === 'string' ? o : o.label)),
      required: q.required, sectionId: q.sectionId ?? defaultSectionId, order: order++,
    }
  })

  const header: SurveyHeader = {
    logoUrl:   (form as any).logoUrl ?? 'https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png',
    ministry:  (form as any).header?.ministry  ?? 'BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG',
    academy:   (form as any).header?.academy   ?? 'HỌC VIỆN NÔNG NGHIỆP VIỆT NAM',
    address:   (form as any).header?.address   ?? 'Xã Gia Lâm, Thành phố Hà Nội',
    phone:     (form as any).header?.phone     ?? '024.62617586',
    showDate:  true,
  }

  const footer: SurveyFooter = {
    primaryText:   (form as any).footer?.primaryText   ?? 'Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!',
    secondaryText: (form as any).footer?.secondaryText ?? 'Kính chúc Anh/Chị sức khỏe và thành công!',
  }

  return { sections, questions, header, footer, accent: getAccent(form.themeId) }
}

//  SurveyPreview (embeddable) 
interface SurveyPreviewProps {
  form: Form | null
  compact?: boolean
  initialValues?: Record<string, any>
  onSubmit?: (answers: Record<string, any>) => void
}

export function SurveyPreview({ form, compact = false, initialValues, onSubmit }: SurveyPreviewProps) {
  if (!form) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, color: '#9ca3af', gap: 12 }}>
      <FileOutlined style={{ fontSize: 40 }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>Chưa có nội dung xem trước</span>
    </div>
  )

  const { sections, questions, header, footer, accent } = mapFormToCanvas(form)
  const descParagraphs = form.description ? form.description.split('\n').filter(Boolean) : []
  const logicRules = (form as any).logicRules ?? []

  return (
    <PDFCanvas
      surveyTitle={form.name}
      descriptionParagraphs={descParagraphs}
      sections={sections}
      questions={questions}
      accent={accent}
      header={header}
      footer={footer}
      interactive={!compact}
      headerOnly={false}
      logoUrl={header.logoUrl}
      logoSize={compact ? 36 : ((form as any).logoSize ?? 120)}
      initialValues={initialValues}
      onSubmit={onSubmit}
      logicRules={logicRules}
    />
  )
}

//  PreviewView (standalone page) 
interface PreviewViewProps {
  form: Form | null
  onBack: () => void
}

export default function PreviewView({ form, onBack }: PreviewViewProps) {
  const accent = form ? getAccent(form.themeId) : THEMES[0].accent
  const theme   = THEMES.find((t) => t.id === form?.themeId) ?? THEMES[0]

  return (
    <div style={{ minHeight: '100vh', background: theme.bg ?? '#f5f5f5' }}>
      {/* Sticky top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 20px', borderBottom: '1px solid #e5e7eb', height: 48, position: 'sticky', top: 0, zIndex: 10 }}>
        <Space size={12}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} aria-label="Quay lại" />
          <div style={{ width: 1, height: 18, background: '#e5e7eb' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' as const }}>Xem trước</span>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent }} />
          <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{accent}</span>
        </div>
      </div>

      {/* Preview content */}
      <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
        <SurveyPreview form={form} compact={false} />
      </div>
    </div>
  )
}
