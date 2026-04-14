import { Switch, Select, Tooltip, Button, Input, Space } from "antd";
import { PlusOutlined, UpOutlined, DownOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { Q_TYPES } from "../../../../feature/form/constants";
import type { Question, QuestionType } from "../../../../feature/form/types";

const T = "#0f766e";

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

const LBL: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: ".07em",
  marginBottom: 6,
};

export function QuestionProps({
  q,
  idx,
  total,
  updateQ,
  dupQ,
  removeQ,
  moveUp,
  moveDown,
  addOpt,
  updOpt,
  removeOpt,
}: QuestionPropsProps) {
  const hasOpts = q.type === "radio" || q.type === "checkbox";

  return (
    <div style={{ padding: "14px 16px 12px" }}>
      {/* Type + Required */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end", marginBottom: 12 }}>
        <div>
          <div style={LBL}>Loại câu hỏi</div>
          <Select
            size="small"
            value={q.type}
            style={{ width: "100%" }}
            onChange={(val) => updateQ(q.id, { type: val as QuestionType, options: [] })}
            options={Q_TYPES.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }))}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 2 }}>
          <span style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 500 }}>Bắt buộc</span>
          <Switch
            size="small"
            checked={q.required}
            onChange={(v) => updateQ(q.id, { required: v })}
            style={{ background: q.required ? T : undefined }}
          />
        </div>
      </div>

      {/* Question content */}
      <div style={{ marginBottom: 12 }}>
        <div style={LBL}>Nội dung</div>
        <Input.TextArea
          rows={2}
          value={q.title}
          onChange={(e) => updateQ(q.id, { title: e.target.value })}
          placeholder="Nhập nội dung câu hỏi..."
          style={{ resize: "none" }}
        />
      </div>

      {/* Options */}
      {hasOpts && (
        <div style={{ marginBottom: 12 }}>
          <div style={LBL}>Lựa chọn</div>
          {(q.options ?? []).map((o, oi) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: q.type === "radio" ? "50%" : "3px",
                  border: "1.5px solid #d1d5db",
                  flexShrink: 0,
                }}
              />
              <Input
                value={o.label}
                onChange={(e) => updOpt(q.id, o.id, e.target.value)}
                placeholder={`Lựa chọn ${oi + 1}`}
                size="small"
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeOpt(q.id, o.id)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => addOpt(q.id)}
            style={{ width: "100%", marginTop: 3 }}
          >
            Thêm lựa chọn
          </Button>
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 3,
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: "1px solid #f0f2f5",
        }}
      >
        <Tooltip title="Lên">
          <Button
            type="text"
            size="small"
            icon={<UpOutlined />}
            onClick={() => moveUp(idx)}
            disabled={idx === 0}
          />
        </Tooltip>
        <Tooltip title="Xuống">
          <Button
            type="text"
            size="small"
            icon={<DownOutlined />}
            onClick={() => moveDown(idx)}
            disabled={idx === total - 1}
          />
        </Tooltip>
        <Tooltip title="Nhân bản">
          <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => dupQ(q.id)} />
        </Tooltip>
        <Tooltip title="Xóa">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeQ(q.id)}
          />
        </Tooltip>
      </div>
    </div>
  );
}