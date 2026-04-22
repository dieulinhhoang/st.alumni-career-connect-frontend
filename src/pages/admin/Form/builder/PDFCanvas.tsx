import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Input, Tooltip, message } from "antd";
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
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
  onSectionsChange?: (sections: Section[]) => void;
  logoUrl?: string;
  logoSize?: number;
  initialValues?: Record<string, any>;
  onSubmit?: (answers: Record<string, any>) => void;
}

// ─── Rich text renderer ──────────────────────────────────────────────────────

function renderRichText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^# (.+)$/gm, '<strong style="font-size:1.15em;display:block;margin-bottom:4px">$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\n/g, "<br/>");
}

function RichTextDisplay({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderRichText(text) }}
      style={{ lineHeight: 1.7, ...style }}
    />
  );
}

// ─── Rich text toolbar + textarea ────────────────────────────────────────────

function RichTextEditor({
  value,
  onChange,
  placeholder,
  style,
  textareaStyle,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (tag: string) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.substring(s, e);
    const map: Record<string, [string, string]> = {
      bold: ["**", "**"],
      italic: ["*", "*"],
      underline: ["__", "__"],
      heading: ["# ", ""],
    };
    const [open, close] = map[tag] ?? ["", ""];
    const next = value.substring(0, s) + open + sel + close + value.substring(e);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(s + open.length, e + open.length);
    }, 0);
  };

  const iconBtn = (label: string, tag: string, icon: React.ReactNode) => (
    <Tooltip title={label}>
      <button
        type="button"
        onMouseDown={(ev) => { ev.preventDefault(); wrap(tag); }}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: "3px 7px",
          borderRadius: 4,
          fontSize: 13,
          color: "#374151",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {icon}
      </button>
    </Tooltip>
  );

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden", ...style }}>
      <div style={{ display: "flex", gap: 2, padding: "5px 8px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" }}>
        {iconBtn("In đậm (**text**)", "bold", <b>B</b>)}
        {iconBtn("In nghiêng (*text*)", "italic", <i>I</i>)}
        {iconBtn("Gạch chân (__text__)", "underline", <u>U</u>)}
        {iconBtn("Tiêu đề (# text)", "heading", <span style={{ fontWeight: 700, fontSize: 11 }}>H1</span>)}
        <span style={{ marginLeft: 6, fontSize: 10.5, color: "#9ca3af", alignSelf: "center" }}>
          **đậm** *nghiêng* __gạch__ # tiêu đề
        </span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          resize: "vertical",
          padding: "10px 12px",
          fontFamily: "inherit",
          fontSize: 13.5,
          background: "#fff",
          boxSizing: "border-box",
          minHeight: 72,
          ...textareaStyle,
        }}
      />
      {value && (
        <div style={{ padding: "8px 12px", borderTop: "1px solid #f0f2f5", background: "#fafafa", fontSize: 12.5, color: "#374151" }}>
          <span style={{ color: "#9ca3af", fontSize: 11, display: "block", marginBottom: 4 }}>Xem trước:</span>
          <RichTextDisplay text={value} />
        </div>
      )}
    </div>
  );
}

// ─── Logo Upload ──────────────────────────────────────────────────────────────

function LogoUpload({
  src,
  size,
  editable,
  onUpload,
}: {
  src: string;
  size: number;
  editable: boolean;
  onUpload?: (dataUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ chấp nhận file ảnh");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      message.error("File quá lớn (tối đa 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onUpload?.(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
      onMouseEnter={() => editable && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={src || "/public/logovua.png"}
        alt="Logo"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: "50%",
          border: hover ? "2px dashed #6b7280" : "1px solid #e2e8f0",
          transition: "all .2s",
          display: "block",
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png";
        }}
      />
      {editable && hover && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(0,0,0,.45)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            gap: 4,
          }}
        >
          <UploadOutlined style={{ color: "#fff", fontSize: 18 }} />
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>Đổi logo</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Inline editable input ────────────────────────────────────────────────────

function InlineInput({
  value,
  onChange,
  style,
  multiline,
  placeholder,
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
    <Input.TextArea
      rows={2}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, display: "block" }}
    />
  ) : (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={base}
    />
  );
}

// ─── Section Manager (embedded in PDFCanvas header area) ─────────────────────

function SectionManager({
  sections,
  accent,
  onSectionsChange,
}: {
  sections: Section[];
  accent: string;
  onSectionsChange: (s: Section[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const addSection = () => {
    const id = `section_${Date.now()}`;
    const next: Section[] = [
      ...sections,
      { id, title: `Phần ${sections.length + 1}`, order: sections.length },
    ];
    onSectionsChange(next);
    setEditingId(id);
    setEditVal(`Phần ${sections.length + 1}`);
  };

  const startEdit = (s: Section) => {
    setEditingId(s.id);
    setEditVal(s.title);
  };

  const commitEdit = (id: string) => {
    onSectionsChange(sections.map((s) => (s.id === id ? { ...s, title: editVal.trim() || s.title } : s)));
    setEditingId(null);
  };

  const removeSection = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  return (
    <div style={{ padding: "10px 0 4px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
        Các phần (Sections)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sections.map((s, idx) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 7,
              border: `1px solid ${editingId === s.id ? accent : "#e5e7eb"}`,
              background: editingId === s.id ? `${accent}08` : "#fafafa",
            }}
          >
            <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 18 }}>{idx + 1}.</span>
            {editingId === s.id ? (
              <input
                autoFocus
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit(s.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  fontFamily: "inherit",
                  color: "#111827",
                }}
              />
            ) : (
              <span style={{ flex: 1, fontSize: 13, color: "#111827", fontWeight: 500 }}>{s.title}</span>
            )}
            {editingId === s.id ? (
              <>
                <button onClick={() => commitEdit(s.id)} style={iconBtnStyle(accent)}>
                  <CheckOutlined />
                </button>
                <button onClick={() => setEditingId(null)} style={iconBtnStyle()}>
                  <CloseOutlined />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(s)} style={iconBtnStyle()}>
                  <EditOutlined />
                </button>
                <button
                  onClick={() => removeSection(s.id)}
                  style={{ ...iconBtnStyle(), color: "#dc2626" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <DeleteOutlined />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addSection}
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          border: `1.5px dashed ${accent}60`,
          borderRadius: 7,
          background: "transparent",
          color: accent,
          cursor: "pointer",
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: "inherit",
          width: "100%",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}10`)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <PlusOutlined /> Thêm phần mới
      </button>
    </div>
  );
}

function iconBtnStyle(color?: string): React.CSSProperties {
  return {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "3px 6px",
    borderRadius: 5,
    fontSize: 13,
    color: color ?? "#6b7280",
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "inherit",
  };
}

// ─── Footer Editor (inline in PDFCanvas) ─────────────────────────────────────

function FooterInline({
  footer,
  editable,
  onFooterChange,
  accent,
}: {
  footer: SurveyFooter;
  editable: boolean;
  onFooterChange?: (f: SurveyFooter) => void;
  accent: string;
}) {
  if (!editable) {
    return (
      <div style={{ textAlign: "center" }}>
        {footer?.primaryText && (
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, color: "#000" }}>
            <RichTextDisplay text={footer.primaryText} />
          </div>
        )}
        {footer?.secondaryText && (
          <div style={{ fontStyle: "italic", color: "#333", fontSize: 13.5 }}>
            <RichTextDisplay text={footer.secondaryText} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
          Dòng cảm ơn (in đậm)
        </div>
        <RichTextEditor
          value={footer?.primaryText ?? ""}
          onChange={(v) => onFooterChange?.({ ...footer, primaryText: v })}
          placeholder="Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!"
        />
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
          Lời chúc (in nghiêng)
        </div>
        <RichTextEditor
          value={footer?.secondaryText ?? ""}
          onChange={(v) => onFooterChange?.({ ...footer, secondaryText: v })}
          placeholder="Kính chúc Anh/Chị sức khỏe và thành công!"
        />
      </div>
    </div>
  );
}

// ─── Question input styles ────────────────────────────────────────────────────

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

// ─── Main PDFCanvas ───────────────────────────────────────────────────────────

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
  onSectionsChange,
  logoUrl,
  logoSize = 200,
  initialValues = {},
  onSubmit,
}: PDFCanvasProps) {
  // Init state từ initialValues nếu có
  const [radios, setRadios] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    questions.forEach(q => {
      if ((q.type === 'radio' || q.type === 'multiple-choice') && initialValues[q.id] != null) {
        init[q.id] = initialValues[q.id];
      }
    });
    return init;
  });
  const [cbs, setCbs] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    questions.forEach(q => {
      if (q.type === 'checkbox' && initialValues[q.id] != null) {
        const vals = Array.isArray(initialValues[q.id]) ? initialValues[q.id] : [initialValues[q.id]];
        init[q.id] = Object.fromEntries(vals.map((v: string) => [v, true]));
      }
    });
    return init;
  });
  const [textVals, setTextVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    questions.forEach(q => {
      if (!['radio', 'multiple-choice', 'checkbox'].includes(q.type) && initialValues[q.id] != null) {
        init[q.id] = String(initialValues[q.id]);
      }
    });
    return init;
  });
  const [done, setDone] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isSmall = containerWidth === 0 || containerWidth < 480;
  const isMedium = containerWidth >= 480 && containerWidth < 640;
  const isMobile = isSmall || isMedium;

  const px = isSmall ? 16 : isMedium ? 20 : 36;
  const effectiveLogoSize = isSmall ? 72 : isMedium ? 88 : logoSize;

  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const editable = headerOnly && !!onHeaderChange;

  const updateHeader = (key: keyof SurveyHeader, value: any) => {
    if (onHeaderChange) onHeaderChange({ ...header, [key]: value });
  };

  const handleSubmit = () => {
    // Gom toàn bộ answers lại
    const allAnswers: Record<string, any> = { ...textVals };
    Object.entries(radios).forEach(([k, v]) => { allAnswers[k] = v; });
    Object.entries(cbs).forEach(([k, v]) => {
      allAnswers[k] = Object.entries(v).filter(([, checked]) => checked).map(([val]) => val);
    });
    if (onSubmit) {
      onSubmit(allAnswers);
    } else {
      setDone(true);
    }
  };

  if (done && interactive) {
    return (
      <div style={{ background: "#fff", textAlign: "center", padding: "60px 20px", fontFamily: "'Times New Roman', serif" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: accent + "20", color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Phản hồi đã được ghi lại!</div>
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Cảm ơn bạn đã tham gia khảo sát.</div>
        <Button onClick={() => { setDone(false); setRadios({}); setCbs({}); setTextVals({}); }} style={{ background: accent }} type="primary">Xem lại</Button>
      </div>
    );
  }

  const questionsBySection = sections
    .map((section) => ({
      ...section,
      questions: questions.filter((q) => q.sectionId === section.id).sort((a, b) => a.order - b.order),
    }))
    .filter((sec) => sec.questions.length > 0);

  // questions not belonging to any section
  const unsectionedQuestions = questions.filter((q) => !sections.find((s) => s.id === q.sectionId));

  let globalIndex = 0;

  const renderQuestion = (q: Question) => {
    globalIndex++;
    const idx = globalIndex;
    return (
      <div key={q.id} style={{ padding: `14px ${px}px 16px`, borderBottom: "none" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#000000", marginBottom: 12, lineHeight: 1.5, fontFamily: "'Times New Roman', Georgia, serif" }}>
          {idx}. <RichTextDisplay text={q.title} style={{ display: "inline" }} />
          {q.required && <span style={{ color: "#c53030", marginLeft: 4 }}>*</span>}
        </div>

        {(q.type === "short" || q.type === "text") && (
          <input type="text" placeholder={q.placeholder || "Câu trả lời của bạn"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={q.required} disabled={!interactive} style={underlineInputStyle} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#cbd5e1")} />
        )}
        {q.type === "long" && (
          <textarea placeholder={q.placeholder || "Câu trả lời của bạn"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={q.required} disabled={!interactive} style={underlineTextareaStyle} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#cbd5e1")} />
        )}
        {q.type === "email" && (
          <input type="email" placeholder={q.placeholder || "Nhập email"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={q.required} disabled={!interactive} style={underlineInputStyle} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#cbd5e1")} />
        )}
        {q.type === "tel" && (
          <input type="tel" placeholder={q.placeholder || "Nhập số điện thoại"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={q.required} disabled={!interactive} style={underlineInputStyle} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#cbd5e1")} />
        )}
        {q.type === "date" && (
          <input type="date" value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={q.required} disabled={!interactive} style={{ ...underlineInputStyle, width: "auto", minWidth: 200 }} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#cbd5e1")} />
        )}
        {q.type === "address" && (
          <AddressInput value={textVals[q.id] || ""} onChange={(v) => setTextVals((t) => ({ ...t, [q.id]: v }))} />
        )}
        {(q.type === "radio" || q.type === "multiple-choice") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(q.options ?? []).map((opt) => {
              const val = typeof opt === "string" ? opt : (opt as any).label;
              const key = typeof opt === "string" ? opt : (opt as any).id ?? val;
              const selected = radios[q.id] === val;
              return (
                <div key={key} onClick={() => interactive && setRadios((v) => ({ ...v, [q.id]: val }))} style={radioCheckboxBaseStyle}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? accent : "#94a3b8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#fff" }}>
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
            {(q.options ?? []).map((opt) => {
              const val = typeof opt === "string" ? opt : (opt as any).label;
              const key = typeof opt === "string" ? opt : (opt as any).id ?? val;
              const checked = cbs[q.id]?.[val] || false;
              return (
                <div key={key} onClick={() => interactive && setCbs((v) => ({ ...v, [q.id]: { ...(v[q.id] || {}), [val]: !checked } }))} style={radioCheckboxBaseStyle}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? accent : "#94a3b8"}`, background: checked ? accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: "bold", color: "#fff" }}>
                    {checked && "✓"}
                  </div>
                  <span>{val}</span>
                </div>
              );
            })}
          </div>
        )}
        {q.type === "select" && (
          <select value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={q.required} disabled={!interactive} style={{ ...underlineInputStyle, appearance: "auto", cursor: interactive ? "pointer" : "default" }} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#cbd5e1")}>
            <option value="" disabled>Chọn một phương án</option>
            {q.options?.map((opt) => <option key={opt as any} value={opt as any}>{opt as any}</option>)}
          </select>
        )}
      </div>
    );
  };

  const currentLogoSrc = logoUrl || header.logoUrl || "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png";

  return (
    <div ref={containerRef} style={{ background: "#fff", fontFamily: "'Times New Roman', Georgia, serif", color: "#000000", width: "100%", boxSizing: "border-box", minWidth: 0 }}>
      {/* Accent stripe */}
      {/* <div style={{ height: 6, background: accent }} /> */}

      {/* Date */}
      {header.showDate !== false && (
        <div style={{ textAlign: "right", fontSize: isSmall ? 12 : 14, fontStyle: "italic", color: "#000", padding: `${isSmall ? 12 : 16}px ${px}px 8px` }}>
          Ngày {today.replace(/\//g, " / ")}
        </div>
      )}

      {/* Logo + org info */}
      <div style={{ padding: `20px ${px}px 24px`, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 14 : 24 }}>
        <LogoUpload
          src={currentLogoSrc}
          size={effectiveLogoSize}
          editable={editable}
          onUpload={(dataUrl) => updateHeader("logoUrl", dataUrl)}
        />

        <div style={{ flex: 1, minWidth: 0, width: isMobile ? "100%" : undefined }}>
          {editable ? (
            <>
              <InlineInput value={header.ministry || ""} onChange={(v) => updateHeader("ministry", v)} placeholder="Bộ/ngành" style={{ fontSize: isSmall ? 11 : 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", textAlign: isMobile ? "center" : "right", color: "#000000" }} />
              <InlineInput value={header.academy || ""} onChange={(v) => updateHeader("academy", v)} placeholder="Học viện / Trường" style={{ fontSize: isSmall ? 13 : 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", margin: "6px 0", textAlign: isMobile ? "center" : "right", color: "#000000" }} />
              <InlineInput value={header.address || ""} onChange={(v) => updateHeader("address", v)} placeholder="Địa chỉ" style={{ fontSize: isSmall ? 11 : 13, textAlign: isMobile ? "center" : "right", color: "#000000" }} />
              <InlineInput value={header.phone || ""} onChange={(v) => updateHeader("phone", v)} placeholder="Điện thoại" style={{ fontSize: isSmall ? 11 : 13, textAlign: isMobile ? "center" : "right", color: "#000000" }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: isSmall ? 11 : 13, fontWeight: 600, color: "#000000", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: isMobile ? "center" : "right", wordBreak: "break-word" }}>{header.ministry}</div>
              <div style={{ fontSize: isSmall ? 13 : 18, fontWeight: 800, color: "#000000", textTransform: "uppercase", letterSpacing: "0.5px", margin: "6px 0", textAlign: isMobile ? "center" : "right", wordBreak: "break-word" }}>{header.academy}</div>
              <div style={{ fontSize: isSmall ? 11 : 13, color: "#000000", lineHeight: 1.5, textAlign: isMobile ? "center" : "right", wordBreak: "break-word" }}>
                {header.address}
                {header.phone && (<><br />{header.phone}{header.fax && ` — Fax: ${header.fax}`}</>)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section manager (only in edit mode) */}
      {editable && onSectionsChange && (
        <div style={{ padding: `0 ${px}px 16px` }}>
          <SectionManager sections={sections} accent={accent} onSectionsChange={onSectionsChange} />
        </div>
      )}

      {/* Title */}
      <div style={{ textAlign: "center", padding: `${isSmall ? 20 : 30}px ${px}px ${isSmall ? 14 : 18}px` }}>
        {editable && onTitleChange ? (
          <InlineInput value={surveyTitle} onChange={onTitleChange} placeholder="TÊN FORM KHẢO SÁT" style={{ fontSize: 20, fontWeight: 800, textAlign: "center", textTransform: "uppercase", letterSpacing: "1px", color: "#000000" }} />
        ) : (
          <h2 style={{ margin: 0, fontSize: isSmall ? 15 : isMedium ? 17 : 20, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#000000", wordBreak: "break-word" }}>
            {surveyTitle || "TÊN FORM KHẢO SÁT"}
          </h2>
        )}
      </div>

      {/* Description with rich text */}
      {(descriptionParagraphs.length > 0 || (editable && onDescriptionParagraphsChange)) && (
        <div style={{ padding: `0 ${px}px 24px` }}>
          {editable && onDescriptionParagraphsChange ? (
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Mô tả (hỗ trợ **đậm** *nghiêng* __gạch__ # tiêu đề)</div>
              <RichTextEditor
                value={descriptionParagraphs.join("\n\n")}
                onChange={(val) => onDescriptionParagraphsChange(val.split(/\n\s*\n/).filter(Boolean))}
                placeholder="Nhập mô tả form..."
              />
            </div>
          ) : (
            descriptionParagraphs.map((para, idx) => (
              <div key={idx} style={{ marginBottom: idx === descriptionParagraphs.length - 1 ? 0 : 14 }}>
                <div style={{ fontSize: 14, fontStyle: "italic", color: "#000000", lineHeight: 1.7, textAlign: "justify" }}>
                  <RichTextDisplay text={para} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Questions */}
      {!headerOnly && (
        <>
          {questionsBySection.length === 0 && unsectionedQuestions.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", color: "#9ca3af", fontStyle: "italic", fontSize: 14 }}>
              Chưa có câu hỏi nào
            </div>
          ) : (
            <>
              {questionsBySection.map((section) => (
                <div key={section.id}>
                  <div style={{ fontWeight: 700, color: "#000000", margin: 0, fontSize: isSmall ? 14 : 17, padding: `${isSmall ? 16 : 22}px ${px}px 8px` }}>
                    {section.title}
                  </div>
                  {section.questions.map((q) => renderQuestion(q))}
                </div>
              ))}
              {unsectionedQuestions.map((q) => renderQuestion(q))}
            </>
          )}

          {questions.length > 0 && interactive && (
            <div style={{ padding: `18px ${px}px`, display: "flex", gap: 12, alignItems: "center" }}>
              <Button type="primary" style={{ background: accent, borderColor: accent }} onClick={handleSubmit}>Gửi</Button>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: `28px ${px}px 40px` }}>
            <FooterInline footer={footer ?? {}} editable={editable} onFooterChange={onFooterChange} accent={accent} />
          </div>
        </>
      )}

      {/* Footer in header-only mode (editable) */}
      {headerOnly && editable && onFooterChange && (
        <div style={{ padding: `0 ${px}px 28px` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10 }}>
            Chân trang (Footer)
          </div>
          <FooterInline footer={footer ?? {}} editable={true} onFooterChange={onFooterChange} accent={accent} />
        </div>
      )}
    </div>
  );
}