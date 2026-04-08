import { useState } from "react";
import type { Question } from "../../../../feature/form/types";
import { AddressInput } from "./AddressInput";

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
  const [textVals, setTextVals] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const h = header ?? DEFAULT_HEADER;
  const setH = (key: keyof HeaderFields) => (val: string) =>
    onHeaderChange?.({ ...h, [key]: val });

  const editable = headerOnly && !!onHeaderChange;

  // Hàm xử lý gửi form (validate)
  const handleSubmit = () => {
    // Tìm tất cả các input, select có required
    const elements = document.querySelectorAll('input[required], select[required]');
    for (let el of elements) {
      const element = el as HTMLInputElement | HTMLSelectElement;
      if (!element.checkValidity()) {
        element.reportValidity();
        return;
      }
    }
    setDone(true);
  };

  if (done && interactive) {
    return (
      <div style={{ background: "#fff", textAlign: "center", padding: "48px 20px", fontFamily: "'Times New Roman', serif" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: accent + "20", color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>✓</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Phản hồi đã được ghi lại!</div>
        <button onClick={() => { setDone(false); setStars({}); setRadios({}); setCbs({}); setTextVals({}); }}
          style={{ height: 32, padding: "0 20px", borderRadius: 4, border: "none", background: accent, color: "#fff", fontSize: 13, cursor: "pointer" }}>
          Xem lại
        </button>
      </div>
    );
  }

   // Trong PDFCanvas.tsx, thay đổi phần return JSX
return (
  <div className="pdf-preview" style={{ background: "#fff" }}>
    {/* Header stripe */}
    <div className="pdf-header-stripe" style={{ background: accent }} />
    
    {/* Date */}
    <div className="pdf-date">
      Ngày {today.replace(/\//g, " / ")}
    </div>

    {/* Thông tin đơn vị */}
    <div className="pdf-org-info">
      <div className="pdf-logo">
        <img src="public/logovua.png" alt="Logo" style={{ width: 28, height: 28 }} />
      </div>
      <div style={{ flex: 1 }}>
        {editable ? (
          <>
            <InlineInput value={h.orgUnit} onChange={setH("orgUnit")} />
            <InlineInput value={h.orgName} onChange={setH("orgName")} />
            <InlineInput value={h.address} onChange={setH("address")} />
            <InlineInput value={h.phone} onChange={setH("phone")} />
          </>
        ) : (
          <>
            <div className="pdf-ministry">{h.orgUnit}</div>
            <div className="pdf-academy">{h.orgName}</div>
            <div className="pdf-address">{h.address}<br />{h.phone}</div>
          </>
        )}
      </div>
    </div>

    {/* Tiêu đề form */}
    <div className="pdf-form-title">
      {editable && onNameChange ? (
        <InlineInput value={name} onChange={onNameChange} placeholder="TÊN FORM KHẢO SÁT" style={{ fontSize: 15, fontWeight: 700, textAlign: "center", textTransform: "uppercase" }} />
      ) : (
        <h2>{name || "TÊN FORM KHẢO SÁT"}</h2>
      )}
    </div>

    {/* Mô tả */}
    {(desc || (editable && onDescChange)) && (
      <div className="pdf-description"  >
        {editable && onDescChange ? (
          <InlineInput value={desc} onChange={onDescChange} placeholder="Mô tả form (tuỳ chọn)..." multiline style={{ fontStyle: "italic", textAlign: "justify" }} />
        ) : (
          desc
        )}
      </div>
    )}

     {!headerOnly && (
      <>
        {questions.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>Chưa có câu hỏi nào</div>
        ) : (
          questions.map((q, i) => {
             const isSectionStart = q.title.match(/^1\./) || q.title.match(/^11\./);
            const sectionTitle = q.title.match(/^1\./) ? "Phần I. Thông tin cá nhân" : (q.title.match(/^11\./) ? "Phần II. Nội dung khảo sát" : null);
            return (
              <div key={q.id}>
                {sectionTitle && <div className="pdf-section" style={{ borderLeftColor: accent, color: accent }}>{sectionTitle}</div>}
                <div className="pdf-question">
                  <div className="pdf-question-title">
                    {i + 1}. {q.title.replace(/^\d+\.\s*/, "")}
                    {q.required && <span className="required-star">*</span>}
                  </div>
                  {/* Các loại câu hỏi - sử dụng class mới */}
                  {q.type === "short" && (
                    <input
                      type="text"
                      className="pdf-input"
                      placeholder="Câu trả lời của bạn"
                      value={textVals[q.id] || ""}
                      onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
                    />
                  )}
                  {q.type === "long" && (
                    <textarea
                      className="pdf-textarea"
                      rows={3}
                      placeholder="Câu trả lời của bạn..."
                      value={textVals[q.id] || ""}
                      onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
                    />
                  )}
                  {q.type === "date" && (
                    <input type="date" className="pdf-input" style={{ width: "auto", minWidth: 160 }} />
                  )}
                  {q.type === "email" && (
                    <input
                      type="email"
                      className="pdf-input"
                      required={q.required}
                      placeholder="Nhập email của bạn"
                      value={textVals[q.id] || ""}
                      onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
                    />
                  )}
                  {q.type === "tel" && (
                    <input
                      type="tel"
                      className="pdf-input"
                      required={q.required}
                      pattern="(02[0-9]{8})|(0[3-9][0-9]{8})"
                      placeholder="Nhập số điện thoại"
                      value={textVals[q.id] || ""}
                      onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
                    />
                  )}
                  {q.type === "radio" && (
                    <div className="pdf-radio-group">
                      {(q.options ?? []).map(o => {
                        const selected = radios[q.id] === o.id;
                        return (
                          <div key={o.id} className="pdf-radio-option" onClick={() => setRadios(v => ({ ...v, [q.id]: o.id }))}>
                            <div className={`pdf-radio-custom ${selected ? "selected" : ""}`} />
                            <span>{o.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {q.type === "checkbox" && (
                    <div className="pdf-checkbox-group">
                      {(q.options ?? []).map(o => {
                        const checked = cbs[q.id]?.[o.id] || false;
                        return (
                          <div key={o.id} className="pdf-checkbox-option" onClick={() => setCbs(v => ({ ...v, [q.id]: { ...(v[q.id] || {}), [o.id]: !checked } }))}>
                            <div className={`pdf-checkbox-custom ${checked ? "selected" : ""}`} />
                            <span>{o.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                   
                  {q.type === "dropdown" && (
                    <select className="pdf-input" value={textVals[q.id] || ""} onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}>
                      <option value="" disabled>Chọn một phương án</option>
                      {(q.options ?? []).map(o => <option key={o.id} value={o.label}>{o.label}</option>)}
                    </select>
                  )}
                  {q.type === "address" && (
                    <AddressInput value={textVals[q.id] || ""} onChange={v => setTextVals(t => ({ ...t, [q.id]: v }))} />
                  )}
                </div>
              </div>
            );
          })
        )}
        {questions.length > 0 && interactive && (
          <div style={{ padding: "16px 24px", display: "flex", gap: 12, borderTop: "1px solid #f3f4f6" }}>
            <button className="pdf-submit-btn" onClick={handleSubmit} style={{ background: accent }}>Gửi</button>
          </div>
        )}
        <div className="pdf-footer">
          Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!<br />
          Kính chúc Anh/Chị sức khỏe và thành công!
        </div>
      </>
    )}
  </div>
);
}