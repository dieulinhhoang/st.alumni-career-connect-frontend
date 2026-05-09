import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, BankOutlined, CheckCircleOutlined, PauseCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";

import AdminLayout from "../../../components/layout/AdminLayout";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import {
  INDUSTRIES, ALL_FACULTIES, FACULTY_VI_NAME,
  type PartnerStatus, type EnterpriseFormValues, type Enterprise,
} from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";
import CustomTable from "../../../components/common/customTable";

const C = {
  primary: "#6366f1", success: "#10b981", warning: "#f59e0b", danger: "#f43f5e",
  text: "#111827", sub: "#9ca3af", muted: "#6b7280", border: "#f0f0f0",
};

const STAT_CONFIG = [
  { accent: C.primary, iconBg: "#eef2ff", icon: <BankOutlined /> },
  { accent: C.success, iconBg: "#ecfdf5", icon: <CheckCircleOutlined /> },
  { accent: C.danger,  iconBg: "#fff1f2", icon: <PauseCircleOutlined /> },
  { accent: C.warning, iconBg: "#fffbeb", icon: <ThunderboltOutlined /> },
];

const pill = (faded = false): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "4px 12px", borderRadius: 6, fontSize: 14, fontWeight: 500,
  whiteSpace: "nowrap", opacity: faded ? 0.45 : 1,
  background: "#f4f4f5", color: "#52525b", border: "1px solid #e4e4e7",
});

const stripeCSS = document.createElement("style");
stripeCSS.textContent = `.row-stripe td { background: #fafafa !important; }`;
if (!document.head.querySelector("[data-stripe]")) {
  stripeCSS.setAttribute("data-stripe", "1");
  document.head.appendChild(stripeCSS);
}

export default function Enterprise() {
  const navigate = useNavigate();
  const { enterprises, loading, addEnterprise, editEnterprise, verify, togglePartnerStatus } = useEnterprises();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [query, setQuery] = useState({ page: 0, size: 8 });
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({ open: false, enterprise: null });

  const faded = (r: Enterprise) => r.partnerStatus === "inactive";

  const filtered = enterprises.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())) &&
    (industry === "Tất cả ngành" || e.industry === industry) &&
    (facultyFilter === "all" || e.faculties.includes(facultyFilter)),
  );

  const listData = {
    data: filtered,
    page: { total_elements: filtered.length, current_page: query.page, total_pages: Math.ceil(filtered.length / query.size) },
  };

  const stats = [
    { label: "Total",          value: enterprises.length,                                                                    sub: "enterprises",         ...STAT_CONFIG[0] },
    { label: "Active",         value: enterprises.filter(e => e.partnerStatus === "active").length,                          sub: "active partners",     ...STAT_CONFIG[1] },
    { label: "Paused",         value: enterprises.filter(e => e.partnerStatus === "inactive").length,                        sub: "inactive partners",   ...STAT_CONFIG[2] },
    { label: "Job Openings",   value: enterprises.filter(e => e.partnerStatus === "active").reduce((s, e) => s + e.jobs, 0), sub: "positions available",  ...STAT_CONFIG[3] },
  ];

  const handleSave = async (values: EnterpriseFormValues) => {
    modal.enterprise ? await editEnterprise(modal.enterprise.id, values) : await addEnterprise(values);
  };

  const handleToggle = (id: string, checked: boolean) => {
    const ent = enterprises.find(e => e.id === id);
    if (!ent) return;
    const newStatus: PartnerStatus = checked ? "active" : "inactive";
    if (!checked) {
      Modal.confirm({
        title: "Ngừng hợp tác đối tác?", content: `"${ent.name}" sẽ bị hủy kích hoạt.`,
        okText: "Hủy kích hoạt", okType: "danger", cancelText: "Quay lại",
        onOk: () => togglePartnerStatus(id, newStatus),
      });
    } else togglePartnerStatus(id, newStatus);
  };

  // ─── columns identical to original (kept) ──────────────────────────────────
  const columns = [
    {
      title: "Tên doanh nghiệp",
      key: "name",
      render: (_: unknown, r: Enterprise) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: faded(r) ? 0.55 : 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: faded(r) ? "#f3f4f6" : `${C.primary}12`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: faded(r) ? "#9ca3af" : C.primary, flexShrink: 0,
          }}>
            {r.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div
              onClick={() => navigate(`/admin/enterprises/${toSlug(r.name)}`)}
              style={{ fontWeight: 600, fontSize: 14, color: faded(r) ? "#9ca3af" : C.text, cursor: "pointer" }}
            >
              {r.name}
            </div>
            <div style={{ fontSize: 12, color: C.sub }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngành",
      key: "industry",
      render: (_: unknown, r: Enterprise) => <span style={pill(faded(r))}>{r.industry}</span>,
    },
    {
      title: "Khoa liên kết",
      key: "faculties",
      render: (_: unknown, r: Enterprise) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, opacity: faded(r) ? 0.5 : 1 }}>
          {r.faculties.length === 0
            ? <span style={{ fontSize: 12, color: C.sub }}>—</span>
            : r.faculties.map(f => (
                <span key={f} style={{ ...pill(), fontSize: 12, padding: "2px 8px" }}>
                  {FACULTY_VI_NAME[f] ?? f}
                </span>
              ))
          }
        </div>
      ),
    },
    {
      title: "Vị trí tuyển",
      key: "jobs",
      render: (_: unknown, r: Enterprise) => (
        <span style={{ fontWeight: 600, fontSize: 14, color: faded(r) ? C.sub : C.warning }}>
          {r.jobs}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: unknown, r: Enterprise) => {
        const active = r.partnerStatus === "active";
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: active ? "#ecfdf5" : "#fff1f2",
            color: active ? C.success : C.danger,
            border: `1px solid ${active ? C.success : C.danger}30`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.success : C.danger }} />
            {active ? "Hoạt động" : "Tạm dừng"}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, r: Enterprise) => (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small" type="text"
              icon={<EditOutlined />}
              onClick={() => setModal({ open: true, enterprise: r })}
              style={{ color: C.primary }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 0 }}>
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Doanh nghiệp</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>Quản lý danh sách doanh nghiệp đối tác</p>
        </div>

        {/* Stat cards — Statistics KPI style */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {stats.map(s => (
            <Col key={s.label} xs={12} sm={12} md={6}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid rgba(30,41,59,0.10)",
                  boxShadow: "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)",
                  padding: "20px 22px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  transition: "box-shadow 160ms cubic-bezier(0.16,1,0.3,1), transform 160ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 4px 16px rgba(30,41,59,0.09), 0 1px 4px rgba(30,41,59,0.05)";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: s.iconBg,
                  color: s.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.02em", marginBottom: 4, lineHeight: 1 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", lineHeight: 1.1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", marginBottom: 4 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.sub}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm tên, email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: 240, borderRadius: 8 }}
          />
          <Select
            value={industry} onChange={setIndustry}
            style={{ width: 180, borderRadius: 8 }}
            options={[{ value: "Tất cả ngành", label: "Tất cả ngành" }, ...INDUSTRIES.map(v => ({ value: v, label: v }))]}
          />
          <Select
            value={facultyFilter} onChange={setFacultyFilter}
            style={{ width: 160, borderRadius: 8 }}
            options={[{ value: "all", label: "Tất cả khoa" }, ...ALL_FACULTIES.map(f => ({ value: f, label: FACULTY_VI_NAME[f] ?? f }))]}
          />
          <Button
            type="primary" icon={<PlusOutlined />}
            style={{ marginLeft: "auto", borderRadius: 8, background: C.primary, borderColor: C.primary }}
            onClick={() => setModal({ open: true, enterprise: null })}
          >
            Thêm doanh nghiệp
          </Button>
        </div>

        {/* Table */}
        <CustomTable
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{
            current: query.page + 1,
            pageSize: query.size,
            total: filtered.length,
            onChange: (p) => setQuery(q => ({ ...q, page: p - 1 })),
            showSizeChanger: false,
          }}
          rowKey="id"
          rowClassName={(_, i) => (i % 2 === 1 ? "row-stripe" : "")}
        />

        <EnterpriseFormModal
          open={modal.open}
          enterprise={modal.enterprise}
          onClose={() => setModal({ open: false, enterprise: null })}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}
