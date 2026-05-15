import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal, Tooltip } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

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
    { label: "Tổng", value: enterprises.length, color: C.primary },
    { label: "Hoạt động", value: enterprises.filter(e => e.partnerStatus === "active").length, color: C.success },
    { label: "Tạm dừng", value: enterprises.filter(e => e.partnerStatus === "inactive").length, color: C.danger },
    { label: "Vị trí tuyển", value: enterprises.filter(e => e.partnerStatus === "active").reduce((s, e) => s + e.jobs, 0), color: C.warning },
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

  const columns = [
    {
      title: "Doanh nghiệp", key: "name", width: 260,
      render: (_: any, r: Enterprise) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: faded(r) ? 0.45 : 1 }}>
          <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 9, background: `${r.color}18`, border: `1.5px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: r.color }}>{r.abbr}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>{r.website}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngành", dataIndex: "industry", key: "industry", width: 150,
      render: (v: string, r: Enterprise) => <span style={pill(faded(r))}>{v}</span>,
    },
    {
      title: "Khoa đối tác", key: "faculties", width: 210,
      render: (_: any, r: Enterprise) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, opacity: faded(r) ? 0.45 : 1 }}>
          {r.faculties.slice(0, 2).map(k => (
            <span key={k} style={pill()}>{FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}</span>
          ))}
          {r.faculties.length > 2 && (
            <Tooltip title={r.faculties.slice(2).map(k => FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k).join(", ")}>
              <span style={{ ...pill(), cursor: "pointer" }}>+{r.faculties.length - 2}</span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Việc làm", dataIndex: "jobs", key: "jobs", align: "center" as const, width: 90,
      render: (v: number, r: Enterprise) => (
        <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, fontWeight: 700, fontSize: 14, background: faded(r) ? "#f4f4f5" : "#f5f3ff", color: faded(r) ? C.sub : "#6d28d9" }}>{v}</span>
      ),
    },
    {
      title: "Hành động", key: "actions", align: "center" as const, width: 120,
      render: (_: any, r: Enterprise) => (
        <Button size="small" icon={<EditOutlined />} style={{ borderRadius: 6, borderColor: "#d1d5db", color: C.muted }} onClick={e => { e.stopPropagation(); setModal({ open: true, enterprise: r }); }} />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="stats-page">

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 24px", boxShadow: "0 1px 4px #0000000a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>Doanh nghiệp đối tác</h2>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: C.sub }}>Quản lý danh sách và trạng thái hợp tác</p>
              </div>
              <Button type="primary" icon={<PlusOutlined />} style={{ background: C.primary, border: "none", borderRadius: 9, fontWeight: 600, height: 40, paddingInline: 20, fontSize: 14, boxShadow: `0 2px 8px ${C.primary}40` }} onClick={() => setModal({ open: true, enterprise: null })}>
                Thêm doanh nghiệp
              </Button>
            </div>
            <Row gutter={[12, 12]}>
              {stats.map(s => (
                <Col key={s.label} xs={12} sm={6}>
                  <div style={{ background: `${s.color}0d`, border: `1.5px solid ${s.color}20`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 800, color: s.color, letterSpacing: -1 }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: s.color, opacity: 0.8, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px #0000000a", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, minWidth: 140, borderRadius: 8, height: 38 }} allowClear />
              <Select value={industry} onChange={setIndustry} style={{ width: 160, minWidth: 130, height: 38 }}>
                <Select.Option value="Tất cả ngành">Tất cả ngành</Select.Option>
                {INDUSTRIES.map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
              </Select>
              <Select value={facultyFilter} onChange={setFacultyFilter} style={{ width: 160, minWidth: 130, height: 38 }}>
                <Select.Option value="all">Tất cả khoa</Select.Option>
                {ALL_FACULTIES.map(k => <Select.Option key={k} value={k}>{FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}</Select.Option>)}
              </Select>
              <Button onClick={() => { setSearch(""); setIndustry("Tất cả ngành"); setFacultyFilter("all"); }} style={{ borderRadius: 7, height: 38, color: C.muted, fontSize: 14 }}>Xóa bộ lọc</Button>
              <span style={{ marginLeft: "auto", fontSize: 14, color: C.sub, flexShrink: 0 }}>{filtered.length}/{enterprises.length}</span>
            </div>
            <CustomTable
              columns={columns} data={listData} filter={query} loading={loading}
              handleTableChange={(p: any) => setQuery(prev => ({ ...prev, page: (p.current || 1) - 1, size: p.pageSize || prev.size }))}
              rowKey="id" scroll={{ x: 760 }}
              rowClassName={(_: Enterprise, i: number) => i % 2 === 1 ? "row-stripe" : ""}
              onRow={(r: Enterprise) => ({ onClick: () => navigate(`/admin/enterprises/${toSlug(r.name)}`), style: { cursor: "pointer", opacity: faded(r) ? 0.65 : 1, transition: "background 0.12s" } })}
            />
          </div>
        </div>
      </div>
      <EnterpriseFormModal open={modal.open} enterprise={modal.enterprise} onClose={() => setModal({ open: false, enterprise: null })} onSave={handleSave} />
    </AdminLayout>
  );
}