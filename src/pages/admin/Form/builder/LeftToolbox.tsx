import { useState } from "react";
import { Tooltip } from "antd";
import { QTypeIcons, Q_TYPE_LABELS, IcDrag, IcChevL, IcChevR } from "./Icons";
import { Q_TYPES } from "../../../../feature/form/constants";

const T = "#0f766e";

interface LeftToolboxProps {
  onAddQuestion: (type: string) => void;
  open?: boolean;
  onToggle?: () => void;
  asDrawer?: boolean;
}

export function LeftToolbox({ onAddQuestion, open: openProp, onToggle, asDrawer }: LeftToolboxProps) {
  const [openState, setOpenState] = useState(true);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const handleToggle = onToggle ?? (() => setOpenState(o => !o));
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

  const effectiveOpen = asDrawer ? true : open;

  return (
    <div style={{
      width: asDrawer ? "100%" : (effectiveOpen ? 232 : 44),
      height: "100%",
      borderRight: asDrawer ? "none" : "1px solid #e8eaed",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
      transition: asDrawer ? "none" : "width .2s cubic-bezier(.16,1,.3,1)",
    }}>

      {/* Header */}
      <div style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        borderBottom: "1px solid #f0f2f5",
        flexShrink: 0,
        gap: 8,
      }}>
        {effectiveOpen && (
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em" }}>
            Loại câu hỏi
          </span>
        )}
        {!asDrawer && (
          <button
            onClick={handleToggle}
            style={{
              width: 24, height: 24,
              border: "1px solid #e8eaed",
              background: "#f8f9fb",
              borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              marginLeft: effectiveOpen ? "auto" : "auto",
              color: "#6b7280",
              flexShrink: 0,
            }}
          >
            {effectiveOpen ? <IcChevL /> : <IcChevR />}
          </button>
        )}
        {asDrawer && (
          <button
            onClick={handleToggle}
            style={{
              width: 28, height: 28,
              border: "1px solid #e8eaed",
              background: "#f8f9fb",
              borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16, color: "#6b7280",
            }}
          >
            ×
          </button>
        )}
      </div>

      {effectiveOpen ? (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Search */}
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid #f0f2f5" }}>
            <input
              placeholder="Tìm loại câu hỏi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "1px solid #e8eaed",
                borderRadius: 7,
                fontSize: 12.5,
                outline: "none",
                boxSizing: "border-box",
                background: "#f8f9fb",
                color: "#111827",
                fontFamily: "inherit",
                transition: "border-color .12s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = T)}
              onBlur={e => (e.currentTarget.style.borderColor = "#e8eaed")}
            />
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
            {filtered.map(t => (
              <div
                key={t.value}
                draggable
                onDragStart={e => handleDragStart(e, t.value)}
                onClick={() => {
                  onAddQuestion(t.value);
                  if (asDrawer) handleToggle();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  cursor: "grab",
                  margin: "1px 6px",
                  borderRadius: 7,
                  transition: "background .1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0fdfa")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 9,
                  border: `1px solid ${T}20`,
                  background: `${T}0a`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {QTypeIcons[t.value]}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#111827", flex: 1, lineHeight: 1.3 }}>
                  {Q_TYPE_LABELS[t.value] ?? t.label}
                </span>
                <span style={{ color: "#d1d5db", flexShrink: 0 }}>
                  <IcDrag />
                </span>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 12px", color: "#9ca3af", fontSize: 12 }}>
                Không tìm thấy
              </div>
            )}
          </div>

          <div style={{
            padding: "8px 12px",
            borderTop: "1px solid #f0f2f5",
            fontSize: 10.5, color: "#c4c9d4",
            textAlign: "center", letterSpacing: ".02em",
          }}>
            Kéo hoặc click để thêm
          </div>
        </div>
      ) : (
        /* Collapsed icon list */
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {supportedTypes.map(t => (
            <Tooltip key={t.value} title={Q_TYPE_LABELS[t.value] ?? t.label} placement="right">
              <div
                draggable
                onDragStart={e => handleDragStart(e, t.value)}
                onClick={() => onAddQuestion(t.value)}
                style={{
                  width: 34, height: 34,
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "grab",
                  transition: "background .1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0fdfa")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
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