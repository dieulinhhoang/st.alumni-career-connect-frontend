import { useState } from "react";
import { Button, Input, Tooltip } from "antd";
import {
  SearchOutlined,
  DragOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  LineOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CaretDownOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Q_TYPES } from "../../../../feature/form/constants";

const T = "#0f766e";

const Q_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  radio: { icon: <CheckCircleOutlined style={{ fontSize: 20, color: T }} />, label: "Lựa chọn đơn" },
  checkbox: { icon: <CheckSquareOutlined style={{ fontSize: 20, color: T }} />, label: "Nhiều lựa chọn" },
  short: { icon: <LineOutlined style={{ fontSize: 20, color: T }} />, label: "Câu hỏi một dòng" },
  long: { icon: <UnorderedListOutlined style={{ fontSize: 20, color: T }} />, label: "Câu hỏi dài" },
  date: { icon: <CalendarOutlined style={{ fontSize: 20, color: T }} />, label: "Ngày tháng" },
  email: { icon: <MailOutlined style={{ fontSize: 20, color: T }} />, label: "Email" },
  tel: { icon: <PhoneOutlined style={{ fontSize: 20, color: T }} />, label: "Số điện thoại" },
  address: { icon: <EnvironmentOutlined style={{ fontSize: 20, color: T }} />, label: "Địa chỉ" },
  select: { icon: <CaretDownOutlined style={{ fontSize: 20, color: T }} />, label: "Danh sách thả xuống" },
  rating: { icon: <StarOutlined style={{ fontSize: 20, color: T }} />, label: "Đánh giá sao" },
};

interface LeftToolboxProps {
  onAddQuestion: (type: string) => void;
  open?: boolean;
  onToggle?: () => void;
  asDrawer?: boolean;
}

export function LeftToolbox({ onAddQuestion, open: openProp, onToggle, asDrawer }: LeftToolboxProps) {
  const [openState, setOpenState] = useState(true);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const handleToggle = onToggle ?? (() => setOpenState((o) => !o));
  const [search, setSearch] = useState("");

  const supportedTypes = Q_TYPES.filter((t) => Q_TYPE_CONFIG[t.value]);
  const filtered = supportedTypes.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      Q_TYPE_CONFIG[t.value].label.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const effectiveOpen = asDrawer ? true : open;

  return (
    <div
      style={{
        width: asDrawer ? "100%" : effectiveOpen ? 260 : 44,
        height: "100%",
        borderRight: asDrawer ? "none" : "1px solid #e8eaed",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        transition: asDrawer ? "none" : "width .2s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid #f0f2f5",
          flexShrink: 0,
          gap: 8,
        }}
      >
        {effectiveOpen && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Thêm câu hỏi
          </span>
        )}
        {!asDrawer && (
          <Button
            type="text"
            size="small"
            icon={effectiveOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={handleToggle}
            style={{ marginLeft: effectiveOpen ? "auto" : "auto" }}
          />
        )}
        {asDrawer && (
          <Button type="text" size="small" onClick={handleToggle} style={{ marginLeft: "auto" }}>
            ✕
          </Button>
        )}
      </div>

      {effectiveOpen ? (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* Search */}
          <div style={{ padding: "12px" }}>
            <Input
              placeholder="Tìm loại câu hỏi..."
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              allowClear
            />
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>
            {filtered.map((t) => {
              const config = Q_TYPE_CONFIG[t.value];
              return (
                <div
                  key={t.value}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.value)}
                  onClick={() => {
                    onAddQuestion(t.value);
                    if (asDrawer) handleToggle();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    cursor: "grab",
                    marginBottom: 4,
                    borderRadius: 8,
                    transition: "all .15s",
                    background: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0fdfa";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: `1px solid ${T}20`,
                      background: `${T}08`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#1f2937",
                      flex: 1,
                    }}
                  >
                    {config.label}
                  </span>
                  
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 16px",
                  color: "#9ca3af",
                  fontSize: 12,
                }}
              >
                Không tìm thấy loại câu hỏi nào
              </div>
            )}
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #f0f2f5",
              fontSize: 10.5,
              color: "#c4c9d4",
              textAlign: "center",
              letterSpacing: ".02em",
            }}
          >
            Kéo thả hoặc click để thêm câu hỏi
          </div>
        </div>
      ) : (
        /* Collapsed icon list */
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {Object.entries(Q_TYPE_CONFIG).map(([type, config]) => (
            <Tooltip key={type} title={config.label} placement="right">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onClick={() => onAddQuestion(type)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "grab",
                  transition: "all .15s",
                  background: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0fdfa";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {config.icon}
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}