import { Switch, Select, Tooltip } from "antd";
import { Q_TYPES } from "../../../../feature/form/constants";
import type { Question, QuestionType } from "../../../../feature/form/types";
import { IcPlus, IcUp, IcDown, IcCopy, IcTrash } from "./Icons";

const T = "#0a9688";

interface QuestionPropsProps {
  q: Question;
  idx: number;
  total: number;
  updateQ: (id: string, patch: Partial<Question>) => void;
  dupQ: (id: string) => void;
  removeQ: (id: string) => void;
  moveUp: (i: number) => void;
  moveDown: (i: number) => void;
  addOpt: (id: string) => void;
  updOpt: (qid: string, oid: string, v: string) => void;
  removeOpt: (qid: string, oid: string) => void;
}

export function QuestionProps({
  q, idx, total, updateQ, dupQ, removeQ, moveUp, moveDown, addOpt, updOpt, removeOpt
}: QuestionPropsProps) {
  const hasOpts = q.type === "radio" || q.type === "checkbox";
  const lbl: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 };

  return (
    <div style={{ padding: "14px 16px 12px", borderTop: "1px solid #f0fdf9", background: "#fafffe" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
        <div>
          <div style={lbl}>Loại câu hỏi</div>
          <Select size="small" value={q.type} style={{ width: "100%" }} onChange={val => updateQ(q.id, { type: val as QuestionType, options: [] })} options={Q_TYPES.map(t => ({ value: t.value, label: `${t.icon} ${t.label}` }))} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 2 }}>
          <span style={{ fontSize: 11.5, color: "#6b7280" }}>Bắt buộc</span>
          <Switch size="small" checked={q.required} onChange={v => updateQ(q.id, { required: v })} style={{ background: q.required ? T : undefined }} />
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={lbl}>Nội dung câu hỏi</div>
        <textarea rows={2} value={q.title} onChange={e => updateQ(q.id, { title: e.target.value })} placeholder="Nhập nội dung câu hỏi..." style={{ width: "100%", padding: "7px 9px", border: "0.5px solid #e5e7eb", borderRadius: 6, fontSize: 12.5, color: "#111827", outline: "none", resize: "none", lineHeight: 1.5, fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }} />
      </div>
      {hasOpts && (
        <div style={{ marginBottom: 10 }}>
          <div style={lbl}>Lựa chọn</div>
          {(q.options ?? []).map((o, oi) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: q.type === "radio" ? "50%" : "3px", border: "1.5px solid #d1d5db", flexShrink: 0 }} />
              <input value={o.label} onChange={e => updOpt(q.id, o.id, e.target.value)} placeholder={`Lựa chọn ${oi + 1}`} style={{ flex: 1, height: 26, padding: "0 8px", border: "0.5px solid #e5e7eb", borderRadius: 5, fontSize: 12, color: "#111827", outline: "none", fontFamily: "inherit" }} />
              <button onClick={() => removeOpt(q.id, o.id)} style={{ width: 20, height: 20, border: "none", background: "transparent", cursor: "pointer", borderRadius: 4, color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }} onMouseEnter={e => { const b = e.currentTarget; b.style.background = "#fef2f2"; b.style.color = "#dc2626"; }} onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "#9ca3af"; }}>×</button>
            </div>
          ))}
          <button onClick={() => addOpt(q.id)} style={{ display: "flex", alignItems: "center", gap: 5, height: 26, padding: "0 9px", border: "0.5px dashed #d0e8e6", borderRadius: 5, background: "transparent", fontSize: 12, color: T, cursor: "pointer", fontFamily: "inherit", width: "100%", marginTop: 2 }} onMouseEnter={e => { const b = e.currentTarget; b.style.background = T + "10"; b.style.borderColor = T; }} onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.borderColor = "#d0e8e6"; }}><IcPlus /> Thêm lựa chọn</button>
        </div>
      )}
      <div style={{ display: "flex", gap: 3, justifyContent: "flex-end", paddingTop: 6, borderTop: "0.5px solid #f3f4f6" }}>
        {([
          { tip: "Lên", icon: <IcUp />, fn: () => moveUp(idx), dis: idx === 0, danger: false },
          { tip: "Xuống", icon: <IcDown />, fn: () => moveDown(idx), dis: idx === total - 1, danger: false },
          { tip: "Nhân bản", icon: <IcCopy />, fn: () => dupQ(q.id), dis: false, danger: false },
          { tip: "Xóa", icon: <IcTrash />, fn: () => removeQ(q.id), dis: false, danger: true },
        ]).map(({ tip, icon, fn, dis, danger }) => (
          <Tooltip key={tip} title={tip}>
            <button onClick={e => { e.stopPropagation(); if (!dis) fn(); }} style={{ width: 26, height: 26, border: "none", background: "transparent", borderRadius: 5, cursor: dis ? "not-allowed" : "pointer", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", opacity: dis ? 0.3 : 1 }} onMouseEnter={e => { const b = e.currentTarget; if (!dis && danger) { b.style.background = "#fef2f2"; b.style.color = "#dc2626"; } else if (!dis) b.style.background = "#f3f4f6"; }} onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "#6b7280"; }}>{icon}</button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}