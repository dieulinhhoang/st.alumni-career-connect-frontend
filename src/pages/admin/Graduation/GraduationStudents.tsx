import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Alert, Input } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduationStudents } from "../../../feature/graduation/hooks/useGraduation";
import type { GraduationStudent } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";

const pill = (color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center",
  padding: "2px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600,
  background: "#fff", color, border: `1.5px solid ${color}40`,
});

const card: React.CSSProperties = {
  background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

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
      title: "STT", key: "stt", width: 55, align: "center",
      render: (_, __, i) => <span style={{ fontSize: 12, color: "#9ca3af" }}>{(meta.current_page - 1) * meta.per_page + i + 1}</span>,
    },
    {
      title: "Mã SV", dataIndex: "code", key: "code", width: 115,
      render: v => <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 600 }}>{v}</span>,
    },
    {
      title: "Họ tên", dataIndex: "full_name", key: "full_name",
      render: v => <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{v}</span>,
    },
    {
      title: "Giới tính", dataIndex: "gender", key: "gender", width: 90, align: "center",
      render: v => <span style={{ fontSize: 12.5, color: "#6b7280" }}>{v === "male" ? "Nam" : "Nữ"}</span>,
    },
    {
      title: "Ngày sinh", dataIndex: "dob", key: "dob", width: 115, align: "center",
      render: v => <span style={{ fontSize: 12, color: "#9ca3af" }}>{v ? new Date(v).toLocaleDateString("vi-VN") : "—"}</span>,
    },
    {
      title: "CCCD", dataIndex: "citizen_identification", key: "citizen_identification", width: 140,
      render: v => <span style={{ fontSize: 12.5, color: "#374151" }}>{v ?? "—"}</span>,
    },
    {
      title: "Email", dataIndex: "email", key: "email",
      render: v => <span style={{ fontSize: 12.5, color: "#374151" }}>{v ?? "—"}</span>,
    },
    {
      title: "SĐT", dataIndex: "phone", key: "phone", width: 125,
      render: v => <span style={{ fontSize: 12.5, color: "#374151" }}>{v ?? "—"}</span>,
    },
    {
      title: "Mã ngành", dataIndex: "training_industry_code", key: "training_industry_code", width: 115, align: "center",
      render: v => v ? <span style={pill("#0369a1")}>{v}</span> : <span style={{ color: "#d1d5db" }}>—</span>,
    },
    {
      title: "Tên ngành", dataIndex: "training_industry_name", key: "training_industry_name", width: 200,
      render: (v, r) => <span style={{ fontSize: 12.5, color: "#374151" }}>{v ?? `ID: ${r.training_industry_id}`}</span>,
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header */}
        <div style={{ ...card, padding: "20px 24px" }}>
          <button
            onClick={() => navigate("/admin/graduation")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 12.5, fontWeight: 500, marginBottom: 14, padding: 0 }}
          >
            <ArrowLeftOutlined style={{ fontSize: 11 }} /> Quay lại danh sách đợt tốt nghiệp
          </button>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>{graduationName}</div>
          <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>
            {loading ? "Đang tải..." : `${meta.total} sinh viên`}
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Table */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
            <Input
              // prefix={<SearchOutlined style={{ color: "#9ca3af", fontSize: 12 }} />}
              placeholder="Tìm theo tên, mã SV, email, CCCD, ngành..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              // allowClear
              style={{ width: 320, borderRadius: 8, height: 34 }}
            />
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{filtered.length}/{meta.total}</span>
          </div>
          <Table
            dataSource={filtered} columns={columns} rowKey="id" loading={loading} size="middle"
            scroll={{ x: 1200 }}
            onRow={record => ({
              onClick: () => navigate(
                `/admin/graduation/${id}/${slug}/students/${record.id}/${toSlug(record.full_name)}`,
                { state: { student: record, graduationName } }
              ),
              style: { cursor: "pointer", transition: "background 0.12s" },
            })}
            pagination={{
              current: meta.current_page, pageSize: meta.per_page, total: filtered.length,
              onChange: setPage, showTotal: t => `${t} sinh viên`, size: "small",
            }}
            locale={{ emptyText: <div style={{ padding: "40px 0", color: "#9ca3af", textAlign: "center" }}>Không có sinh viên nào</div> }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}