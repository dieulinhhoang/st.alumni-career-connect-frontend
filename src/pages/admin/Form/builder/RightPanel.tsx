import { useState } from "react";
import { Q_TYPE_LABELS, IcDrag, IcPlus, IcChevL, IcChevR } from "./Icons";
import { QUESTION_BANK, type BankQuestion } from "../../../../feature/form/api";

const T = "#0a9688";

interface RightPanelProps {
  onAddFromBank: (q: BankQuestion) => void;
  accent: string;
  onAccentChange: (color: string) => void;
}

export function RightPanel({ onAddFromBank, accent, onAccentChange }: RightPanelProps) {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<"bank" | "theme">("bank");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const categories = ["Tất cả", ...new Set(QUESTION_BANK.map(q => q.category))];
  const filtered = QUESTION_BANK.filter(q =>
    (category === "Tất cả" || q.category === category) &&
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, q: BankQuestion) => {
    e.dataTransfer.setData("bank", JSON.stringify({ title: q.title, type: q.type, options: q.options }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div style={{
      width: open ? 260 : 42,
      borderLeft: "1px solid #e5e7eb",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width .2s ease"
    }}>
      {/* Header */}
      <div style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0
      }}>
        {open && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setTab("bank")}
              style={{
                fontSize: 11.5,
                fontWeight: tab === "bank" ? 700 : 500,
                color: tab === "bank" ? T : "#9ca3af",
                border: "none",
                background: "transparent",
                cursor: "pointer"
              }}
            >
              Câu hỏi mẫu
            </button>
            <button
              onClick={() => setTab("theme")}
              style={{
                fontSize: 11.5,
                fontWeight: tab === "theme" ? 700 : 500,
                color: tab === "theme" ? T : "#9ca3af",
                border: "none",
                background: "transparent",
                cursor: "pointer"
              }}
            >
              Màu sắc
            </button>
          </div>
        )}
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
          {open ? <IcChevR /> : <IcChevL />}
        </button>
      </div>

      {open && tab === "bank" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          <input
            placeholder="Tìm câu hỏi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "6px 8px", marginBottom: 8, borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 12 }}
          />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  border: `1px solid ${category === c ? T : "#e5e7eb"}`,
                  background: category === c ? `${T}10` : "transparent",
                  color: category === c ? T : "#6b7280",
                  cursor: "pointer"
                }}
              >
                {c}
              </button>
            ))}
          </div>
          {filtered.map(bq => (
            <div
              key={bq.id}
              draggable
              onDragStart={e => handleDragStart(e, bq)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                marginBottom: 6,
                cursor: "grab",
                background: "#fff",
                transition: "all .12s"
              }}
              onMouseEnter={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.borderColor = T;
                d.style.background = "#f0fdf9";
              }}
              onMouseLeave={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.borderColor = "#e5e7eb";
                d.style.background = "#fff";
              }}
            >
              <div style={{ color: "#c4c9cf", flexShrink: 0 }}><IcDrag /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#111827", marginBottom: 3 }}>{bq.title}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ fontSize: 10, color: "#9ca3af", background: "#f3f4f6", padding: "1px 5px", borderRadius: 4 }}>{Q_TYPE_LABELS[bq.type] ?? bq.type}</span>
                  <span style={{ fontSize: 10, color: T, background: `${T}10`, padding: "1px 5px", borderRadius: 4 }}>{bq.category}</span>
                </div>
              </div>
              <button
                title="Thêm"
                onClick={() => onAddFromBank(bq)}
                style={{
                  width: 20, height: 20,
                  border: `1px solid ${T}`,
                  borderRadius: "50%",
                  background: "transparent",
                  cursor: "pointer",
                  color: T,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget;
                  b.style.background = T;
                  b.style.color = "#fff";
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget;
                  b.style.background = "transparent";
                  b.style.color = T;
                }}
              >
                <IcPlus />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af", fontSize: 12 }}>Không tìm thấy</div>
          )}
        </div>
      )}

      {open && tab === "theme" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 12 }}>Màu chủ đạo</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {["#6d28d9", "#1d4ed8", "#15803d", "#be123c", "#0f766e", "#c2410c", "#0369a1", "#7e22ce", "#92400e", "#18181b"].map(c => (
              <div
                key={c}
                onClick={() => onAccentChange(c)}
                style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: c,
                  cursor: "pointer",
                  border: accent === c ? "3px solid #fff" : "2px solid transparent",
                  boxShadow: accent === c ? `0 0 0 2px ${c}` : undefined,
                  transform: accent === c ? "scale(1.15)" : "scale(1)",
                  transition: "all .15s"
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Tùy chỉnh:</label>
            <input
              type="color"
              value={accent}
              onChange={e => onAccentChange(e.target.value)}
              style={{ width: 34, height: 28, borderRadius: 6, border: "0.5px solid #e5e7eb", cursor: "pointer", padding: 2 }}
            />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#475569" }}>{accent}</span>
          </div>
        </div>
      )}
    </div>
  );
}