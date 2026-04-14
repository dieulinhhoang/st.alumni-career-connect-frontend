import { useState } from "react";
import { Select } from "antd";
import { IcPlus, IcTrash } from "./Icons";
import type { Question } from "../../../../feature/form/types";

type LogicAction   = "show" | "hide" | "skip" | "require";
type LogicOperator = "equals" | "not_equals" | "contains";

interface LogicRule {
  id: string;
  sourceQuestionId: string;
  operator: LogicOperator;
  value: string;
  action: LogicAction;
  targetQuestionId: string;
}

const T = "#0f766e";

const OPERATOR_LABELS: Record<LogicOperator, string> = {
  equals: "bằng", not_equals: "không bằng", contains: "chứa",
};
const ACTION_LABELS: Record<LogicAction, string> = {
  show: "Hiển thị câu", hide: "Ẩn câu", skip: "Nhảy đến câu", require: "Bắt buộc câu",
};
const ACTION_COLORS: Record<LogicAction, string> = {
  show: "#16a34a", hide: "#9ca3af", skip: "#2563eb", require: "#dc2626",
};
const ACTION_BG: Record<LogicAction, string> = {
  show: "#f0fdf4", hide: "#f9fafb", skip: "#eff6ff", require: "#fef2f2",
};

export function LogicTab({ questions }: { questions: Question[] }) {
  const [rules, setRules] = useState<LogicRule[]>([]);

  const addRule = () => {
    if (questions.length < 2) return;
    setRules(r => [...r, {
      id: Date.now().toString(),
      sourceQuestionId: questions[0].id,
      operator: "equals",
      value: "",
      action: "show",
      targetQuestionId: questions[1]?.id ?? questions[0].id,
    }]);
  };

  const updateRule = (id: string, patch: Partial<LogicRule>) =>
    setRules(r => r.map(rule => rule.id === id ? { ...rule, ...patch } : rule));

  const removeRule = (id: string) => setRules(r => r.filter(rule => rule.id !== id));

  const getQ = (id: string) => questions.find(q => q.id === id);
  const hasOptions = (qId: string) => {
    const q = getQ(qId);
    return q && (q.type === "radio" || q.type === "checkbox");
  };

  if (questions.length < 2) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "64px 32px", textAlign: "center", gap: 12,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "#f0f2f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          🔀
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>Cần ít nhất 2 câu hỏi</div>
        <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>
          Thêm câu hỏi vào form trước khi thiết lập logic điều kiện.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1117", marginBottom: 3 }}>
            Logic điều kiện
          </div>
          <div style={{ fontSize: 12.5, color: "#9ca3af" }}>
            Hiển thị / ẩn / nhảy / bắt buộc câu hỏi theo điều kiện
          </div>
        </div>
        <button
          onClick={addRule}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 32, padding: "0 14px",
            border: `1px solid ${T}`,
            borderRadius: 7,
            background: `${T}0e`, color: T,
            fontSize: 12.5, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <IcPlus /> Thêm điều kiện
        </button>
      </div>

      {rules.length === 0 && (
        <div style={{
          padding: "40px 20px", textAlign: "center",
          border: "2px dashed #e8eaed", borderRadius: 10, color: "#9ca3af",
        }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
            Chưa có điều kiện nào
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
            Nhấn <strong style={{ color: "#374151" }}>Thêm điều kiện</strong> để bắt đầu thiết lập logic.
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rules.map((rule, idx) => {
          const srcQ = getQ(rule.sourceQuestionId);
          const srcHasOpts = hasOptions(rule.sourceQuestionId);
          const acColor = ACTION_COLORS[rule.action];
          const acBg    = ACTION_BG[rule.action];

          return (
            <div
              key={rule.id}
              style={{
                background: "#fff",
                border: "1px solid #e8eaed",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,.04)",
              }}
            >
              {/* Card header */}
              <div style={{
                display: "flex", alignItems: "center",
                padding: "10px 14px",
                background: "#fafafa",
                borderBottom: "1px solid #f0f2f5",
                gap: 8,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: `${T}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10.5, fontWeight: 700, color: T, flexShrink: 0,
                  fontFamily: "Geist Mono, monospace",
                }}>
                  {idx + 1}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", flex: 1 }}>
                  Điều kiện #{idx + 1}
                </span>
                <button
                  onClick={() => removeRule(rule.id)}
                  style={{
                    width: 26, height: 26, border: "none",
                    background: "transparent", cursor: "pointer",
                    borderRadius: 5, color: "#9ca3af",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .1s",
                  }}
                  onMouseEnter={e => { const b = e.currentTarget; b.style.background = "#fef2f2"; b.style.color = "#dc2626"; }}
                  onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "#9ca3af"; }}
                >
                  <IcTrash />
                </button>
              </div>

              {/* Card body */}
              <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

                {/* IF row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 10.5, fontWeight: 800, color: "#9ca3af",
                    width: 26, textAlign: "right", flexShrink: 0, letterSpacing: ".04em",
                  }}>
                    NẾU
                  </span>
                  <Select
                    size="small" value={rule.sourceQuestionId}
                    style={{ flex: 1, minWidth: 120 }}
                    onChange={v => updateRule(rule.id, { sourceQuestionId: v, value: "" })}
                    options={questions.map((q, i) => ({
                      value: q.id,
                      label: `${i + 1}. ${q.title.slice(0, 30)}${q.title.length > 30 ? "…" : ""}`,
                    }))}
                  />
                  <Select
                    size="small" value={rule.operator}
                    style={{ width: 110 }}
                    onChange={v => updateRule(rule.id, { operator: v as LogicOperator })}
                    options={Object.entries(OPERATOR_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                  />
                  {srcHasOpts ? (
                    <Select
                      size="small" value={rule.value || undefined}
                      placeholder="Giá trị..."
                      style={{ flex: 1, minWidth: 100 }}
                      onChange={v => updateRule(rule.id, { value: v })}
                      options={(srcQ?.options || []).map(o => ({ value: o.label, label: o.label }))}
                    />
                  ) : (
                    <input
                      value={rule.value}
                      onChange={e => updateRule(rule.id, { value: e.target.value })}
                      placeholder="Giá trị..."
                      style={{
                        flex: 1, minWidth: 80, height: 24,
                        padding: "0 8px", border: "1px solid #d9d9d9",
                        borderRadius: 6, fontSize: 12, outline: "none",
                        fontFamily: "inherit",
                        transition: "border-color .12s",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = T)}
                      onBlur={e => (e.currentTarget.style.borderColor = "#d9d9d9")}
                    />
                  )}
                </div>

                {/* THEN row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 10.5, fontWeight: 800, color: "#9ca3af",
                    width: 26, textAlign: "right", flexShrink: 0, letterSpacing: ".04em",
                  }}>
                    THÌ
                  </span>
                  <Select
                    size="small" value={rule.action}
                    style={{ width: 160 }}
                    onChange={v => updateRule(rule.id, { action: v as LogicAction })}
                    options={Object.entries(ACTION_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                  />
                  <Select
                    size="small" value={rule.targetQuestionId}
                    style={{ flex: 1, minWidth: 120 }}
                    onChange={v => updateRule(rule.id, { targetQuestionId: v })}
                    options={questions
                      .filter(q => q.id !== rule.sourceQuestionId)
                      .map(q => ({
                        value: q.id,
                        label: `${questions.indexOf(q) + 1}. ${q.title.slice(0, 30)}${q.title.length > 30 ? "…" : ""}`,
                      }))}
                  />
                </div>

                {/* Summary */}
                <div style={{
                  padding: "7px 10px", borderRadius: 6,
                  background: acBg, border: `1px solid ${acColor}20`,
                  fontSize: 11.5, color: "#6b7280", lineHeight: 1.6,
                }}>
                  Nếu <strong style={{ color: "#374151" }}>
                    "{questions.find(q => q.id === rule.sourceQuestionId)?.title?.slice(0, 20) || "…"}"
                  </strong> {OPERATOR_LABELS[rule.operator]} <strong style={{ color: "#374151" }}>
                    "{rule.value || "…"}"
                  </strong> → <span style={{ color: acColor, fontWeight: 700 }}>
                    {ACTION_LABELS[rule.action]}
                  </span> <strong style={{ color: "#374151" }}>
                    "{questions.find(q => q.id === rule.targetQuestionId)?.title?.slice(0, 20) || "…"}"
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow diagram */}
      {rules.length > 0 && (
        <div style={{
          marginTop: 20, padding: "14px 16px",
          background: "#fafafa", borderRadius: 8,
          border: "1px solid #e8eaed",
        }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, color: "#9ca3af",
            textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10,
          }}>
            Sơ đồ điều kiện
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {rules.map((rule, idx) => {
              const acColor = ACTION_COLORS[rule.action];
              return (
                <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: `${acColor}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: acColor, flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ color: "#6b7280" }}>
                    Câu <strong style={{ color: "#111827" }}>
                      {questions.findIndex(q => q.id === rule.sourceQuestionId) + 1}
                    </strong>
                    {" → "}
                    <span style={{
                      background: `${acColor}15`, color: acColor,
                      padding: "1px 7px", borderRadius: 4,
                      fontWeight: 600, fontSize: 11,
                    }}>
                      {ACTION_LABELS[rule.action].split(" ").slice(1).join(" ")}
                    </span>
                    {" câu "}
                    <strong style={{ color: "#111827" }}>
                      {questions.findIndex(q => q.id === rule.targetQuestionId) + 1}
                    </strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}