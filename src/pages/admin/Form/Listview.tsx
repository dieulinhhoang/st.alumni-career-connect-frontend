import { useState } from "react";
import type { Form } from "../../../feature/form/types";

const ACCENT_MAP: Record<string, string> = {
  blue: "#2563eb", green: "#16a34a", red: "#dc2626",
  purple: "#7c3aed", orange: "#ea580c", teal: "#0d9488",
  brown: "#78716c", gray: "#6b7280",
};
const getAccent = (id?: string) => ACCENT_MAP[id as string] ?? "#2563eb";

const IcEye    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcCopy   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IcTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcFile   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcBolt   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcHash   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;

interface Props {
  forms: Form[];
  onCreate: () => void;
  onAI: () => void;
  onEdit: (f: Form) => void;
  onPreview: (f: Form) => void;
  onTheme: (f: Form) => void;
  onDup: (f: Form) => void;
  onDelete: (id: number) => void;
}

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

export default function ListView({ forms, onCreate, onAI, onEdit, onPreview, onDup, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const filtered = forms.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const totalQ = forms.reduce((a, f) => a + f.questions.length, 0);
  const avgQ   = forms.length > 0 ? Math.round(totalQ / forms.length) : 0;

  return (
    <div className="page">

      {/* TOP BAR */}
      <div className="topbar">
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Quản lý</div>
          <div className="page-title">Form khảo sát</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-gold" onClick={onAI}>
            <IcBolt /> Tạo bằng AI
          </button>
          <button className="btn btn-primary" onClick={onCreate}>
            <IcPlus /> Form mới
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        {([
          ["Tổng form",      forms.length],
          ["Đang hoạt động", forms.length],
          ["Câu hỏi TB",     avgQ],
          ["Phản hồi",       "—"],
        ] as [string, number | string][]).map(([label, value]) => (
          <div className="stat-card" key={label}>
            <div className="stat-num">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"><IcSearch /></span>
          <input
            className="search-inp"
            placeholder="Tìm kiếm form..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="count-badge count-green">{filtered.length} form</span>
      </div>

      {/* GRID */}
      <div className="form-grid">

        {/* AI Card */}
        <div className="ai-card" onClick={onAI}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,.15)", borderRadius: 20,
            padding: "3px 10px", fontSize: 10.5, fontWeight: 700,
            color: "rgba(255,255,255,.9)", letterSpacing: ".06em",
            textTransform: "uppercase", marginBottom: 14,
          }}>
            <IcBolt /> AI
          </div>
          <div className="ai-title">Tạo form thông minh<br />bằng trí tuệ nhân tạo</div>
          <div className="ai-desc">Upload PDF hoặc nhập mô tả — AI phân tích và sinh câu hỏi tự động.</div>
          <div className="ai-cta">Bắt đầu ngay →</div>
        </div>

        {/* New Form Card */}
        <div className="new-card" onClick={onCreate}>
          <div className="new-ring"><IcPlus /></div>
          <span>Tạo form mới</span>
        </div>

        {/* Form Cards */}
        {filtered.map((form) => {
          const accent = getAccent(form.themeId as string);
          return (
            <div key={form.id} className="form-card" onClick={() => onPreview(form)}>
              <div className="form-card-accent" style={{ background: accent }} />
              <div className="form-card-body">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div className="form-icon" style={{ background: accent + "1a", color: accent }}>
                    <IcFile />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="form-name">{form.name}</div>
                    <div className="form-desc">{form.description || "Chưa có mô tả"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                  <span className="fc-tag" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <IcHash /> {form.questions.length} câu hỏi
                  </span>
                  <span className="fc-tag">{fmt(form.created_at)}</span>
                </div>
              </div>

              <div className="form-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="fa-btn" onClick={() => onPreview(form)} title="Xem trước"><IcEye /></button>
                <span className="fa-sep" />
                <button className="fa-btn" onClick={() => onEdit(form)} title="Chỉnh sửa"><IcEdit /></button>
                <span className="fa-sep" />
                <button className="fa-btn" onClick={() => onDup(form)} title="Nhân bản"><IcCopy /></button>
                <span className="fa-sep" />
                <button className="fa-btn danger" onClick={() => onDelete(form.id as number)} title="Xóa"><IcTrash /></button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && search && (
        <div style={{
          textAlign: "center", padding: "60px 20px", color: "#9ca3af",
        }}>
          <div style={{
            width: 48, height: 48, margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--bg-hover)", borderRadius: 12,
          }}>
            <IcSearch />
          </div>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text-light)" }}>Không tìm thấy form nào</div>
          <div style={{ fontSize: 13 }}>Thử từ khóa khác</div>
        </div>
      )}
    </div>
  );
}