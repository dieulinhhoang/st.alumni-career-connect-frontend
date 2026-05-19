import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Typography, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduations } from "../../../feature/graduation/hooks/useGraduation";
import type { Graduation } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";
import CustomTable from "../../../components/common/customTable";

const { Text } = Typography;

//  Design tokens 
const T = {
  accent:  "#16a34a",   // green-600
  warning: "#f59e0b",   // amber
  text:    "#1e2433",
  sub:     "#8791a6",
  muted:   "#adb5c4",
  border:  "#eceef2",
  surface: "#ffffff",
  bg:      "#f7f8fa",
};

//  Stat card (same style as Enterprise) 
function StatCard({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  return (
    <div style={{ background: "#f4f5f7", borderRadius: 12, padding: "18px 22px" }}>
      <div style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-0.5px", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: T.sub, marginTop: 6, fontWeight: 400 }}>{label}</div>
    </div>
  );
}

//  Pill badge ─
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>
      {children}
    </span>
  );
}

//  Main ─
export default function GraduationList() {
  const navigate = useNavigate();
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [pageSize, setPageSize] = useState(10);

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

  const listData = {
    data: filtered,
    page: {
      total_elements: search.trim() ? filtered.length : meta.total,
      current_page:   meta.current_page,
      total_pages:    meta.total_pages,
    },
  };

  const columns = [
    {
      title: "STT", key: "stt", width: 55, align: "center" as const,
      render: (_: any, __: Graduation, i: number) => (
        <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>
          {(meta.current_page - 1) * meta.per_page + i + 1}
        </span>
      ),
    },
    {
      title: "Đợt tốt nghiệp", dataIndex: "name", key: "name",
      render: (v: string) => (
        <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{v}</span>
      ),
    },
    {
      title: "Năm", dataIndex: "school_year", key: "school_year",
      width: 100, align: "center" as const,
      render: (v: any) => <Pill>{v}</Pill>,
    },
    {
      title: "Sinh viên", dataIndex: "student_count", key: "student_count",
      width: 110, align: "center" as const,
      render: (v: any) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: T.muted }}>
          {v != null ? v.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      title: "Số quyết định", dataIndex: "certification", key: "certification",
      width: 160,
      render: (v: any) =>
        v
          ? <span style={{ fontSize: 13, color: T.accent, fontWeight: 500 }}>{v}</span>
          : <span style={{ color: "#d1d5db" }}>—</span>,
    },
    {
      title: "Ngày quyết định", dataIndex: "certification_date", key: "certification_date",
      width: 148, align: "center" as const,
      render: (v: any) => (
        <Text style={{ fontSize: 13, color: T.sub }}>
          {v
            ? new Date(v).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
            : <span style={{ color: "#d1d5db" }}>—</span>}
        </Text>
      ),
    },
    {
      title: "Cập nhật", dataIndex: "updated_at", key: "updated_at",
      width: 150, align: "center" as const,
      render: (v: any) => (
        <Text style={{ fontSize: 12, color: T.muted }}>
          {v
            ? new Date(v).toLocaleString("vi-VN", {
                hour: "2-digit", minute: "2-digit",
                day: "2-digit", month: "2-digit", year: "numeric",
              })
            : <span style={{ color: "#d1d5db" }}>—</span>}
        </Text>
      ),
    },
  ];

  return (
    <AdminLayout>

      <div style={{ padding: "24px 28px 32px",  minHeight: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/*  Header  */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.3px" }}>
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

          {/*  Table card  */}
          <div style={{
            background: T.surface,
            
          }}>
            {/* Filter bar */}
            <div style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
              background: "#fafafa",
            }}>
              <Input
                prefix={<SearchOutlined style={{ color: T.muted, fontSize: 12 }} />}
                placeholder="Tìm kiếm đợt tốt nghiệp..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ width: 240, height: 34, fontSize: 13 }}
                variant="filled"
                allowClear
              />
              <span style={{ marginLeft: "auto", fontSize: 12, color: T.muted }}>
                {search.trim() ? filtered.length : meta.total} đợt
              </span>
            </div>

            {/* Table */}
            <div >
              <CustomTable
                columns={columns}
                data={listData}
                filter={{ page: page - 1, size: pageSize }}
                loading={loading}
                handleTableChange={(p: any) => {
                  setPage(p.current || 1);
                  setPageSize(p.pageSize || pageSize);
                }}
                rowKey="id"
                onRow={(record: Graduation) => ({
                  onClick: () =>
                    navigate(
                      `/admin/graduation/${record.id}/${toSlug(record.name)}/students`,
                      { state: { graduationName: record.name } }
                    ),
                  style: { cursor: "pointer" },
                })}
              />
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}