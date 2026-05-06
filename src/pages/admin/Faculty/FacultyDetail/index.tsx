import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Select, Button, Tag, Typography } from "antd";
import { ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../../components/layout/AdminLayout";
import { useFacultyDetail } from "../../../../feature/faculty/hooks/useFaculties";
import type { Major } from "../../../../feature/faculty/types";
import CustomTable from "../../../../components/common/customTable";

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
      render: (v) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: (faculty?.color ?? "#7c3aed") + "15",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <BookOutlined style={{ color: faculty?.color ?? "#7c3aed", fontSize: 13 }} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1e1b4b" }}>{v}</div>
        </div>
      ),
    },
    {
      title: "Mã ngành",
      dataIndex: "code",
      key: "code",
      width: 120,
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

  const color = faculty.color;

  return (
    <AdminLayout>
      <div>
        {/* Back */}
        <Button
          icon={<ArrowLeftOutlined />} type="text"
          style={{ marginBottom: 16, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate("/admin/faculties")}
        >Quay lại danh sách khoa</Button>

       
        <div style={{
          borderRadius: 16,
          border: `1px solid ${color}25`,
          overflow: "hidden",
          marginBottom: 20,
          background: "white",
        }}>
          {/* Gradient banner */}
          <div style={{
            height: 90,
            background: `linear-gradient(135deg, ${color}35 0%, ${color}60 100%)`,
          }} />

          {/* Avatar + Info — padding starts here, avatar pulled up with negative marginTop */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 24px 20px",
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "white",
              border: `2px solid ${color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: -32, // avatar overlaps banner bottom by ~half its height
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}>
              <span style={{ fontWeight: 900, fontSize: 13, color }}>{faculty.abbr}</span>
            </div>
            <div style={{ paddingTop: 12 }}>
              <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>{faculty.name}</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {majors.length} ngành đào tạo &nbsp;|&nbsp; {majors.reduce((s, m) => s + m.students, 0).toLocaleString()} sinh viên
              </Text>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <Text style={{ fontSize: 13, color: "#6b7280" }}>Lọc theo khóa:</Text>
          <Select value={khoaFilter} onChange={setKhoaFilter} style={{ width: 140 }}>
            <Select.Option value="all">Tất cả khóa</Select.Option>
            {ALL_KHOA.map(k => <Select.Option key={k} value={k}>Khóa {k}</Select.Option>)}
          </Select>
          <Text type="secondary" style={{ fontSize: 12 }}>{filtered.length} ngành</Text>
        </div>

        {/* Table */}
        <CustomTable
          columns={columns}
          data={{ data: filtered }}
          rowKey="id"
          pagination={false}
          onRow={(record: Major) => ({
            style: { cursor: "pointer" },
            onClick: () => navigate(`/admin/faculties/${facultySlug}/${record.slug}`),
          })}
        />
      </div>
    </AdminLayout>
  );
}