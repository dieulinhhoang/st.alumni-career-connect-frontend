import { useState, useRef } from "react";
import { PDFCanvas } from "./PDFCanvas";
import { Canvas } from "./Canvas";
import type { Question } from "../../../../feature/form/types";

interface HeaderFields {
  orgUnit: string;
  orgName: string;
  address: string;
  phone: string;
}

interface CenterCanvasProps {
  name: string;
  desc: string;
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
}

export function CenterCanvas({
  name, desc, accent, questions, activeId, setActiveId,
  onUpdateQuestion, onDuplicate, onRemove, onMove,
  onAddOption, onUpdateOption, onRemoveOption, onInsertQuestion,
  header, onHeaderChange, onNameChange, onDescChange,
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
      } catch (err) { console.error(err); }
    } else if (dragSourceIndex.current !== null && dragSourceIndex.current !== targetIndex) {
      onMove(dragSourceIndex.current, targetIndex);
      dragSourceIndex.current = null;
    }
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    dragSourceIndex.current = null;
  };

  return (
    <div
      style={{
        height: "100%",
        background: "#eff1f5",
        overflowY: "auto",
        padding: "24px 20px",
      }}
      onDragOver={e => e.preventDefault()}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* PDF Header */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,.07)",
          marginBottom: 16,
          overflow: "hidden",
        }}>
          <PDFCanvas
            name={name} desc={desc} questions={questions} accent={accent}
            interactive={false} headerOnly
            header={header} onHeaderChange={onHeaderChange}
            onNameChange={onNameChange} onDescChange={onDescChange}
          />
        </div>

        {/* Questions */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,.07)",
          overflow: "hidden",
        }}>
          {questions.length === 0 ? (
            <div
              style={{
                padding: "52px 28px",
                textAlign: "center",
                color: "#c4c9d4",
                fontSize: 13,
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, 0)}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "#f0f2f5",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: 20,
              }}>
                ✦
              </div>
              <div style={{ fontWeight: 600, color: "#9ca3af", marginBottom: 4 }}>
                Chưa có câu hỏi nào
              </div>
              <div style={{ fontSize: 12.5 }}>Kéo câu hỏi từ bên trái vào đây để bắt đầu</div>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div
                key={q.id}
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={e => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                style={{
                  borderTop: dragOverIndex === idx ? `2px solid ${accent}` : "none",
                  borderBottom: dragOverIndex === idx + 1 ? `2px solid ${accent}` : "none",
                  cursor: "grab",
                  transition: "border .08s",
                }}
              >
                <Canvas
                  question={q} index={idx} total={questions.length}
                  isActive={activeId === q.id} accent={accent}
                  onActivate={() => setActiveId(q.id)}
                  onUpdate={patch => onUpdateQuestion(q.id, patch)}
                  onDuplicate={() => onDuplicate(q.id)}
                  onRemove={() => onRemove(q.id)}
                  onMoveUp={() => idx > 0 && onMove(idx, idx - 1)}
                  onMoveDown={() => idx < questions.length - 1 && onMove(idx, idx + 1)}
                  onAddOption={() => onAddOption(q.id)}
                  onUpdateOption={(oid, label) => onUpdateOption(q.id, oid, label)}
                  onRemoveOption={oid => onRemoveOption(q.id, oid)}
                />
              </div>
            ))
          )}
        </div>

        {/* Question count footer */}
        {questions.length > 0 && (
          <div style={{
            textAlign: "center", marginTop: 16,
            fontSize: 11.5, color: "#9ca3af", fontWeight: 500,
          }}>
            {questions.length} câu hỏi · Kéo để sắp xếp
          </div>
        )}
      </div>
    </div>
  );
}