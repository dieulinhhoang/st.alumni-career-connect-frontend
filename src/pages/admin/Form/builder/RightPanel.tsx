import { useState } from "react";
import { Q_TYPE_LABELS, IcDrag, IcPlus, IcChevL, IcChevR } from "./Icons";
import { QUESTION_BANK, type BankQuestion } from "../../../../feature/form/api";

const T = "#0f766e";

interface RightPanelProps {
  onAddFromBank: (q: BankQuestion) => void;
  accent: string;
  onAccentChange: (color: string) => void;
  open?: boolean;
  onToggle?: () => void;
  asDrawer?: boolean;
}

const PRESET_COLORS = [
  "#0f766e", "#1d4ed8", "#7c3aed", "#be123c",
  "#c2410c", "#0369a1", "#15803d", "#92400e", "#1e293b",
];

export function RightPanel({ onAddFromBank, accent, onAccentChange, open: openProp, onToggle, asDrawer }: RightPanelProps) {
  const [openState, setOpenState] = useState(true);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const handleToggle = onToggle ?? (() => setOpenState(o => !o));

  const [tab, setTab]         = useState<"bank" | "theme">("bank");
  const [search, setSearch]   = useState("");
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

  const effectiveOpen = asDrawer ? true : open;

  return (
    <div style={{
      width: asDrawer ? "100%" : (effectiveOpen ? 256 : 44),
      height: "100%",
      borderLeft: asDrawer ? "none" : "1px solid #e8eaed",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: asDrawer ? "none" : "width .2s cubic-bezier(.16,1,.3,1)",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        borderBottom: "1px solid #f0f2f5",
        flexShrink: 0,
        gap: 6,
      }}>
        {effectiveOpen && (
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {(["bank", "theme"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 6,
                  border: "none",
                  background: tab === t ? `${T}12` : "transparent",
                  color: tab === t ? T : "#9ca3af",
                  fontSize: 12,
                  fontWeight: tab === t ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .12s",
                }}
              >
                {t === "bank" ? "Mẫu hỏi" : "Giao diện"}
              </button>
            ))}
          </div>
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
              cursor: "pointer", color: "#6b7280",
              marginLeft: effectiveOpen ? 0 : "auto",
              flexShrink: 0,
            }}
          >
            {effectiveOpen ? <IcChevR /> : <IcChevL />}
          </button>
        )}
        {asDrawer && (
          <button
            onClick={handleToggle}
            style={{
              width: 28, height: 28, border: "1px solid #e8eaed",
              background: "#f8f9fb", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16, color: "#6b7280", marginLeft: "auto",
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Collapsed state */}
      {!effectiveOpen && !asDrawer && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", gap: 6 }}>
          <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", writingMode: "vertical-rl", marginTop: 8 }}>
            Mẫu
          </div>
        </div>
      )}

      {/* Bank Tab */}
      {effectiveOpen && tab === "bank" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          <input
            placeholder="Tìm câu hỏi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px", marginBottom: 8,
              borderRadius: 7, border: "1px solid #e8eaed",
              fontSize: 12.5, outline: "none", boxSizing: "border-box",
              background: "#f8f9fb", fontFamily: "inherit",
              transition: "border-color .12s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = T)}
            onBlur={e => (e.currentTarget.style.borderColor = "#e8eaed")}
          />

          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: "2px 9px", borderRadius: 12, fontSize: 11,
                  border: `1px solid ${category === c ? T : "#e8eaed"}`,
                  background: category === c ? `${T}10` : "transparent",
                  color: category === c ? T : "#6b7280",
                  cursor: "pointer", fontFamily: "inherit",
                  fontWeight: category === c ? 600 : 400,
                  transition: "all .1s",
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
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px", border: "1px solid #e8eaed",
                borderRadius: 8, marginBottom: 6, cursor: "grab",
                background: "#fff", transition: "all .12s",
              }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = T; d.style.background = "#f0fdfa"; }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = "#e8eaed"; d.style.background = "#fff"; }}
            >
              <span style={{ color: "#d1d5db", flexShrink: 0 }}><IcDrag /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#111827", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {bq.title}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ fontSize: 10, color: "#9ca3af", background: "#f3f4f6", padding: "1px 6px", borderRadius: 4 }}>
                    {Q_TYPE_LABELS[bq.type] ?? bq.type}
                  </span>
                  <span style={{ fontSize: 10, color: T, background: `${T}10`, padding: "1px 6px", borderRadius: 4 }}>
                    {bq.category}
                  </span>
                </div>
              </div>
              <button
                title="Thêm"
                onClick={() => { onAddFromBank(bq); if (asDrawer) handleToggle(); }}
                style={{
                  width: 22, height: 22, border: `1px solid ${T}`,
                  borderRadius: "50%", background: "transparent",
                  cursor: "pointer", color: T,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  transition: "all .1s",
                }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = T; b.style.color = "#fff"; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = T; }}
              >
                <IcPlus />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 12px", color: "#9ca3af", fontSize: 12 }}>
              Không tìm thấy
            </div>
          )}
        </div>
      )}

      {/* Theme Tab */}
      {effectiveOpen && tab === "theme" && (
        <div style={{ padding: "14px 14px 20px", overflowY: "auto", flex: 1 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>
            Màu chủ đạo
          </div>

          {/* Presets */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {PRESET_COLORS.map(c => (
              <div
                key={c}
                onClick={() => onAccentChange(c)}
                title={c}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: c,
                  cursor: "pointer",
                  border: accent === c ? "3px solid #fff" : "2px solid transparent",
                  boxShadow: accent === c ? `0 0 0 2px ${c}` : "0 1px 3px rgba(0,0,0,.12)",
                  transform: accent === c ? "scale(1.18)" : "scale(1)",
                  transition: "all .15s",
                }}
              />
            ))}
          </div>

          {/* Custom */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px",
            background: "#f8f9fb", borderRadius: 8,
            border: "1px solid #e8eaed",
          }}>
            <input
              type="color"
              value={accent}
              onChange={e => onAccentChange(e.target.value)}
              style={{ width: 32, height: 28, borderRadius: 6, border: "none", cursor: "pointer", padding: 2, background: "transparent" }}
            />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Tùy chỉnh</div>
              <div style={{ fontSize: 12, fontFamily: "Geist Mono, monospace", color: "#374151", fontWeight: 600 }}>{accent}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: accent, marginLeft: "auto", flexShrink: 0 }} />
          </div>

          {/* Live preview */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>
              Xem trước
            </div>
            <div style={{ border: "1px solid #e8eaed", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 4, background: accent }} />
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Tiêu đề form</div>
                <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 4, fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
                  Câu trả lời...
                </div>
                <button style={{
                  background: accent, color: "#fff", border: "none",
                  borderRadius: 5, padding: "5px 14px", fontSize: 12, fontWeight: 600,
                  cursor: "default", fontFamily: "inherit",
                }}>
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}