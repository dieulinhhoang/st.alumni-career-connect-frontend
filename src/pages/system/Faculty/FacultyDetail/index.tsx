import { useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table, Tag, Typography, Modal, Form, Input, Switch, Popconfirm, message } from "antd";
import { ArrowLeftOutlined, BookOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../../components/layout/AdminLayout";
import { useFacultyDetailBySlug } from "../../../../feature/faculty/hooks/useFaculties";
import { createMajor, updateMajor, deleteMajor } from "../../../../feature/major/api";
import { toSlug } from "../../../../components/common/utils";
import CustomTable from "../../../../components/common/customTable";

const { Title, Text } = Typography;

type MajorRow = {
  id: string;
  code: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: number;
};

interface MajorFormValues {
  name: string;
  code: string;
  slug?: string;
  description?: string;
  status?: boolean;
}

export default function FacultyDetailPage() {
  const { facultySlug = "" } = useParams<{ facultySlug: string }>();
  const navigate = useNavigate();

  const { data: faculty, loading, error, reload } = useFacultyDetailBySlug(facultySlug);

  const [form] = Form.useForm<MajorFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const slugTouched = useRef(false);

  const majors: MajorRow[] = useMemo(() => {
    const raw = Array.isArray((faculty as any)?.majors) ? (faculty as any).majors : [];
    return raw.map((m: any) => ({
      id: String(m.id),
      code: m.code ?? "",
      name: m.name ?? "",
      slug: m.slug ?? null,
      description: m.description ?? null,
      status: m.status,
    }));
  }, [faculty]);

  const color = (faculty as any)?.color ?? "#2563eb";

  const openCreateModal = () => {
    setEditingMajor(null);
    slugTouched.current = false;
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (major: MajorRow) => {
    setEditingMajor(major);
    slugTouched.current = !!major.slug;
    form.setFieldsValue({
      name: major.name,
      code: major.code,
      slug: major.slug ?? toSlug(major.name),
      description: major.description ?? undefined,
      status: major.status !== 0,
    });
    setModalOpen(true);
  };

  // Tự sinh slug từ tên cho đến khi người dùng tự sửa slug
  const handleNameChange = (name: string) => {
    if (!slugTouched.current) {
      form.setFieldValue("slug", toSlug(name));
    }
  };

  const handleDelete = async (major: MajorRow) => {
    try {
      await deleteMajor(Number(major.id));
      message.success("Đã xoá ngành");
      reload();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Xoá ngành thất bại");
    }
  };

  const handleSubmit = async (values: MajorFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        code: values.code,
        slug: values.slug?.trim() || toSlug(values.name),
        description: values.description,
        status: values.status === false ? 0 : 1,
        facultyId: Number((faculty as any)?.id),
      };
      if (editingMajor) {
        await updateMajor(Number(editingMajor.id), payload);
        message.success("Đã cập nhật ngành");
      } else {
        await createMajor(payload);
        message.success("Đã thêm ngành mới");
      }
      setModalOpen(false);
      reload();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Lưu ngành thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<MajorRow> = [
    {
      title: "Tên ngành",
      dataIndex: "name",
      key: "name",
      render: (value) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BookOutlined style={{ color, fontSize: 13 }} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1e1b4b" }}>
            {value}
          </div>
        </div>
      ),
    },
    {
      title: "Mã ngành",
      dataIndex: "code",
      key: "code",
      width: 140,
      render: (value) => <Tag color="purple">{value || "--"}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 110,
      align: "center",
      render: (_value, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }} onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xoá ngành này?"
            description="Hành động này không thể hoàn tác."
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
          Đang tải...
        </div>
      </AdminLayout>
    );
  }

  if (error || !faculty) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: 60 }}>
          <div>{error ?? "Không tìm thấy khoa"}</div>
          <Button style={{ marginTop: 16 }} onClick={() => navigate("/admin/faculties")}>
            Quay lại
          </Button>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          style={{ marginBottom: 16, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate("/admin/faculties")}
        >
          Quay lại danh sách khoa
        </Button>

        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${color}25`,
            overflow: "hidden",
            marginBottom: 20,
            background: "white",
          }}
        >
          <div
            style={{
              height: 90,
              background: `linear-gradient(135deg, ${color}35 0%, ${color}60 100%)`,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 24px 20px",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: "white",
                border: `2px solid ${color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: -32,
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 13, color }}>
                {(faculty as any)?.abbr ?? "--"}
              </span>
            </div>

            <div style={{ paddingTop: 12 }}>
              <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>
                {(faculty as any)?.name ?? "Không có tên khoa"}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {majors.length} ngành đào tạo
              </Text>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Thêm ngành
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={majors}
          rowKey="id"
          pagination={false}
          onRow={(record: MajorRow) => ({
            style: { cursor: record.slug ? "pointer" : "default" },
            onClick: () => {
              if (record.slug) {
                navigate(`/admin/faculties/${facultySlug}/${record.slug}`);
              }
            },
          })}
        />
      </div>

      <Modal
        title={editingMajor ? "Sửa ngành" : "Thêm ngành"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingMajor ? "Lưu" : "Thêm"}
        cancelText="Huỷ"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: true }}>
          <Form.Item
            label="Tên ngành"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên ngành" }]}
          >
            <Input placeholder="VD: Công nghệ Thông tin" onChange={(e) => handleNameChange(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Mã ngành"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã ngành" }]}
          >
            <Input placeholder="VD: CNTT01" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Vui lòng nhập slug" }]}
            extra="Dùng cho đường dẫn URL, tự sinh từ tên ngành — có thể sửa tay."
          >
            <Input
              placeholder="VD: cong-nghe-thong-tin"
              onChange={() => {
                slugTouched.current = true;
              }}
            />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Giới thiệu ngành đào tạo" />
          </Form.Item>
          <Form.Item label="Đang hoạt động" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}