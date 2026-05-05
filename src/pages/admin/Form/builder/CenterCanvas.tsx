import { useState, useRef, useCallback, useEffect } from "react";
import { PDFCanvas } from "./Form";
import { Canvas } from "./Canvas";
import { QuestionToolbar } from "./QuestionToolbar";
import type { Question, Section, SurveyFooter } from "../../../../feature/form/types";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface HeaderFields {
  orgUnit: string;
  orgName: string;
  address: string;
  phone: string;
}

interface CenterCanvasProps {
  name: string;
  desc: string;
  descHtml?: string;
  accent: string;
  questions: Question[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onUpdateQuestion: (id: string, patch: Partial<Question>) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onAddOption: (qid: string) => void;
  onUpdateOption: (qid: string, oid: string, label: string) => void;
  onRemoveOption: (qid: string, oid: string) => void;
  onInsertQuestion: (index: number, type?: string, title?: string, options?: any[]) => string;
  header: HeaderFields;
  onHeaderChange: (fields: HeaderFields) => void;
  onNameChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onFooterChange?: (footer: SurveyFooter) => void;
  footer?: SurveyFooter;
  onSectionsChange?: (sections: Section[]) => void;
  sections?: Section[];
  activeSectionId?: string | null;
  onActiveSectionChange?: (id: string) => void;
  onCreateSection?: () => void;
  onDeleteSection?: (id: string) => void;
  onAddQuestionToSection?: (type: string) => void;
}

function SectionBar({
  sections,
  activeSectionId,
  accent,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: {
  sections: Section[];
  activeSectionId: string | null;
  accent: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (s: Section, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditValue(s.title);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "8px 8px 0",
        flexWrap: "wrap",
        minWidth: 0,
      }}
    >
      {sections.map((s) => {
        const isActive = s.id === activeSectionId;
        return (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(s.id); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: "8px 8px 0 0",
              background: isActive ? "#fff" : "#e8eaed",
              border: isActive ? `1.5px solid ${accent}` : "1.5px solid transparent",
              borderBottom: isActive ? "1.5px solid #fff" : "1.5px solid transparent",
              cursor: "pointer",
              fontWeight: isActive ? 700 : 400,
              fontSize: 13,
              color: isActive ? accent : "#6b7280",
              transition: "all .15s",
              position: "relative",
              userSelect: "none",
              marginBottom: isActive ? -1 : 0,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {editingId === s.id ? (

              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") setEditingId(null);
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                size={Math.max(8, editValue.length + 2)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  fontWeight: 700,
                  color: accent,
                  fontFamily: "inherit",
                  minWidth: 60,
                  maxWidth: 200,
                }}
              />
            ) : (
              <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.title}
              </span>
            )}

            {isActive && editingId !== s.id && (
              <span
                onClick={(e) => startEdit(s, e)}
                role="button"
                aria-label={`Đổi tên phần ${s.title}`}
                style={{ color: `${accent}80`, fontSize: 11, cursor: "pointer", lineHeight: 1 }}
              >
                <EditOutlined />
              </span>
            )}

            {isActive && sections.length > 1 && (
              <span
                onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                role="button"
                aria-label={`Xóa phần ${s.title}`}
                style={{ color: "#dc262680", fontSize: 11, cursor: "pointer", lineHeight: 1 }}
              >
                <DeleteOutlined />
              </span>
            )}
          </div>
        );
      })}

      <button
        onClick={onCreate}
        aria-label="Thêm phần mới"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
          borderRadius: "8px 8px 0 0",
          border: "1.5px dashed #d1d5db",
          background: "transparent",
          cursor: "pointer",
          fontSize: 12,
          color: "#9ca3af",
          fontFamily: "inherit",
          fontWeight: 500,
          transition: "all .15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.color = accent;
          e.currentTarget.style.background = `${accent}08`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#9ca3af";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <PlusOutlined style={{ fontSize: 10 }} />
        Thêm phần
      </button>
    </div>
  );
}

function FooterBlock({
  footer,
  accent,
  editable,
  onEdit,
}: {
  footer?: SurveyFooter;
  accent: string;
  editable: boolean;
  onEdit: () => void;
}) {
  const [hov, setHov] = useState(false);
  const hasContent = footer?.primaryText || footer?.secondaryText;

  return (
    <div
      onClick={editable ? onEdit : undefined}
      onMouseEnter={() => editable && setHov(true)}
      onMouseLeave={() => setHov(false)}
      role={editable ? "button" : undefined}
      aria-label={editable ? "Chỉnh sửa footer" : undefined}
      style={{
        background: hov ? `${accent}04` : "#fff",
        borderTop: hov ? `1.5px dashed ${accent}70` : "1px solid #e2e8f0",
        border: hov ? `1.5px dashed ${accent}70` : "1px solid #e2e8f0",
        borderRadius: "0 0 10px 10px",
        padding: "24px 28px 32px",
        textAlign: "center",
        cursor: editable ? "pointer" : "default",
        transition: "border .15s, background .15s",
        position: "relative",
      }}
    >
      {hov && editable && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            background: accent,
            padding: "2px 8px",
            borderRadius: 10,
            letterSpacing: ".04em",
          }}
        >
          Sửa footer
        </div>
      )}
      {hasContent ? (
        <>
          {footer?.primaryText && (
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 6 }}>
              {footer.primaryText}
            </div>
          )}
          {footer?.secondaryText && (
            <div style={{ fontStyle: "italic", fontSize: 13.5, color: "#64748b" }}>
              {footer.secondaryText}
            </div>
          )}
        </>
      ) : editable ? (
        <div style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
          Nhấn để thêm lời cảm ơn (footer)
        </div>
      ) : null}
    </div>
  );
}

function FooterEditPopup({
  footer,
  accent,
  onSave,
  onClose,
}: {
  footer?: SurveyFooter;
  accent: string;
  onSave: (f: SurveyFooter) => void;
  onClose: () => void;
}) {
  const [primary, setPrimary] = useState(footer?.primaryText ?? "");
  const [secondary, setSecondary] = useState(footer?.secondaryText ?? "");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        background: "rgba(0,0,0,.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chỉnh sửa footer"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: 380,
          maxWidth: "100%",
          boxShadow: "0 12px 48px rgba(0,0,0,.18)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #f0f0f0",
            background: `linear-gradient(135deg, ${accent}08, transparent)`,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14 }}>Chân trang (Footer)</span>
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 16, color: "#9ca3af", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
              Dòng cảm ơn (in đậm)
            </div>
            <textarea
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              placeholder="Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!"
              rows={2}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = accent; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
              Lời chúc (in nghiêng)
            </div>
            <textarea
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              placeholder="Kính chúc Anh/Chị sức khỏe và thành công!"
              rows={2}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = accent; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button
              onClick={onClose}
              style={{ height: 32, padding: "0 14px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b7280", fontFamily: "inherit" }}
            >
              Hủy
            </button>
            <button
              onClick={() => { onSave({ primaryText: primary, secondaryText: secondary }); onClose(); }}
              style={{ height: 32, padding: "0 16px", border: "none", borderRadius: 7, background: accent, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit" }}
            >
              ✓ Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CenterCanvas({
  name, desc, accent, questions, activeId, setActiveId,
  onUpdateQuestion, onDuplicate, onRemove, onMove,
  onAddOption, onUpdateOption, onRemoveOption, onInsertQuestion,
  header, onHeaderChange, onNameChange, onDescChange,
  onFooterChange, footer, onSectionsChange, sections = [],
  activeSectionId, onActiveSectionChange,
  onCreateSection, onDeleteSection, onAddQuestionToSection,
}: CenterCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragSourceIndex = useRef<number | null>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const [footerEditOpen, setFooterEditOpen] = useState(false);

  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const rafId = useRef<number | null>(null);

  const measureToolbar = useCallback(() => {
    if (!activeId) { setToolbarPos(null); return; }
    const card = cardRefs.current[activeId];
    const col = colRef.current;
    const scroll = scrollRef.current;
    if (!card || !col || !scroll) { setToolbarPos(null); return; }
    const cardRect = card.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();
    const scrollRect = scroll.getBoundingClientRect();
    if (cardRect.bottom < scrollRect.top || cardRect.top > scrollRect.bottom) {
      setToolbarPos(null);
      return;
    }
    const topRaw = cardRect.top;
    const top = Math.max(scrollRect.top + 8, Math.min(topRaw, scrollRect.bottom - 120));
    setToolbarPos({ top, left: colRect.right + 10 });
  }, [activeId]);

  useEffect(() => {
    const id = requestAnimationFrame(() => measureToolbar());
    return () => cancelAnimationFrame(id);
  }, [activeId, measureToolbar]);

  useEffect(() => {
    window.addEventListener("resize", measureToolbar);
    return () => window.removeEventListener("resize", measureToolbar);
  }, [measureToolbar]);

  const handleScroll = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      measureToolbar();
      rafId.current = null;
    });
  }, [measureToolbar]);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragSourceIndex.current = idx;
    e.dataTransfer.setData("text/plain", idx.toString());
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIndex(idx); };
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault(); e.stopPropagation(); setDragOverIndex(null);
    const type = e.dataTransfer.getData("type");
    const bankData = e.dataTransfer.getData("bank");
    if (type) {
      const newId = onInsertQuestion(targetIndex, type);
      if (newId) setActiveId(newId);
    } else if (bankData) {
      try {
        const { title, type: t, options } = JSON.parse(bankData);
        const newId = onInsertQuestion(targetIndex, t, title, options);
        if (newId) setActiveId(newId);
      } catch {}
    } else if (dragSourceIndex.current !== null && dragSourceIndex.current !== targetIndex) {
      onMove(dragSourceIndex.current, targetIndex);
      dragSourceIndex.current = null;
    }
  };
  const handleDragEnd = () => { setDragOverIndex(null); dragSourceIndex.current = null; };

  const activeIdx = questions.findIndex((q) => q.id === activeId);

  const handleAddAfterActive = (type: string) => {
    if (onAddQuestionToSection) {
      onAddQuestionToSection(type);
    } else {
      const insertAt = activeIdx >= 0 ? activeIdx + 1 : questions.length;
      const newId = onInsertQuestion(insertAt, type);
      if (newId) setActiveId(newId);
    }
  };

  const handleRenameSection = (id: string, title: string) => {
    if (!onSectionsChange) return;
    onSectionsChange(sections.map((s) => s.id === id ? { ...s, title } : s));
  };

  const visibleQuestions = sections.length === 0
    ? questions
    : activeSectionId
    ? questions.filter((q) => q.sectionId === activeSectionId)
    : questions;

  const getGlobalIdx = (q: Question) => questions.findIndex((x) => x.id === q.id);

  const renderQuestions = () => {

    if (visibleQuestions.length === 0) {
      return (
        <div
          style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,.07)", padding: "52px 28px", textAlign: "center" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, questions.length)}
        >
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20 }}>✦</div>
          <div style={{ fontWeight: 600, color: "#9ca3af", marginBottom: 4, fontSize: 13 }}>Chưa có câu hỏi nào</div>
          <div style={{ fontSize: 13, color: "#c4c9d4" }}>
            Dùng nút <strong>+</strong> bên phải để thêm câu hỏi
          </div>
        </div>
      );
    }

    return (
      <>
        <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,.07)", overflow: "hidden" }}>
          {visibleQuestions.map((q) => {
            const idx = getGlobalIdx(q);
            return (
              <div
                key={q.id}

                ref={(el) => {
                  if (el) {
                    cardRefs.current[q.id] = el;
                  } else {
                    delete cardRefs.current[q.id];
                  }
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                style={{ borderTop: dragOverIndex === idx ? `2px solid ${accent}` : "none", transition: "border .08s" }}
              >
                {}
                <Canvas
                  question={q}
                  index={idx}
                  total={questions.length}
                  isActive={activeId === q.id}
                  accent={accent}
                  sections={sections}
                  onActivate={() => setActiveId(q.id)}
                  onUpdate={(patch) => onUpdateQuestion(q.id, patch)}
                  onDuplicate={() => onDuplicate(q.id)}
                  onRemove={() => onRemove(q.id)}
                  onMoveUp={() => idx > 0 && onMove(idx, idx - 1)}
                  onMoveDown={() => idx < questions.length - 1 && onMove(idx, idx + 1)}
                  onAddOption={() => onAddOption(q.id)}
                  onUpdateOption={(oid, label) => onUpdateOption(q.id, oid, label)}
                  onRemoveOption={(oid) => onRemoveOption(q.id, oid)}
                />
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
          {visibleQuestions.length} câu hỏi · Kéo để sắp xếp
        </div>
      </>
    );
  };

  return (
    <div
      style={{ height: "100%", background: "#eff1f5", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        style={{ flex: 1, overflowY: "auto", position: "relative" }}
        ref={scrollRef}

        onScroll={handleScroll}
      >
        <div style={{ padding: "20px 20px 32px" }}>
          <div ref={colRef} style={{ maxWidth: 640, margin: "0 auto", width: "100%", position: "relative", overflowX: "auto" }}>

            {}
            <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,.07)", marginBottom: 16, overflow: "hidden" }}>
              <PDFCanvas
                surveyTitle={name}
                descriptionParagraphs={desc ? [desc] : []}
                sections={sections}
                questions={questions}
                accent={accent}
                header={{ ministry: header.orgUnit, academy: header.orgName, address: header.address, phone: header.phone, showDate: true }}
                footer={{ primaryText: "", secondaryText: "" }}
                interactive={false}
                headerOnly
                onHeaderChange={(h) => onHeaderChange({ orgUnit: h.ministry || "", orgName: h.academy || "", address: h.address || "", phone: h.phone || "" })}
                onTitleChange={onNameChange}
                onDescriptionParagraphsChange={(ps) => onDescChange(ps.join("\n\n"))}
              />
            </div>

            {}
            {sections.length > 0 && (
              <div style={{ marginBottom: 0 }}>
                <SectionBar
                  sections={sections}
                  activeSectionId={activeSectionId ?? null}
                  accent={accent}
                  onSelect={(id) => onActiveSectionChange?.(id)}
                  onCreate={onCreateSection ?? (() => {})}
                  onDelete={onDeleteSection ?? (() => {})}
                  onRename={handleRenameSection}
                />
                <div style={{ height: 2, background: `${accent}20`, marginBottom: 8 }} />
              </div>
            )}

            {}
            {sections.length === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${accent}08`,
                  border: `1px dashed ${accent}40`,
                  marginBottom: 12,
                  cursor: "pointer",
                }}
                onClick={onCreateSection}
                role="button"
                aria-label="Thêm phần để tổ chức câu hỏi"
              >
                <PlusOutlined style={{ color: accent, fontSize: 13 }} />
                <span style={{ fontSize: 13, color: accent, fontWeight: 600 }}>
                  Thêm phần (section) để tổ chức câu hỏi
                </span>
              </div>
            )}

            {}
            {renderQuestions()}

            {}
            <div style={{ marginTop: 16 }}>
              <FooterBlock
                footer={footer}
                accent={accent}
                editable={!!onFooterChange}
                onEdit={() => setFooterEditOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {}
      <QuestionToolbar
        anchorTop={toolbarPos?.top ?? null}
        anchorLeft={toolbarPos?.left ?? null}
        accent={accent}
        onAddQuestion={handleAddAfterActive}
        onDuplicate={activeIdx >= 0 ? () => onDuplicate(questions[activeIdx].id) : undefined}
        onDelete={activeIdx >= 0 ? () => onRemove(questions[activeIdx].id) : undefined}
        onMoveUp={activeIdx >= 0 ? () => activeIdx > 0 && onMove(activeIdx, activeIdx - 1) : undefined}
        onMoveDown={activeIdx >= 0 ? () => activeIdx < questions.length - 1 && onMove(activeIdx, activeIdx + 1) : undefined}
        canMoveUp={activeIdx > 0}
        canMoveDown={activeIdx >= 0 && activeIdx < questions.length - 1}
      />

      {}
      {footerEditOpen && onFooterChange && (
        <FooterEditPopup
          footer={footer}
          accent={accent}
          onSave={(f) => { onFooterChange(f); }}
          onClose={() => setFooterEditOpen(false)}
        />
      )}
    </div>
  );
}