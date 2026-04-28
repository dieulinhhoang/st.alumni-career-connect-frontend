import { useState } from "react";
import { Input, Space, Tag, Tooltip, Select } from "antd";
import {
  DragOutlined,
  PlusOutlined,
  SearchOutlined,
  ReadOutlined,
  BgColorsOutlined,
  BranchesOutlined,
  CloseOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { QUESTION_BANK, type BankQuestion } from "../../../../feature/form/api";
import type { Question } from "../../../../feature/form/types";

type PanelTab = "bank" | "theme" | "logic";
type LogicAction = "show" | "hide" | "skip" | "require";
type LogicOperator = "equals" | "not_equals" | "contains";

interface LogicRule {
  id: string;
  sourceQuestionId: string;
  operator: LogicOperator;
  value: string;
  action: LogicAction;
  targetQuestionId: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  bodyBg: string;
  font: string;
  radius: string;
  tag: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "academic", name: "Academic",  primaryColor: "#0f766e", secondaryColor: "#ccfbf1", bodyBg: "#f0fdfa", font: "'Times New Roman', Georgia, serif", radius: "4px",  tag: "Học thuật" },
  { id: "official", name: "Official",  primaryColor: "#1d4ed8", secondaryColor: "#dbeafe", bodyBg: "#eff6ff", font: "'Times New Roman', serif",              radius: "2px",  tag: "Trang trọng" },
  { id: "modern",   name: "Modern",    primaryColor: "#7c3aed", secondaryColor: "#ede9fe", bodyBg: "#faf5ff", font: "system-ui, sans-serif",                 radius: "12px", tag: "Hiện đại" },
  { id: "warm",     name: "Warm",      primaryColor: "#c2410c", secondaryColor: "#fed7aa", bodyBg: "#fff7ed", font: "'Georgia', serif",                      radius: "8px",  tag: "Ấm áp" },
  { id: "minimal",  name: "Minimal",   primaryColor: "#374151", secondaryColor: "#f3f4f6", bodyBg: "#f9fafb", font: "system-ui, sans-serif",                 radius: "6px",  tag: "Tối giản" },
  { id: "ocean",    name: "Ocean",     primaryColor: "#0369a1", secondaryColor: "#bae6fd", bodyBg: "#f0f9ff", font: "system-ui, sans-serif",                 radius: "14px", tag: "Biển xanh" },
  { id: "forest",   name: "Forest",    primaryColor: "#15803d", secondaryColor: "#bbf7d0", bodyBg: "#f0fdf4", font: "system-ui, sans-serif",                 radius: "10px", tag: "Thiên nhiên" },
  { id: "rose",     name: "Rose",      primaryColor: "#be123c", secondaryColor: "#fecdd3", bodyBg: "#fff1f2", font: "system-ui, sans-serif",                 radius: "16px", tag: "Nhẹ nhàng" },
  { id: "gold",     name: "Gold",      primaryColor: "#92400e", secondaryColor: "#fde68a", bodyBg: "#fffbeb", font: "'Georgia', serif",                      radius: "6px",  tag: "Sang trọng" },
  { id: "dark",     name: "Dark",      primaryColor: "#818cf8", secondaryColor: "#312e81", bodyBg: "#0f172a", font: "system-ui, sans-serif",                 radius: "8px",  tag: "Tối" },
];

interface RightPanelProps {
  onAddFromBank: (q: BankQuestion) => void;
  accent: string;
  onAccentChange: (color: string) => void;
  onThemeChange?: (theme: ThemePreset) => void;
  selectedThemeId?: string;
  questions?: Question[];
  open?: boolean;
  onToggle?: () => void;
  asDrawer?: boolean;
}

const PANEL_WIDTH = 310;

const Q_TYPE_LABELS: Record<string, string> = {
  radio: "Chọn một", checkbox: "Chọn nhiều", short: "Một dòng",
  long: "Đoạn văn", date: "Ngày tháng", email: "Email",
  tel: "Điện thoại", address: "Địa chỉ", select: "Thả xuống", rating: "Đánh giá",
};

const OPERATOR_LABELS: Record<LogicOperator, string> = {
  equals: "bằng", not_equals: "không bằng", contains: "chứa",
};

const ACTION_LABELS: Record<LogicAction, string> = {
  show: "Hiển thị câu", hide: "Ẩn câu", skip: "Nhảy đến câu", require: "Bắt buộc câu",
};

const ACTION_COLORS: Record<LogicAction, string> = {
  show: "#16a34a", hide: "#9ca3af", skip: "#2563eb", require: "#dc2626",
};

const PANEL_TABS: { key: PanelTab; icon: React.ReactNode; label: string }[] = [
  { key: "bank",  icon: <ReadOutlined />,     label: "Ngân hàng câu hỏi" },
  { key: "theme", icon: <BgColorsOutlined />, label: "Giao diện" },
  { key: "logic", icon: <BranchesOutlined />, label: "Logic điều kiện" },
];

// ── BankPanel ──────────────────────────────────────────────────────────────

function BankPanel({ onAddFromBank, accent, onClose }: {
  onAddFromBank: (q: BankQuestion) => void;
  accent: string;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const categories = ["Tất cả", ...new Set(QUESTION_BANK.map((q) => q.category))];
  const filtered = QUESTION_BANK.filter(
    (q) =>
      (category === "Tất cả" || q.category === category) &&
      q.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleDragStart = (e: React.DragEvent, q: BankQuestion) => {
    e.dataTransfer.setData("bank", JSON.stringify({ title: q.title, type: q.type, options: q.options }));
    e.dataTransfer.effectAllowed = "copy";
  };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 12px 6px", flexShrink: 0 }}>
        <Input placeholder="Tìm câu hỏi..." prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
      </div>
      <div style={{ padding: "0 12px 8px", flexShrink: 0, display: "flex", gap: 4, flexWrap: "nowrap", overflowX: "auto" }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: "2px 8px", borderRadius: 20, border: "1px solid", borderColor: category === c ? accent : "#e8eaed", background: category === c ? `${accent}12` : "#fff", color: category === c ? accent : "#6b7280", fontSize: 11, fontWeight: category === c ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0 }}>{c}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
        {filtered.map((bq) => (
          <div key={bq.id} draggable onDragStart={(e) => handleDragStart(e, bq)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", border: "1px solid #e8eaed", borderRadius: 8, cursor: "grab", background: "#fff", transition: "all .12s" }} onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = accent; d.style.background = `${accent}08`; }} onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = "#e8eaed"; d.style.background = "#fff"; }}>
            <span style={{ color: "#d1d5db", flexShrink: 0, fontSize: 12 }}><DragOutlined /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{bq.title}</div>
              <Space size={4}>
                <Tag style={{ fontSize: 10, lineHeight: "16px", padding: "0 5px", margin: 0 }}>{Q_TYPE_LABELS[bq.type] ?? bq.type}</Tag>
                <Tag color="cyan" style={{ fontSize: 10, lineHeight: "16px", padding: "0 5px", margin: 0 }}>{bq.category}</Tag>
              </Space>
            </div>
            <Tooltip title="Thêm vào form">
              <button onClick={() => { onAddFromBank(bq); onClose(); }} style={{ width: 26, height: 26, border: `1px solid ${accent}`, borderRadius: 6, background: `${accent}10`, color: accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}><PlusOutlined /></button>
            </Tooltip>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "24px 12px", color: "#9ca3af", fontSize: 12 }}>Không tìm thấy</div>}
      </div>
    </div>
  );
}

// ── ThemePanel — grid only ─────────────────────────────────────────────────

function ThemePanel({
  accent,
  onAccentChange,
  selectedThemeId,
  onThemeChange,
}: {
  accent: string;
  onAccentChange: (c: string) => void;
  selectedThemeId?: string;
  onThemeChange?: (theme: ThemePreset) => void;
}) {
  const [activeId, setActiveId] = useState<string>(selectedThemeId ?? THEME_PRESETS[0].id);

  const handleSelect = (theme: ThemePreset) => {
    setActiveId(theme.id);
    onAccentChange(theme.primaryColor);
    onThemeChange?.(theme);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "12px 14px 16px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>
        Chọn giao diện
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {THEME_PRESETS.map((theme) => {
          const isSel = activeId === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => handleSelect(theme)}
              style={{
                border: `2px solid ${isSel ? theme.primaryColor : "#e8e8e8"}`,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                background: "#fff",
                transition: "all .15s",
                boxShadow: isSel ? `0 0 0 3px ${theme.primaryColor}20` : "0 1px 3px rgba(0,0,0,.06)",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isSel) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${theme.primaryColor}80`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSel) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#e8e8e8";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,.06)";
                }
              }}
            >
              {isSel && (
                <div style={{ position: "absolute", top: 4, right: 4, zIndex: 2, width: 14, height: 14, borderRadius: "50%", background: theme.primaryColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckOutlined style={{ color: "#fff", fontSize: 7 }} />
                </div>
              )}

              {/* Thumbnail */}
              <div style={{ background: theme.primaryColor, height: 20 }} />
              <div style={{ padding: "5px 7px 4px", display: "flex", flexDirection: "column", gap: 2, background: theme.bodyBg }}>
                <div style={{ background: theme.secondaryColor, height: 4, borderRadius: 3, width: "65%", opacity: 0.9 }} />
                <div style={{ background: "#e5e7eb", height: 3, borderRadius: 3, width: "85%" }} />
                <div style={{ marginTop: 1, width: 18, height: 5, borderRadius: 3, background: theme.primaryColor, opacity: 0.75 }} />
              </div>

              {/* Label */}
              <div style={{ padding: "4px 7px 6px", fontSize: 10.5, fontWeight: 600, color: isSel ? theme.primaryColor : "#555", background: "#fff", textAlign: "center" }}>
                {theme.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── LogicPanel ─────────────────────────────────────────────────────────────

function LogicPanel({ questions, accent }: { questions: Question[]; accent: string }) {
  const [rules, setRules] = useState<LogicRule[]>([]);
  const addRule = () => {
    if (questions.length < 2) return;
    setRules((r) => [...r, { id: Date.now().toString(), sourceQuestionId: questions[0].id, operator: "equals", value: "", action: "show", targetQuestionId: questions[1]?.id ?? questions[0].id }]);
  };
  const updateRule = (id: string, patch: Partial<LogicRule>) => setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  const removeRule = (id: string) => setRules((r) => r.filter((rule) => rule.id !== id));
  const getQ = (id: string) => questions.find((q) => q.id === id);
  const hasOptions = (qId: string) => { const q = getQ(qId); return q && (q.type === "radio" || q.type === "checkbox"); };

  if (questions.length < 2) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, color: "#9ca3af", padding: "32px 16px", textAlign: "center" }}>
        <BranchesOutlined style={{ fontSize: 28 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#6b7280" }}>Cần ít nhất 2 câu hỏi</span>
        <span style={{ fontSize: 11.5, lineHeight: 1.6 }}>Thêm câu hỏi vào form trước khi thiết lập logic.</span>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px 8px", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{rules.length} điều kiện</span>
        <button onClick={addRule} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", border: `1.5px solid ${accent}`, borderRadius: 6, background: `${accent}10`, color: accent, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          <PlusOutlined style={{ fontSize: 11 }} />Thêm
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {rules.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 120, gap: 6, color: "#c4c9d4", fontSize: 12, border: "2px dashed #e8eaed", borderRadius: 8, margin: "4px 0" }}>
            <BranchesOutlined style={{ fontSize: 20 }} />
            <span>Nhấn <strong style={{ color: "#9ca3af" }}>Thêm</strong> để tạo điều kiện</span>
          </div>
        ) : rules.map((rule, idx) => {
          const srcQ = getQ(rule.sourceQuestionId);
          const acColor = ACTION_COLORS[rule.action];
          return (
            <div key={rule.id} style={{ border: "1px solid #e8eaed", borderLeft: `3px solid ${acColor}`, borderRadius: 8, padding: "10px 10px 8px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: acColor, background: `${acColor}12`, padding: "2px 7px", borderRadius: 10 }}>#{idx + 1} · {ACTION_LABELS[rule.action]}</span>
                <button onClick={() => removeRule(rule.id)} style={{ border: "none", background: "transparent", color: "#dc2626", cursor: "pointer", fontSize: 12, padding: 2, display: "flex", alignItems: "center", opacity: 0.7 }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}><DeleteOutlined /></button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", minWidth: 20 }}>Nếu</span>
                <Select size="small" value={rule.sourceQuestionId} style={{ flex: 1, minWidth: 80 }} onChange={(v) => updateRule(rule.id, { sourceQuestionId: v, value: "" })} options={questions.map((q, i) => ({ value: q.id, label: `${i + 1}. ${q.title.slice(0, 18)}${q.title.length > 18 ? "…" : ""}` }))} />
                <Select size="small" value={rule.operator} style={{ width: 88 }} onChange={(v) => updateRule(rule.id, { operator: v as LogicOperator })} options={Object.entries(OPERATOR_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5, paddingLeft: 24 }}>
                {hasOptions(rule.sourceQuestionId) ? (
                  <Select size="small" value={rule.value || undefined} placeholder="Giá trị..." style={{ flex: 1 }} onChange={(v) => updateRule(rule.id, { value: v })} options={(srcQ?.options || []).map((o) => ({ value: o.label, label: o.label }))} />
                ) : (
                  <input value={rule.value} onChange={(e) => updateRule(rule.id, { value: e.target.value })} placeholder="Giá trị..." style={{ flex: 1, height: 24, border: "1px solid #d9d9d9", borderRadius: 6, padding: "0 8px", fontSize: 11.5, outline: "none", fontFamily: "inherit" }} />
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", minWidth: 20 }}>Thì</span>
                <Select size="small" value={rule.action} style={{ width: 120 }} onChange={(v) => updateRule(rule.id, { action: v as LogicAction })} options={Object.entries(ACTION_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
                <Select size="small" value={rule.targetQuestionId} style={{ flex: 1, minWidth: 80 }} onChange={(v) => updateRule(rule.id, { targetQuestionId: v })} options={questions.filter((q) => q.id !== rule.sourceQuestionId).map((q) => ({ value: q.id, label: `${questions.indexOf(q) + 1}. ${q.title.slice(0, 18)}${q.title.length > 18 ? "…" : ""}` }))} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── RightPanel (main export) ───────────────────────────────────────────────

export function RightPanel({
  onAddFromBank,
  accent,
  onAccentChange,
  onThemeChange,
  selectedThemeId,
  questions = [],
  onToggle,
  asDrawer = false,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab | null>(null);
  const handleTabClick = (tab: PanelTab) => setActiveTab((prev) => (prev === tab ? null : tab));

  // Drawer mode (mobile)
  if (asDrawer) {
    return (
      <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid #f0f2f5", gap: 4 }}>
          {PANEL_TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", border: "none", borderRadius: 6, background: activeTab === t.key ? `${accent}12` : "transparent", color: activeTab === t.key ? accent : "#9ca3af", cursor: "pointer", fontSize: 12, fontWeight: activeTab === t.key ? 700 : 400, fontFamily: "inherit" }}>{t.icon}</button>
          ))}
          <button onClick={onToggle} style={{ marginLeft: "auto", border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: 16, display: "flex", alignItems: "center" }}><CloseOutlined /></button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {(activeTab === "bank" || !activeTab) && <BankPanel onAddFromBank={onAddFromBank} accent={accent} onClose={onToggle ?? (() => {})} />}
          {activeTab === "theme" && <ThemePanel accent={accent} onAccentChange={onAccentChange} selectedThemeId={selectedThemeId} onThemeChange={onThemeChange} />}
          {activeTab === "logic" && <LogicPanel questions={questions} accent={accent} />}
        </div>
      </div>
    );
  }

  // Desktop: icon strip + sliding panel
  return (
    <div style={{ display: "flex", height: "100%", flexShrink: 0 }}>

      {/* Sliding panel */}
      <div style={{ width: activeTab ? PANEL_WIDTH : 0, minWidth: 0, height: "100%", overflow: "hidden", transition: "width .22s cubic-bezier(.16,1,.3,1)", borderLeft: "1px solid #e8eaed", background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 42, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid #f0f2f5", flexShrink: 0, background: "#fafafa", gap: 6, minWidth: PANEL_WIDTH }}>
          <span style={{ fontSize: 13, color: accent }}>{PANEL_TABS.find((t) => t.key === activeTab)?.icon}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", flex: 1, whiteSpace: "nowrap" }}>{PANEL_TABS.find((t) => t.key === activeTab)?.label}</span>
          <button onClick={() => setActiveTab(null)} style={{ width: 24, height: 24, border: "1px solid #e8eaed", borderRadius: 6, background: "#fff", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}><CloseOutlined /></button>
        </div>
        <div style={{ flex: 1, overflow: "hidden", minWidth: PANEL_WIDTH }}>
          {activeTab === "bank"  && <BankPanel  onAddFromBank={onAddFromBank} accent={accent} onClose={() => setActiveTab(null)} />}
          {activeTab === "theme" && <ThemePanel accent={accent} onAccentChange={onAccentChange} selectedThemeId={selectedThemeId} onThemeChange={onThemeChange} />}
          {activeTab === "logic" && <LogicPanel questions={questions} accent={accent} />}
        </div>
      </div>

      {/* Icon strip */}
      <div style={{ width: 44, height: "100%", borderLeft: "1px solid #e8eaed", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 3, flexShrink: 0 }}>
        {PANEL_TABS.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <Tooltip key={t.key} title={t.label} placement="left" mouseEnterDelay={0.4}>
              <button
                onClick={() => handleTabClick(t.key)}
                style={{ width: 34, height: 34, border: "none", borderRadius: 9, background: isActive ? `${accent}15` : "transparent", color: isActive ? accent : "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all .14s", outline: isActive ? `2px solid ${accent}30` : "none", outlineOffset: 1, position: "relative" }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; } }}
              >
                {t.icon}
                {isActive && <div style={{ position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: 2, background: accent }} />}
              </button>
            </Tooltip>
          );
        })}
      </div>

    </div>
  );
}