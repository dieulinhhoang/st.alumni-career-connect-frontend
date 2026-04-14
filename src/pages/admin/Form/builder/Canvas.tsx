import { useState } from "react";
import { Button, Space, Tooltip } from "antd";
import {
  UpOutlined,
  DownOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
  question,
  index,
  total,
  isActive,
  accent,
  onActivate,
  onUpdate,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: CanvasProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    onActivate();
    setExpanded(true);
  };

  const answerPreview = () => {
    const style: React.CSSProperties = {
      borderBottom: "1.5px solid #e8eaed",
      height: 24,
      fontSize: 12.5,
      color: "#d1d5db",
      fontStyle: "italic",
      display: "flex",
      alignItems: "flex-end",
      paddingBottom: 3,
    };

    switch (question.type) {
      case "short":
      case "email":
      case "tel":
      case "address":
        return <div style={style}>Câu trả lời...</div>;
      case "long":
        return <div style={{ ...style, height: "auto", paddingBottom: 28 }}>Câu trả lời...</div>;
      case "date":
        return (
          <div style={{ ...style, fontStyle: "normal", letterSpacing: ".03em", fontSize: 12 }}>
            dd/mm/yyyy
          </div>
        );
      case "radio":
      case "checkbox":
        return (
          <div style={{ marginTop: 4 }}>
            {(question.options ?? []).map((o) => (
              <div
                key={o.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "3px 0" }}
              >
                <div
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: question.type === "radio" ? "50%" : 3,
                    border: "1.5px solid #d1d5db",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "'Times New Roman', serif" }}>
                  {o.label}
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        borderBottom: "1px solid #f0f2f5",
        background: isActive ? "#fafffe" : "#fff",
        transition: "background .12s",
      }}
    >
      <div
        onClick={handleClick}
        style={{
          padding: "14px 22px 14px 20px",
          cursor: "pointer",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        {/* Index */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: isActive ? accent : "#d1d5db",
            flexShrink: 0,
            marginTop: 2,
            fontFamily: "Geist Mono, monospace",
            transition: "color .12s",
            minWidth: 20,
          }}
        >
          {index + 1}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Question title */}
          <div
            style={{
              fontSize: 13.5,
              color: question.title ? "#111827" : "#d1d5db",
              lineHeight: 1.5,
              marginBottom: 8,
              fontFamily: "'Times New Roman', serif",
              fontStyle: question.title ? "normal" : "italic",
            }}
          >
            {question.title || "Chưa có nội dung..."}
            {question.required && (
              <span style={{ color: "#dc2626", marginLeft: 3, fontFamily: "inherit" }}>*</span>
            )}
          </div>

          {answerPreview()}
        </div>

        {/* Active indicator */}
        {isActive && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accent,
              flexShrink: 0,
              marginTop: 6,
            }}
          />
        )}
      </div>

      {/* Expanded props */}
      {expanded && isActive && (
        <div
          style={{
            borderTop: `1px solid ${accent}18`,
            background: "#f8fffd",
          }}
        >
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
        </div>
      )}
    </div>
  );
}