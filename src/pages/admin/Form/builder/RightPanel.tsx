import { useState } from "react";
import { Button, Input, Tabs, Tag, Space, Tooltip, ColorPicker } from "antd";
import {
  DragOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { QUESTION_BANK, type BankQuestion } from "../../../../feature/form/api";

const T = "#0f766e";

const Q_TYPE_LABELS: Record<string, string> = {
  radio: "Lựa chọn đơn",
  checkbox: "Nhiều lựa chọn",
  short: "Một dòng",
  long: "Đoạn văn",
  date: "Ngày tháng",
  email: "Email",
  tel: "Số điện thoại",
  address: "Địa chỉ",
  select: "Thả xuống",
  rating: "Đánh giá",
};

interface RightPanelProps {
  onAddFromBank: (q: BankQuestion) => void;
  accent: string;
  onAccentChange: (color: string) => void;
  open?: boolean;
  onToggle?: () => void;
  asDrawer?: boolean;
}

const PRESET_COLORS = [
  "#0f766e",
  "#1d4ed8",
  "#7c3aed",
  "#be123c",
  "#c2410c",
  "#0369a1",
  "#15803d",
  "#92400e",
  "#1e293b",
];

export function RightPanel({
  onAddFromBank,
  accent,
  onAccentChange,
  open: openProp,
  onToggle,
  asDrawer,
}: RightPanelProps) {
  const [openState, setOpenState] = useState(true);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const handleToggle = onToggle ?? (() => setOpenState((o) => !o));

  const [tab, setTab] = useState<"bank" | "theme">("bank");
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

  const effectiveOpen = asDrawer ? true : open;

  return (
    <div
      style={{
        width: asDrawer ? "100%" : effectiveOpen ? 256 : 44,
        height: "100%",
        borderLeft: asDrawer ? "none" : "1px solid #e8eaed",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: asDrawer ? "none" : "width .2s cubic-bezier(.16,1,.3,1)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          borderBottom: "1px solid #f0f2f5",
          flexShrink: 0,
          gap: 6,
        }}
      >
        {effectiveOpen && (
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {(
              [
                { key: "bank", label: "Mẫu hỏi" },
                { key: "theme", label: "Giao diện" },
              ] as const
            ).map((t) => (
              <Button
                key={t.key}
                type={tab === t.key ? "primary" : "text"}
                size="small"
                onClick={() => setTab(t.key)}
                style={{
                  background: tab === t.key ? `${T}12` : "transparent",
                  color: tab === t.key ? T : "#9ca3af",
                  border: "none",
                }}
              >
                {t.label}
              </Button>
            ))}
          </div>
        )}

        {!asDrawer && (
          <Button
            type="text"
            size="small"
            icon={effectiveOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggle}
            style={{ marginLeft: effectiveOpen ? 0 : "auto" }}
          />
        )}
        {asDrawer && (
          <Button type="text" size="small" onClick={handleToggle} style={{ marginLeft: "auto" }}>
            ✕
          </Button>
        )}
      </div>

      {/* Collapsed state */}
      {!effectiveOpen && !asDrawer && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#9ca3af",
              fontWeight: 600,
              letterSpacing: ".05em",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              marginTop: 8,
            }}
          >
            Mẫu
          </div>
        </div>
      )}

      {/* Bank Tab */}
      {effectiveOpen && tab === "bank" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          <Input
            placeholder="Tìm câu hỏi..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            style={{ marginBottom: 8 }}
          />

          <Space wrap size={4} style={{ marginBottom: 10 }}>
            {categories.map((c) => (
              <Button
                key={c}
                size="small"
                type={category === c ? "primary" : "default"}
                onClick={() => setCategory(c)}
                style={{
                  padding: "0 9px",
                  fontSize: 11,
                  height: 24,
                }}
              >
                {c}
              </Button>
            ))}
          </Space>

          {filtered.map((bq) => (
            <div
              key={bq.id}
              draggable
              onDragStart={(e) => handleDragStart(e, bq)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                border: "1px solid #e8eaed",
                borderRadius: 8,
                marginBottom: 6,
                cursor: "grab",
                background: "#fff",
                transition: "all .12s",
              }}
              onMouseEnter={(e) => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.borderColor = T;
                d.style.background = "#f0fdfa";
              }}
              onMouseLeave={(e) => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.borderColor = "#e8eaed";
                d.style.background = "#fff";
              }}
            >
              <span style={{ color: "#d1d5db", flexShrink: 0 }}>
                <DragOutlined />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#111827",
                    marginBottom: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {bq.title}
                </div>
                <Space size={4}>
                  <Tag>{Q_TYPE_LABELS[bq.type] ?? bq.type}</Tag>
                  <Tag color="cyan">{bq.category}</Tag>
                </Space>
              </div>
              <Tooltip title="Thêm">
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    onAddFromBank(bq);
                    if (asDrawer) handleToggle();
                  }}
                />
              </Tooltip>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 12px", color: "#9ca3af", fontSize: 12 }}>
              Không tìm thấy
            </div>
          )}
        </div>
      )}

      {/* Theme Tab */}
      {effectiveOpen && tab === "theme" && (
        <div style={{ padding: "14px 14px 20px", overflowY: "auto", flex: 1 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginBottom: 12,
            }}
          >
            Màu chủ đạo
          </div>

          {/* Presets */}
          <Space wrap size={8} style={{ marginBottom: 14 }}>
            {PRESET_COLORS.map((c) => (
              <div
                key={c}
                onClick={() => onAccentChange(c)}
                title={c}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: c,
                  cursor: "pointer",
                  border: accent === c ? "3px solid #fff" : "2px solid transparent",
                  boxShadow: accent === c ? `0 0 0 2px ${c}` : "0 1px 3px rgba(0,0,0,.12)",
                  transform: accent === c ? "scale(1.18)" : "scale(1)",
                  transition: "all .15s",
                }}
              />
            ))}
          </Space>

          {/* Custom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: "#f8f9fb",
              borderRadius: 8,
              border: "1px solid #e8eaed",
            }}
          >
            <ColorPicker value={accent} onChange={(_, hex) => onAccentChange(hex)} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Tùy chỉnh</div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "Geist Mono, monospace",
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                {accent}
              </div>
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: accent,
                marginLeft: "auto",
                flexShrink: 0,
              }}
            />
          </div>

          {/* Live preview */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 10,
              }}
            >
              Xem trước
            </div>
            <div style={{ border: "1px solid #e8eaed", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 4, background: accent }} />
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                  Tiêu đề form
                </div>
                <div
                  style={{
                    borderBottom: `2px solid ${accent}`,
                    paddingBottom: 4,
                    fontSize: 12,
                    color: "#9ca3af",
                    marginBottom: 10,
                  }}
                >
                  Câu trả lời...
                </div>
                <Button type="primary" style={{ background: accent, borderColor: accent }}>
                  Gửi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}