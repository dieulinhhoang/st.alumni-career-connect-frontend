import { useState, useRef, useEffect } from "react";
import { Tooltip } from "antd";
import {
  PlusOutlined,
  LineOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CaretDownOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
  HolderOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";

interface QuestionToolbarProps {

  anchorTop: number | null;

  anchorLeft: number | null;
  accent: string;
  onAddQuestion: (type: string) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const Q_TYPES = [
  { type: "short",    icon: <LineOutlined />,           label: "Câu ngắn" },
  { type: "long",     icon: <UnorderedListOutlined />,  label: "Đoạn văn dài" },
  { type: "radio",    icon: <CheckCircleOutlined />,    label: "Chọn một" },
  { type: "checkbox", icon: <CheckSquareOutlined />,    label: "Chọn nhiều" },
  { type: "select",   icon: <CaretDownOutlined />,      label: "Dropdown" },
  { type: "date",     icon: <CalendarOutlined />,       label: "Ngày tháng" },
  { type: "email",    icon: <MailOutlined />,           label: "Email" },
  { type: "tel",      icon: <PhoneOutlined />,          label: "Số điện thoại" },
  { type: "address",  icon: <EnvironmentOutlined />,    label: "Địa chỉ" },
  { type: "rating",   icon: <StarOutlined />,           label: "Đánh giá sao" },
];

function TBtn({
  icon, label, onClick, danger = false, disabled = false, accent,
}: {
  icon: React.ReactNode; label: string; onClick: () => void;
  danger?: boolean; disabled?: boolean; accent: string;
}) {
  const [hov, setHov] = useState(false);
  const bg = disabled ? "transparent"
    : hov && danger ? "#fee2e2"
    : hov ? `${accent}12`
    : "transparent";
  const color = disabled ? "#d1d5db"
    : hov && danger ? "#dc2626"
    : hov ? accent
    : "#6b7280";

  return (
    <Tooltip title={label} placement="right" mouseEnterDelay={0.3}>
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: 34, height: 34,
          border: "none",
          borderRadius: 8,
          background: bg,
          color,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: 15,
          transition: "all .12s",
          flexShrink: 0,
          padding: 0,
        }}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

function AddTypeMenu({
  open, accent, onSelect, onClose,
}: {
  open: boolean; accent: string; onSelect: (t: string) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 60);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: 200,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 8px 28px rgba(0,0,0,.14)",
        padding: "6px 4px",
        zIndex: 1001,
        animation: "tbMenuIn .14s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <style>{`@keyframes tbMenuIn { from { opacity:0; transform: translateX(-50%) translateY(6px) scale(.96); } }`}</style>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", padding: "4px 10px 6px" }}>
        Thêm câu hỏi
      </div>
      {Q_TYPES.map((qt) => (
        <button
          key={qt.type}
          onClick={() => { onSelect(qt.type); onClose(); }}
          onMouseEnter={() => setHov(qt.type)}
          onMouseLeave={() => setHov(null)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            width: "100%", padding: "7px 10px",
            border: "none", borderRadius: 8, background: hov === qt.type ? `${accent}10` : "transparent",
            cursor: "pointer", fontFamily: "inherit",
            color: hov === qt.type ? accent : "#374151",
            fontSize: 12.5, fontWeight: hov === qt.type ? 600 : 400,
            transition: "all .1s",
          }}
        >
          <span style={{ fontSize: 14, color: hov === qt.type ? accent : "#9ca3af", width: 18, display: "flex", justifyContent: "center" }}>
            {qt.icon}
          </span>
          {qt.label}
        </button>
      ))}
    </div>
  );
}

export function QuestionToolbar({
  anchorTop,
  anchorLeft,
  accent,
  onAddQuestion,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: QuestionToolbarProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const visible = anchorTop !== null && anchorLeft !== null;

  useEffect(() => {
    if (!visible) setAddMenuOpen(false);
  }, [visible]);

  return (
    <div
      style={{

        position: "fixed",
        top: anchorTop ?? 0,
        left: anchorLeft ?? 0,
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(-4px) scale(.97)",
        transition: "opacity .18s cubic-bezier(.16,1,.3,1), transform .18s cubic-bezier(.16,1,.3,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 4px 18px rgba(0,0,0,.10)",
          padding: "6px 5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          position: "relative",
        }}
      >
        {}
        <div style={{ position: "relative" }}>
          <Tooltip title="Thêm câu hỏi" placement="right" mouseEnterDelay={0.3}>
            <button
              onClick={() => setAddMenuOpen((o) => !o)}
              style={{
                width: 34, height: 34,
                border: "none", borderRadius: 8,
                background: addMenuOpen ? accent : "transparent",
                color: addMenuOpen ? "#fff" : "#6b7280",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 16,
                transition: "all .12s",
              }}
              onMouseEnter={(e) => { if (!addMenuOpen) { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.color = accent; } }}
              onMouseLeave={(e) => { if (!addMenuOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; } }}
            >
              <PlusOutlined />
            </button>
          </Tooltip>
          <AddTypeMenu
            open={addMenuOpen}
            accent={accent}
            onSelect={onAddQuestion}
            onClose={() => setAddMenuOpen(false)}
          />
        </div>

        {}
        <Tooltip title="Kéo để sắp xếp" placement="right" mouseEnterDelay={0.5}>
          <div
            style={{
              width: 34, height: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#d1d5db", fontSize: 13, cursor: "grab",
            }}
          >
            <HolderOutlined />
          </div>
        </Tooltip>

        {}
        <div style={{ width: 20, height: 1, background: "#f0f0f0", margin: "2px 0" }} />

        {}
        <TBtn icon={<UpOutlined />} label="Lên" onClick={onMoveUp ?? (() => {})} disabled={!canMoveUp} accent={accent} />
        {}
        <TBtn icon={<DownOutlined />} label="Xuống" onClick={onMoveDown ?? (() => {})} disabled={!canMoveDown} accent={accent} />

        {}
        <div style={{ width: 20, height: 1, background: "#f0f0f0", margin: "2px 0" }} />

        {}
        <TBtn icon={<CopyOutlined />} label="Nhân bản" onClick={onDuplicate ?? (() => {})} accent={accent} />
        {}
        <TBtn icon={<DeleteOutlined />} label="Xóa" onClick={onDelete ?? (() => {})} danger accent={accent} />
      </div>
    </div>
  );
}