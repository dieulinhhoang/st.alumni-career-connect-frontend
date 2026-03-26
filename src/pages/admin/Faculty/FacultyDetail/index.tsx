import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Select, Button, Tag, Typography, Table } from "antd";
import { ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../../components/layout/AdminLayout";
import { useFacultyDetail } from "../../../../feature/faculty/hooks/useFaculties";
import type { Major } from "../../../../feature/faculty/types";

const { Title, Text } = Typography;
const ALL_KHOA = [2021, 2022, 2023, 2024];

export default function FacultyDetailPage() {
  const { facultySlug = "" } = useParams<{ facultySlug: string }>();
  const navigate = useNavigate();
  const [khoaFilter, setKhoaFilter] = useState<number | "all">("all");

  const { faculty, majors, loading } = useFacultyDetail(facultySlug);

  const filtered = khoaFilter === "all"
    ? majors
    : majors.filter(m => m.khoa.includes(khoaFilter as number));

  const columns: ColumnsType<Major> = [
    {
      title: "Tên ngành",
      dataIndex: "name",
      key: "name",
      render: (v, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: faculty!.color + "12",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <BookOutlined style={{ color: faculty!.color, fontSize: 13 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1e1b4b" }}>{v}</div>
            {/* <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
              {record.khoa.map(k => (
                <span key={k} style={{
                  fontSize: 10, padding: "0px 6px", borderRadius: 100,
                  background: khoaFilter === k ? faculty!.color + "20" : "#f3f4f6",
                  color: khoaFilter === k ? faculty!.color : "#9ca3af",
                  fontWeight: 600,
                }}>
                  K{k}
                </span>
              ))}
            </div> */}
          </div>
        </div>
      ),
    },
    {
      title: "Mã ngành",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: v => <Tag color="purple" style={{ fontSize: 11 }}>{v}</Tag>,
    },
    {
      title: "Sinh viên",
      dataIndex: "students",
      key: "students",
      width: 110,
      align: "center",
      render: v => (
        <span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>
          {v.toLocaleString()}
        </span>
      ),
    },
  ];

  if (loading) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Đang tải...</div>
    </AdminLayout>
  );

  if (!faculty) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏫</div>
        <div>Không tìm thấy khoa</div>
        <Button style={{ marginTop: 16 }} onClick={() => navigate("/admin/faculties")}>Quay lại</Button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        {/* Back */}
        <Button
          icon={<ArrowLeftOutlined />} type="text"
          style={{ marginBottom: 16, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate("/admin/faculties")}
        >Quay lại danh sách khoa</Button>

        {/* Hero + Stats gộp chung */}
        <Card style={{ borderRadius: 16, marginBottom: 20, border: `1px solid ${faculty.color}30`, overflow: "hidden" }}>
          <div style={{
            height: 80,
            background: `linear-gradient(135deg, ${faculty.color}22, ${faculty.color}44)`,
            margin: "-50px -24px 0",
            // borderBottom: `2px solid ${faculty.color}20`,
          }} />

          {/* Row: avatar + tên  |  stats */}
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: 16, marginTop: -28,
          }}>
            {/* Left: avatar + tên */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: faculty.color + "18", border: "3px solid white",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0,
              }}>
                <span style={{ fontWeight: 900, fontSize: 14, color: faculty.color }}>{faculty.abbr}</span>
              </div>
              <div style={{ paddingBottom: 4 }}>
                <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>{faculty.name}</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>{majors.length} ngành đào tạo |  {majors.reduce((s, m) => s + m.students, 0).toLocaleString()} sinh viên
</Text>
              </div>
            </div>

            {/* Right: stats */}
            {/* <div style={{ display: "flex", gap: 10, paddingBottom: 6, flexWrap: "wrap" }}>
              <div style={{
                padding: "8px 20px", borderRadius: 10,
                background: faculty.color + "12", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: faculty.color, lineHeight: 1 }}>
                  {majors.length}
                </div>
                <div style={{ fontSize: 11, color: faculty.color, opacity: 0.8, marginTop: 3 }}>Ngành</div>
              </div>
              <div style={{
                padding: "8px 20px", borderRadius: 10,
                background: "#dcfce7", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", lineHeight: 1 }}>
                  {majors.reduce((s, m) => s + m.students, 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: "#16a34a", opacity: 0.8, marginTop: 3 }}>Sinh viên</div>
              </div>
            </div> */}
          </div>
        </Card>

        {/* Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Text style={{ fontSize: 13, color: "#6b7280" }}>Lọc theo khóa:</Text>
          <Select value={khoaFilter} onChange={setKhoaFilter} style={{ width: 140 }}>
            <Select.Option value="all">Tất cả khóa</Select.Option>
            {ALL_KHOA.map(k => <Select.Option key={k} value={k}>Khóa {k}</Select.Option>)}
          </Select>
          <Text type="secondary" style={{ fontSize: 12 }}>{filtered.length} ngành</Text>
        </div>

        {/* Table */}
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={false}
          onRow={record => ({
            // onClick: () => navigate(`/admin/faculties/${facultySlug}/${record.slug}`),
            style: { cursor: "pointer" },
          })}
          locale={{
            emptyText: (
              <div style={{ padding: "40px 0", color: "#9ca3af" }}>
                <div>Không có ngành nào trong khóa này</div>
              </div>
            ),
          }}
        />
      </div>
    </AdminLayout>
  );
}