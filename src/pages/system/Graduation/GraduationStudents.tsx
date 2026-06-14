import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Alert, Input, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";

import AdminLayout from "../../../components/layout/AdminLayout";
import { useGraduationStudents } from "../../../feature/graduation/hooks/useGraduation";
import type { GraduationStudent } from "../../../feature/graduation/type";
import { toSlug } from "../../../components/common/utils";

const pill = (color: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 15,
  fontWeight: 600,
  background: "#fff",
  color,
  border: `1.5px solid ${color}40`,
});

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  // border: "1px solid #e5e7eb",
  // boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

export default function GraduationStudentsPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");

  const graduationName =
    (location.state as { graduationName?: string })?.graduationName ?? "Đợt tốt nghiệp";

  const graduationId = Number(id);

  const { data: students, meta, loading, error } = useGraduationStudents(
    graduationId,
    page,
    pageSize
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();

    return students.filter((s) => {
      const fullName = s.full_name ?? "";
      const code = s.code ?? "";
      const email = s.email ?? "";
      const citizenId = s.citizen_identification ?? "";
      const industryName = s.training_industry_name ?? "";

      return (
        fullName.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        citizenId.includes(q) ||
        industryName.toLowerCase().includes(q)
      );
    });
  }, [students, search]);

  const isSearching = search.trim().length > 0;

  const columns: ColumnsType<GraduationStudent> = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_value, _record, index) => (
        <span style={{ fontSize: 15, color: "#9ca3af" }}>
          {isSearching ? index + 1 : (page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Mã SV",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (value: string) => (
        <span >{value ?? ""}</span>
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      width: 220,
      render: (value: string) => (
        <span >{value ?? ""}</span>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 95,
      align: "center",
      render: (value: string) => (
        <span >
          {value === "male" ? "Nam" : value === "female" ? "Nữ" : "Khác"}
        </span>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 120,
      align: "center",
      render: (value: string) => (
        <span >
          {value ? new Date(value).toLocaleDateString("vi-VN") : ""}
        </span>
      ),
    },
    {
      title: "CCCD",
      dataIndex: "citizen_identification",
      key: "citizen_identification",
      width: 145,
      render: (value: string) => (
        <span >{value ?? ""}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value: string) => (
        <span >{value ?? ""}</span>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (value: string) => (
        <span >{value ?? ""}</span>
      ),
    },
    {
      title: "Mã ngành",
      dataIndex: "training_industry_code",
      key: "training_industry_code",
      width: 120,
      align: "center",
      render: (value: string) =>
        value ? <span >{value}</span> : <span ></span>,
    },
    {
      title: "Tên ngành",
      dataIndex: "training_industry_name",
      key: "training_industry_name",
      width: 210,
      render: (value: string, record) => (
        <span>
          {value ?? (record.training_industry_id ? `ID: ${record.training_industry_id}` : "")}
        </span>
      ),
    },
    {
      title:"Khoa",
      dataIndex: "faculty_name",
      key: "faculty_name",
      width: 270,
      render: (value: string) => (
        <span>{value ?? ""}</span>
      ),
    }
  ];

  const pagination: TablePaginationConfig = isSearching
    ? {
      current: 1,
      pageSize,
      total: filtered.length,
      showSizeChanger: false,
    }
    : {
      current: page,
      pageSize: meta.per_page || pageSize,
      total: meta.total || 0,
      showSizeChanger: false,
      onChange: (nextPage) => {
        setPage(nextPage);
      },
    };

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <button
            onClick={() => navigate("/admin/graduation")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#9ca3af",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 14,
              padding: 0,
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: 13 }} /> Danh sách đợt tốt nghiệp
          </button>

          {/* <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>
            {graduationName}
          </div>

          <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
            {loading ? "Đang tải..." : `${isSearching ? filtered.length : meta.total} sinh viên`}
          </div> */}
        </div>

        {error && <Alert type="error" message={error} showIcon />}

        <div style={{ ...card, overflow: "hidden" }}>
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: "#9ca3af", fontSize: 14 }} />}
              placeholder="Tìm theo tên, mã SV, email, CCCD, ngành..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ flex: "1 1 240px", maxWidth: 380, borderRadius: 8, height: 38 }}
            />

            {/* <span style={{ marginLeft: "auto", fontSize: 14, color: "#9ca3af", whiteSpace: "nowrap" }}>
              {isSearching ? `${filtered.length} kết quả` : `${meta.total} sinh viên`}
            </span> */}
            <span style={{ marginLeft: "auto", fontSize: 14, color: "#9ca3af", whiteSpace: "nowrap" }}>
              <div >
                {graduationName}
              </div>

              <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
                {loading ? "Đang tải..." : `${isSearching ? filtered.length : meta.total} sinh viên`}
              </div>
            </span>
          </div>

          <Table<GraduationStudent>
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onRow={(record) => ({
              onClick: () =>
                navigate(
                  `/admin/graduation/${id}/${slug}/students/${record.id}/${toSlug(record.full_name ?? "student")}`,
                  { state: { student: record, graduationName } }
                ),
              style: { cursor: "pointer" },
            })}
            scroll={{ x: 1400 }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}