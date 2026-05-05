import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Input, Tooltip, message } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { Question, Section, SurveyFooter, SurveyHeader } from "../../../../feature/form/types";
import { AddressInput } from "./AddressInput";
import { RichTextEditor } from "./RichTextEditor";

interface LogicRule {
  id: string;
  sourceQuestionId: string;
  operator: "equals" | "not_equals" | "contains";
  value: string;
  action: "show" | "hide" | "skip" | "require";
  targetQuestionId: string;
}

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
  submitLabel?: string;
  logicRules?: LogicRule[];
}

function RichTextDisplay({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span
      style={style}
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>"),
      }}
    />
  );
}

interface FloatingEditPopupProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
  width?: number;
}

function FloatingEditPopup({
  open,
  anchorEl,
  onClose,
  title,
  icon,
  accent,
  children,
  width = 340,
}: FloatingEditPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  const calcPos = useCallback(() => {
    if (!anchorEl || !popupRef.current) return;
    const anchor = anchorEl.getBoundingClientRect();
    const popup = popupRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = anchor.bottom + 8;
    let left = anchor.left + anchor.width / 2 - width / 2;

    left = Math.max(12, Math.min(left, vw - width - 12));

    if (top + popup.height > vh - 12) top = anchor.top - popup.height - 8;
    top = Math.max(12, top);

    setPos({ top, left });
    setVisible(true);
  }, [anchorEl, width]);

  useEffect(() => {
    if (!open) { setVisible(false); return; }
    const t = setTimeout(calcPos, 10);
    return () => clearTimeout(t);
  }, [open, calcPos]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", calcPos);
    return () => window.removeEventListener("resize", calcPos);
  }, [open, calcPos]);

  useEffect(() => {
    if (!open) return;
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

    const t = setTimeout(() => document.addEventListener("mousedown", handler), 80);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, anchorEl, onClose]);

  if (!open) return null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width,
        zIndex: 1200,
        background: "#fff",
        borderRadius: 14,
        boxShadow: `
          0 0 0 1px rgba(0,0,0,.07),
          0 8px 32px rgba(0,0,0,.13),
          0 4px 10px ${accent}18
        `,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(.96) translateY(-8px)",
        transition: "opacity .18s cubic-bezier(.16,1,.3,1), transform .18s cubic-bezier(.16,1,.3,1)",
        overflow: "hidden",
      }}
    >
      {}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px 9px",
          borderBottom: "1px solid #f0f2f5",
          background: `linear-gradient(135deg, ${accent}0a, transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: `${accent}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
            }}
          >
            {icon}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", letterSpacing: "-.01em" }}>
            {title}
          </span>
        </div>
        <button
          onClick={onClose}
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
            fontSize: 11,
            transition: "all .12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <CloseOutlined />
        </button>
      </div>

      {}
      <div style={{ padding: "14px 14px 16px", maxHeight: "65vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

interface ClickToEditBlockProps {
  accent: string;
  label: string;
  hint?: string;
  isEmpty?: boolean;
  emptyLabel?: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ClickToEditBlock({
  accent,
  label,
  hint,
  isEmpty,
  emptyLabel = "Nhấn để thêm nội dung",
  onClick,
  children,
}: ClickToEditBlockProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 10,
        border: hover
          ? `1.5px dashed ${accent}70`
          : "1.5px dashed transparent",
        padding: hover ? "10px 14px" : "10px 14px",
        transition: "border-color .15s, background .15s",
        background: hover ? `${accent}05` : "transparent",
        margin: "-10px -14px",
      }}
    >
      {isEmpty ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#94a3b8",
            fontSize: 13,
            fontStyle: "italic",
            padding: "8px 0",
          }}
        >
          <span style={{ fontSize: 16 }}></span>
          {emptyLabel}
        </div>
      ) : (
        children
      )}

      {}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: -1,
            right: -1,
            background: accent,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".04em",
            padding: "3px 9px",
            borderRadius: "0 9px 0 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            pointerEvents: "none",
          }}
        >
          ✏ {label}
        </div>
      )}
    </div>
  );
}

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
    if (!file.type.startsWith("image/")) { message.error("Chỉ chấp nhận file ảnh"); return; }
    if (file.size > 2 * 1024 * 1024) { message.error("File quá lớn (tối đa 2MB)"); return; }
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
        style={{ width: size, height: size, objectFit: "contain", borderRadius: "50%", border: hover ? "2px dashed #6b7280" : "1px solid #e2e8f0", transition: "all .2s", display: "block" }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png"; }}
      />
      {editable && hover && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 4 }}
        >
          <UploadOutlined style={{ color: "#fff", fontSize: 18 }} />
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>Đổi logo</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

function InlineInput({ value, onChange, style, multiline, placeholder }: {
  value: string; onChange: (v: string) => void; style?: React.CSSProperties; multiline?: boolean; placeholder?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = { background: "transparent", border: "none", outline: "none", borderBottom: hover ? "1.5px dashed #ccc" : "1.5px solid transparent", width: "100%", fontFamily: "inherit", resize: "none", cursor: "text", transition: "border-color .15s", ...style };
  return multiline ? (
    <Input.TextArea rows={2} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ ...base, display: "block" }} />
  ) : (
    <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={base} />
  );
}

function SectionManager({ sections, accent, onSectionsChange }: { sections: Section[]; accent: string; onSectionsChange: (s: Section[]) => void; }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const addSection = () => {
    const id = `section_${Date.now()}`;
    const next: Section[] = [...sections, { id, title: `Phần ${sections.length + 1}`, order: sections.length }];
    onSectionsChange(next);
    setEditingId(id);
    setEditVal(`Phần ${sections.length + 1}`);
  };
  const startEdit = (s: Section) => { setEditingId(s.id); setEditVal(s.title); };
  const commitEdit = (id: string) => { onSectionsChange(sections.map((s) => (s.id === id ? { ...s, title: editVal.trim() || s.title } : s))); setEditingId(null); };
  const removeSection = (id: string) => { onSectionsChange(sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i }))); };

  return (
    <div style={{ padding: "10px 0 4px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Các phần (Sections)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sections.map((s, idx) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 7, border: `1px solid ${editingId === s.id ? accent : "#e5e7eb"}`, background: editingId === s.id ? `${accent}08` : "#fafafa" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 18 }}>{idx + 1}.</span>
            {editingId === s.id ? (
              <input autoFocus value={editVal} onChange={(e) => setEditVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commitEdit(s.id); if (e.key === "Escape") setEditingId(null); }} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, fontFamily: "inherit", color: "#111827" }} />
            ) : (
              <span style={{ flex: 1, fontSize: 13, color: "#111827", fontWeight: 500 }}>{s.title}</span>
            )}
            {editingId === s.id ? (
              <>
                <button onClick={() => commitEdit(s.id)} style={ibs(accent)}><CheckOutlined /></button>
                <button onClick={() => setEditingId(null)} style={ibs()}><CloseOutlined /></button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(s)} style={ibs()}><EditOutlined /></button>
                <button onClick={() => removeSection(s.id)} style={{ ...ibs(), color: "#dc2626" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}><DeleteOutlined /></button>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={addSection} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1.5px dashed ${accent}60`, borderRadius: 7, background: "transparent", color: accent, cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "inherit", width: "100%", justifyContent: "center" }} onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}10`)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        <PlusOutlined /> Thêm phần mới
      </button>
    </div>
  );
}

function ibs(color?: string): React.CSSProperties {
  return { border: "none", background: "transparent", cursor: "pointer", padding: "3px 6px", borderRadius: 5, fontSize: 13, color: color ?? "#6b7280", display: "inline-flex", alignItems: "center", fontFamily: "inherit" };
}

const underlineInputStyle: React.CSSProperties = { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1e293b", transition: "border-color 0.2s, box-shadow 0.2s" };
const underlineTextareaStyle: React.CSSProperties = { ...underlineInputStyle, resize: "vertical", minHeight: "96px", lineHeight: 1.65 };
const radioCheckboxBaseStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", fontSize: 14, color: "#334155", cursor: "pointer", fontFamily: "inherit", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", transition: "all 0.15s" };

export function PDFCanvas({
  surveyTitle,
  descriptionParagraphs = [],
  sections = [],
  questions,
  accent,
  header = { ministry: "Bộ Giáo dục và Đào tạo", academy: "", address: "", phone: "", fax: "", showDate: true },
  footer,
  interactive = true,
  headerOnly = false,
  onHeaderChange,
  onFooterChange,
  onTitleChange,
  onDescriptionParagraphsChange,
  onSectionsChange,
  logoUrl,
  logoSize = 120,
  initialValues = {},
  onSubmit,
  submitLabel = "Gửi",
  logicRules = [],
}: PDFCanvasProps) {
  const [radios, setRadios] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    questions.forEach((q) => { if ((q.type === "radio" || q.type === "multiple-choice") && initialValues[q.id] != null) init[q.id] = initialValues[q.id]; });
    return init;
  });
  const [cbs, setCbs] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    questions.forEach((q) => { if (q.type === "checkbox" && initialValues[q.id] != null) { const vals = Array.isArray(initialValues[q.id]) ? initialValues[q.id] : [initialValues[q.id]]; init[q.id] = Object.fromEntries(vals.map((v: string) => [v, true])); } });
    return init;
  });
  const [textVals, setTextVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    questions.forEach((q) => { if (!["radio", "multiple-choice", "checkbox"].includes(q.type) && initialValues[q.id] != null) init[q.id] = String(initialValues[q.id]); });
    return init;
  });
  const [done, setDone] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [descPopupOpen, setDescPopupOpen] = useState(false);
  const [footerPopupOpen, setFooterPopupOpen] = useState(false);
  const descBlockRef = useRef<HTMLDivElement>(null);
  const footerBlockRef = useRef<HTMLDivElement>(null);

  const [descDraft, setDescDraft] = useState(descriptionParagraphs.join("\n\n"));
  const [footerPrimaryDraft, setFooterPrimaryDraft] = useState(footer?.primaryText ?? "");
  const [footerSecondaryDraft, setFooterSecondaryDraft] = useState(footer?.secondaryText ?? "");

  useEffect(() => { setDescDraft(descriptionParagraphs.join("\n\n")); }, [descriptionParagraphs.join("\n\n")]);
  useEffect(() => { setFooterPrimaryDraft(footer?.primaryText ?? ""); setFooterSecondaryDraft(footer?.secondaryText ?? ""); }, [footer?.primaryText, footer?.secondaryText]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => { for (const entry of entries) setContainerWidth(entry.contentRect.width); });
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
  const updateHeader = (key: keyof SurveyHeader, value: any) => { if (onHeaderChange) onHeaderChange({ ...header, [key]: value }); };

  const handleSubmit = () => {
    const allAnswers: Record<string, any> = { ...textVals };
    Object.entries(radios).forEach(([k, v]) => { allAnswers[k] = v; });
    Object.entries(cbs).forEach(([k, v]) => { allAnswers[k] = Object.entries(v).filter(([, checked]) => checked).map(([val]) => val); });
    if (onSubmit) onSubmit(allAnswers); else setDone(true);
  };

  if (done && interactive) {
    return (
      <div style={{ background: "#f8fafc", textAlign: "center", padding: "80px 20px", fontFamily: "inherit" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Phản hồi đã được ghi lại!</div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.7 }}>Cảm ơn bạn đã tham gia khảo sát.</div>
        <button onClick={() => { setDone(false); setRadios({}); setCbs({}); setTextVals({}); }} style={{ padding: "10px 28px", background: accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Xem lại</button>
      </div>
    );
  }

  const questionsBySection = sections.map((section) => ({ ...section, questions: questions.filter((q) => q.sectionId === section.id).sort((a, b) => a.order - b.order) })).filter((sec) => sec.questions.length > 0);
  const unsectionedQuestions = questions.filter((q) => !sections.find((s) => s.id === q.sectionId));

  const hiddenQuestionIds = new Set<string>();
  const requiredOverrides = new Set<string>();

  if (interactive && logicRules.length > 0) {

    const getAnswer = (qId: string, qType: string) => {
      if (qType === "radio" || qType === "multiple-choice") return radios[qId] ?? "";
      if (qType === "checkbox")
        return Object.entries(cbs[qId] ?? {}).filter(([, c]) => c).map(([v]) => v).join(",");
      return textVals[qId] ?? "";
    };

    const checkCondition = (rule: LogicRule) => {
      const srcQ = questions.find((q) => q.id === rule.sourceQuestionId);
      if (!srcQ) return false;
      const ans = getAnswer(rule.sourceQuestionId, srcQ.type);
      switch (rule.operator) {
        case "equals": return ans === rule.value;
        case "not_equals": return ans !== rule.value;
        case "contains": return ans.includes(rule.value);
        default: return false;
      }
    };

    for (const rule of logicRules) {
      if (rule.action === "show") hiddenQuestionIds.add(rule.targetQuestionId);
    }

    for (const rule of logicRules) {
      if (!checkCondition(rule)) continue;
      switch (rule.action) {
        case "hide": hiddenQuestionIds.add(rule.targetQuestionId); break;
        case "show": hiddenQuestionIds.delete(rule.targetQuestionId); break;
        case "require": requiredOverrides.add(rule.targetQuestionId); break;
        case "skip": {
          const srcIdx = questions.findIndex(q => q.id === rule.sourceQuestionId);
          const tgtIdx = questions.findIndex(q => q.id === rule.targetQuestionId);
          if (srcIdx !== -1 && tgtIdx !== -1 && tgtIdx > srcIdx) {
            for (let i = srcIdx + 1; i < tgtIdx; i++) {
              hiddenQuestionIds.add(questions[i].id);
            }
          }
          break;
        }
      }
    }
  }

  let globalIndex = 0;

  const renderQuestion = (q: Question) => {
    const isRequired = q.required || requiredOverrides.has(q.id);
    globalIndex++;
    const idx = globalIndex;
    return (
      <div key={q.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: `${isSmall ? 16 : 20}px ${isSmall ? 16 : 22}px`, transition: "box-shadow .15s" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14, lineHeight: 1.5, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ width: 24, height: 24, borderRadius: 6, background: accent + "18", color: accent, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{idx}</span>
          <span style={{ flex: 1 }}>
            <RichTextDisplay text={q.title} style={{ display: "inline" }} />
            {isRequired && <span style={{ color: "#ef4444" }}>*</span>}
          </span>
        </div>
        {(q.type === "short" || q.type === "text") && (<input type="text" placeholder={q.placeholder || "Câu trả lời của bạn"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={isRequired} disabled={!interactive} style={underlineInputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }} />)}
        {q.type === "long" && (<textarea placeholder={q.placeholder || "Câu trả lời của bạn"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={isRequired} disabled={!interactive} style={underlineTextareaStyle} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }} />)}
        {q.type === "email" && (<input type="email" placeholder={q.placeholder || "Nhập email"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={isRequired} disabled={!interactive} style={underlineInputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }} />)}
        {q.type === "tel" && (<input type="tel" placeholder={q.placeholder || "Nhập số điện thoại"} value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={isRequired} disabled={!interactive} style={underlineInputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }} />)}
        {q.type === "date" && (<input type="date" value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={isRequired} disabled={!interactive} style={{ ...underlineInputStyle, width: "auto", minWidth: 200 }} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }} />)}
        {q.type === "address" && (<AddressInput value={textVals[q.id] || ""} onChange={(v) => setTextVals((t) => ({ ...t, [q.id]: v }))} />)}
        {(q.type === "radio" || q.type === "multiple-choice") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(q.options ?? []).map((opt) => {
              const val = typeof opt === "string" ? opt : (opt as any).label;
              const key = typeof opt === "string" ? opt : (opt as any).id ?? val;
              const selected = radios[q.id] === val;
              return (<div key={key} onClick={() => interactive && setRadios((v) => ({ ...v, [q.id]: val }))} style={{ ...radioCheckboxBaseStyle, background: selected ? `${accent}0d` : "#fff", borderColor: selected ? accent : "#e2e8f0" }}><div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? accent : "#94a3b8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#fff" }}>{selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />}</div><span style={{ color: selected ? "#0f172a" : "#334155" }}>{val}</span></div>);
            })}
          </div>
        )}
        {q.type === "checkbox" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(q.options ?? []).map((opt) => {
              const val = typeof opt === "string" ? opt : (opt as any).label;
              const key = typeof opt === "string" ? opt : (opt as any).id ?? val;
              const checked = cbs[q.id]?.[val] || false;
              return (<div key={key} onClick={() => interactive && setCbs((v) => ({ ...v, [q.id]: { ...(v[q.id] || {}), [val]: !checked } }))} style={{ ...radioCheckboxBaseStyle, background: checked ? `${accent}0d` : "#fff", borderColor: checked ? accent : "#e2e8f0" }}><div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? accent : "#94a3b8"}`, background: checked ? accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#fff" }}>{checked && "✓"}</div><span style={{ color: checked ? "#0f172a" : "#334155" }}>{val}</span></div>);
            })}
          </div>
        )}
        {q.type === "select" && (
          <select value={textVals[q.id] || ""} onChange={(e) => setTextVals((v) => ({ ...v, [q.id]: e.target.value }))} required={isRequired} disabled={!interactive} style={{ ...underlineInputStyle, appearance: "auto", cursor: interactive ? "pointer" : "default" }} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>
            <option value="" disabled>Chọn một phương án</option>
            {q.options?.map((opt) => <option key={opt as any} value={opt as any}>{opt as any}</option>)}
          </select>
        )}
      </div>
    );
  };

  const currentLogoSrc = logoUrl || header.logoUrl || "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png";
  const descIsEmpty = descriptionParagraphs.length === 0 || descriptionParagraphs.every((p) => !p.trim());
  const footerIsEmpty = !footer?.primaryText && !footer?.secondaryText;

  return (
    <div ref={containerRef} style={{ background: "#f8fafc", fontFamily: "'Inter', 'Geist', system-ui, sans-serif", color: "#1e293b", width: "100%", boxSizing: "border-box", minWidth: 0 }}>

      {}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: `${isSmall ? 16 : 24}px ${px}px ${isSmall ? 14 : 20}px` }}>
        {header.showDate !== false && (
          <div style={{ textAlign: "right", fontSize: 12, color: "#94a3b8", marginBottom: 14, fontStyle: "italic", letterSpacing: ".01em" }}>
            Ngày {today.replace(/\//g, " tháng ")} năm {today.split("/")[2]}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 14 : 20 }}>
          <LogoUpload src={currentLogoSrc} size={effectiveLogoSize} editable={editable} onUpload={(dataUrl) => updateHeader("logoUrl", dataUrl)} />
          <div style={{ flex: 1, minWidth: 0, width: isMobile ? "100%" : undefined }}>
            {editable ? (
              <>
                <InlineInput
                  value={header.ministry || ""}
                  onChange={(v) => updateHeader("ministry", v)}
                  placeholder="Bộ/ngành"
                  style={{
                    fontSize: isSmall ? 11 : 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    textAlign: isMobile ? "center" : "right",
                    color: "#64748b",
                    lineHeight: 1.4
                  }}
                />
                <InlineInput
                  value={header.academy || ""}
                  onChange={(v) => updateHeader("academy", v)}
                  placeholder="Học viện / Trường"
                  style={{
                    fontSize: isSmall ? 14 : 16,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    margin: "4px 0",
                    textAlign: isMobile ? "center" : "right",
                    color: "#0f172a",
                    lineHeight: 1.3
                  }}
                />
                <InlineInput
                  value={header.address || ""}
                  onChange={(v) => updateHeader("address", v)}
                  placeholder="Địa chỉ"
                  style={{
                    fontSize: isSmall ? 11 : 12,
                    textAlign: isMobile ? "center" : "right",
                    color: "#64748b",
                    lineHeight: 1.5
                  }}
                />
                <InlineInput
                  value={header.phone || ""}
                  onChange={(v) => updateHeader("phone", v)}
                  placeholder="Điện thoại"
                  style={{
                    fontSize: isSmall ? 11 : 12,
                    textAlign: isMobile ? "center" : "right",
                    color: "#64748b",
                    lineHeight: 1.5
                  }}
                />
              </>
            ) : (
              <>
                <div style={{
                  fontSize: isSmall ? 11 : 12,
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: isMobile ? "center" : "right",
                  wordBreak: "break-word",
                  lineHeight: 1.4
                }}>
                  {header.ministry}
                </div>
                <div style={{
                  fontSize: isSmall ? 14 : 16,
                  fontWeight: 800,
                  color: "#0f172a",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  margin: "4px 0",
                  textAlign: isMobile ? "center" : "right",
                  wordBreak: "break-word",
                  lineHeight: 1.3
                }}>
                  {header.academy}
                </div>
                <div style={{
                  fontSize: isSmall ? 11 : 12,
                  color: "#64748b",
                  lineHeight: 1.5,
                  textAlign: isMobile ? "center" : "right",
                  wordBreak: "break-word",
                  fontStyle: "italic"
                }}>
                  {header.address}
                  {header.phone && (
                    <>
                      <br />
                      {header.phone}
                      {header.fax && ` — Fax: ${header.fax}`}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {}
      {editable && onSectionsChange && (
        <div style={{ padding: `16px ${px}px`, background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <SectionManager sections={sections} accent={accent} onSectionsChange={onSectionsChange} />
        </div>
      )}

      {}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: `${isSmall ? 24 : 36}px ${px}px ${isSmall ? 20 : 28}px`, textAlign: "center" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: accent, margin: "0 auto 20px" }} />

        {}
        {editable && onTitleChange ? (
          <InlineInput value={surveyTitle} onChange={onTitleChange} placeholder="TÊN FORM KHẢO SÁT" style={{ fontSize: isSmall ? 16 : 20, fontWeight: 700, textAlign: "center", letterSpacing: "0.02em", color: "#0f172a" }} />
        ) : (
          <h2 style={{
            margin: 0,
            fontSize: isSmall ? 18 : isMedium ? 20 : 22,
            fontWeight: 800,
            letterSpacing: "0.01em",
            color: "#0f172a",
            wordBreak: "break-word"
          }}>
            {surveyTitle || "TÊN FORM KHẢO SÁT"}
          </h2>
        )}

        {}
        {(descriptionParagraphs.length > 0 || (editable && onDescriptionParagraphsChange)) && (
          <div style={{ marginTop: 16, textAlign: "left", maxWidth: 680, margin: "16px auto 0" }}>
            {editable && onDescriptionParagraphsChange ? (
              <>
                {}
                <div ref={descBlockRef}>
                  <ClickToEditBlock
                    accent={accent}
                    label="Sửa mô tả"
                    isEmpty={descIsEmpty}
                    emptyLabel="Nhấn để thêm mô tả / lời dẫn"
                    onClick={() => {
                      setDescDraft(descriptionParagraphs.join("\n\n"));
                      setDescPopupOpen(true);
                    }}
                  >
                    {descriptionParagraphs.map((para, idx) => (
                      <div key={idx} style={{ marginBottom: idx === descriptionParagraphs.length - 1 ? 0 : 12 }}>
                        <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.65, textAlign: "justify" }}>
                          <RichTextDisplay text={para} />
                        </div>
                      </div>
                    ))}
                  </ClickToEditBlock>
                </div>

                {}
                <FloatingEditPopup
                  open={descPopupOpen}
                  anchorEl={descBlockRef.current}
                  onClose={() => setDescPopupOpen(false)}
                  title="Mô tả / Lời dẫn"
                  icon="📝"
                  accent={accent}
                  width={400}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
                    Nội dung mô tả
                  </div>
                  {}
                  <RichTextEditor
                    value={descDraft}
                    onChange={setDescDraft}
                    placeholder="Nhập mô tả hoặc lời dẫn cho khảo sát..."
                    minHeight={180}
                  />
                  {}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => setDescPopupOpen(false)}
                      style={{ height: 32, padding: "0 14px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#6b7280", fontFamily: "inherit" }}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        onDescriptionParagraphsChange(descDraft.split(/\n\s*\n/).filter(Boolean));
                        setDescPopupOpen(false);
                      }}
                      style={{ height: 32, padding: "0 16px", border: "none", borderRadius: 7, background: accent, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff", fontFamily: "inherit" }}
                    >
                      ✓ Lưu
                    </button>
                  </div>
                </FloatingEditPopup>
              </>
            ) : (
              descriptionParagraphs.map((para, idx) => (
                <div key={idx} style={{ marginBottom: idx === descriptionParagraphs.length - 1 ? 0 : 12, padding: "14px 16px", background: `${accent}08`, borderLeft: `3px solid ${accent}`, borderRadius: "0 8px 8px 0" }}>
                  <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, textAlign: "justify" }}>
                    <RichTextDisplay text={para} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {}
      {!headerOnly && (
        <>
          {questionsBySection.length === 0 && unsectionedQuestions.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", color: "#94a3b8", fontSize: 14, background: "#f8fafc" }}>Chưa có câu hỏi nào</div>
          ) : (
            <div style={{ padding: `${isSmall ? 16 : 24}px ${px}px`, display: "flex", flexDirection: "column", gap: 8 }}>
              {questionsBySection.map((section, sIdx) => (
                <div key={section.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 0 12px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{sIdx + 1}</div>
                    <div style={{ fontSize: isSmall ? 14 : 16, fontWeight: 700, color: "#0f172a", flex: 1 }}>{section.title}</div>
                    <div style={{ height: 1, flex: 1, background: "#e2e8f0", maxWidth: 80 }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}> {section.questions
                    .filter((q) => !hiddenQuestionIds.has(q.id))
                    .map((q) => renderQuestion(q))}
                  </div>
                </div>
              ))}
              {unsectionedQuestions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{unsectionedQuestions
                  .filter((q) => !hiddenQuestionIds.has(q.id))
                  .map((q) => renderQuestion(q))
                }</div>
              )}
            </div>
          )}

          {questions.length > 0 && interactive && (
            <div style={{ padding: `0 ${px}px 32px`, display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={handleSubmit} style={{ padding: "11px 32px", background: accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: ".01em", transition: "opacity .15s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>{submitLabel}</button>
            </div>
          )}

          {}
          <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: `28px ${px}px 40px` }}>
            {editable && onFooterChange ? (
              <>
                <div ref={footerBlockRef}>
                  <ClickToEditBlock
                    accent={accent}
                    label="Sửa footer"
                    isEmpty={footerIsEmpty}
                    emptyLabel="Nhấn để thêm lời cảm ơn"
                    onClick={() => {
                      setFooterPrimaryDraft(footer?.primaryText ?? "");
                      setFooterSecondaryDraft(footer?.secondaryText ?? "");
                      setFooterPopupOpen(true);
                    }}
                  >
                    <div style={{ textAlign: "center", padding: "4px 0" }}>
                      {footer?.primaryText && (
                        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14, color: "#0f172a" }}>
                          <RichTextDisplay text={footer.primaryText} />
                        </div>
                      )}
                      {footer?.secondaryText && (
                        <div style={{ fontStyle: "italic", color: "#64748b", fontSize: 13.5 }}>
                          <RichTextDisplay text={footer.secondaryText} />
                        </div>
                      )}
                    </div>
                  </ClickToEditBlock>
                </div>

                {}
                <FloatingEditPopup
                  open={footerPopupOpen}
                  anchorEl={footerBlockRef.current}
                  onClose={() => setFooterPopupOpen(false)}
                  title="Chân trang (Footer)"
                  icon="🏷️"
                  accent={accent}
                  width={360}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
                        Dòng cảm ơn (in đậm)
                      </div>
                      {}
                      <RichTextEditor
                        value={footerSecondaryDraft}
                        onChange={setFooterSecondaryDraft}
                        placeholder="Kính chúc Anh/Chị sức khỏe và thành công!"
                        minHeight={100}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
                        Lời chúc (in nghiêng)
                      </div>
                      <textarea
                        value={footerSecondaryDraft}
                        onChange={(e) => setFooterSecondaryDraft(e.target.value)}
                        placeholder="Kính chúc Anh/Chị sức khỏe và thành công!"
                        rows={2}
                        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, color: "#1e293b", background: "#fafafa", boxSizing: "border-box" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = "#fff"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fafafa"; }}
                      />
                    </div>

                    {}
                    {(footerPrimaryDraft || footerSecondaryDraft) && (
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: `${accent}06`, border: `1px solid ${accent}20`, textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Xem trước</div>
                        {footerPrimaryDraft && <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 4 }}>{footerPrimaryDraft}</div>}
                        {footerSecondaryDraft && <div style={{ fontStyle: "italic", fontSize: 12.5, color: "#64748b" }}>{footerSecondaryDraft}</div>}
                      </div>
                    )}

                    {}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                      <button
                        onClick={() => setFooterPopupOpen(false)}
                        style={{ height: 32, padding: "0 14px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#6b7280", fontFamily: "inherit" }}
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          onFooterChange({ primaryText: footerPrimaryDraft, secondaryText: footerSecondaryDraft });
                          setFooterPopupOpen(false);
                        }}
                        style={{ height: 32, padding: "0 16px", border: "none", borderRadius: 7, background: accent, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff", fontFamily: "inherit" }}
                      >
                        ✓ Lưu
                      </button>
                    </div>
                  </div>
                </FloatingEditPopup>
              </>
            ) : (

              <div style={{ textAlign: "center", padding: "8px 0" }}>
                {footer?.primaryText && (<div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14, color: "#0f172a" }}><RichTextDisplay text={footer.primaryText} /></div>)}
                {footer?.secondaryText && (<div style={{ fontStyle: "italic", color: "#64748b", fontSize: 13.5 }}><RichTextDisplay text={footer.secondaryText} /></div>)}
              </div>
            )}
          </div>
        </>
      )}

      {}
      {headerOnly && editable && onFooterChange && (
        <div style={{ padding: `0 ${px}px 28px`, background: "#fff", borderTop: "1px solid #e2e8f0", marginTop: 8 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10, paddingTop: 16 }}>
            Chân trang (Footer)
          </div>
          {}
          <div ref={footerBlockRef}>
            <ClickToEditBlock
              accent={accent}
              label="Sửa footer"
              isEmpty={footerIsEmpty}
              emptyLabel="Nhấn để thêm lời cảm ơn"
              onClick={() => {
                setFooterPrimaryDraft(footer?.primaryText ?? "");
                setFooterSecondaryDraft(footer?.secondaryText ?? "");
                setFooterPopupOpen(true);
              }}
            >
              <div style={{ textAlign: "center" }}>
                {footer?.primaryText && <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", marginBottom: 4 }}><RichTextDisplay text={footer.primaryText} /></div>}
                {footer?.secondaryText && <div style={{ fontStyle: "italic", fontSize: 13, color: "#64748b" }}><RichTextDisplay text={footer.secondaryText} /></div>}
              </div>
            </ClickToEditBlock>
          </div>
          <FloatingEditPopup
            open={footerPopupOpen}
            anchorEl={footerBlockRef.current}
            onClose={() => setFooterPopupOpen(false)}
            title="Chân trang (Footer)"
            icon="🏷️"
            accent={accent}
            width={360}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Dòng cảm ơn</div>
                <textarea value={footerPrimaryDraft} onChange={(e) => setFooterPrimaryDraft(e.target.value)} placeholder="Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!" rows={2} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box", background: "#fafafa" }} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = "#fff"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fafafa"; }} />
              </div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Lời chúc</div>
                <textarea value={footerSecondaryDraft} onChange={(e) => setFooterSecondaryDraft(e.target.value)} placeholder="Kính chúc Anh/Chị sức khỏe và thành công!" rows={2} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box", background: "#fafafa" }} onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = "#fff"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fafafa"; }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setFooterPopupOpen(false)} style={{ height: 32, padding: "0 14px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#6b7280", fontFamily: "inherit" }}>Hủy</button>
                <button onClick={() => { onFooterChange({ primaryText: footerPrimaryDraft, secondaryText: footerSecondaryDraft }); setFooterPopupOpen(false); }} style={{ height: 32, padding: "0 16px", border: "none", borderRadius: 7, background: accent, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff", fontFamily: "inherit" }}>✓ Lưu</button>
              </div>
            </div>
          </FloatingEditPopup>
        </div>
      )}
    </div>
  );
}