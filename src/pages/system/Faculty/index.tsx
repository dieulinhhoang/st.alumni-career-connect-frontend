import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Input, Typography, Button, Modal, Form, Switch, Popconfirm, message } from "antd";
import {
  RightOutlined,
  BookOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";
import { updateFaculty, deleteFaculty } from "../../../feature/faculty/api";
import type { Faculty } from "../../../feature/faculty/types";
import { toSlug } from "../../../components/common/utils";

const { Title, Text } = Typography;

const COLOR = {
  primary: "#16a34a",
  yellow: "#f59e0b",
  text: "#0f172a",
  sub: "#64748b",
  border: "#e5e7eb",
  cardBg: "#f9fafb",
};

export default function FacultyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { faculties, loading, error, reload } = useFaculties();

  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const slugTouched = useRef(false);

  const list = Array.isArray(faculties) ? faculties : [];

  const openEditModal = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    slugTouched.current = !!faculty.slug;
    form.setFieldsValue({
      name: faculty.name,
      abbr: faculty.abbr,
      slug: faculty.slug ?? toSlug(faculty.name),
      status: faculty.status !== 0,
    });
    setModalOpen(true);
  };

  // Tự sinh slug từ tên cho đến khi người dùng tự sửa slug
  const handleNameChange = (name: string) => {
    if (!slugTouched.current) {
      form.setFieldValue("slug", toSlug(name));
    }
  };

  const handleDelete = async (faculty: Faculty) => {
    try {
      await deleteFaculty(faculty.id);
      message.success("Đã xoá khoa");
      reload();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Xoá khoa thất bại");
    }
  };

  const handleSubmit = async (values: { name: string; abbr?: string; slug?: string; status?: boolean }) => {
    if (!editingFaculty) return;
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        abbr: values.abbr,
        slug: values.slug?.trim() || toSlug(values.name),
        status: values.status === false ? 0 : 1,
      };
      await updateFaculty(editingFaculty.id, payload);
      message.success("Đã cập nhật khoa");
      setModalOpen(false);
      reload();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Lưu khoa thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(
    () =>
      list.filter((f) => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        return (
          f?.name?.toLowerCase().includes(keyword) ||
          f?.abbr?.toLowerCase().includes(keyword)
        );
      }),
    [list, search]
  );

  const getMajorCount = (faculty: any) => Number(faculty?.majorCount ?? 0);
  const isEmpty = !loading && filtered.length === 0;
  const isNoFaculties = isEmpty && list.length === 0 && search === "";
  const isNoResults = isEmpty && !isNoFaculties;

  return (
    <AdminLayout>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{ padding: 4 }}>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: COLOR.text }}>Khoa</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Quản lý danh sách khoa và thông tin quy mô đào tạo
            </Text>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Input
              allowClear
              placeholder="Tìm kiếm khoa..."
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 280, borderRadius: 999 }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 10,
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* FIX: minHeight thay vì height cố định — tránh bị cắt khi text dài */}
        <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
          {[
            { label: "Tổng số khoa", value: list.length, color: COLOR.primary },
            // { label: "Ngành đào tạo", value: list.reduce((sum, f) => sum + getMajorCount(f), 0), color: COLOR.yellow },
          ].map((s) => (
            <Col key={s.label} xs={24} sm={8}>
              <div
                style={{
                  background: COLOR.cardBg,
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: `1px solid ${COLOR.border}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 70,          // FIX: minHeight, không phải height
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: COLOR.sub, marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 72,
                    borderRadius: 14,
                    background: "#f3f4f6",
                    animation: "pulse 1.5s infinite",
                    border: `1px solid ${COLOR.border}`,
                  }}
                />
              ))
            : filtered.map((f) => {
                const isHovered = hoveredId === String(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => navigate(`/admin/faculties/${f.slug}`)}
                    onMouseEnter={() => setHoveredId(String(f.id))}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      background: "#ffffff",
                      borderRadius: 14,
                      border: `1px solid ${isHovered ? "#d1fae5" : COLOR.border}`,
                      padding: "16px 20px",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      transform: isHovered ? "translateY(-1px)" : "none",
                      boxShadow: isHovered
                        ? "0 8px 24px rgba(15,23,42,0.08)"
                        : "0 1px 3px rgba(15,23,42,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: "#f0fdf4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: 12, color: COLOR.primary, textTransform: "uppercase" }}>
                            {f.abbr}
                          </span>
                        </div>

                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: COLOR.text, marginBottom: 4 }}>
                            {f.name}
                          </div>
                          <div style={{ display: "flex", gap: 12, fontSize: 12, color: COLOR.sub }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              {/* <BookOutlined style={{ fontSize: 11 }} />
                              {getMajorCount(f)} ngành */}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(f);
                          }}
                        />
                        <Popconfirm
                          title="Xoá khoa này?"
                          description="Hành động này không thể hoàn tác."
                          okText="Xoá"
                          cancelText="Huỷ"
                          okButtonProps={{ danger: true }}
                          onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDelete(f);
                          }}
                          onCancel={(e) => e?.stopPropagation()}
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                        <RightOutlined style={{ fontSize: 12, color: "#9ca3af" }} />
                      </div>
                    </div>
                  </div>
                );
              })}

          {isNoFaculties && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: COLOR.sub,
                borderRadius: 12,
                border: `1px dashed ${COLOR.border}`,
                background: COLOR.cardBg,
              }}
            >
              Chưa có khoa nào trong hệ thống
            </div>
          )}

          {isNoResults && (
            <div style={{ textAlign: "center", padding: "40px 0", color: COLOR.sub }}>
              Không tìm thấy khoa nào phù hợp với{" "}
              <span style={{ fontWeight: 600, color: COLOR.primary }}>"{search}"</span>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Sửa khoa"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: true }}>
          <Form.Item
            label="Tên khoa"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên khoa" }]}
          >
            <Input placeholder="VD: Công nghệ Thông tin" onChange={(e) => handleNameChange(e.target.value)} />
          </Form.Item>
          <Form.Item label="Viết tắt" name="abbr">
            <Input placeholder="VD: CNTT" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Vui lòng nhập slug" }]}
            extra="Dùng cho đường dẫn URL, tự sinh từ tên khoa — có thể sửa tay."
          >
            <Input
              placeholder="VD: cong-nghe-thong-tin"
              onChange={() => {
                slugTouched.current = true;
              }}
            />
          </Form.Item>
          <Form.Item label="Đang hoạt động" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}