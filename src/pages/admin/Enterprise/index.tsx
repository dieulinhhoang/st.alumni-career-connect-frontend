import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Space, Modal, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from "@ant-design/icons";

import AdminLayout from "../../../components/layout/AdminLayout";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import { useFacultyColors } from "../../../feature/enterprise/hooks/useFacultyColors";
import { INDUSTRIES, ALL_FACULTIES, FACULTY_VI_NAME, type PartnerStatus, type EnterpriseFormValues, type Enterprise } from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";
import CustomTable from "../../../components/common/customTable";

const pill = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "2px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600,
  background: bg, color, border: `1.5px solid ${color}30`,
});

function Avatar({ abbr, color }: { abbr: string; color: string }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: color + "18", border: `1.5px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 10, fontWeight: 800, color }}>{abbr}</span>
    </div>
  );
}

export default function Enterprise() {
  const navigate = useNavigate();
  const { getColor } = useFacultyColors();
  const { enterprises, loading, addEnterprise, editEnterprise, verify, togglePartnerStatus } = useEnterprises();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({ open: false, enterprise: null });
  const [query, setQuery] = useState({ page: 0, size: 8 });

  const filtered = enterprises.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())) &&
    (industry === "Tất cả ngành" || e.industry === industry) &&
    (facultyFilter === "all" || e.faculties.includes(facultyFilter))
  );

  const listData = {
    data: filtered,
    page: {
      total_elements: filtered.length,
      current_page: query.page,
      total_pages: Math.ceil(filtered.length / query.size),
    }
  };

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

  const handleTableChange = (pagination: any) => {
    setQuery(prev => ({
      ...prev,
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || prev.size,
    }));
  };

  const stats = [
    { label: "Tổng",         value: enterprises.length,                                                                    color: "#6366f1" },
    { label: "Hoạt động",    value: enterprises.filter(e => e.partnerStatus === "active").length,                          color: "#10b981" },
    { label: "Tạm dừng",    value: enterprises.filter(e => e.partnerStatus === "inactive").length,                         color: "#f43f5e" },
    { label: "Vị trí tuyển", value: enterprises.filter(e => e.partnerStatus === "active").reduce((s, e) => s + e.jobs, 0), color: "#f59e0b" },
  ];

  const columns = [
    {
      title: "Doanh nghiệp", key: "name",
      render: (_: any, r: Enterprise) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: r.partnerStatus === "inactive" ? 0.5 : 1 }}>
          <Avatar abbr={r.abbr} color={r.color} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 5 }}>
              {r.name}
              {r.verified && <CheckCircleOutlined style={{ color: "#10b981", fontSize: 11 }} />}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.website}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngành", dataIndex: "industry", key: "industry",
      render: (v: string, r: Enterprise) => <span style={{ ...pill("#f5f3ff", "#6d28d9"), opacity: r.partnerStatus === "inactive" ? 0.5 : 1 }}>{v}</span>,
    },
    {
      title: "Khoa đối tác", key: "faculties",
      render: (_: any, r: Enterprise) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, opacity: r.partnerStatus === "inactive" ? 0.5 : 1 }}>
          {r.faculties.slice(0, 2).map(k => (
            <span key={k} style={pill(getColor(k) + "15", getColor(k))}>
              {FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}
            </span>
          ))}
          {r.faculties.length > 2 && (
            <Tooltip title={r.faculties.slice(2).map(k => FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k).join(", ")}>
              <span style={pill("#f3f4f6", "#6b7280")}>+{r.faculties.length - 2}</span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Việc làm", dataIndex: "jobs", key: "jobs", align: "center" as const,
      render: (v: number, r: Enterprise) => <span style={{ fontWeight: 700, fontSize: 13, color: r.partnerStatus === "inactive" ? "#9ca3af" : "#6d28d9" }}>{v}</span>,
    },
    {
      title: "Trạng thái", key: "status",
      render: (_: any, r: Enterprise) => r.verified
        ? <span style={{ ...pill("#ecfdf5", "#059669"), opacity: r.partnerStatus === "inactive" ? 0.5 : 1 }}><CheckCircleOutlined style={{ fontSize: 10 }} />Đã xác minh</span>
        : (
          <Space size={6}>
            <span style={{ ...pill("#fffbeb", "#d97706"), opacity: r.partnerStatus === "inactive" ? 0.5 : 1 }}>Chờ duyệt</span>
            <Button size="small" type="primary" icon={<SafetyCertificateOutlined />}
              style={{ background: "#10b981", border: "none", fontSize: 11, borderRadius: 6, fontWeight: 600 }}
              onClick={e => { e.stopPropagation(); verify(r.id); }}>Xác minh</Button>
          </Space>
        ),
    },
    {
      title: "", key: "actions", align: "center" as const, width: 50,
      render: (_: any, r: Enterprise) => (
        <Button size="small" icon={<EditOutlined />}
          onClick={e => { e.stopPropagation(); setModal({ open: true, enterprise: r }); }}
          style={{ borderRadius: 7, border: "1.5px solid #e5e7eb" }} />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header + Stats */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "20px 24px", boxShadow: "0 1px 4px #0000000a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>Doanh nghiệp đối tác</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>Quản lý danh sách và trạng thái hợp tác</div>
            </div>
            <Button type="primary" icon={<PlusOutlined />}
              style={{ background: "#6366f1", border: "none", borderRadius: 9, fontWeight: 600, height: 38, paddingInline: 18, boxShadow: "0 2px 8px #6366f140" }}
              onClick={() => setModal({ open: true, enterprise: null })}>Thêm doanh nghiệp</Button>
          </div>
          <Row gutter={[12, 12]}>
            {stats.map(s => (
              <Col key={s.label} xs={12} sm={6}>
                <div style={{ background: s.color + "0d", border: `1.5px solid ${s.color}20`, borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -1 }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: s.color, opacity: 0.75, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", boxShadow: "0 1px 4px #0000000a", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 210, borderRadius: 8, height: 34 }} />
            <Select value={industry} onChange={setIndustry} style={{ width: 165, height: 34 }}>
              <Select.Option value="Tất cả ngành">Tất cả ngành</Select.Option>
              {INDUSTRIES.map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
            </Select>
            <Select value={facultyFilter} onChange={setFacultyFilter} style={{ width: 165, height: 34 }}>
              <Select.Option value="all">Tất cả khoa</Select.Option>
              {ALL_FACULTIES.map(k => <Select.Option key={k} value={k}>{FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}</Select.Option>)}
            </Select>
            <Button onClick={() => { setSearch(""); setIndustry("Tất cả ngành"); setFacultyFilter("all"); }} style={{ borderRadius: 7, height: 34, color: "#6b7280", fontSize: 12 }}>Xóa</Button>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{filtered.length}/{enterprises.length}</span>
          </div>

          <CustomTable
            columns={columns}
            data={listData}
            filter={query}
            loading={loading}
            handleTableChange={handleTableChange}
            rowKey="id"
            onRow={(r: Enterprise) => ({
              onClick: () => navigate(`/admin/enterprises/${toSlug(r.name)}`),
              style: { cursor: "pointer", opacity: r.partnerStatus === "inactive" ? 0.65 : 1, transition: "background 0.12s" },
            })}
          />
        </div>
      </div>

      <EnterpriseFormModal open={modal.open} enterprise={modal.enterprise} onClose={() => setModal({ open: false, enterprise: null })} onSave={handleSave} />
    </AdminLayout>
  );
}