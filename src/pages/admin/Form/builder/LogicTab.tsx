import { useState } from "react";
import { Button, Card, Select, Input, Space, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Question } from "../../../../feature/form/types";

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

const T = "#0f766e";

const OPERATOR_LABELS: Record<LogicOperator, string> = {
  equals: "bằng",
  not_equals: "không bằng",
  contains: "chứa",
};
const ACTION_LABELS: Record<LogicAction, string> = {
  show: "Hiển thị câu",
  hide: "Ẩn câu",
  skip: "Nhảy đến câu",
  require: "Bắt buộc câu",
};
const ACTION_COLORS: Record<LogicAction, string> = {
  show: "#16a34a",
  hide: "#9ca3af",
  skip: "#2563eb",
  require: "#dc2626",
};

export function LogicTab({ questions }: { questions: Question[] }) {
  const [rules, setRules] = useState<LogicRule[]>([]);

  const addRule = () => {
    if (questions.length < 2) return;
    setRules((r) => [
      ...r,
      {
        id: Date.now().toString(),
        sourceQuestionId: questions[0].id,
        operator: "equals",
        value: "",
        action: "show",
        targetQuestionId: questions[1]?.id ?? questions[0].id,
      },
    ]);
  };

  const updateRule = (id: string, patch: Partial<LogicRule>) =>
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));

  const removeRule = (id: string) => setRules((r) => r.filter((rule) => rule.id !== id));

  const getQ = (id: string) => questions.find((q) => q.id === id);
  const hasOptions = (qId: string) => {
    const q = getQ(qId);
    return q && (q.type === "radio" || q.type === "checkbox");
  };

  if (questions.length < 2) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 32px",
          textAlign: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#f0f2f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          🔀
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>
          Cần ít nhất 2 câu hỏi
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>
          Thêm câu hỏi vào form trước khi thiết lập logic điều kiện.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1117", marginBottom: 3 }}>
            Logic điều kiện
          </div>
          <div style={{ fontSize: 12.5, color: "#9ca3af" }}>
            Hiển thị / ẩn / nhảy / bắt buộc câu hỏi theo điều kiện
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={addRule}>
          Thêm điều kiện
        </Button>
      </div>

      {rules.length === 0 && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            border: "2px dashed #e8eaed",
            borderRadius: 10,
            color: "#9ca3af",
          }}
        >
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

          return (
            <Card
              key={rule.id}
              size="small"
              title={`Điều kiện #${idx + 1}`}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeRule(rule.id)}
                />
              }
              style={{ borderLeft: `3px solid ${acColor}` }}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {/* IF row */}
                <Space wrap>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: "#9ca3af",
                      minWidth: 40,
                    }}
                  >
                    NẾU
                  </span>
                  <Select
                    size="small"
                    value={rule.sourceQuestionId}
                    style={{ width: 200 }}
                    onChange={(v) => updateRule(rule.id, { sourceQuestionId: v, value: "" })}
                    options={questions.map((q, i) => ({
                      value: q.id,
                      label: `${i + 1}. ${q.title.slice(0, 30)}${q.title.length > 30 ? "…" : ""}`,
                    }))}
                  />
                  <Select
                    size="small"
                    value={rule.operator}
                    style={{ width: 110 }}
                    onChange={(v) => updateRule(rule.id, { operator: v as LogicOperator })}
                    options={Object.entries(OPERATOR_LABELS).map(([k, v]) => ({
                      value: k,
                      label: v,
                    }))}
                  />
                  {srcHasOpts ? (
                    <Select
                      size="small"
                      value={rule.value || undefined}
                      placeholder="Giá trị..."
                      style={{ width: 150 }}
                      onChange={(v) => updateRule(rule.id, { value: v })}
                      options={(srcQ?.options || []).map((o) => ({
                        value: o.label,
                        label: o.label,
                      }))}
                    />
                  ) : (
                    <Input
                      size="small"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      placeholder="Giá trị..."
                      style={{ width: 150 }}
                    />
                  )}
                </Space>

                {/* THEN row */}
                <Space wrap>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: "#9ca3af",
                      minWidth: 40,
                    }}
                  >
                    THÌ
                  </span>
                  <Select
                    size="small"
                    value={rule.action}
                    style={{ width: 160 }}
                    onChange={(v) => updateRule(rule.id, { action: v as LogicAction })}
                    options={Object.entries(ACTION_LABELS).map(([k, v]) => ({
                      value: k,
                      label: v,
                    }))}
                  />
                  <Select
                    size="small"
                    value={rule.targetQuestionId}
                    style={{ width: 200 }}
                    onChange={(v) => updateRule(rule.id, { targetQuestionId: v })}
                    options={questions
                      .filter((q) => q.id !== rule.sourceQuestionId)
                      .map((q) => ({
                        value: q.id,
                        label: `${questions.indexOf(q) + 1}. ${q.title.slice(0, 30)}${
                          q.title.length > 30 ? "…" : ""
                        }`,
                      }))}
                  />
                </Space>

                {/* Summary */}
                <div
                  style={{
                    padding: "7px 10px",
                    borderRadius: 6,
                    background: `${acColor}10`,
                    border: `1px solid ${acColor}20`,
                    fontSize: 11.5,
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  Nếu{" "}
                  <strong style={{ color: "#374151" }}>
                    "{srcQ?.title?.slice(0, 20) || "…"}"
                  </strong>{" "}
                  {OPERATOR_LABELS[rule.operator]}{" "}
                  <strong style={{ color: "#374151" }}>"{rule.value || "…"}"</strong> →{" "}
                  <span style={{ color: acColor, fontWeight: 700 }}>
                    {ACTION_LABELS[rule.action]}
                  </span>{" "}
                  <strong style={{ color: "#374151" }}>
                    "{getQ(rule.targetQuestionId)?.title?.slice(0, 20) || "…"}"
                  </strong>
                </div>
              </Space>
            </Card>
          );
        })}
      </div>

      {/* Flow diagram */}
      {rules.length > 0 && (
        <Card size="small" title="Sơ đồ điều kiện" style={{ marginTop: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {rules.map((rule, idx) => {
              const acColor = ACTION_COLORS[rule.action];
              return (
                <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: `${acColor}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: acColor,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ color: "#6b7280" }}>
                    Câu{" "}
                    <strong style={{ color: "#111827" }}>
                      {questions.findIndex((q) => q.id === rule.sourceQuestionId) + 1}
                    </strong>
                    {" → "}
                    <Tag color={acColor}>{ACTION_LABELS[rule.action]}</Tag> câu{" "}
                    <strong style={{ color: "#111827" }}>
                      {questions.findIndex((q) => q.id === rule.targetQuestionId) + 1}
                    </strong>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}