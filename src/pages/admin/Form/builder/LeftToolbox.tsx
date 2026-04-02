import { useState } from "react";
import { Tooltip } from "antd";
import { QTypeIcons, Q_TYPE_LABELS, IcDrag, IcChevL, IcChevR } from "./Icons";
import { Q_TYPES } from "../../../../feature/form/constants";

const T = "#0a9688";

interface LeftToolboxProps {
  onAddQuestion: (type: string) => void;
}

export function LeftToolbox({ onAddQuestion }: LeftToolboxProps) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const supportedTypes = Q_TYPES.filter(t => QTypeIcons[t.value]);
  const filtered = supportedTypes.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    (Q_TYPE_LABELS[t.value] || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div style={{
      width: open ? 236 : 42,
      borderRight: "1px solid #e5e7eb",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
      transition: "width .2s ease"
    }}>
      {/* Header */}
      <div style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0
      }}>
        {open && <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>Loại câu hỏi</span>}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 22, height: 22,
            border: "1px solid #e5e7eb",
            background: "#fff",
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {open ? <IcChevL /> : <IcChevR />}
        </button>
      </div>

      {open ? (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* Search */}
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid #f0f0f0" }}>
            <input
              placeholder="Tìm loại câu hỏi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                outline: "none"
              }}
            />
          </div>
          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map(t => (
              <div
                key={t.value}
                draggable
                onDragStart={e => handleDragStart(e, t.value)}
                onClick={() => onAddQuestion(t.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "11px 14px",
                  cursor: "grab",
                  transition: "background .1s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${T}0c`)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 38, height: 38,
                  borderRadius: 9,
                  border: `1px solid ${T}25`,
                  background: `${T}08`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {QTypeIcons[t.value]}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", flex: 1 }}>
                  {Q_TYPE_LABELS[t.value] ?? t.label}
                </span>
                <IcDrag />
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 12px", color: "#9ca3af", fontSize: 12 }}>
                Không tìm thấy
              </div>
            )}
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid #f0f0f0", fontSize: 10.5, color: "#b0b7c3", textAlign: "center" }}>
            Kéo hoặc click để thêm
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {supportedTypes.map(t => (
            <Tooltip key={t.value} title={Q_TYPE_LABELS[t.value] ?? t.label} placement="right">
              <div
                draggable
                onDragStart={e => handleDragStart(e, t.value)}
                onClick={() => onAddQuestion(t.value)}
                style={{ cursor: "grab" }}
              >
                {QTypeIcons[t.value]}
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}