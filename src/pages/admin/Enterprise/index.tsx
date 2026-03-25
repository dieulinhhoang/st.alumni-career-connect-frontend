import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, Col, Row, Input, Select, Button, Table, Tag, Space,
  Typography, Modal, Badge, Tooltip,
} from "antd";
import {
  SearchOutlined, PlusOutlined, EditOutlined,
  SafetyCertificateOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import AdminLayout from "../../../components/layout/AdminLayout";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import { useFacultyColors } from "../../../feature/enterprise/hooks/useFacultyColors";
import {
  INDUSTRIES, ALL_FACULTIES, FACULTY_VI_NAME,
  type PartnerStatus, type EnterpriseFormValues, type Enterprise,
} from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";

 
const { Title, Text } = Typography;

// Avatar

function Avatar({ abbr, color, size = 36 }: { abbr: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.27, fontWeight: 800, color }}>{abbr}</span>
    </div>
  );
}

export default function Enterprise() {
  const navigate     = useNavigate();
  const { getColor } = useFacultyColors();

  const { enterprises, loading, addEnterprise, editEnterprise, verify, togglePartnerStatus } = useEnterprises();

  // Filters
  const [search,         setSearch]         = useState("");
  const [industry,       setIndustry]       = useState("Tất cả ngành");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [facultyFilter,  setFacultyFilter]  = useState("all");
  const [partnerFilter,  setPartnerFilter]  = useState("all");

  const filtered = enterprises.filter(e => {
    const q = search.toLowerCase();
    return (
      (e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)) &&
      (industry === "Tất cả ngành" || e.industry === industry) &&
      (verifiedFilter === "all" || (verifiedFilter === "yes" ? e.verified : !e.verified)) &&
      (facultyFilter === "all" || e.faculties.includes(facultyFilter)) &&
      (partnerFilter === "all" || e.partnerStatus === partnerFilter)
    );
  });

  const clearFilters = () => {
    setSearch(""); setIndustry("Tất cả ngành");
    setVerifiedFilter("all"); setFacultyFilter("all"); setPartnerFilter("all");
  };

  // Modal state
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({ open: false, enterprise: null });

  const handleSave = async (values: EnterpriseFormValues) => {
    if (modal.enterprise) {
      await editEnterprise(modal.enterprise.id, values);
    } else {
      await addEnterprise(values);
    }
  };

  const handleToggle = (id: string, checked: boolean) => {
    const ent = enterprises.find(e => e.id === id);
    if (!ent) return;
    const newStatus: PartnerStatus = checked ? "active" : "inactive";
    if (!checked) {
      Modal.confirm({
        title: "Ngừng hợp tácđối tác?",
        content: `"${ent.name}" sẽ bị hủy kích hoạt. Tin tuyển dụng sẽ bị ẩn với sinh viên.`,
        okText: "Hủy kích hoạt", okType: "danger", cancelText: "Quay lại",
        onOk: () => togglePartnerStatus(id, newStatus),
      });
    } else {
      togglePartnerStatus(id, newStatus);
    }
  };

  const columns: ColumnsType<Enterprise> = [
    {
      title: "Doanh nghiệp", key: "name",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: r.partnerStatus === "inactive" ? 0.45 : 1 }}>
          <Avatar abbr={r.abbr} color={r.color} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              {r.name}
              {r.verified && <CheckCircleOutlined style={{ color: "#059669", fontSize: 12 }} />}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.website}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngành nghề", dataIndex: "industry", key: "industry",
      render: (v, r) => <Tag color="purple" style={{ fontSize: 11, opacity: r.partnerStatus === "inactive" ? 0.45 : 1 }}>{v}</Tag>,
    },
    {
      title: "Khoa đối tác", key: "faculties",
      render: (_, r) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, opacity: r.partnerStatus === "inactive" ? 0.45 : 1 }}>
          {r.faculties.slice(0, 2).map(k => (
            <span key={k} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: getColor(k) + "15", color: getColor(k) }}>
              {FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}
            </span>
          ))}
          {r.faculties.length > 2 && (
            <Tooltip title={r.faculties.slice(2).map(k => FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k).join(", ")}>
              <span style={{ fontSize: 11, color: "#9ca3af", cursor: "default" }}>+{r.faculties.length - 2}</span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Việc làm", dataIndex: "jobs", key: "jobs", align: "center",
      render: (v, r) => (
        <Badge count={v} style={{ backgroundColor: r.partnerStatus === "inactive" ? "#d1d5db" : "#7c3aed" }} overflowCount={99} showZero />
      ),
    },
    {
      title: "Trạng thái", key: "status",
      render: (_, r) => r.verified
        ? <Tag color="success" icon={<CheckCircleOutlined />} style={{ opacity: r.partnerStatus === "inactive" ? 0.45 : 1 }}>Đã xác minh</Tag>
        : (
          <Space>
            <Tag color="warning" style={{ opacity: r.partnerStatus === "inactive" ? 0.45 : 1 }}>Chờ duyệt</Tag>
            <Button size="small" type="primary" icon={<SafetyCertificateOutlined />}
              style={{ background: "#059669", border: "none", fontSize: 11 }}
              onClick={e => { e.stopPropagation(); verify(r.id); }}
            >Xác minh</Button>
          </Space>
        ),
    },
    {
      title: "Hành động", key: "actions", align: "center",
      render: (_, r) => (
        <Button size="small" icon={<EditOutlined />}
          onClick={e => { e.stopPropagation(); setModal({ open: true, enterprise: r }); }}
          style={{ borderRadius: 6, fontSize: 11 }}
        >Sửa</Button>
      ),
    },
  ];

  const stats = [
    { label: "Tổng doanh nghiệp", value: enterprises.length,                                             bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#7c3aed" },
    { label: "Đang hoạt động",    value: enterprises.filter(e => e.partnerStatus === "active").length,   bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", color: "#059669" },
    { label: "Không hoạt động",   value: enterprises.filter(e => e.partnerStatus === "inactive").length, bg: "linear-gradient(135deg,#fee2e2,#fecaca)", color: "#ef4444" },
    { label: "Tổng vị trí tuyển", value: enterprises.filter(e => e.partnerStatus === "active").reduce((s, e) => s + e.jobs, 0), bg: "linear-gradient(135deg,#fce7f3,#fbcfe8)", color: "#db2777" },
  ];

  return (
    <AdminLayout>
      <div>
        
        {/* Stats */}
        <Card style={{ borderRadius: 12, marginBottom: 16, border: "1px solid #ede9fe" }}>
          {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Doanh nghiệp đối tác</Title>
            {/* <Text type="secondary" style={{ fontSize: 13 }}>{filtered.length} / {enterprises.length} doanh nghiệp</Text> */}
          </div>
          <Button type="primary" icon={<PlusOutlined />}
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 8 }}
            onClick={() => setModal({ open: true, enterprise: null })}
          >Thêm doanh nghiệp</Button>
        </div>

          <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          {stats.map(s => (
            <Col key={s.label} xs={12} sm={12} md={6}>
              <Card variant="borderless" style={{ borderRadius: 12, background: s.bg, border: "none" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.color, opacity: 0.8, marginTop: 4 }}>{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>
        
          
        </Card>

        {/* Table */}
        <Card style={{ borderRadius: 12, border: "1px solid #ede9fe" }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={10} md={7}>
              <Input placeholder="Tìm kiếm ..." value={search} onChange={e => setSearch(e.target.value)}  />
            </Col>
            <Col xs={24} sm={7} md={5}>
              <Select value={industry} onChange={setIndustry} style={{ width: "100%" }}>
                <Select.Option value="Tất cả ngành">Tất cả ngành</Select.Option>
                {INDUSTRIES.map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
              </Select>
            </Col>
            <Col xs={24} sm={7} md={5}>
              <Select value={facultyFilter} onChange={setFacultyFilter} style={{ width: "100%" }}>
                <Select.Option value="all">Tất cả khoa</Select.Option>
                {ALL_FACULTIES.map(k => (
                  <Select.Option key={k} value={k}>{FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button onClick={clearFilters}>Xóa bộ lọc</Button>
            </Col>
          </Row>
          <br></br>
          <Table
            dataSource={filtered} columns={columns} rowKey="id" loading={loading}
            pagination={{ pageSize: 8, showTotal: total => `${total} doanh nghiệp` }}
            scroll={{ x: 950 }}
            onRow={record => ({
              onClick: () => navigate(`/admin/enterprises/${toSlug(record.name)}`),
              style: {
                cursor: "pointer",
                opacity: record.partnerStatus === "inactive" ? 0.6 : 1,
                filter: record.partnerStatus === "inactive" ? "grayscale(40%)" : "none",
                transition: "background 0.15s",
              },
            })}
          />
        </Card>

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