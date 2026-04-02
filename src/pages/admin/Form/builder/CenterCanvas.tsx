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
      style={{ minWidth: 0, height: "100%", background: "#f0f0f0", overflowY: "auto", padding: "24px" }}
      onDragOver={e => e.preventDefault()}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Header editable */}
        <div style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,.1)", marginBottom: 24 }}>
          <PDFCanvas
            name={name} desc={desc} questions={questions} accent={accent}
            interactive={false} headerOnly
            header={header} onHeaderChange={onHeaderChange}
            onNameChange={onNameChange} onDescChange={onDescChange}
          />
        </div>

        {/* Danh sách câu hỏi editable */}
        <div style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,.1)" }}>
          {questions.length === 0 ? (
            <div
              style={{ padding: "48px 28px", textAlign: "center", color: "#bbb", fontSize: 13, fontStyle: "italic" }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, 0)}
            >
              Kéo câu hỏi từ bên trái vào đây để bắt đầu
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
                  borderTop: dragOverIndex === idx ? `2px dashed ${accent}` : "none",
                  borderBottom: dragOverIndex === idx + 1 ? `2px dashed ${accent}` : "none",
                  cursor: "grab", transition: "border 0.1s"
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
      </div>
    </div>
  );
}