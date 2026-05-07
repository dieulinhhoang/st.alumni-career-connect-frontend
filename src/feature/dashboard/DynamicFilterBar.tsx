import { Select, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { ChartFilterState, FilterFieldSchema } from "./filterSchema";

const { Text } = Typography;

interface Props<S extends Record<string, string>> {
  schema: FilterFieldSchema[];
  state: S;
  setField: (key: string, value: string) => void;
  label?: ReactNode;
  style?: CSSProperties;
  labelColor?: string;
}

export function DynamicFilterBar<S extends Record<string, string>>({
  schema, state, setField, label, style, labelColor,
}: Props<S>) {
  const leftFields = schema.filter(f => f.align !== "right");
  const rightFields = schema.filter(f => f.align === "right");

  const renderField = (field: FilterFieldSchema) => {
    const options = field.getOptions(state as unknown as ChartFilterState);
    return (
      <Select
        key={field.key}
        value={state[field.key]}
        onChange={v => setField(field.key, v as string)}
        style={{ width: field.width ?? 160 }}
        size={field.size ?? "small"}
      >
        {options.map(o => (
          <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
        ))}
      </Select>
    );
  };

  return (
    <div style={{
      padding: "10px 20px",
      background: "#f8fafc",
      borderBottom: "1px solid #f1f5f9",
      display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      ...style,
    }}>
      {label && (
        <Text style={{ fontSize: 12, color: labelColor ?? "#64748b", fontWeight: 600, flexShrink: 0 }}>
          {label}
        </Text>
      )}
      {leftFields.map(renderField)}
      {rightFields.length > 0 && (
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          {rightFields.map(renderField)}
        </div>
      )}
    </div>
  );
}
