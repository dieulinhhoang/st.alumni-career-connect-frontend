import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Typography, Alert, Input, Tag } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduationStudents } from "../../../feature/graduation/hooks/useGraduation";
import type { GraduationStudent } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";

const { Title, Text } = Typography;

export default function GraduationStudentsPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const graduationName = (location.state as { graduationName?: string })?.graduationName ?? "Đợt tốt nghiệp";
  const graduationId = Number(id);

  const { data: students, meta, loading, error } = useGraduationStudents(graduationId, page);

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(s =>
      s.full_name?.toLowerCase().includes(q) ||
      s.code?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.citizen_identification?.includes(q) ||
      s.training_industry_name?.toLowerCase().includes(q)
    );
  }, [students, search]);

  const columns: ColumnsType<GraduationStudent> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {(meta.current_page - 1) * meta.per_page + index + 1}
        </Text>
      ),
    },
    {
      title: "Mã SV",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: v => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      render: v => <Text style={{ fontSize: 14, fontWeight: 500 }}>{v}</Text>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      render: v => <Text style={{ fontSize: 13 }}>{v === "male" ? "Nam" : "Nữ"}</Text>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 120,
      align: "center",
      render: v => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {v ? new Date(v).toLocaleDateString("vi-VN") : "—"}
        </Text>
      ),
    },
    {
      title: "CCCD",
      dataIndex: "citizen_identification",
      key: "citizen_identification",
      width: 140,
      render: v => <Text style={{ fontSize: 13 }}>{v ?? "—"}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: v => <Text style={{ fontSize: 13 }}>{v ?? "—"}</Text>,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: v => <Text style={{ fontSize: 13 }}>{v ?? "—"}</Text>,
    },
    {
      title: "Mã ngành",
      dataIndex: "training_industry_code",
      key: "training_industry_code",
      width: 120,
      align: "center",
      render: v => <Tag style={{ background: "#e0f2fe", color: "#0369a1", border: "none", fontWeight: 600, fontSize: 12, borderRadius: 6 }}>{v ?? "—"}</Tag>,
    },
    {
      title: "Tên ngành",
      dataIndex: "training_industry_name",
      key: "training_industry_name",
      width: 200,
      render: (v, record) => (
        <Text style={{ fontSize: 13 }}>
          {v ?? `ID: ${record.training_industry_id}`}
        </Text>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          style={{ marginBottom: 12, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate("/admin/graduation")}
        >
          Quay lại danh sách đợt tốt nghiệp
        </Button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0, color: "#2330ef" }}>{graduationName}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {loading ? "Đang tải..." : `${meta.total} sinh viên`}
            </Text>
          </div>
          <Input
            placeholder="Tìm kiếm sinh viên..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 260, borderRadius: 8 }}
            allowClear
          />
        </div>

        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          size="middle"
          scroll={{ x: 1200 }}
          onRow={record => ({
            onClick: () => navigate(
              `/admin/graduation/${id}/${slug}/students/${record.id}/${toSlug(record.full_name)}`,
              { state: { student: record, graduationName } }
            ),
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: meta.current_page,
            pageSize: meta.per_page,
            total: filtered.length,
            onChange: setPage,
            showTotal: total => `${total} sinh viên`,
            size: "small",
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px 0", color: "#9ca3af" }}>
                Không có sinh viên nào
              </div>
            ),
          }}
        />
      </div>
    </AdminLayout>
  );
}