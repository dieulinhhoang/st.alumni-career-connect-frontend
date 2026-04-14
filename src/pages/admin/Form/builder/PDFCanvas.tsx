import { useState, useRef, useEffect } from "react";
import type { Question, Section, SurveyFooter, SurveyHeader } from "../../../../feature/form/types";
import { AddressInput } from "./AddressInput";

interface PDFCanvasProps {
  surveyTitle: string;
  descriptionParagraphs?: string[];
  sections: Section[];
  questions: Question[];
  accent: string;
  header: SurveyHeader;
  footer: SurveyFooter;
  interactive?: boolean;
  headerOnly?: boolean;
  onHeaderChange?: (header: SurveyHeader) => void;
  onFooterChange?: (footer: SurveyFooter) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionParagraphsChange?: (paragraphs: string[]) => void;
  logoUrl?: string;
  logoSize?: number;
}

function InlineInput({
  value, onChange, style, multiline, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    background: "transparent",
    border: "none",
    outline: "none",
    borderBottom: hover ? "1.5px dashed #ccc" : "1.5px solid transparent",
    width: "100%",
    fontFamily: "inherit",
    resize: "none",
    cursor: "text",
    transition: "border-color .15s",
    ...style,
  };
  return multiline ? (
    <textarea
      rows={2}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, display: "block" }}
    />
  ) : (
    <input
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={base}
    />
  );
}

// Input chỉ gạch dưới, không nền, chữ đen, kích thước chữ 15px
const underlineInputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1.5px solid #cbd5e1",
  padding: "8px 4px 6px",
  fontSize: 15,
  fontFamily: "'Times New Roman', Georgia, serif",
  outline: "none",
  background: "transparent",
  color: "#000000",
  transition: "border-color 0.2s",
};

const underlineTextareaStyle: React.CSSProperties = {
  ...underlineInputStyle,
  resize: "vertical",
  minHeight: "80px",
};

const radioCheckboxBaseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "6px 0",
  fontSize: 15,
  color: "#000000",
  cursor: "pointer",
  fontFamily: "'Times New Roman', Georgia, serif",
};

export function PDFCanvas({
  surveyTitle,
  descriptionParagraphs = [],
  sections = [],
  questions,
  accent,
  header = {
    ministry: "Bộ Giáo dục và Đào tạo",
    academy: "",
    address: "",
    phone: "",
    fax: "",
    showDate: true,
  },
  footer,
  interactive = true,
  headerOnly = false,
  onHeaderChange,
  onFooterChange,
  onTitleChange,
  onDescriptionParagraphsChange,
  logoUrl,
  logoSize = 200,
}: PDFCanvasProps) {
  const [radios, setRadios] = useState<Record<string, string>>({});
  const [cbs, setCbs] = useState<Record<string, Record<string, boolean>>>({});
  const [textVals, setTextVals] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Set immediately on mount
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // containerWidth=0 means not measured yet → treat as small (mobile-first)
  const isSmall  = containerWidth === 0 || containerWidth < 480;
  const isMedium = containerWidth >= 480 && containerWidth < 640;
  const isMobile = isSmall || isMedium;

  const px = isSmall ? 16 : isMedium ? 20 : 36;
  const effectiveLogoSize = isSmall ? 72 : isMedium ? 88 : logoSize;

  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const editable = headerOnly && !!onHeaderChange;

  const updateHeader = (key: keyof SurveyHeader, value: any) => {
    if (onHeaderChange) onHeaderChange({ ...header, [key]: value });
  };

  const updateFooter = (key: keyof SurveyFooter, value: string) => {
    if (onFooterChange) onFooterChange({ ...footer, [key]: value });
  };

  const handleSubmit = () => {
    const elements = document.querySelectorAll("input[required], select[required]");
    for (const el of elements) {
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
      <div
        style={{
          background: "#fff",
          textAlign: "center",
          padding: "60px 20px",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: accent + "20",
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            fontSize: 28,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
          Phản hồi đã được ghi lại!
        </div>
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          Cảm ơn bạn đã tham gia khảo sát.
        </div>
        <button
          onClick={() => { setDone(false); setRadios({}); setCbs({}); setTextVals({}); }}
          style={{
            height: 40,
            padding: "0 28px",
            borderRadius: 6,
            border: "none",
            background: accent,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Xem lại
        </button>
      </div>
    );
  }

  // Group questions by section
  const questionsBySection = sections
    .map(section => ({
      ...section,
      questions: questions
        .filter(q => q.sectionId === section.id)
        .sort((a, b) => a.order - b.order),
    }))
    .filter(sec => sec.questions.length > 0);

  let globalIndex = 0;

  const renderQuestion = (q: Question) => {
    globalIndex++;
    const idx = globalIndex;

    return (
      <div
        key={q.id}
        style={{ padding: `14px ${px}px 16px`, borderBottom: "none" }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#000000",
            marginBottom: 12,
            lineHeight: 1.5,
            fontFamily: "'Times New Roman', Georgia, serif",
          }}
        >
          {idx}. {q.title}
          {q.required && <span style={{ color: "#c53030", marginLeft: 4 }}>*</span>}
        </div>

        {(q.type === "short" || q.type === "text") && (
          <input
            type="text"
            placeholder={q.placeholder || "Câu trả lời của bạn"}
            value={textVals[q.id] || ""}
            onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
            required={q.required}
            disabled={!interactive}
            style={underlineInputStyle}
            onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}
          />
        )}

        {q.type === "long" && (
          <textarea
            placeholder={q.placeholder || "Câu trả lời của bạn"}
            value={textVals[q.id] || ""}
            onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
            required={q.required}
            disabled={!interactive}
            style={underlineTextareaStyle}
            onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}
          />
        )}

        {q.type === "email" && (
          <input
            type="email"
            placeholder={q.placeholder || "Nhập email"}
            value={textVals[q.id] || ""}
            onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
            required={q.required}
            disabled={!interactive}
            style={underlineInputStyle}
            onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}
          />
        )}

        {q.type === "tel" && (
          <input
            type="tel"
            placeholder={q.placeholder || "Nhập số điện thoại"}
            value={textVals[q.id] || ""}
            onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
            required={q.required}
            disabled={!interactive}
            style={underlineInputStyle}
            onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}
          />
        )}

        {q.type === "date" && (
          <input
            type="date"
            value={textVals[q.id] || ""}
            onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
            required={q.required}
            disabled={!interactive}
            style={{ ...underlineInputStyle, width: "auto", minWidth: 200 }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}
          />
        )}

        {q.type === "address" && (
          <AddressInput
            value={textVals[q.id] || ""}
            onChange={v => setTextVals(t => ({ ...t, [q.id]: v }))}
          />
        )}

        {q.type === "radio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(q.options ?? []).map(opt => {
              const val = typeof opt === "string" ? opt : opt.label;
              const key = typeof opt === "string" ? opt : opt.id;
              const selected = radios[q.id] === val;
              return (
                <div
                  key={key}
                  onClick={() => interactive && setRadios(v => ({ ...v, [q.id]: val }))}
                  style={radioCheckboxBaseStyle}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${selected ? accent : "#94a3b8"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: "#fff",
                    }}
                  >
                    {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />}
                  </div>
                  <span>{val}</span>
                </div>
              );
            })}
          </div>
        )}

        {q.type === "checkbox" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(q.options ?? []).map(opt => {
              const val = typeof opt === "string" ? opt : opt.label;
              const key = typeof opt === "string" ? opt : opt.id;
              const checked = cbs[q.id]?.[val] || false;
              return (
                <div
                  key={key}
                  onClick={() =>
                    interactive &&
                    setCbs(v => ({
                      ...v,
                      [q.id]: { ...(v[q.id] || {}), [val]: !checked },
                    }))
                  }
                  style={radioCheckboxBaseStyle}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${checked ? accent : "#94a3b8"}`,
                      background: checked ? accent : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {checked && "✓"}
                  </div>
                  <span>{val}</span>
                </div>
              );
            })}
          </div>
        )}

        {q.type === "multiple-choice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options?.map(opt => {
              const val = typeof opt === "string" ? opt : opt;
              const selected = radios[q.id] === val;
              return (
                <div
                  key={val}
                  onClick={() => interactive && setRadios(v => ({ ...v, [q.id]: val }))}
                  style={radioCheckboxBaseStyle}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${selected ? accent : "#94a3b8"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: "#fff",
                    }}
                  >
                    {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />}
                  </div>
                  <span>{val}</span>
                </div>
              );
            })}
          </div>
        )}

        {q.type === "select" && (
          <select
            value={textVals[q.id] || ""}
            onChange={e => setTextVals(v => ({ ...v, [q.id]: e.target.value }))}
            required={q.required}
            disabled={!interactive}
            style={{
              ...underlineInputStyle,
              appearance: "auto",
              cursor: interactive ? "pointer" : "default",
              color: "#000000",
            }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}
          >
            <option value="" disabled>Chọn một phương án</option>
            {q.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: "#fff",
        fontFamily: "'Times New Roman', Georgia, serif",
        color: "#000000",
        width: "100%",
        boxSizing: "border-box",
        minWidth: 0,
      }}
    >

      {/* Top accent stripe */}
      <div style={{ height: 6, background: accent }} />

      {/* Ngày tháng */}
      {header.showDate !== false && (
        <div
          style={{
            textAlign: "right",
            fontSize: isSmall ? 12 : 14,
            fontStyle: "italic",
            color: "#000",
            padding: `${isSmall ? 12 : 16}px ${px}px 8px`,
          }}
        >
          Ngày {today.replace(/\//g, " / ")}
        </div>
      )}

      {/* Logo + thông tin đơn vị */}
      <div
        style={{
          padding: `20px ${px}px 24px`,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "center",
          gap: isMobile ? 14 : 24,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <img
            src={logoUrl || header.logoUrl || "public/logovua.png"}
            alt="Logo"
            style={{
              width: effectiveLogoSize,
              height: effectiveLogoSize,
              objectFit: "contain",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, width: isMobile ? "100%" : undefined }}>
          {editable ? (
            <>
              <InlineInput
                value={header.ministry || ""}
                onChange={v => updateHeader("ministry", v)}
                placeholder="Bộ/ngành"
                style={{ fontSize: isSmall ? 11 : 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", textAlign: isMobile ? "center" : "right", color: "#000000" }}
              />
              <InlineInput
                value={header.academy || ""}
                onChange={v => updateHeader("academy", v)}
                placeholder="Học viện / Trường"
                style={{ fontSize: isSmall ? 13 : 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", margin: "6px 0", textAlign: isMobile ? "center" : "right", color: "#000000" }}
              />
              <InlineInput
                value={header.address || ""}
                onChange={v => updateHeader("address", v)}
                placeholder="Địa chỉ"
                style={{ fontSize: isSmall ? 11 : 13, textAlign: isMobile ? "center" : "right", color: "#000000" }}
              />
              <InlineInput
                value={header.phone || ""}
                onChange={v => updateHeader("phone", v)}
                placeholder="Điện thoại"
                style={{ fontSize: isSmall ? 11 : 13, textAlign: isMobile ? "center" : "right", color: "#000000" }}
              />
            </>
          ) : (
            <>
              <div style={{ fontSize: isSmall ? 11 : 13, fontWeight: 600, color: "#000000", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: isMobile ? "center" : "right", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                {header.ministry}
              </div>
              <div style={{ fontSize: isSmall ? 13 : 18, fontWeight: 800, color: "#000000", textTransform: "uppercase", letterSpacing: "0.5px", margin: "6px 0", textAlign: isMobile ? "center" : "right", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                {header.academy}
              </div>
              <div style={{ fontSize: isSmall ? 11 : 13, color: "#000000", lineHeight: 1.5, textAlign: isMobile ? "center" : "right", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                {header.address}
                {header.phone && <><br />{header.phone}{header.fax ? ` — Fax: ${header.fax}` : ""}</>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tiêu đề form */}
      <div style={{ textAlign: "center", padding: `${isSmall ? 20 : 30}px ${px}px ${isSmall ? 14 : 18}px` }}>
        {editable && onTitleChange ? (
          <InlineInput
            value={surveyTitle}
            onChange={onTitleChange}
            placeholder="TÊN FORM KHẢO SÁT"
            style={{
              fontSize: 20,
              fontWeight: 800,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#000000",
            }}
          />
        ) : (
          <h2
            style={{
              margin: 0,
              fontSize: isSmall ? 15 : isMedium ? 17 : 20,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#000000",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {surveyTitle || "TÊN FORM KHẢO SÁT"}
          </h2>
        )}
      </div>

      {/* Mô tả - in nghiêng, căn đều */}
      {descriptionParagraphs.length > 0 && (
        <div style={{ padding: `0 ${px}px 24px` }}>
          {descriptionParagraphs.map((para, idx) => (
            <div key={idx} style={{ marginBottom: idx === descriptionParagraphs.length - 1 ? 0 : 14 }}>
              {editable && onDescriptionParagraphsChange ? (
                <InlineInput
                  value={para}
                  onChange={val => {
                    const updated = [...descriptionParagraphs];
                    updated[idx] = val;
                    onDescriptionParagraphsChange(updated);
                  }}
                  placeholder={`Đoạn ${idx + 1}`}
                  multiline
                  style={{ fontStyle: "italic", textAlign: "justify", fontSize: 14, color: "#000000" }}
                />
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#000000",
                    lineHeight: 1.7,
                    textAlign: "justify",
                  }}
                >
                  {para}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nội dung câu hỏi */}
      {!headerOnly && (
        <>
          {questionsBySection.length === 0 ? (
            <div
              style={{
                padding: "60px 24px",
                textAlign: "center",
                color: "#9ca3af",
                fontStyle: "italic",
                fontSize: 14,
              }}
            >
              Chưa có câu hỏi nào
            </div>
          ) : (
            questionsBySection.map(section => (
              <div key={section.id}>
                <div
                  style={{ fontWeight: 700, color: "#000000", margin: 0, fontSize: isSmall ? 14 : 17, padding: `${isSmall ? 16 : 22}px ${px}px 8px` }}>
                  {section.title}
                </div>
                {section.questions.map(q => renderQuestion(q))}
              </div>
            ))
          )}

          {questions.length > 0 && interactive && (
            <div style={{ padding: `18px ${px}px`, display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={handleSubmit}
                style={{
                  background: accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "10px 32px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Gửi
              </button>
            </div>
          )}

          <div style={{ textAlign: "center", padding: `28px ${px}px 40px` }}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: "#000000" }}>
              {editable && onFooterChange ? (
                <InlineInput
                  value={footer?.primaryText || ""}
                  onChange={v => updateFooter("primaryText", v)}
                  placeholder="Dòng cảm ơn"
                  style={{ textAlign: "center", fontWeight: "bold", color: "#000000" }}
                />
              ) : (
                footer?.primaryText
              )}
            </div>
            <div style={{ fontStyle: "italic", color: "#000000", fontSize: 13.5 }}>
              {editable && onFooterChange ? (
                <InlineInput
                  value={footer?.secondaryText || ""}
                  onChange={v => updateFooter("secondaryText", v)}
                  placeholder="Lời chúc"
                  style={{ textAlign: "center", fontStyle: "italic", color: "#000000" }}
                />
              ) : (
                footer?.secondaryText
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}