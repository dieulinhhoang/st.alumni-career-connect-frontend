import { useState } from "react";
import type { Question } from "../../../../feature/form/types";

interface HeaderFields {
  orgUnit: string;
  orgName: string;
  address: string;
  phone: string;
}

interface PDFCanvasProps {
  name: string;
  desc: string;
  questions: Question[];
  accent: string;
  interactive?: boolean;
  headerOnly?: boolean;
  header?: HeaderFields;
  onHeaderChange?: (fields: HeaderFields) => void;
  onNameChange?: (v: string) => void;
  onDescChange?: (v: string) => void;
}

function InlineInput({ value, onChange, style, multiline, placeholder }: {
  value: string; onChange: (v: string) => void;
  style?: React.CSSProperties; multiline?: boolean; placeholder?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    background: "transparent", border: "none", outline: "none",
    borderBottom: hover ? "1.5px dashed #ccc" : "1.5px solid transparent",
    width: "100%", fontFamily: "inherit", resize: "none",
    cursor: "text", transition: "border-color .15s", ...style,
  };
  return multiline
    ? <textarea rows={2} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ ...base, display: "block" }} />
    : <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={base} />;
}

const DEFAULT_HEADER: HeaderFields = {
  orgUnit: "Bộ Nông nghiệp và Môi trường",
  orgName: "Học viện Nông nghiệp Việt Nam",
  address: "Xã Gia Lâm, Thành phố Hà Nội",
  phone: "Điện thoại: 024.62617586 — Fax: 024.62617586",
};

export function PDFCanvas({
  name, desc, questions, accent,
  interactive = true, headerOnly = false,
  header = DEFAULT_HEADER,
  onHeaderChange, onNameChange, onDescChange,
}: PDFCanvasProps) {
  const [stars, setStars] = useState<Record<string, number>>({});
  const [radios, setRadios] = useState<Record<string, string>>({});
  const [cbs, setCbs] = useState<Record<string, Record<string, boolean>>>({});
  const [done, setDone] = useState(false);
  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const h = header ?? DEFAULT_HEADER;
  const setH = (key: keyof HeaderFields) => (val: string) =>
    onHeaderChange?.({ ...h, [key]: val });

  const editable = headerOnly && !!onHeaderChange;

  if (done && interactive) {
    return (
      <div style={{ background: "#fff", textAlign: "center", padding: "48px 20px", fontFamily: "'Times New Roman', serif" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: accent + "20", color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>✓</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Phản hồi đã được ghi lại!</div>
        <button onClick={() => { setDone(false); setStars({}); setRadios({}); setCbs({}); }}
          style={{ height: 32, padding: "0 20px", borderRadius: 4, border: "none", background: accent, color: "#fff", fontSize: 13, cursor: "pointer" }}>
          Xem lại
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", fontFamily: "'Times New Roman', Georgia, serif", fontSize: 14 }}>
      <div style={{ height: 6, background: accent }} />
      <div style={{ padding: "6px 28px", textAlign: "right", fontSize: 12, fontStyle: "italic", color: "#6b7280", borderBottom: "1px solid #f0f0f0" }}>
        Ngày {today.replace(/\//g, " / ")}
      </div>

      {/* Thông tin đơn vị */}
      <div style={{ padding: "16px 28px 14px", borderBottom: "1px solid #eee", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${accent}30`, background: accent + "10", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🌾</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editable ? (
            <>
              <InlineInput value={h.orgUnit} onChange={setH("orgUnit")}
                style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em" }} />
              <InlineInput value={h.orgName} onChange={setH("orgName")}
                style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: ".04em", margin: "2px 0" }} />
              <InlineInput value={h.address} onChange={setH("address")}
                style={{ fontSize: 11.5, color: "#9ca3af" }} />
              <InlineInput value={h.phone} onChange={setH("phone")}
                style={{ fontSize: 11.5, color: "#9ca3af" }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em" }}>{h.orgUnit}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: ".04em", margin: "2px 0" }}>{h.orgName}</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af", lineHeight: 1.6 }}>{h.address}<br />{h.phone}</div>
            </>
          )}
        </div>
      </div>

      {/* Tên form & mô tả */}
      <div style={{ padding: "20px 28px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>
        {editable && onNameChange ? (
          <InlineInput
            value={name} onChange={onNameChange} placeholder="TÊN FORM KHẢO SÁT"
            style={{ fontSize: 15, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: ".06em", lineHeight: 1.5, textAlign: "center" }}
          />
        ) : (
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: ".06em", lineHeight: 1.5 }}>
            {name || "TÊN FORM KHẢO SÁT"}
          </div>
        )}
        {editable && onDescChange ? (
          <InlineInput
            value={desc} onChange={onDescChange} placeholder="Mô tả form (tuỳ chọn)..." multiline
            style={{ fontSize: 13, color: "#374151", fontStyle: "italic", marginTop: 8, lineHeight: 1.8, textAlign: "left" }}
          />
        ) : (
          desc && <div style={{ fontSize: 13, color: "#374151", fontStyle: "italic", marginTop: 8, lineHeight: 1.8, textAlign: "left" }}>{desc}</div>
        )}
      </div>

      {/* Câu hỏi – ẩn khi headerOnly */}
      {!headerOnly && (
        <>
          {questions.length === 0 ? (
            <div style={{ padding: "48px 28px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Chưa có câu hỏi nào</div>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} style={{ padding: "14px 28px", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ fontSize: 13.5, color: "#111827", marginBottom: 10, lineHeight: 1.5 }}>
                  {i + 1}. {q.title}{q.required && <span style={{ color: "#dc2626", marginLeft: 3 }}>*</span>}
                </div>
                {q.type === "short" && <div style={{ borderBottom: `1.5px solid ${accent}`, paddingBottom: 4, fontSize: 13, color: "#bbb", fontStyle: "italic" }}>Câu trả lời...</div>}
                {q.type === "long" && <div style={{ borderBottom: `1.5px solid ${accent}`, paddingBottom: 20, fontSize: 13, color: "#bbb", fontStyle: "italic" }}>Câu trả lời...</div>}
                {q.type === "date" && <div style={{ display: "inline-flex", borderBottom: `1.5px solid ${accent}`, padding: "4px 0", fontSize: 13, color: "#9ca3af" }}>dd/mm/yyyy</div>}
                {q.type === "rating" && interactive && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} onClick={() => setStars(v => ({ ...v, [q.id]: n }))}
                        style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${(stars[q.id] || 0) >= n ? accent : "#e5e7eb"}`, background: (stars[q.id] || 0) >= n ? accent + "18" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: (stars[q.id] || 0) >= n ? accent : "#d1d5db" }}>★</div>
                    ))}
                  </div>
                )}
                {(q.type === "radio" || q.type === "checkbox") && (q.options ?? []).map(o => {
                  const selected = interactive && (radios[q.id] === o.id || cbs[q.id]?.[o.id]);
                  return (
                    <div key={o.id} onClick={() => {
                      if (!interactive) return;
                      if (q.type === "radio") setRadios(v => ({ ...v, [q.id]: o.id }));
                      if (q.type === "checkbox") setCbs(v => ({ ...v, [q.id]: { ...(v[q.id] || {}), [o.id]: !cbs[q.id]?.[o.id] } }));
                    }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", cursor: interactive ? "pointer" : "default" }}>
                      <div style={{ width: 16, height: 16, borderRadius: q.type === "radio" ? "50%" : 3, border: `2px solid ${selected ? accent : "#9ca3af"}`, background: (q.type === "checkbox" && selected) ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {q.type === "radio" && selected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: accent }} />}
                        {q.type === "checkbox" && selected && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13.5, color: "#374151" }}>{o.label}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          {questions.length > 0 && interactive && (
            <div style={{ padding: "18px 28px 14px", borderTop: "1px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={() => setDone(true)} style={{ height: 34, padding: "0 22px", border: "none", background: accent, color: "#fff", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>Gửi</button>
              <button onClick={() => { setStars({}); setRadios({}); setCbs({}); }} style={{ height: 34, padding: "0 14px", border: "none", background: "transparent", color: accent, fontSize: 13, cursor: "pointer" }}>Xóa câu trả lời</button>
            </div>
          )}
          <div style={{ padding: "14px 28px 20px", textAlign: "center", fontSize: 12.5, color: "#9ca3af", fontStyle: "italic", lineHeight: 2, borderTop: "1px solid #f5f5f5" }}>
            Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!<br />
            Kính chúc Anh/Chị sức khỏe và thành công!
          </div>
        </>
      )}
    </div>
  );
}