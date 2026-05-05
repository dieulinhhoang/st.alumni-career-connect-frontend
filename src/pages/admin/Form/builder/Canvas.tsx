import { useState, useRef, useEffect, useCallback } from "react";
import { Switch, Select, Input, Tooltip } from "antd";
import {
  CloseOutlined,
  PlusOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import type { Question, QuestionType, Section } from "../../../../feature/form/types";
import { Q_TYPES } from "../../../../feature/form/constants";

interface CanvasProps {
  question: Question;
  index: number;
  total: number;
  isActive: boolean;
  accent: string;
  sections?: Section[];
  onActivate: () => void;
  onDeactivate?: () => void;
  onUpdate: (patch: Partial<Question>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddOption: () => void;
  onUpdateOption: (oid: string, label: string) => void;
  onRemoveOption: (oid: string) => void;
}

function AnswerPreview({ question }: { question: Question }) {
  const base: React.CSSProperties = {
    borderBottom: "1.5px solid #e8eaed",
    height: 28,

    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
    display: "flex",
    alignItems: "center",
    paddingBottom: 4,
    marginTop: 6,
  };

  switch (question.type) {
    case "short":
    case "email":
    case "tel":
      return <div style={base}>Câu trả lời...</div>;
    case "address":
      return <div style={base}>📍 Địa chỉ...</div>;
    case "long":
      return <div style={{ ...base, height: "auto", paddingBottom: 24 }}>Câu trả lời...</div>;
    case "date":
      return <div style={{ ...base, fontStyle: "normal", fontSize: 12, color: "#9ca3af" }}>dd / mm / yyyy</div>;
    case "radio":
    case "checkbox":
      return (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
          {(question.options ?? []).slice(0, 3).map((o) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: question.type === "radio" ? "50%" : 3,
                  border: "1.5px solid #d1d5db",
                  flexShrink: 0,
                }}
              />
              {}
              <span style={{ fontSize: 12, color: "#6b7280" }}>{o.label}</span>
            </div>
          ))}
          {(question.options?.length ?? 0) > 3 && (
            <div style={{ fontSize: 12, color: "#9ca3af", paddingLeft: 23 }}>
              +{(question.options?.length ?? 0) - 3} lựa chọn khác
            </div>
          )}
        </div>
      );
    case "rating":
      return (
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} style={{ fontSize: 18, color: "#e5e7eb" }}>★</span>
          ))}
        </div>
      );
    case "select":
      return <div style={{ ...base, fontStyle: "normal" }}>▾ Chọn một phương án</div>;
    default:
      return null;
  }
}

const LBL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  marginBottom: 5,
};

interface PopupProps {
  question: Question;
  index: number;
  accent: string;
  sections: Section[];
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  onUpdate: (patch: Partial<Question>) => void;
  onAddOption: () => void;
  onUpdateOption: (oid: string, label: string) => void;
  onRemoveOption: (oid: string) => void;
}

function FloatingPopup({
  question,
  index,
  accent,
  sections,
  anchorEl,
  onClose,
  onUpdate,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const hasOpts = question.type === "radio" || question.type === "checkbox" || question.type === "select";

  const calcPos = useCallback(() => {
    if (!anchorEl || !popupRef.current) return;
    const card = anchorEl.getBoundingClientRect();
    const popup = popupRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = card.right + 10;
    let top = card.top;

    if (left + popup.width > vw - 12) {
      left = card.left - popup.width - 10;
    }
    top = Math.max(12, Math.min(top, vh - popup.height - 12));
    setPos({ top, left });
    setVisible(true);
  }, [anchorEl]);

  useEffect(() => {
    const t = setTimeout(calcPos, 10);
    return () => clearTimeout(t);
  }, [calcPos]);

  useEffect(() => {
    window.addEventListener("resize", calcPos);
    return () => window.removeEventListener("resize", calcPos);
  }, [calcPos]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchorEl, onClose]);

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="false"
      aria-label="Chỉnh sửa câu hỏi"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: 300,
        zIndex: 1000,
        background: "#fff",
        borderRadius: 14,
        boxShadow: `0 8px 40px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.06), 0 4px 12px ${accent}20`,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(.96) translateY(-6px)",
        transition: "opacity .18s cubic-bezier(.16,1,.3,1), transform .18s cubic-bezier(.16,1,.3,1)",
        pointerEvents: visible ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      {}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px 8px",
          borderBottom: "1px solid #f0f2f5",
          background: `linear-gradient(135deg, ${accent}08, transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: accent,
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {index + 1}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
            Chỉnh sửa câu hỏi
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Đóng"
          style={{
            width: 24,
            height: 24,
            border: "none",
            background: "transparent",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: 12,
            transition: "all .12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <CloseOutlined />
        </button>
      </div>

      {}
      <div
        style={{
          padding: "12px 14px",
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
          <div>
            <div style={LBL}>Loại câu hỏi</div>
            <Select
              size="small"
              value={question.type}
              style={{ width: "100%" }}
              onChange={(val) => onUpdate({ type: val as QuestionType, options: [] })}
              options={Q_TYPES.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }))}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 2 }}>
            <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Bắt buộc</span>
            <Switch
              size="small"
              checked={question.required}
              onChange={(v) => onUpdate({ required: v })}
              style={{ background: question.required ? accent : undefined }}
            />
          </div>
        </div>

        {}
        {sections.length > 0 && (
          <div>
            <div style={LBL}>Thuộc phần</div>
            <Select
              size="small"
              value={question.sectionId || ""}
              style={{ width: "100%" }}
              onChange={(val) => onUpdate({ sectionId: val })}
              options={[
                { value: "", label: "— Chưa phân phần —" },
                ...sections.map((s) => ({ value: s.id, label: s.title })),
              ]}
            />
          </div>
        )}

        {}
        <div>
          <div style={LBL}>Nội dung câu hỏi</div>
          <Input.TextArea
            rows={2}
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Nhập nội dung câu hỏi..."
            style={{ resize: "none", fontSize: 13 }}
          />
        </div>

        {}
        {hasOpts && (
          <div>
            <div style={LBL}>Lựa chọn</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(question.options ?? []).map((o, oi) => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: question.type === "radio" ? "50%" : 3,
                      border: "1.5px solid #d1d5db",
                      flexShrink: 0,
                    }}
                  />
                  <Input
                    value={o.label}
                    onChange={(e) => onUpdateOption(o.id, e.target.value)}
                    placeholder={`Lựa chọn ${oi + 1}`}
                    size="small"
                    style={{ flex: 1, fontSize: 13 }}
                  />
                  <button
                    onClick={() => onRemoveOption(o.id)}
                    aria-label={`Xóa lựa chọn ${oi + 1}`}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#d1d5db",
                      fontSize: 12,
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      padding: 0,
                      transition: "all .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fee2e2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#d1d5db"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={onAddOption}
              aria-label="Thêm lựa chọn"
              style={{
                marginTop: 6,
                width: "100%",
                height: 28,
                border: "1.5px dashed #e2e8f0",
                borderRadius: 6,
                background: "transparent",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                transition: "all .12s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}08`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; }}
            >
              <PlusOutlined style={{ fontSize: 10 }} />
              Thêm lựa chọn
            </button>
          </div>
        )}
      </div>
      {}
    </div>
  );
}

export function Canvas({
  question,
  index,
  total,
  isActive,
  accent,
  sections = [],
  onActivate,
  onDeactivate,
  onUpdate,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: CanvasProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleCardClick = () => {
    onActivate();
    setPopupOpen(true);
  };

  const handleClose = () => {
    setPopupOpen(false);
    onDeactivate?.();
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={handleCardClick}
        role="button"
        aria-label={`Câu hỏi ${index + 1}: ${question.title || "Chưa có nội dung"}`}
        aria-pressed={isActive}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCardClick(); }}
        style={{
          marginBottom: 10,
          borderRadius: 12,
          background: "#fff",
          border: isActive ? `1.5px solid ${accent}` : "1px solid #eaecf0",
          boxShadow: isActive ? `0 4px 16px ${accent}18` : "0 1px 3px rgba(0,0,0,.04)",
          transition: "all .18s cubic-bezier(.16,1,.3,1)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.borderColor = `${accent}60`;
            e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,.07)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.borderColor = "#eaecf0";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.04)";
          }
        }}
      >
        {}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: isActive ? 3 : 0,
            background: accent,
            borderRadius: "12px 0 0 12px",
            transition: "width .18s cubic-bezier(.16,1,.3,1)",
          }}
        />

        <div
          style={{
            padding: "13px 16px 13px 20px",
            display: "flex",
            gap: 13,
            alignItems: "flex-start",
          }}
        >
          {}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <Tooltip title="Kéo để sắp xếp" placement="left">
              <div
                style={{ color: "#d1d5db", fontSize: 13, cursor: "grab", lineHeight: 1, padding: "2px 1px" }}
                aria-hidden="true"
              >
                <HolderOutlined />
              </div>
            </Tooltip>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: isActive ? accent : "#f1f5f9",
                color: isActive ? "#fff" : "#64748b",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .15s",
              }}
            >
              {index + 1}
            </div>
          </div>

          {}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{

                fontSize: 13.5,
                fontWeight: 600,
                color: question.title ? "#1e293b" : "#94a3b8",
                lineHeight: 1.45,
              }}
            >
              {question.title || "Chưa có nội dung..."}
              {question.required && (
                <span style={{ color: "#dc2626", marginLeft: 3 }} aria-label="bắt buộc">*</span>
              )}
            </div>
            <AnswerPreview question={question} />
          </div>

          {}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 3,
              opacity: isActive ? 1 : 0,
              transition: "opacity .12s",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                fontSize: 12,
                color: accent,
                fontWeight: 700,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                background: `${accent}12`,
                padding: "3px 7px",
                borderRadius: 20,
              }}
            >
              Đang chỉnh
            </div>
          </div>
        </div>
      </div>

      {}
      {isActive && popupOpen && (
        <FloatingPopup
          question={question}
          index={index}
          accent={accent}
          sections={sections}
          anchorEl={cardRef.current}
          onClose={handleClose}
          onUpdate={onUpdate}
          onAddOption={onAddOption}
          onUpdateOption={onUpdateOption}
          onRemoveOption={onRemoveOption}
        />
      )}
    </>
  );
}