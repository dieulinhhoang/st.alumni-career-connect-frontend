import { useState } from "react";
import type { Form, Theme } from "../../../feature/form/types";
import { THEMES, ACCENT_COLORS, FONTS, RADIUS_OPTIONS } from "../../../feature/form/constants";

interface ThemeViewProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onBack: () => void;
}

export function ThemeView({ form, onSave, onBack }: ThemeViewProps) {
  const [themeId, setThemeId]   = useState(form?.themeId ?? "purple");
  const [customAcc, setCA]      = useState<string | null>(null);
  const [customFont, setCF]     = useState<string | null>(null);
  const [customRad, setCR]      = useState<string | null>(null);

  const baseTheme = THEMES.find((t: { id: string; name?: string }) => t.id === themeId) ?? THEMES[0];
  const accent = customAcc  ?? baseTheme.accent;
  const font   = customFont ?? baseTheme.font;
  const radius = customRad  ?? baseTheme.radius;
  const bg     = baseTheme.bg;

  const handleSave = () => {
    const updated: Form = {
      ...form!,
      themeId,
      _customTheme: (customAcc || customFont || customRad) ? { accent, font, radius, bg } : null,
    };
    onSave(updated);
  };

  return (
    <div className="page">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Quay lại</button>
          <div>
            <div className="page-eyebrow">Cấu hình giao diện</div>
            <div className="page-title" style={{ fontSize: 16, marginBottom: 0 }}>Chọn theme · {form?.name}</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>💾 Lưu theme</button>
      </div>

      <div className="theme-layout">
        {/* LEFT: controls */}
        <div className="theme-controls">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">Preset themes</div>
            <div className="themes-grid">
              {THEMES.map((t: { id: string; name: string; accent: string; header: string; bg: string; font: string; radius: string }) => (
                <div key={t.id}
                  className={`theme-card${themeId === t.id ? " selected" : ""}`}
                  style={themeId === t.id ? { borderColor: t.accent, "--sel": t.accent } as React.CSSProperties : {}}
                  onClick={() => { setThemeId(t.id); setCA(null); setCF(null); setCR(null); }}>
                  <div style={{ height: 48, background: t.header, borderRadius: "8px 8px 0 0" }} />
                  <div style={{ height: 20, background: t.bg, borderRadius: "0 0 8px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 32, height: 6, borderRadius: 3, background: t.accent, opacity: 0.5 }} />
                  </div>
                  <div style={{ padding: "7px 10px", fontSize: 11.5, fontWeight: 600, color: "#0f172a", textAlign: "center" }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">Màu chủ đạo</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {ACCENT_COLORS.map((c: string) => (
                <div key={c}
                  onClick={() => setCA(c)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: accent === c ? "3px solid #fff" : "2px solid transparent", boxShadow: accent === c ? `0 0 0 2px ${c}` : undefined, transform: accent === c ? "scale(1.12)" : "scale(1)", transition: "all .15s" }}
                />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Tùy chỉnh:</label>
              <input type="color" value={accent} onChange={(e) => setCA(e.target.value)} style={{ width: 36, height: 30, borderRadius: 6, border: "0.5px solid #e2e8f0", cursor: "pointer", padding: 2 }} />
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "#475569" }}>{accent}</span>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">Font chữ</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FONTS.map((f: { name: string; val: string }) => (
                <button key={f.name}
                  className={`font-btn${font === f.val ? " selected" : ""}`}
                  style={{ fontFamily: f.val, ...(font === f.val ? { borderColor: accent, background: accent + "15", color: accent } : {}) }}
                  onClick={() => setCF(f.val)}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title">Bo góc</div>
            <div style={{ display: "flex", gap: 8 }}>
              {RADIUS_OPTIONS.map((r: { name: string; val: string }) => (
                <button key={r.val}
                  className={`font-btn${radius === r.val ? " selected" : ""}`}
                  style={radius === r.val ? { borderColor: accent, background: accent + "15", color: accent } : {}}
                  onClick={() => setCR(r.val)}>
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div className="theme-preview-panel">
          <div className="section-title" style={{ marginBottom: 12 }}>Xem trước live</div>
          <div style={{ background: bg, borderRadius: 12, padding: 16, border: "0.5px solid #e2e8f0" }}>
            <div style={{ background: "#fff", borderRadius: `${radius} ${radius} 4px 4px`, overflow: "hidden", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ height: 8, background: accent }} />
              <div style={{ padding: "14px 18px 12px", fontFamily: font }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#202124", marginBottom: 4, fontFamily: font }}>{form?.name ?? "Tên form của bạn"}</div>
                <div style={{ fontSize: 12, color: "#444746" }}>{form?.description ?? "Mô tả form ở đây"}</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 4, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", fontFamily: font }}>
              <div style={{ fontSize: 13.5, color: "#202124", marginBottom: 10 }}>Họ và tên <span style={{ color: "#d93025" }}>*</span></div>
              <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 4, fontSize: 13, color: "#5f6368" }}>Nguyễn Văn A</div>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center", fontFamily: font }}>
              <button style={{ height: 32, padding: "0 20px", borderRadius: 4, border: "none", background: accent, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Gửi</button>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "0.5px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".06em", textTransform: "uppercase" as const, marginBottom: 8 }}>Cấu hình hiện tại</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {([["Preset", THEMES.find((t: { id: string; name?: string }) => t.id === themeId)?.name], ["Accent", accent], ["Font", font.split(",")[0].replace(/'/g, "")], ["Bo góc", radius]] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#64748b" }}>{k}</span>
                  <span style={{ fontWeight: 600, color: "#0f172a", fontFamily: k === "Font" ? font : undefined }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}