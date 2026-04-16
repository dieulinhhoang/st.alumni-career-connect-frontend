import { useState, useRef } from "react";
import { PDFCanvas } from "./PDFCanvas";
import { Canvas } from "./Canvas";
import type { Question, Section, SurveyFooter } from "../../../../feature/form/types";

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
  setActiveId: (id: string) => void;
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
}

export function CenterCanvas({
  name,
  desc,
  accent,
  questions,
  activeId,
  setActiveId,
  onUpdateQuestion,
  onDuplicate,
  onRemove,
  onMove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onInsertQuestion,
  header,
  onHeaderChange,
  onNameChange,
  onDescChange,
  onFooterChange,
  footer,
  onSectionsChange,
  sections = [],
}: CenterCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragSourceIndex = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragSourceIndex.current = idx;
    e.dataTransfer.setData("text/plain", idx.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    const type = e.dataTransfer.getData("type");
    const bankData = e.dataTransfer.getData("bank");
    if (type) {
      const newId = onInsertQuestion(targetIndex, type);
      if (newId) setActiveId(newId);
    } else if (bankData) {
      try {
        const { title, type, options } = JSON.parse(bankData);
        const newId = onInsertQuestion(targetIndex, type, title, options);
        if (newId) setActiveId(newId);
      } catch (err) {
        console.error(err);
      }
    } else if (dragSourceIndex.current !== null && dragSourceIndex.current !== targetIndex) {
      onMove(dragSourceIndex.current, targetIndex);
      dragSourceIndex.current = null;
    }
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    dragSourceIndex.current = null;
  };

  // Thêm state để theo dõi section đang drag over
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  // Thêm handler cho drop vào section
  const handleDropOnSection = (e: React.DragEvent, sectionId: string, targetIndex: number) => {
    e.preventDefault();
    setDragOverSectionId(null);

    const type = e.dataTransfer.getData("type");
    const bankData = e.dataTransfer.getData("bank");
    const draggedQuestionId = e.dataTransfer.getData("questionId");

    if (draggedQuestionId) {
      // Di chuyển câu hỏi hiện có sang section khác
      const q = questions.find(q => q.id === draggedQuestionId);
      if (q) {
        onUpdateQuestion(draggedQuestionId, { sectionId });
        // Cập nhật order trong section mới
        const questionsInSection = questions.filter(q => q.sectionId === sectionId);
        onMove(dragSourceIndex.current!, questionsInSection.length);
      }
    } else if (type) {
      // Thêm câu hỏi mới vào section
      const newId = onInsertQuestion(targetIndex, type);
      if (newId) {
        onUpdateQuestion(newId, { sectionId });
        setActiveId(newId);
      }
    } else if (bankData) {
      try {
        const { title, type, options } = JSON.parse(bankData);
        const newId = onInsertQuestion(targetIndex, type, title, options);
        if (newId) {
          onUpdateQuestion(newId, { sectionId });
          setActiveId(newId);
        }
      } catch (err) {
        console.error(err);
      }
    }

    dragSourceIndex.current = null;
  };
  return (
    <div
      style={{
        height: "100%",
        background: "#eff1f5",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "24px 20px",
        boxSizing: "border-box",
        width: "100%",
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", minWidth: 0, width: "100%" }}>
        {/* PDF Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,.07)",
            marginBottom: 16,
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <PDFCanvas
            surveyTitle={name}
            descriptionParagraphs={desc ? [desc] : []}
            sections={sections}
            questions={questions}
            accent={accent}
            header={{
              ministry: header.orgUnit,
              academy: header.orgName,
              address: header.address,
              phone: header.phone,
              showDate: true,
            }}
            footer={footer ?? { primaryText: "", secondaryText: "" }}
            interactive={false}
            headerOnly
            onHeaderChange={(h) =>
              onHeaderChange({
                orgUnit: h.ministry || "",
                orgName: h.academy || "",
                address: h.address || "",
                phone: h.phone || "",
              })
            }
            onTitleChange={onNameChange}
            onDescriptionParagraphsChange={(ps) => onDescChange(ps.join("\n\n"))}
            onFooterChange={onFooterChange}
            onSectionsChange={onSectionsChange}
          />
        </div>

        {/* Questions — grouped by section */}
        {questions.length === 0 ? (
          <div
            style={{
              background: "#fff", borderRadius: 10,
              boxShadow: "0 2px 12px rgba(0,0,0,.07)",
              padding: "52px 28px", textAlign: "center", color: "#c4c9d4", fontSize: 13,
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20 }}>✦</div>
            <div style={{ fontWeight: 600, color: "#9ca3af", marginBottom: 4 }}>Chưa có câu hỏi nào</div>
            <div style={{ fontSize: 12.5 }}>Kéo câu hỏi từ bên trái vào đây để bắt đầu</div>
          </div>
        ) : (() => {
          // Group questions by sectionId, preserve insertion order
          const groups: { sectionId: string; title: string; qs: { q: Question; idx: number }[] }[] = [];
          const groupMap = new Map<string, typeof groups[0]>();
          questions.forEach((q, idx) => {
            const sid = q.sectionId || "";
            if (!groupMap.has(sid)) {
              const sec = sections.find((s) => s.id === sid);
              const entry = { sectionId: sid, title: sec?.title ?? "", qs: [] as { q: Question; idx: number }[] };
              groups.push(entry);
              groupMap.set(sid, entry);
            }
            groupMap.get(sid)!.qs.push({ q, idx });
          });

          return (
            <>
              {groups.map((group) => (
                <div key={group.sectionId || "__unsectioned"} style={{ marginBottom: 12 }}>
                  {/* Section divider */}
                  {group.title ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px 8px" }}>
                      <div style={{ height: 1, flex: 1, background: `${accent}30` }} />
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: accent,
                        textTransform: "uppercase", letterSpacing: ".08em",
                        background: `${accent}12`, padding: "3px 12px", borderRadius: 20,
                      }}>
                        {group.title}
                      </span>
                      <div style={{ height: 1, flex: 1, background: `${accent}30` }} />
                    </div>
                  ) : sections.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px 8px" }}>
                      <div style={{ height: 1, flex: 1, background: "#e5e7eb" }} />
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#9ca3af",
                        background: "#f3f4f6", padding: "3px 12px", borderRadius: 20,
                      }}>
                        Chưa phân phần
                      </span>
                      <div style={{ height: 1, flex: 1, background: "#e5e7eb" }} />
                    </div>
                  )}

                  <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,.07)", overflow: "hidden" }}>
                    {group.qs.map(({ q, idx }) => (
                      <div
                        key={q.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                        style={{
                          borderTop: dragOverIndex === idx ? `2px solid ${accent}` : "none",
                          borderBottom: dragOverIndex === idx + 1 ? `2px solid ${accent}` : "none",
                          cursor: "grab", transition: "border .08s",
                        }}
                      >
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
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}>
                {questions.length} câu hỏi · Kéo để sắp xếp
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}