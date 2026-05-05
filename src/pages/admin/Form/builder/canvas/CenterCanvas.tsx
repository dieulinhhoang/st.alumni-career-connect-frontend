import { useRef, useCallback, useState } from 'react'
import { Tooltip } from 'antd'
import {
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SplitCellsOutlined,
} from '@ant-design/icons'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Question, Section, SurveyHeader, SurveyFooter } from '../../../../../feature/form/types'
import { EditableQuestionCard } from './EditableQuestionCard'
import { SectionBar } from './SectionBar'
import { PDFCanvas } from '../form/PDFCanvas'

interface CenterCanvasProps {
  questions: Question[]
  sections: Section[]
  activeQuestionId: string | null
  accent: string
  surveyTitle: string
  descriptionParagraphs?: string[]
  header: SurveyHeader
  footer?: SurveyFooter
  logoUrl?: string
  logoSize?: number
  onActivate: (id: string) => void
  onDeactivate: () => void
  onUpdate: (id: string, patch: Partial<Question>) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onAddQuestion: (afterId?: string, patch?: Partial<Question>) => void
  onAddSectionAfter: (afterQuestionId: string) => void
  onAddOption: (qid: string) => void
  onUpdateOption: (qid: string, oid: string, label: string) => void
  onRemoveOption: (qid: string, oid: string) => void
  onTitleChange: (title: string) => void
  onDescriptionParagraphsChange: (paragraphs: string[]) => void
  onHeaderChange: (header: SurveyHeader) => void
  onFooterChange: (footer: SurveyFooter) => void
  onSectionsChange: (sections: Section[]) => void
  onDrop: (e: React.DragEvent, afterId?: string) => void
  onReorder: (dragId: string, overId: string) => void
  onRenameSection: (id: string, title: string) => void
  onDeleteSection: (id: string) => void
}

const railBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  border: 'none',
  borderRadius: 12,
  background: '#fff',
  color: '#6b7280',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  transition: 'all .15s',
}

function RailButton({
  icon, label, onClick, accent, danger = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  accent: string
  danger?: boolean
}) {
  return (
    <Tooltip title={label} placement="left">
      <button
        onClick={onClick}
        aria-label={label}
        style={{ ...railBtn, color: danger ? '#dc2626' : '#6b7280' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = danger ? '#fee2e2' : `${accent}12`
          e.currentTarget.style.color = danger ? '#dc2626' : accent
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff'
          e.currentTarget.style.color = danger ? '#dc2626' : '#6b7280'
        }}
      >
        {icon}
      </button>
    </Tooltip>
  )
}

//  Sortable wrapper cho mỗi câu hỏi 
function SortableCard({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        position: 'relative',
      }}
    >
      {/* Drag handle — truyền xuống con qua data attribute */}
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        data-drag-handle
        style={{
          position: 'absolute',
          left: -28,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 24,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: '#cbd5e1',
          fontSize: 16,
          zIndex: 10,
          userSelect: 'none',
          borderRadius: 6,
          transition: 'color .15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1' }}
        title="Kéo để sắp xếp"
      >
        ⠿
      </div>
      {children}
    </div>
  )
}

export function CenterCanvas({
  questions,
  sections,
  activeQuestionId,
  accent,
  surveyTitle,
  descriptionParagraphs,
  header,
  footer,
  logoUrl,
  logoSize,
  onActivate,
  onDeactivate,
  onUpdate,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddQuestion,
  onAddSectionAfter,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onTitleChange,
  onDescriptionParagraphsChange,
  onHeaderChange,
  onFooterChange,
  onSectionsChange,
  onDrop,
  onReorder,
  onRenameSection,
  onDeleteSection,
}: CenterCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)

  // dnd-kit sensors — distance: 5 để tránh nhầm với click
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setDragActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDragActiveId(null)
    if (!over || active.id === over.id) return
    onReorder(active.id as string, over.id as string)
  }

  // Drop từ bank bên phải
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const sectionedGroups = sections.map((section, sIdx) => ({
    section,
    sIdx,
    questions: questions
      .filter((q) => q.sectionId === section.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }))

  const unsectioned = questions.filter((q) => !sections.find((s) => s.id === q.sectionId))
  const dragActiveQuestion = dragActiveId ? questions.find((q) => q.id === dragActiveId) : null

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
        position: 'relative',
      }}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 88px 48px 44px', // left 44 để chỗ cho drag handle
        }}
      >
        {/* Header card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #eaecf0',
            overflow: 'hidden',
            marginBottom: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,.04)',
          }}
        >
          <PDFCanvas
            surveyTitle={surveyTitle}
            descriptionParagraphs={descriptionParagraphs}
            sections={sections}
            questions={[]}
            accent={accent}
            header={header}
            footer={footer}
            logoUrl={logoUrl}
            logoSize={logoSize}
            interactive={false}
            headerOnly
            onHeaderChange={onHeaderChange}
            onFooterChange={onFooterChange}
            onTitleChange={onTitleChange}
            onDescriptionParagraphsChange={onDescriptionParagraphsChange}
            onSectionsChange={onSectionsChange}
          />
        </div>

        {questions.length === 0 ? (
          //  Empty state 
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, undefined)}
            style={{
              padding: '48px 24px',
              borderRadius: 14,
              border: '2px dashed #d1d5db',
              background: '#fff',
              textAlign: 'center',
              cursor: 'default',
              transition: 'all .15s',
            }}
            onDragEnter={(e) => {
              e.currentTarget.style.borderColor = accent
              e.currentTarget.style.background = `${accent}06`
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>
              📋
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Chưa có câu hỏi nào
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18 }}>
              Kéo từ thư viện bên phải hoặc nhấn nút bên dưới để bắt đầu
            </div>
            <button
              onClick={() => onAddQuestion()}
              style={{ height: 36, padding: '0 20px', border: 'none', borderRadius: 8, background: accent, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
            >
              <PlusOutlined style={{ fontSize: 11 }} /> Thêm câu hỏi
            </button>
          </div>
        ) : (
          //  Question list với dnd-kit 
          <div onDragOver={handleDragOver} onDrop={(e) => onDrop(e, undefined)}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {sectionedGroups.map(({ section, sIdx, questions: sqs }) => (
                  <div key={section.id}>
                    <SectionBar
                      section={section}
                      accent={accent}
                      sectionIndex={sIdx}
                      canDelete={sections.length > 1}
                      onRename={onRenameSection}
                      onDelete={onDeleteSection}
                      onAddQuestion={(sectionId) => {
                        onAddQuestion(undefined, { sectionId })
                      }}
                    />
                    {sqs.map((q) => (
                      <SortableCard key={q.id} id={q.id}>
                        <EditableQuestionCard
                          question={q}
                          index={questions.indexOf(q)}
                          total={questions.length}
                          isActive={activeQuestionId === q.id}
                          accent={accent}
                          sections={sections}
                          onActivate={() => onActivate(q.id)}
                          onDeactivate={onDeactivate}
                          onUpdate={(patch) => onUpdate(q.id, patch)}
                          onDuplicate={() => onDuplicate(q.id)}
                          onRemove={() => onRemove(q.id)}
                          onMoveUp={() => onMoveUp(q.id)}
                          onMoveDown={() => onMoveDown(q.id)}
                          onAddQuestion={() => onAddQuestion(q.id)}
                          onAddOption={() => onAddOption(q.id)}
                          onUpdateOption={(oid, label) => onUpdateOption(q.id, oid, label)}
                          onRemoveOption={(oid) => onRemoveOption(q.id, oid)}
                        />
                      </SortableCard>
                    ))}
                  </div>
                ))}

                {/* Câu hỏi chưa thuộc section nào */}
                {unsectioned.map((q) => (
                  <SortableCard key={q.id} id={q.id}>
                    <EditableQuestionCard
                      question={q}
                      index={questions.indexOf(q)}
                      total={questions.length}
                      isActive={activeQuestionId === q.id}
                      accent={accent}
                      sections={sections}
                      onActivate={() => onActivate(q.id)}
                      onDeactivate={onDeactivate}
                      onUpdate={(patch) => onUpdate(q.id, patch)}
                      onDuplicate={() => onDuplicate(q.id)}
                      onRemove={() => onRemove(q.id)}
                      onMoveUp={() => onMoveUp(q.id)}
                      onMoveDown={() => onMoveDown(q.id)}
                      onAddQuestion={() => onAddQuestion(q.id)}
                      onAddOption={() => onAddOption(q.id)}
                      onUpdateOption={(oid, label) => onUpdateOption(q.id, oid, label)}
                      onRemoveOption={(oid) => onRemoveOption(q.id, oid)}
                    />
                  </SortableCard>
                ))}
              </SortableContext>

              {/* Ghost card khi đang kéo */}
              <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
                {dragActiveQuestion ? (
                  <div style={{ opacity: 0.85, pointerEvents: 'none', transform: 'rotate(1deg)', boxShadow: '0 16px 40px rgba(0,0,0,.18)', borderRadius: 12 }}>
                    <EditableQuestionCard
                      question={dragActiveQuestion}
                      index={0}
                      total={0}
                      isActive={false}
                      accent={accent}
                      sections={sections}
                      onActivate={() => {}}
                      onDeactivate={() => {}}
                      onUpdate={() => {}}
                      onDuplicate={() => {}}
                      onRemove={() => {}}
                      onMoveUp={() => {}}
                      onMoveDown={() => {}}
                      onAddQuestion={() => {}}
                      onAddOption={() => {}}
                      onUpdateOption={() => {}}
                      onRemoveOption={() => {}}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {/*  Bottom action bar  */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Tooltip title="Thêm câu hỏi mới" placement="top">
                <button
                  onClick={() => onAddQuestion()}
                  aria-label="Thêm câu hỏi mới"
                  style={{ flex: 1, height: 36, border: '1.5px dashed #d1d5db', borderRadius: 10, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all .15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}08` }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}
                >
                  <PlusOutlined style={{ fontSize: 11 }} /> Thêm câu hỏi
                </button>
              </Tooltip>

              {/* <Tooltip title="Ngắt phần — thêm section mới" placement="top">
                <button
                  onClick={() => {
                    const targetId = activeQuestionId ?? questions[questions.length - 1]?.id
                    if (targetId) onAddSectionAfter(targetId)
                  }}
                  aria-label="Ngắt phần"
                  style={{ height: 36, padding: '0 16px', border: '1.5px dashed #d1d5db', borderRadius: 10, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all .15s', flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#6366f108' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}
                >
                  <SplitCellsOutlined style={{ fontSize: 13 }} /> Ngắt phần
                </button>
              </Tooltip> */}
            </div>
          </div>
        )}
      </div>

      {/*  Floating rail toolbar  */}
      {activeQuestionId && questions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            right: 18,
            top: 96,
            zIndex: 30,
            width: 56,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 18,
            boxShadow: '0 12px 30px rgba(15,23,42,.12)',
            padding: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <RailButton icon={<PlusOutlined />} label="Thêm câu hỏi" onClick={() => onAddQuestion(activeQuestionId)} accent={accent} />
          <RailButton icon={<SplitCellsOutlined />} label="Ngắt phần" onClick={() => onAddSectionAfter(activeQuestionId)} accent={accent} />
          {/* <RailButton icon={<CopyOutlined />} label="Nhân bản" onClick={() => onDuplicate(activeQuestionId)} accent={accent} />
          <RailButton icon={<ArrowUpOutlined />} label="Đưa lên" onClick={() => onMoveUp(activeQuestionId)} accent={accent} />
          <RailButton icon={<ArrowDownOutlined />} label="Đưa xuống" onClick={() => onMoveDown(activeQuestionId)} accent={accent} />
          <RailButton icon={<DeleteOutlined />} label="Xóa câu hỏi" onClick={() => onRemove(activeQuestionId)} accent={accent} danger /> */}
        </div>
      )}
    </div>
  )
}