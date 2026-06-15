import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Typography, Alert, Table, Button, Modal, Form, InputNumber, DatePicker, Popconfirm, message } from "antd";
import type { TablePaginationConfig, ColumnsType } from "antd/es/table";
import { SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduations } from "../../../feature/graduation/hooks/useGraduation";
import { updateGraduation, deleteGraduation } from "../../../feature/graduation/api";
import type { Graduation } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";

const { Text } = Typography;

const T = {
  accent: "#16a34a",
  warning: "#f59e0b",
  text: "#1e2433",
  sub: "#8791a6",
  muted: "#adb5c4",
  border: "#eceef2",
  surface: "#ffffff",
  bg: "#f7f8fa",
};

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <div style={{ background: "#f4f5f7", borderRadius: 12, padding: "18px 22px" }}>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-0.5px",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: T.sub, marginTop: 6, fontWeight: 400 }}>{label}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>{children}</span>;
}

interface EditFormValues {
  name: string;
  schoolYear?: number;
  certification?: string;
  certificationDate?: dayjs.Dayjs;
}

export default function GraduationList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize] = useState(10);

  const { data: graduations, meta, loading, error, reload } = useGraduations(page, pageSize);

  const [form] = Form.useForm<EditFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGraduation, setEditingGraduation] = useState<Graduation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openEditModal = (graduation: Graduation) => {
    setEditingGraduation(graduation);
    form.setFieldsValue({
      name: graduation.name,
      schoolYear: graduation.school_year ? Number(graduation.school_year) : undefined,
      certification: graduation.certification ?? undefined,
      certificationDate: graduation.certification_date ? dayjs(graduation.certification_date) : undefined,
    });
    setModalOpen(true);
  };

  const handleDelete = async (graduation: Graduation) => {
    try {
      await deleteGraduation(graduation.id);
      message.success("Đã xoá đợt tốt nghiệp");
      reload();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Xoá đợt tốt nghiệp thất bại");
    }
  };

  const handleSubmit = async (values: EditFormValues) => {
    if (!editingGraduation) return;
    setSubmitting(true);
    try {
      await updateGraduation(editingGraduation.id, {
        name: values.name,
        schoolYear: values.schoolYear,
        certification: values.certification,
        certificationDate: values.certificationDate ? values.certificationDate.format("YYYY-MM-DD") : undefined,
      });
      message.success("Đã cập nhật đợt tốt nghiệp");
      setModalOpen(false);
      reload();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Cập nhật đợt tốt nghiệp thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return graduations;
    const q = search.toLowerCase();

    return graduations.filter((g) =>
      [g.name, g.school_year?.toString(), g.certification]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [graduations, search]);

  const totalStudents = graduations.reduce((sum, g) => sum + (g.student_count ?? 0), 0);

  const columns: ColumnsType<Graduation> = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_value, _record, index) => (
        <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Đợt tốt nghiệp",
      dataIndex: "name",
      key: "name",
      render: (value: string) => (
        <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{value}</span>
      ),
    },
    {
      title: "Năm",
      dataIndex: "school_year",
      key: "school_year",
      width: 100,
      align: "center",
      render: (value: number) => <Pill>{value ?? "—"}</Pill>,
    },
    {
      title: "Sinh viên",
      dataIndex: "student_count",
      key: "student_count",
      width: 110,
      align: "center",
      render: (value: number) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: T.muted }}>
          {value != null ? value.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      title: "Số quyết định",
      dataIndex: "certification",
      key: "certification",
      width: 160,
      render: (value: string) =>
        value ? (
          <span style={{ fontSize: 13, color: T.accent, fontWeight: 500 }}>{value}</span>
        ) : (
          <span style={{ color: "#d1d5db" }}>—</span>
        ),
    },
    {
      title: "Ngày quyết định",
      dataIndex: "certification_date",
      key: "certification_date",
      width: 148,
      align: "center",
      render: (value: string) => (
        <Text style={{ fontSize: 13, color: T.sub }}>
          {value
            ? new Date(value).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"}
        </Text>
      ),
    },
    {
      title: "Cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 170,
      align: "center",
      render: (value: string) => (
        <Text style={{ fontSize: 12, color: T.muted }}>
          {value
            ? new Date(value).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 110,
      align: "center",
      render: (_value, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }} onClick={(e) => e.stopPropagation()}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Xoá đợt tốt nghiệp này?"
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

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total: search.trim() ? filtered.length : meta.total,
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} đợt`,
    onChange: (nextPage) => {
      setPage(nextPage);
    },
  };

  return (
    <AdminLayout>
      {/* <div style={{ padding: "24px 28px 32px", minHeight: "100vh", background: T.bg }}> */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.3px",
                }}
              >
                Đợt tốt nghiệp
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: T.sub }}>
                Quản lý danh sách các đợt tốt nghiệp
              </p>
            </div>

            <Row gutter={[12, 12]}>
              <Col xs={12} sm={6}>
                <StatCard label="Tổng đợt tốt nghiệp" value={meta.total} color={T.accent} />
              </Col>
              <Col xs={12} sm={6}>
                <StatCard label="Sinh viên" value={totalStudents.toLocaleString()} color={T.warning} />
              </Col>
            </Row>
          </div>

          {error && <Alert type="error" message={error} showIcon style={{ borderRadius: 8 }} />}

          <div style={{ background: T.surface, borderRadius: 12, overflow: "hidden" }}>
            <div
              style={{
                padding: "12px 20px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                background: "#fafafa",
              }}
            >
              <Input
                prefix={<SearchOutlined style={{ color: T.muted, fontSize: 12 }} />}
                placeholder="Tìm kiếm đợt tốt nghiệp..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ width: 240, height: 34, fontSize: 13 }}
                variant="filled"
                allowClear
              />
              <Button type="primary" icon={<UploadOutlined />}   onClick={() => navigate('/admin/graduation-import')}>
                       Tải lên đợt tốt nghiệp
            </Button>
              <span style={{ marginLeft: "auto", fontSize: 12, color: T.muted }}>
                {search.trim() ? filtered.length : meta.total} đợt
              </span>
            </div>
            
            <Table<Graduation>
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onRow={(record) => ({
                onClick: () =>
                  navigate(`/admin/graduation/${record.id}/${toSlug(record.name)}/students`, {
                    state: { graduationName: record.name },
                  }),
                style: { cursor: "pointer" },
              })}
            />
          </div>
        </div>
      {/* </div> */}

      <Modal
        title="Sửa đợt tốt nghiệp"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên đợt tốt nghiệp"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đợt tốt nghiệp" }]}
          >
            <Input placeholder="VD: Đợt tốt nghiệp tháng 6/2026" />
          </Form.Item>
          <Form.Item label="Năm học" name="schoolYear">
            <InputNumber style={{ width: "100%" }} placeholder="VD: 2026" />
          </Form.Item>
          <Form.Item label="Số quyết định" name="certification">
            <Input placeholder="VD: 123/QĐ-ĐHKHTN" />
          </Form.Item>
          <Form.Item label="Ngày quyết định" name="certificationDate">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}