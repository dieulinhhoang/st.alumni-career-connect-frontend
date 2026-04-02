import { useState } from "react";
import { THEMES } from "../../../feature/form/constants";
import type { Form } from "../../../feature/form/types";

//  Types 
interface Question {
  id: string;
  type: string;
  title: string;
  required: boolean;
  options?: { id: string; label: string }[];
}

//  Inline theme resolver 
function getTheme(themeId?: string) {
  return THEMES.find((t: { id: string }) => t.id === themeId) ?? THEMES[0];
}

//  Section labels matching PDF 
function buildSectionMap(questions: Question[]): Record<string, string> {
  const map: Record<string, string> = {};
  questions.forEach((q) => {
    const m = q.title.match(/^(\d+)\./);
    if (m) {
      const n = parseInt(m[1]);
      if (n === 1)  map[q.id] = "Phần I. Thông tin cá nhân";
      if (n === 11) map[q.id] = "Phần II. Nội dung khảo sát";
    }
  });
  return map;
}

// 
// EMBEDDED SURVEY PREVIEW — renders inline inside Builder
// No separate route/page. Pass `compact` for sidebar mode.
// 

interface PreviewProps {
  form: Form | null;
  /** compact = small preview inside builder right panel */
  compact?: boolean;
  /** called when user taps "Quay lại" in standalone mode */
  onBack?: () => void;
}

export function SurveyPreview({ form, compact = false, onBack }: PreviewProps) {
  const [starVals,  setStarVals]  = useState<Record<string, number>>({});
  const [radioVals, setRadioVals] = useState<Record<string, string>>({});
  const [cbVals,    setCbVals]    = useState<Record<string, Record<string, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [textVals,  setTextVals]  = useState<Record<string, string>>({});

  if (!form) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", padding: 32,
      color: "#9ca3af", gap: 12,
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <span style={{ fontSize: 13, fontWeight: 500 }}>Chưa có nội dung để xem trước</span>
    </div>
  );

  const th = getTheme(form.themeId);
  const sectionMap = buildSectionMap(form.questions ?? []);
  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  //  Submitted screen 
  if (submitted) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: compact ? "32px 20px" : "64px 20px",
      textAlign: "center", minHeight: compact ? 240 : "60vh",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: th.accent + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px", color: th.accent,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div style={{ fontSize: compact ? 15 : 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
        Phản hồi đã được ghi lại!
      </div>
      <div style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, marginBottom: 20, maxWidth: 320 }}>
        Đây là chế độ xem trước — form chưa thực sự được gửi.<br />
        Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!
      </div>
      <button
        onClick={() => { setSubmitted(false); setStarVals({}); setRadioVals({}); setCbVals({}); setTextVals({}); }}
        style={{
          height: 34, padding: "0 20px", borderRadius: 6,
          border: "none", background: th.accent, color: "#fff",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}
      >
        Xem lại
      </button>
    </div>
  );

  //  Survey body 
  const fontFamily = th.font ?? "'Times New Roman', serif";
  const accentColor = th.accent;

  return (
    <div style={{
      fontFamily: "'Times New Roman', Georgia, serif",
      background: compact ? "#f8f9fa" : (th.bg ?? "#f5f5f5"),
      minHeight: compact ? "auto" : "100vh",
      fontSize: compact ? 13 : 14,
    }}>

      {/*  VNUA OFFICIAL HEADER — matches PDF exactly  */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        overflow: "hidden",
      }}>
        {/* Top accent stripe */}
        <div style={{ height: compact ? 4 : 6, background: accentColor }} />

        {/* Date */}
        <div style={{
          padding: compact ? "5px 16px" : "7px 24px",
          textAlign: "right",
          fontSize: compact ? 10.5 : 11.5,
          fontStyle: "italic",
          color: "#6b7280",
          borderBottom: "1px solid #f3f4f6",
          fontFamily: "'Times New Roman', serif",
        }}>
          Ngày {today.replace(/\//g, " / ")}
        </div>

        {/* Institution header */}
        <div style={{
          padding: compact ? "12px 16px" : "16px 32px",
          display: "flex", alignItems: "flex-start", gap: 14,
          borderBottom: "1px solid #f3f4f6",
        }}>
           <div >
             <img style={{
            width: compact ? 36 : 52, height: compact ? 36 : 52,
            borderRadius: "50%",
            border: `2px solid ${accentColor}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, background: accentColor + "10",
            fontSize: compact ? 16 : 22,
          }} src= "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: compact ? 9 : 10.5,
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 2,
              fontFamily: "inherit",
            }}>
              Bộ Nông nghiệp và Môi trường
            </div>
            <div style={{
              fontSize: compact ? 12 : 14,
              fontWeight: 700,
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: ".04em",
              marginBottom: compact ? 2 : 3,
              fontFamily: "inherit",
            }}>
              Học viện Nông nghiệp Việt Nam
            </div>
            <div style={{ fontSize: compact ? 10 : 11.5, color: "#9ca3af", lineHeight: 1.6, fontFamily: "inherit" }}>
              Xã Gia Lâm, Thành phố Hà Nội<br />
              Điện thoại: 024.62617586 — Fax: 024.62617586
            </div>
          </div>
        </div>

        {/* Form title */}
        <div style={{
          padding: compact ? "14px 16px 10px" : "22px 32px 14px",
          textAlign: "center",
          borderBottom: "1px solid #f3f4f6",
        }}>
          <h2 style={{
            fontSize: compact ? 13 : 15,
            fontWeight: 700,
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: ".05em",
            lineHeight: 1.5,
            fontFamily: "inherit",
            margin: 0,
          }}>
            {form.name || "Chưa đặt tên form"}
          </h2>
        </div>

        {/* Description / intro paragraph */}
        {form.description && (
          <div style={{
            padding: compact ? "10px 16px 12px" : "14px 32px 18px",
            fontSize: compact ? 11.5 : 13,
            fontStyle: "italic",
            color: "#374151",
            lineHeight: 1.8,
            textAlign: "justify",
            fontFamily: "inherit",
            borderBottom: `3px solid ${accentColor}`,
          }}>
            {form.description}
          </div>
        )}
        {!form.description && (
          <div style={{ height: 4, background: accentColor }} />
        )}
      </div>

      {/*  QUESTIONS  */}
      <div style={{ padding: compact ? "0 0 24px" : "0 0 40px" }}>
        {(form.questions ?? []).map((q: Question, idx: number) => (
          <div key={q.id}>
            {/* Section header */}
            {sectionMap[q.id] && (
              <div style={{
                padding: compact ? "8px 16px" : "10px 32px",
                fontSize: compact ? 11.5 : 13,
                fontWeight: 700,
                color: accentColor,
                background: accentColor + "10",
                borderLeft: `3px solid ${accentColor}`,
                margin: compact ? "12px 0 0" : "16px 0 0",
                fontFamily: "inherit",
                letterSpacing: ".01em",
              }}>
                {sectionMap[q.id]}
              </div>
            )}

            {/* Question card */}
            <div style={{
              background: "#fff",
              padding: compact ? "12px 16px" : "18px 32px",
              borderBottom: "1px solid #f3f4f6",
              position: "relative",
            }}>
              {/* Question number + title */}
              <div style={{
                fontSize: compact ? 12.5 : 14,
                color: "#111827",
                marginBottom: compact ? 10 : 14,
                lineHeight: 1.6,
                fontFamily: "inherit",
                display: "flex", gap: 4,
              }}>
                <span style={{ flexShrink: 0 }}>{idx + 1}.</span>
                <span style={{ flex: 1 }}>
                  {q.title.replace(/^\d+\.\s*/, "")}
                  {q.required && <span style={{ color: "#dc2626", marginLeft: 3 }}>*</span>}
                </span>
              </div>

              {/*  Short text  */}
              {q.type === "short" && (
                <input
                  className="gf-input"
                  placeholder="Câu trả lời của bạn"
                  value={textVals[q.id] ?? ""}
                  onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))}
                  style={{ fontSize: compact ? 12.5 : 14 }}
                />
              )}

              {/*  Long text  */}
              {q.type === "long" && (
                <textarea
                  className="gf-textarea"
                  rows={compact ? 2 : 3}
                  placeholder="Câu trả lời của bạn..."
                  value={textVals[q.id] ?? ""}
                  onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))}
                  style={{ fontSize: compact ? 12.5 : 14 }}
                />
              )}

              {/*  Date  */}
              {q.type === "date" && (
                <input type="date" className="gf-input" style={{ width: 180, fontSize: compact ? 12.5 : 14 }} />
              )}

              {/*  Rating / Stars  */}
              {q.type === "rating" && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = (starVals[q.id] || 0) >= n;
                    return (
                      <div
                        key={n}
                        onClick={() => setStarVals((v) => ({ ...v, [q.id]: n }))}
                        style={{
                          width: compact ? 28 : 34, height: compact ? 28 : 34,
                          borderRadius: "50%",
                          border: `1.5px solid ${active ? accentColor : "#d1d5db"}`,
                          background: active ? accentColor + "15" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", fontSize: compact ? 14 : 18,
                          color: active ? accentColor : "#9ca3af",
                          transition: "all .12s",
                          userSelect: "none",
                        }}
                      >★</div>
                    );
                  })}
                  {starVals[q.id] && (
                    <span style={{ fontSize: 11.5, color: "#6b7280", marginLeft: 4 }}>
                      {starVals[q.id]}/5
                    </span>
                  )}
                </div>
              )}

              {/*  Radio  */}
              {q.type === "radio" && (q.options ?? []).map((o) => {
                const selected = radioVals[q.id] === o.id;
                return (
                  <div
                    key={o.id}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", cursor: "pointer" }}
                    onClick={() => setRadioVals((v) => ({ ...v, [q.id]: o.id }))}
                  >
                    <div style={{
                      width: compact ? 15 : 18, height: compact ? 15 : 18,
                      borderRadius: "50%",
                      border: `2px solid ${selected ? accentColor : "#9ca3af"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "border-color .12s",
                    }}>
                      {selected && (
                        <div style={{ width: compact ? 7 : 9, height: compact ? 7 : 9, borderRadius: "50%", background: accentColor }} />
                      )}
                    </div>
                    <span style={{ fontSize: compact ? 12.5 : 14, color: "#374151", fontFamily: "inherit" }}>{o.label}</span>
                  </div>
                );
              })}

              {/*  Checkbox  */}
              {q.type === "checkbox" && (q.options ?? []).map((o: { id: string; label: string }) => {
                const checked = cbVals[q.id]?.[o.id] || false;
                return (
                  <div
                    key={o.id}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", cursor: "pointer" }}
                    onClick={() => setCbVals((v) => ({
                      ...v, [q.id]: { ...(v[q.id] || {}), [o.id]: !checked }
                    }))}
                  >
                    <div style={{
                      width: compact ? 15 : 18, height: compact ? 15 : 18,
                      borderRadius: 3,
                      border: `2px solid ${checked ? accentColor : "#9ca3af"}`,
                      background: checked ? accentColor : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "all .12s",
                    }}>
                      {checked && (
                        <svg width={compact ? 8 : 10} height={compact ? 8 : 10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <span style={{ fontSize: compact ? 12.5 : 14, color: "#374151", fontFamily: "inherit" }}>{o.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/*  Empty state  */}
        {(form.questions ?? []).length === 0 && (
          <div style={{
            textAlign: "center", padding: compact ? "24px 16px" : "40px 20px",
            color: "#9ca3af", background: "#fff",
          }}>
            <div style={{ fontSize: compact ? 12 : 13 }}>Chưa có câu hỏi nào</div>
          </div>
        )}

        {/*  Submit row  */}
        {(form.questions ?? []).length > 0 && (
          <div style={{
            background: "#fff",
            padding: compact ? "14px 16px" : "20px 32px",
            borderTop: "1px solid #f3f4f6",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <button
              onClick={() => setSubmitted(true)}
              style={{
                height: compact ? 32 : 36,
                padding: compact ? "0 18px" : "0 24px",
                borderRadius: 4,
                border: "none", background: accentColor, color: "#fff",
                fontSize: compact ? 12.5 : 14,
                fontWeight: 600, cursor: "pointer",
                fontFamily: fontFamily,
                letterSpacing: ".01em",
                transition: "opacity .12s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = ".88")}
              onMouseOut={(e)  => (e.currentTarget.style.opacity = "1")}
            >
              Gửi
            </button>
            <button
              onClick={() => { setStarVals({}); setRadioVals({}); setCbVals({}); setTextVals({}); }}
              style={{
                height: compact ? 32 : 36, padding: compact ? "0 12px" : "0 16px",
                border: "none", background: "transparent",
                fontSize: compact ? 12 : 13.5, color: accentColor,
                cursor: "pointer", fontFamily: fontFamily, fontWeight: 500,
              }}
            >
              Xóa câu trả lời
            </button>
          </div>
        )}

        {/*  Footer  */}
        <div style={{
          textAlign: "center",
          fontSize: compact ? 11 : 12.5,
          color: "#9ca3af",
          fontFamily: "'Times New Roman', serif",
          fontStyle: "italic",
          padding: compact ? "12px 16px 4px" : "18px 20px 8px",
          lineHeight: 1.9,
        }}>
          Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!<br />
          Kính chúc Anh/Chị sức khỏe và thành công!
        </div>
      </div>
    </div>
  );
}

 interface StandaloneProps {
  form: Form | null;
  onBack: () => void;
}

export default function PreviewView({ form, onBack }: StandaloneProps) {
  const th = form ? (THEMES.find((t: { id: string }) => t.id === form.themeId) ?? THEMES[0]) : THEMES[0];

  return (
    <div style={{ minHeight: "100vh", background: th.bg ?? "#f5f5f5" }}>
      {/* Minimal top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fff", padding: "0 20px",
        borderBottom: "1px solid #e5e7eb",
        height: 48,
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onBack}
            style={{ gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Quay lại
          </button>
          <div style={{ width: 1, height: 18, background: "#e5e7eb" }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#9ca3af",
            textTransform: "uppercase", letterSpacing: ".08em",
          }}>
            Xem trước
          </span>
        </div>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: th.accent,
        }} />
      </div>

      {/* The survey itself — full width, centered */}
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SurveyPreview form={form} compact={false} onBack={onBack} />
      </div>
    </div>
  );
}