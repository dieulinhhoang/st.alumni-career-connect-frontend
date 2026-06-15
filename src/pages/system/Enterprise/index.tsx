import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Input,
  Select,
  Button,
  Tooltip,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import AdminLayout from "../../../components/layout/AdminLayout";
import CustomTable from "../../../components/common/customTable";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import {
  INDUSTRIES,
  type EnterpriseFormValues,
  type Enterprise,
} from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";
import { KpiCard } from "../../../components/common/KpiCard";
import { havePermission } from "../../../feature/auth/permission";
import { PermissionEnum } from "../../../feature/auth/type";

const { Text } = Typography;

// FIX: Dùng color token thống nhất thay vì hardcode
const COLOR = {
  primary: "#16a34a",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#1677ff",
  text: "#0f172a",
  sub: "#64748b",
  muted: "#94a3b8",
  border: "#e5e7eb",
  surface: "#ffffff",
};

function IndustryTag({ value }: { value: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 500,
        color: "#475569",
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

function PartnerStatusBadge({ status }: { status: string }) {
  // FIX: Thống nhất pill badge style
  const map: Record<string, { bg: string; color: string; label: string }> = {
    active:   { bg: "#f0fdf4", color: "#16a34a", label: "Hoạt động" },
    inactive: { bg: "#fff7ed", color: "#ea580c", label: "Tạm ngưng" },
  };
  const cfg = map[status] ?? map.inactive;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}

export default function EnterprisePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [query, setQuery] = useState({ page: 1, size: 8 });
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({
    open: false,
    enterprise: null,
  });

  const {
    enterprises,
    loading,
    total,
    setPage,
    addEnterprise,
    editEnterprise,
  } = useEnterprises({ page: query.page - 1, size: query.size });

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        e.name.toLowerCase().includes(keyword) ||
        e.email.toLowerCase().includes(keyword);
      const matchIndustry = industry === "Tất cả ngành" || e.industry === industry;
      return matchSearch && matchIndustry;
    });
  }, [enterprises, search, industry]);

  const handleSave = async (values: EnterpriseFormValues) => {
    if (modal.enterprise) {
      await editEnterprise(modal.enterprise.id, values);
    } else {
      await addEnterprise(values);
    }
    setModal({ open: false, enterprise: null });
  };

  const activeCount = enterprises.filter((e) => e.partnerStatus === "active").length;
  const inactiveCount = enterprises.filter((e) => e.partnerStatus === "inactive").length;
  const totalJobs = enterprises.reduce((sum, e) => sum + e.jobs, 0);

  const columns: ColumnsType<Enterprise> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 60,
      render: (_v, _r, index) => (
        <span style={{ fontSize: 13, color: COLOR.muted, fontWeight: 500 }}>
          {(query.page - 1) * query.size + index + 1}
        </span>
      ),
    },
    {
      title: "Doanh nghiệp",
      key: "name",
      dataIndex: "name",
      render: (value: string) => (
        <span style={{ fontWeight: 600, fontSize: 14, color: COLOR.text }}>{value}</span>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      width: 280,
      render: (value: string) => <IndustryTag value={value} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "partnerStatus",
      key: "partnerStatus",
      width: 130,
      render: (value: string) => <PartnerStatusBadge status={value} />,
    },
    {
      title: "Việc làm",
      dataIndex: "jobs",
      key: "jobs",
      width: 100,
      align: "center",
      render: (value: number) => (
        <span style={{ fontWeight: 700, fontSize: 14, color: COLOR.primary }}>
          {value}
        </span>
      ),
    },
    ...(havePermission(PermissionEnum.ENTERPRISES_UPDATE)
      ? [{
          title: "",
          key: "action",
          width: 60,
          align: "center" as const,
          render: (_v: unknown, record: Enterprise) => (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setModal({ open: true, enterprise: record });
                }}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  color: "#94a3b8",
                }}
              />
            </Tooltip>
          ),
        }]
      : []),
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLOR.text, letterSpacing: "-0.3px" }}>
              Doanh nghiệp đối tác
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: COLOR.sub }}>
              Quản lý danh sách và trạng thái hợp tác
            </p>
          </div>
        {havePermission(PermissionEnum.ENTERPRISES_CREATE) && (
          
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setModal({ open: true, enterprise: null })}
            style={{ height: 34, borderRadius: 10, paddingInline: 14, fontWeight: 600 }}
          >
            Thêm doanh nghiệp
          </Button>
     )}
        </div>

        {/* FIX: KPI cards dùng KpiCard thống nhất, màu từ COLOR token */}
        <Row gutter={[14, 14]}>
          <Col xs={12} sm={12} md={6}>
            <KpiCard label="Tổng doanh nghiệp" value={total} accentColor={COLOR.primary} />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <KpiCard label="Đang hoạt động" value={activeCount} accentColor={COLOR.info} />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <KpiCard label="Tạm ngưng" value={inactiveCount} accentColor={COLOR.warning} />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <KpiCard label="Vị trí tuyển dụng" value={totalJobs} accentColor={COLOR.danger} />
          </Col>
        </Row>

        {/* Table card */}
        <div
          style={{
            background: COLOR.surface,
            borderRadius: 12,
            border: `1px solid ${COLOR.border}`,
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${COLOR.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: "#94a3b8", fontSize: 13 }} />}
              placeholder="Tìm kiếm doanh nghiệp..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              // FIX: onClear cũng reset page về 1
              onClear={() => setQuery((prev) => ({ ...prev, page: 1 }))}
              style={{ width: 240, height: 36, fontSize: 13 }}
              variant="filled"
              allowClear
            />

            <Select
              value={industry}
              onChange={(v) => {
                setIndustry(v);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 170, height: 36 }}
              options={[
                { label: "Tất cả ngành", value: "Tất cả ngành" },
                ...INDUSTRIES.map((i) => ({ label: i, value: i })),
              ]}
            />

            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                color: COLOR.sub,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {filtered.length} / {total} doanh nghiệp
            </Text>
          </div>

          <CustomTable<Enterprise>
            rowKey="id"
            data={filtered}
            columns={columns}
            loading={loading}
            pagination={{
              current: query.page,
              pageSize: query.size,
              total: filtered.length,
              showSizeChanger: false,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]} đến ${range[1]} trong số ${total} bản ghi`,
              position: ["bottomRight"],
            }}
            handleTableChange={(pagination) => {
              const newPage = pagination.current || 1;
              const newSize = pagination.pageSize || query.size;
              setQuery({ page: newPage, size: newSize });
              setPage(newPage - 1);
            }}
            scroll={{ x: 760 }}
            onRow={(r) => ({
              onClick: () => navigate(`/admin/enterprises/${toSlug(r.name)}`),
              style: { cursor: "pointer" },
            })}
          />
        </div>

        <EnterpriseFormModal
          open={modal.open}
          enterprise={modal.enterprise}
          faculties={[]}
          onClose={() => setModal({ open: false, enterprise: null })}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}