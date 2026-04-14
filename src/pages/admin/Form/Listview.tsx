import { useState } from "react";
import { Button, Input, Tooltip, Table, Tag, Space, Row, Col } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  QuestionOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { Form } from "../../../feature/form/types";
import type { ColumnsType } from "antd/es/table";

const ACCENT_MAP: Record<string, string> = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  purple: "#7c3aed",
  orange: "#ea580c",
  teal: "#0d9488",
  brown: "#78716c",
  gray: "#6b7280",
};
const getAccent = (id?: string) => ACCENT_MAP[id as string] ?? "#2563eb";

type ViewMode = "grid" | "table";

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
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

export default function ListView({
  forms,
  onCreate,
  onAI,
  onEdit,
  onPreview,
  onDup,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered = forms.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const columns: ColumnsType<Form> = [
    {
      title: "STT",
      key: "index",
      width: 50,
      render: (_, __, index) => <span style={{ color: "#9ca3af" }}>{index + 1}</span>,
    },
    {
      title: "Tên form",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${getAccent(record.themeId)}1a`,
              color: getAccent(record.themeId),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>{text}</div>
            <div style={{ fontSize: 11.5, color: "#9ca3af" }}>
              {record.description || "Chưa có mô tả"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questions",
      key: "questions",
      width: 100,
      render: (questions) => (
        <Tag>{questions.length} câu</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) => (
        <Space size={4}>
          <CalendarOutlined />
          <span>{fmt(date)}</span>
        </Space>
      ),
    },
    // {
    //   title: "Theme",
    //   dataIndex: "themeId",
    //   key: "themeId",
    //   width: 100,
    //   render: (themeId) => (
    //     <Space size={4}>
    //       <div
    //         style={{
    //           width: 10,
    //           height: 10,
    //           borderRadius: "50%",
    //           background: getAccent(themeId),
    //         }}
    //       />
    //       <span style={{ fontSize: 11, color: "#6b7280", textTransform: "capitalize" }}>
    //         {themeId}
    //       </span>
    //     </Space>
    //   ),
    // },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem trước">
            <Button type="text" icon={<EyeOutlined />} onClick={() => onPreview(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Nhân bản">
            <Button type="text" icon={<CopyOutlined />} onClick={() => onDup(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id as number)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="topbar">
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            Quản lý
          </div>
          <div className="page-title">Form khảo sát</div>
        </div>
        <Space>
          <Button icon={<ThunderboltOutlined />} onClick={onAI} className="btn-gold">
            Tạo bằng AI
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Form mới
          </Button>
        </Space>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Input
          placeholder="Tìm kiếm form..."
          prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 380 }}
        />

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Tooltip title="Chế độ lưới">
            <Button
              type={viewMode === "grid" ? "primary" : "default"}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode("grid")}
            />
          </Tooltip>
          <Tooltip title="Chế độ danh sách">
            <Button
              type={viewMode === "table" ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode("table")}
            />
          </Tooltip>
          <Tag color="blue">{filtered.length} form</Tag>
        </div>
      </div>

      {/* CONTENT - Grid or Table */}
      {viewMode === "grid" ? (
        <Row gutter={[14, 14]}>
          {/* AI Card - Giữ nguyên như cũ */}
          <Col xs={24} sm={12} md={8}>
            <div className="ai-card" onClick={onAI}>
              <div className="ai-title">
                Tạo form thông minh
                <br />
                bằng trí tuệ nhân tạo
              </div>
              <div className="ai-desc">
                Upload PDF hoặc nhập mô tả — AI phân tích và sinh câu hỏi tự động.
              </div>
              <div className="ai-cta">Bắt đầu ngay →</div>
            </div>
          </Col>

          {/* New Form Card - Giữ nguyên như cũ */}
          <Col xs={24} sm={12} md={8}>
            <div className="new-card" onClick={onCreate}>
              <div className="new-ring">
                <PlusOutlined />
              </div>
              <span>Tạo form mới</span>
            </div>
          </Col>

          {/* Form Cards - Chỉ sửa phần icon action */}
          {filtered.map((form) => {
            const accent = getAccent(form.themeId as string);
            return (
              <Col xs={24} sm={12} md={8} key={form.id}>
                <div className="form-card" onClick={() => onPreview(form)}>
                  <div className="form-card-accent" style={{ background: accent }} />
                  <div className="form-card-body">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        className="form-icon"
                        style={{ background: accent + "1a", color: accent }}
                      >
                        <FileOutlined />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="form-name">{form.name}</div>
                        <div className="form-desc">{form.description || "Chưa có mô tả"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <Tag >{form.questions.length} câu hỏi</Tag>
                      <Tag icon={<CalendarOutlined />}>{fmt(form.created_at)}</Tag>
                    </div>
                  </div>

                   <div className="form-card-actions" onClick={(e) => e.stopPropagation()} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "flex-end",
                    gap: "4px",
                    padding: "12px 16px",
                    borderTop: "1px solid #f0f0f0",
                    background: "#fafafa"
                  }}>
                    <Tooltip title="Xem trước">
                      <button 
                        className="fa-btn" 
                        onClick={() => onPreview(form)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          color: "#6b7280",
                          fontSize: "16px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e5e7eb";
                          e.currentTarget.style.color = "#374151";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#6b7280";
                        }}
                      >
                        <EyeOutlined />
                      </button>
                    </Tooltip>
                    <span className="fa-sep" style={{ width: "1px", height: "20px", background: "#e5e7eb" }} />
                    <Tooltip title="Chỉnh sửa">
                      <button 
                        className="fa-btn" 
                        onClick={() => onEdit(form)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          color: "#6b7280",
                          fontSize: "16px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e5e7eb";
                          e.currentTarget.style.color = "#374151";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#6b7280";
                        }}
                      >
                        <EditOutlined />
                      </button>
                    </Tooltip>
                    <span className="fa-sep" style={{ width: "1px", height: "20px", background: "#e5e7eb" }} />
                    <Tooltip title="Nhân bản">
                      <button 
                        className="fa-btn" 
                        onClick={() => onDup(form)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          color: "#6b7280",
                          fontSize: "16px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e5e7eb";
                          e.currentTarget.style.color = "#374151";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#6b7280";
                        }}
                      >
                        <CopyOutlined />
                      </button>
                    </Tooltip>
                    <span className="fa-sep" style={{ width: "1px", height: "20px", background: "#e5e7eb" }} />
                    <Tooltip title="Xóa">
                      <button 
                        className="fa-btn danger" 
                        onClick={() => onDelete(form.id as number)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          color: "#dc2626",
                          fontSize: "16px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => onPreview(record),
            style: { cursor: "pointer" },
          })}
        />
      )}
    </div>
  );
}