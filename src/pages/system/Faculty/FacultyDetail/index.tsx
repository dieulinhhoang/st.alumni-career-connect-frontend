import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table, Tag, Typography } from "antd";
import { ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../../components/layout/AdminLayout";
import { useFacultyDetailBySlug } from "../../../../feature/faculty/hooks/useFaculties";
import CustomTable from "../../../../components/common/customTable";

const { Title, Text } = Typography;

type MajorRow = {
  id: string;
  code: string;
  name: string;
  slug?: string | null;
};

export default function FacultyDetailPage() {
  const { facultySlug = "" } = useParams<{ facultySlug: string }>();
  const navigate = useNavigate();

  const { data: faculty, loading, error } = useFacultyDetailBySlug(facultySlug);

  const majors: MajorRow[] = useMemo(() => {
    const raw = Array.isArray((faculty as any)?.majors) ? (faculty as any).majors : [];
    return raw.map((m: any) => ({
      id: String(m.id),
      code: m.code ?? "",
      name: m.name ?? "",
      slug: m.slug ?? null,
    }));
  }, [faculty]);

  const color = (faculty as any)?.color ?? "#2563eb";

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
    </AdminLayout>
  );
}