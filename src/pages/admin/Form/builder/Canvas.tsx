import { useState } from "react";
import type { Question } from "../../../../feature/form/types";
import { QuestionProps } from "./QuestionProps";

interface CanvasProps {
  question: Question;
  index: number;
  total: number;
  isActive: boolean;
  accent: string;
  onActivate: () => void;
  onUpdate: (patch: Partial<Question>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddOption: () => void;
  onUpdateOption: (oid: string, label: string) => void;
  onRemoveOption: (oid: string) => void;
}

export function Canvas({
  question, index, total, isActive, accent,
  onActivate, onUpdate, onDuplicate, onRemove,
  onMoveUp, onMoveDown, onAddOption, onUpdateOption, onRemoveOption
}: CanvasProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    onActivate();
    setExpanded(true);
  };

  return (
    <div style={{
      borderBottom: "1px solid #f0f0f0",
      background: isActive ? "#fafafa" : "#fff",
      transition: "all .12s"
    }}>
      <div
        onClick={handleClick}
        style={{ padding: "14px 28px 14px 25px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}
      >
        <span style={{ fontSize: 13.5, fontWeight: 400, color: isActive ? "#374151" : "#9ca3af", flexShrink: 0, marginTop: 1 }}>
          {index + 1}.
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, color: "#111827", lineHeight: 1.5, marginBottom: 8, fontFamily: "'Times New Roman', serif" }}>
            {question.title || <span style={{ color: "#ccc", fontStyle: "italic" }}>Chưa có nội dung...</span>}
            {question.required && <span style={{ color: "#dc2626", marginLeft: 3 }}>*</span>}
          </div>
          {/* Preview answer style – luôn màu xám nhạt, không dùng accent */}
          {question.type === "short" && (
            <div style={{ borderBottom: "1.5px solid #e5e7eb", height: 24, fontSize: 13, color: "#bbb", fontStyle: "italic", display: "flex", alignItems: "flex-end", paddingBottom: 3 }}>
              Câu trả lời...
            </div>
          )}
          {question.type === "long" && (
            <div style={{ borderBottom: "1.5px solid #e5e7eb", paddingBottom: 32, fontSize: 13, color: "#bbb", fontStyle: "italic" }}>
              Câu trả lời...
            </div>
          )}
          {question.type === "date" && (
            <div style={{ borderBottom: "1.5px solid #e5e7eb", paddingBottom: 4, fontSize: 13, color: "#9ca3af" }}>
              dd/mm/yyyy
            </div>
          )}
           {
            question.type ==="email" && (
              <div style={{ borderBottom: "1.5px solid #e5e7eb", paddingBottom: 4, fontSize: 13, color: "#9ca3af" }}>
                Câu trả lời ...
              </div>
            )
           }
           {
            question.type ==="tel" && (
              <div style={{ borderBottom: "1.5px solid #e5e7eb", paddingBottom: 4, fontSize: 13, color: "#9ca3af" }}>
                Câu trả lời ...
              </div>
            )
           }
           {
            question.type ==="address" && (
              <div style={{ borderBottom: "1.5px solid #e5e7eb", paddingBottom: 4, fontSize: 13, color: "#9ca3af" }}>
                Câu trả lời ...
              </div>
            )
           }
          {(question.type === "radio" || question.type === "checkbox") && (question.options ?? []).map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
              <div style={{
                width: 15, height: 15,
                borderRadius: question.type === "radio" ? "50%" : 3,
                border: "2px solid #d1d5db",
                flexShrink: 0
              }} />
              <span style={{ fontSize: 13.5, color: "#374151", fontFamily: "'Times New Roman', serif" }}>{o.label}</span>
            </div>
          ))}
        </div>
        {isActive && <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, flexShrink: 0, marginTop: 2 }}>✏</div>}
      </div>
      {expanded && isActive && (
        <QuestionProps
          q={question}
          idx={index}
          total={total}
          updateQ={(id, patch) => onUpdate(patch)}
          dupQ={onDuplicate}
          removeQ={onRemove}
          moveUp={onMoveUp}
          moveDown={onMoveDown}
          addOpt={onAddOption}
          updOpt={onUpdateOption}
          removeOpt={onRemoveOption}
        />
      )}
    </div>
  );
}