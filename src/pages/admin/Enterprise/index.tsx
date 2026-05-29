import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import AdminLayout from "../../../components/layout/AdminLayout";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import {
  INDUSTRIES,
  type PartnerStatus,
  type EnterpriseFormValues,
  type Enterprise,
  type Faculty,
} from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";
import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";
 
const T = {
  accent: "#16a34a",
  success: "#ecdd40",
  danger: "#595040",
  warning: "#8e713f",
  text: "#1e2433",
  sub: "#8791a6",
  muted: "#adb5c4",
  border: "#eceef2",
  surface: "#ffffff",
  bg: "#f7f8fa",
  hover: "#f3f4f8",
};

const stripeCSS = document.createElement("style");
stripeCSS.textContent = `
  .row-stripe td { background: #f9fafb !important; }
  .ent-row:hover td { background: #f3f4f8 !important; transition: background 0.15s; }
`;
if (!document.head.querySelector("[data-stripe]")) {
  stripeCSS.setAttribute("data-stripe", "1");
  document.head.appendChild(stripeCSS);
}

const chip = (faded = false): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 10px",
  borderRadius: 5,
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
  background: "#f0f1f5",
  color: "#5e6880",
  border: "1px solid #e4e6ed",
  opacity: faded ? 0.4 : 1,
  letterSpacing: "0.01em",
});

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        background: "#f4f5f7",
        borderRadius: 12,
        padding: "18px 22px",
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-0.5px",
          lineHeight: 1,
        }}
      >
        {value.toLocaleString("vi-VN")}
      </div>
      <div style={{ fontSize: 13, color: T.sub, marginTop: 6, fontWeight: 400 }}>
        {label}
      </div>
    </div>
  );
}

// FIX: ép String để tránh type mismatch giữa number và string khi so sánh
function getEnterpriseFacultyValue(enterprise: Enterprise): string | undefined {
  const raw = enterprise.faculty;

  if (!raw) return undefined;
  if (typeof raw === "string") return raw;

  const id = raw.id ?? raw.code ?? raw.name ?? undefined;
  return id !== undefined ? String(id) : undefined;
}

function getEnterpriseFacultyLabel(enterprise: Enterprise, faculties: Faculty[]): string {
  const raw = enterprise.faculty;

  if (!raw) return "-";

  if (typeof raw === "object") {
    return raw.name ?? raw.code ?? raw.id ?? "-";
  }

  const matched = faculties.find(
    (f) => f.id === raw || f.code === raw || f.name === raw,
  );

  return matched?.name ?? raw;
}

export default function EnterprisePage() {
  const navigate = useNavigate();

  const {
    enterprises,
    loading,
    addEnterprise,
    editEnterprise,
    togglePartnerStatus,
  } = useEnterprises();

  const { faculties = [], loading: facultiesLoading } = useFaculties();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [query, setQuery] = useState({ page: 1, size: 8 });
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({
    open: false,
    enterprise: null,
  });

  const faded = (r: Enterprise) => r.partnerStatus === "inactive";

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const keyword = search.trim().toLowerCase();

      const matchSearch =
        !keyword ||
        e.name.toLowerCase().includes(keyword) ||
        e.email.toLowerCase().includes(keyword);

      const matchIndustry =
        industry === "Tất cả ngành" || e.industry === industry;

      const facultyValue = getEnterpriseFacultyValue(e);
      // FIX: ép cả hai về String để so sánh chính xác
      const matchFaculty =
        facultyFilter === "all" || String(facultyValue) === String(facultyFilter);

      return matchSearch && matchIndustry && matchFaculty;
    });
  }, [enterprises, search, industry, facultyFilter]);

  const stats = [
    { label: "Tổng doanh nghiệp", value: enterprises.length, color: T.accent },
    {
      label: "Đang hoạt động",
      value: enterprises.filter((e) => e.partnerStatus === "active").length,
      color: T.success,
    },
    {
      label: "Tạm ngưng",
      value: enterprises.filter((e) => e.partnerStatus === "inactive").length,
      color: T.danger,
    },
    {
      label: "Vị trí tuyển dụng",
      value: enterprises
        .filter((e) => e.partnerStatus === "active")
        .reduce((sum, e) => sum + e.jobs, 0),
      color: T.warning,
    },
  ];

  const handleSave = async (values: EnterpriseFormValues) => {
    if (modal.enterprise) {
      await editEnterprise(modal.enterprise.id, values);
    } else {
      await addEnterprise(values);
    }

    setModal({ open: false, enterprise: null });
  };

  const handleToggle = (id: string, checked: boolean) => {
    const ent = enterprises.find((e) => e.id === id);
    if (!ent) return;

    const newStatus: PartnerStatus = checked ? "active" : "inactive";

    if (!checked) {
      Modal.confirm({
        title: "Ngưng hợp tác đối tác?",
        content: `"${ent.name}" sẽ bị hủy kích hoạt.`,
        okText: "Hủy kích hoạt",
        okType: "danger",
        cancelText: "Quay lại",
        onOk: () => togglePartnerStatus(id, newStatus),
      });
      return;
    }

    togglePartnerStatus(id, newStatus);
  };

  const columns: ColumnsType<Enterprise> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 55,
      render: (_value, _record, index) => (
        <span style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>
          {(query.page - 1) * query.size + index + 1}
        </span>
      ),
    },
    {
      title: "Doanh nghiệp",
      key: "name",
      width: 270,
      render: (_value, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: faded(r) ? 0.4 : 1 }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: T.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {r.name}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{r.website}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      width: 155,
      render: (value: string, r) => <span style={chip(faded(r))}>{value}</span>,
    },
    {
      title: "Việc làm",
      dataIndex: "jobs",
      key: "jobs",
      align: "center",
      width: 90,
      render: (value: number, r) => (
        <span
          style={{
            display: "inline-block",
            padding: "3px 13px",
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 13,
            color: faded(r) ? T.muted : T.accent,
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ minHeight: "100vh", padding: "24px 28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Doanh nghiệp đối tác
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: T.sub }}>
                  Quản lý danh sách và trạng thái hợp tác
                </p>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  background: "#0b69cf",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  height: 38,
                  paddingInline: 18,
                  fontSize: 13,
                  boxShadow: "0 2px 6px rgba(11,105,207,0.3)",
                }}
                onClick={() => setModal({ open: true, enterprise: null })}
              >
                Thêm doanh nghiệp
              </Button>
            </div>

            <Row gutter={[12, 12]}>
              {stats.map((s) => (
                <Col key={s.label} xs={12} sm={6}>
                  <StatCard {...s} />
                </Col>
              ))}
            </Row>
          </div>

          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
                background: "#fafafa",
              }}
            >
              <Input
                prefix={<SearchOutlined style={{ color: T.muted, fontSize: 12 }} />}
                placeholder="Tìm kiếm doanh nghiệp..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setQuery((prev) => ({ ...prev, page: 1 }));
                }}
                style={{
                  width: 220,
                  borderRadius: 8,
                  height: 34,
                  fontSize: 13,
                  background: "#f3f4f6",
                  borderColor: "transparent",
                }}
                variant="filled"
                allowClear
              />

              <Select
                value={industry}
                onChange={(value) => {
                  setIndustry(value);
                  setQuery((prev) => ({ ...prev, page: 1 }));
                }}
                style={{ width: 170, height: 34, fontSize: 13 }}
                variant="filled"
                options={[
                  { label: "Tất cả ngành", value: "Tất cả ngành" },
                  ...INDUSTRIES.map((i) => ({ label: i, value: i })),
                ]}
              />

              <Select
                value={facultyFilter === "all" ? undefined : facultyFilter}
                onChange={(value) => {
                  setFacultyFilter(value ?? "all");
                  setQuery((prev) => ({ ...prev, page: 1 }));
                }}
                loading={facultiesLoading}
                allowClear
                showSearch
                placeholder="Chọn khoa liên kết"
                style={{ width: 190, height: 34, fontSize: 13 }}
                optionFilterProp="children"
                notFoundContent={facultiesLoading ? "Đang tải..." : "Không có khoa"}
                getPopupContainer={(trigger) => trigger.parentElement!}
              >
                {(faculties ?? []).map((f: any) => (
                  <Select.Option
                    key={String(f.id ?? f.facultyId)}
                    value={String(f.id ?? f.facultyId)}
                  >
                    {f.name ?? f.facultyName ?? `Khoa #${f.id ?? ""}`}
                  </Select.Option>
                ))}
              </Select>

              {(search || industry !== "Tất cả ngành" || facultyFilter !== "all") && (
                <Button
                  type="text"
                  onClick={() => {
                    setSearch("");
                    setIndustry("Tất cả ngành");
                    setFacultyFilter("all");
                    setQuery((prev) => ({ ...prev, page: 1 }));
                  }}
                  style={{
                    height: 34,
                    color: T.danger,
                    fontSize: 13,
                    padding: "0 10px",
                    borderRadius: 8,
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}

              <span style={{ marginLeft: "auto", fontSize: 12, color: T.muted }}>
                {filtered.length} / {enterprises.length} doanh nghiệp
              </span>
            </div>

            <Table<Enterprise>
              rowKey="id"
              dataSource={filtered}
              columns={columns}
              loading={loading}
              pagination={{
                current: query.page,
                pageSize: query.size,
                total: filtered.length,
                showSizeChanger: true,
                pageSizeOptions: [8, 10, 20, 50],
              }}
              onChange={(pagination: TablePaginationConfig) => {
                setQuery((prev) => ({
                  ...prev,
                  page: pagination.current || 1,
                  size: pagination.pageSize || prev.size,
                }));
              }}
              scroll={{ x: 760 }}
              rowClassName={(_record, index) => `ent-row${index % 2 === 1 ? " row-stripe" : ""}`}
              onRow={(r) => ({
                onClick: () => navigate(`/admin/enterprises/${toSlug(r.name)}`),
                style: { cursor: "pointer", opacity: faded(r) ? 0.6 : 1 },
              })}
            />
          </div>
        </div>
      </div>

      <EnterpriseFormModal
        open={modal.open}
        enterprise={modal.enterprise}
        faculties={faculties}
        onClose={() => setModal({ open: false, enterprise: null })}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}
