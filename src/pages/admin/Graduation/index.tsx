import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduations } from "../../../feature/graduation/hooks/useGraduation";
import type { Graduation } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";

const { Text } = Typography;

const pill = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "2px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600,
  background: bg, color, border: `1.5px solid ${color}30`,
});

export default function GraduationList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: graduations, meta, loading, error } = useGraduations(page);

  const filtered = useMemo(() => {
    if (!search.trim()) return graduations;
    const q = search.toLowerCase();
    return graduations.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.school_year?.toString().includes(q) ||
      g.certification?.toLowerCase().includes(q)
    );
  }, [graduations, search]);

  const totalStudents = graduations.reduce((s, g) => s + (g.student_count ?? 0), 0);

  const stats = [
    { label: "Tổng đợt",      value: meta.total,                     color: "#6366f1" },
    { label: "Tổng sinh viên", value: totalStudents.toLocaleString(), color: "#10b981" },
  ];

  const columns: ColumnsType<Graduation> = [
    {
      title: "STT", key: "stt", width: 55, align: "center",
      render: (_, __, i) => (
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          {(meta.current_page - 1) * meta.per_page + i + 1}
        </span>
      ),
    },
    {
      title: "Đợt tốt nghiệp", dataIndex: "name", key: "name",
      render: v => <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{v}</span>,
    },
    {
      title: "Năm tốt nghiệp", dataIndex: "school_year", key: "school_year",
      width: 140, align: "center",
      render: v => <span style={pill("#f5f3ff", "#6d28d9")}>{v}</span>,
    },
    {
      title: "Sinh viên", dataIndex: "student_count", key: "student_count",
      width: 120, align: "center",
      render: v => <span style={{ fontWeight: 700, fontSize: 13, color: "#6d28d9" }}>{v?.toLocaleString() ?? "—"}</span>,
    },
    {
      title: "Số quyết định", dataIndex: "certification", key: "certification",
      width: 170,
      render: v => v ? <span style={pill("#fffbeb", "#d97706")}>{v}</span> : <Text type="secondary">—</Text>,
    },
    {
      title: "Ngày quyết định", dataIndex: "certification_date", key: "certification_date",
      width: 150, align: "center",
      render: v => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {v ? new Date(v).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}
        </Text>
      ),
    },
    {
      title: "Ngày cập nhật", dataIndex: "updated_at", key: "updated_at",
      width: 170, align: "center",
      render: v => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {v ? new Date(v).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}
        </Text>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header + Stats */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "20px 24px", boxShadow: "0 1px 4px #0000000a" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>Đợt tốt nghiệp</div>
            <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>Quản lý danh sách các đợt tốt nghiệp</div>
          </div>
          <Row gutter={[12, 12]}>
            {stats.map(s => (
              <Col key={s.label} xs={12} sm={6}>
                <div style={{ background: s.color + "0d", border: `1.5px solid ${s.color}20`, borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -1 }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: s.color, opacity: 0.75, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", boxShadow: "0 1px 4px #0000000a", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", gap: 10, alignItems: "center" }}>
            <Input
              placeholder="Tìm kiếm đợt tốt nghiệp..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: 260, borderRadius: 8, height: 34 }}
            />
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{filtered.length}/{meta.total}</span>
          </div>
          <Table
            dataSource={filtered} columns={columns} rowKey="id" loading={loading}
            size="middle" scroll={{ x: 900 }}
            onRow={record => ({
              onClick: () => navigate(`/admin/graduation/${record.id}/${toSlug(record.name)}/students`, { state: { graduationName: record.name } }),
              style: { cursor: "pointer" },
            })}
            pagination={{
              current: meta.current_page, pageSize: meta.per_page, total: filtered.length,
              onChange: setPage, showTotal: total => `${total} đợt`, size: "small",
            }}
            locale={{ emptyText: <div style={{ padding: "40px 0", color: "#9ca3af" }}>Không có đợt tốt nghiệp nào</div> }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}