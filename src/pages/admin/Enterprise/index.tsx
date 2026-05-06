import { useState } from "react";
import {
  Table, Tag, Button, Input, Select, Space, Tooltip,
  Avatar, Badge
} from "antd";
import {
  SearchOutlined, PlusOutlined, EyeOutlined,
  BankOutlined, TeamOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/layout/AdminLayout";
import { EnterpriseFormModal } from "./EnterpriseFormModal";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import { useFacultyColors } from "../../../feature/enterprise/hooks/useFacultyColors";
import {
  FACULTY_VI_NAME,
  type Enterprise, type EnterpriseFormValues,
} from "../../../feature/enterprise/type";
import type { ColumnsType } from "antd/es/table";

export default function EnterprisePage() {
  const navigate = useNavigate();
  const { enterprises, loading, addEnterprise } = useEnterprises();
  const { getColor } = useFacultyColors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = enterprises.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.industry?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.partnerStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: ColumnsType<Enterprise> = [
    {
      title: "Doanh nghiệp",
      key: "name",
      render: (_: any, record: Enterprise) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            style={{ background: record.color + "20", color: record.color, fontWeight: 800, flexShrink: 0 }}
            size={38}
          >
            {record.abbr}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700 }}>{record.name}</div>
            <div style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
              <BankOutlined />{record.industry}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Quy mô",
      dataIndex: "size",
      key: "size",
      render: (size: string) => size ? (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <TeamOutlined style={{ color: "#9ca3af" }} />{size}
        </span>
      ) : "—",
    },
    {
      title: "Khoa liên kết",
      dataIndex: "faculties",
      key: "faculties",
      render: (faculties: string[]) => (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {(faculties ?? []).slice(0, 3).map(k => (
            <Tag key={k} style={{ background: getColor(k) + "15", color: getColor(k), border: `1px solid ${getColor(k)}30`, margin: 0 }}>
              {FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}
            </Tag>
          ))}
          {(faculties ?? []).length > 3 && <Tag>+{faculties.length - 3}</Tag>}
        </div>
      ),
    },
    {
      title: "Tin tuyển dụng",
      key: "jobs",
      render: (_: any, record: Enterprise) => (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Badge count={record.activeJobCount ?? 0} style={{ backgroundColor: record.color }} />
          <span style={{ color: "#6b7280" }}>đang tuyển</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "partnerStatus",
      key: "partnerStatus",
      render: (status: string) => (
        <Tag color={status === "active" ? "blue" : "error"}>
          {status === "active" ? "Đang hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Enterprise) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary" icon={<EyeOutlined />} size="small"
              style={{ background: record.color, border: "none" }}
              onClick={() => navigate(`/admin/enterprises/${record.slug}`)}
            >
              Chi tiết
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: "0 0 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800 }}>Doanh nghiệp đối tác</div>
            <div style={{ color: "#6b7280" }}>Quản lý các doanh nghiệp và tin tuyển dụng</div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Thêm doanh nghiệp
          </Button>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Tìm kiếm doanh nghiệp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "active", label: "Đang hoạt động" },
              { value: "inactive", label: "Không hoạt động" },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} doanh nghiệp` }}
          style={{ background: "white", borderRadius: 12, overflow: "hidden" }}
        />
      </div>

      <EnterpriseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addEnterprise as (v: EnterpriseFormValues) => Promise<void>}
      />
    </AdminLayout>
  );
}
