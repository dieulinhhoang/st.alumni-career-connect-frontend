import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal } from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";

import AdminLayout from "../../../components/layout/AdminLayout";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import {
  INDUSTRIES, ALL_FACULTIES, FACULTY_VI_NAME,
  type PartnerStatus, type EnterpriseFormValues, type Enterprise,
} from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";
import CustomTable from "../../../components/common/customTable";

//  Design tokens 
const T = {
  accent:   "#16a34a",           
  success:  "#ecdd40",           
  danger:   "#595040",         
  warning:  "#8e713f",         
  text:     "#1e2433",
  sub:      "#8791a6",
  muted:    "#adb5c4",
  border:   "#eceef2",
  surface:  "#ffffff",
  bg:       "#f7f8fa",
  hover:    "#f3f4f8",
};

// Stripe row style injection
const stripeCSS = document.createElement("style");
stripeCSS.textContent = `.row-stripe td { background: #f9fafb !important; }
.ent-row:hover td { background: #f3f4f8 !important; transition: background 0.15s; }`;
if (!document.head.querySelector("[data-stripe]")) {
  stripeCSS.setAttribute("data-stripe", "1");
  document.head.appendChild(stripeCSS);
}

//  Chip / pill 
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

//  Stat card 
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "#f4f5f7",
      borderRadius: 12,
      padding: "18px 22px",
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-0.5px", lineHeight: 1 }}>
        {value.toLocaleString("vi-VN")}
      </div>
      <div style={{ fontSize: 13, color: T.sub, marginTop: 6, fontWeight: 400 }}>{label}</div>
    </div>
  );
}

//  Main component 
export default function Enterprise() {
  const navigate = useNavigate();
  const { enterprises, loading, addEnterprise, editEnterprise, verify, togglePartnerStatus } = useEnterprises();

  const [search, setSearch]               = useState("");
  const [industry, setIndustry]           = useState("Tất cả ngành");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [query, setQuery]                 = useState({ page: 0, size: 8 });
  const [modal, setModal]                 = useState<{ open: boolean; enterprise: Enterprise | null }>({ open: false, enterprise: null });

  const faded = (r: Enterprise) => r.partnerStatus === "inactive";

  const filtered = enterprises.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())) &&
    (industry === "Tất cả ngành" || e.industry === industry) &&
    (facultyFilter === "all" || e.faculties.includes(facultyFilter)),
  );

  const listData = {
    data: filtered,
    page: {
      total_elements: filtered.length,
      current_page: query.page,
      total_pages: Math.ceil(filtered.length / query.size),
    },
  };

  const stats = [
    { label: "Tổng doanh nghiệp",  value: enterprises.length,                                                                  color: T.accent  },
    { label: "Đang hoạt động",     value: enterprises.filter(e => e.partnerStatus === "active").length,                        color: T.success },
    { label: "Tạm ngừng",          value: enterprises.filter(e => e.partnerStatus === "inactive").length,                      color: T.danger  },
    { label: "Vị trí tuyển dụng",  value: enterprises.filter(e => e.partnerStatus === "active").reduce((s, e) => s + e.jobs, 0), color: T.warning },
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
        title: "Ngừng hợp tác đối tác?",
        content: `"${ent.name}" sẽ bị hủy kích hoạt.`,
        okText: "Hủy kích hoạt", okType: "danger", cancelText: "Quay lại",
        onOk: () => togglePartnerStatus(id, newStatus),
      });
    } else togglePartnerStatus(id, newStatus);
  };

  const columns = [
    {
      title: "STT", key: "stt", align: "center" as const, width: 55,
      render: (_: any, __: Enterprise, index: number) => (
        <span style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>
          {query.page * query.size + index + 1}
        </span>
      ),
    },
    {
      title: "Doanh nghiệp", key: "name", width: 270,
      render: (_: any, r: Enterprise) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: faded(r) ? 0.4 : 1 }}>
          {/* Avatar */}
          {/* <div style={{
            width: 38, height: 38, flexShrink: 0, borderRadius: 8,
            background: `${r.color}12`,
            border: `1.5px solid ${r.color}28`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: r.color, letterSpacing: "0.03em" }}>{r.abbr}</span>
          </div> */}
          {/* Name + website */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.name}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{r.website}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngành", dataIndex: "industry", key: "industry", width: 155,
      render: (v: string, r: Enterprise) => <span style={chip(faded(r))}>{v}</span>,
    },
    {
      title: "Việc làm", dataIndex: "jobs", key: "jobs", align: "center" as const, width: 90,
      render: (v: number, r: Enterprise) => (
        <span style={{
          display: "inline-block",
          padding: "3px 13px",
          borderRadius: 20,
          fontWeight: 700,
          fontSize: 13,
          // background: faded(r) ? "#f0f1f5" : "#f0fdf4",
          color:      faded(r) ? T.muted     : T.accent,
        }}>
          {v}
        </span>
      ),
    },
    {
      title: "", key: "actions", align: "center" as const, width: 60,
      render: (_: any, r: Enterprise) => (
        <Button
          size="small"
          icon={<EditOutlined style={{ fontSize: 13 }} />}
          style={{ borderRadius: 6, borderColor: T.border, color: T.sub, background: T.surface }}
          onClick={e => { e.stopPropagation(); setModal({ open: true, enterprise: r }); }}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{  minHeight: "100vh", padding: "24px 28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/*  Header  */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.3px" }}>
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
                  background: " #0b69cf" ,
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

            {/* Stat cards */}
            <Row gutter={[12, 12]}>
              {stats.map(s => (
                <Col key={s.label} xs={12} sm={6}>
                  <StatCard {...s} />
                </Col>
              ))}
            </Row>
          </div>

          {/*  Table card  */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>

            {/* Filter bar */}
            <div style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
              background: "#fafafa",
            }}>
              <Input
                prefix={<SearchOutlined style={{ color: T.muted, fontSize: 12 }} />}
                placeholder="Tìm kiếm doanh nghiệp..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 220, borderRadius: 8, height: 34, fontSize: 13, background: "#f3f4f6", borderColor: "transparent" }}
                variant="filled"
                allowClear
              />
              <Select
                value={industry}
                onChange={setIndustry}
                style={{ width: 155, height: 34, fontSize: 13 }}
                variant="filled"
              >
                <Select.Option value="Tất cả ngành">Tất cả ngành</Select.Option>
                {INDUSTRIES.map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
              </Select>
              {(search || industry !== "Tất cả ngành") && (
                <Button
                  type="text"
                  onClick={() => { setSearch(""); setIndustry("Tất cả ngành"); setFacultyFilter("all"); }}
                  style={{ height: 34, color: T.danger, fontSize: 13, padding: "0 10px", borderRadius: 8 }}
                >
                  Xóa bộ lọc
                </Button>
              )}
              <span style={{ marginLeft: "auto", fontSize: 12, color: T.muted }}>
                {filtered.length} / {enterprises.length} doanh nghiệp
              </span>
            </div>

            {/* Table */}
            <CustomTable
              columns={columns}
              data={listData}
              filter={query}
              loading={loading}
              handleTableChange={(p: any) =>
                setQuery(prev => ({ ...prev, page: (p.current || 1) - 1, size: p.pageSize || prev.size }))
              }
              rowKey="id"
              scroll={{ x: 760 }}
              rowClassName={(_: Enterprise, i: number) => `ent-row${i % 2 === 1 ? " row-stripe" : ""}`}
              onRow={(r: Enterprise) => ({
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
        onClose={() => setModal({ open: false, enterprise: null })}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}