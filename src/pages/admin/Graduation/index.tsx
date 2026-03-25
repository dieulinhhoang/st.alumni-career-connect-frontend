import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Typography, Alert, Tag, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduations } from "../../../feature/graduation/hooks/useGraduation";
import type { Graduation } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";

const { Title, Text } = Typography;

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

  const columns: ColumnsType<Graduation> = [
    {
      title: "Đợt tốt nghiệp",
      dataIndex: "name",
      key: "name",
      render: v => (
        <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
      ),
    },
    {
      title: "Năm tốt nghiệp",
      dataIndex: "school_year",
      key: "school_year",
      width: 140,
      align: "center",
      render: v => (
        <Tag style={{
          background: "#ede9fe", color: "#4f15ab",
          border: "none", fontWeight: 600, fontSize: 12, borderRadius: 6,
        }}>
          {v}
        </Tag>
      ),
    },
    {
      title: "Tổng số sinh viên",
      dataIndex: "student_count",
      key: "student_count",
      width: 160,
      align: "center",
      render: v => (
        <span style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>
          {v?.toLocaleString() ?? "—"}
        </span>
      ),
    },
    {
      title: "Số quyết định",
      dataIndex: "certification",
      key: "certification",
      width: 160,
      align: "center",
      render: v => (
        <Tag style={{
          background: "#fef9c3", color: "#854d0e",
          border: "none", fontWeight: 600, fontSize: 12, borderRadius: 6,
        }}>
          {v ?? "—"}
        </Tag>
      ),
    },
    {
      title: "Ngày quyết định",
      dataIndex: "certification_date",
      key: "certification_date",
      width: 150,
      align: "center",
      render: v => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {v
            ? new Date(v).toLocaleDateString("vi-VN", {
                day: "2-digit", month: "2-digit", year: "numeric",
              })
            : "—"}
        </Text>
      ),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 170,
      align: "center",
      render: v => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {v ? new Date(v).toLocaleString("vi-VN", {
            hour: "2-digit", minute: "2-digit",
            day: "2-digit", month: "2-digit", year: "numeric",
          }) : "—"}
        </Text>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Đợt tốt nghiệp</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {loading ? "Đang tải..." : `${meta.total} đợt • ${totalStudents.toLocaleString()} sinh viên`}
            </Text>
          </div>
          <Input
            placeholder="Tìm kiếm ..."
            // prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 280, borderRadius: 8 }}
            // allowClear
          />
        </div>

        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

        {/* Table */}
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          size="middle"
          onRow={record => ({
            onClick: () => navigate(
              `/admin/graduation/${record.id}/${toSlug(record.name)}/students`,
              { state: { graduationName: record.name } }
            ),
            style: { cursor: "pointer" },
          })}
          pagination={{
            current: meta.current_page,
            pageSize: meta.per_page,
            total: filtered.length,
            onChange: setPage,
            showTotal: total => `${total} đợt`,
            size: "small",
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px 0", color: "#9ca3af" }}>
                <div>Không có đợt tốt nghiệp nào</div>
              </div>
            ),
          }}
        />
      </div>
    </AdminLayout>
  );
}