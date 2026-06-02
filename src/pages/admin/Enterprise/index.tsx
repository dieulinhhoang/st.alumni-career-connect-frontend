import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { COLOR, RADIUS, SHADOW } from "../DashBoard/theme";
import AdminLayout from "../../../components/layout/AdminLayout";
import CustomTable from "../../../components/common/customTable";
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

const { Title, Text } = Typography;

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  accentColor: string;
}

function StatCard({ label, value, color, bg, accentColor }: StatCardProps) {
  const textColor = accentColor;
  return (
    <div
      style={{
        backgroundColor: COLOR.bgCard,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.card,
        padding: "1.5rem",
        transition: "all 0.2s ease",
        border: `1px solid ${COLOR.borderSoft}`,
        background: bg,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = SHADOW.hover;
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = SHADOW.card;
        el.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.875rem", fontWeight: 700, color: textColor }}>
          {value.toLocaleString("vi-VN")}
        </span>
        <span style={{ color: COLOR.textMuted, fontSize: "0.875rem", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ height: 3, width: 40, borderRadius: 2, backgroundColor: accentColor, opacity: 0.3 }} />
    </div>
  );
}

function StatusBadge({ status }: { status: PartnerStatus }) {
  const isActive = status === "active";
  const dotColor = isActive ? COLOR.success : COLOR.textFaint;
  const textColor = isActive ? COLOR.success : COLOR.textMuted;
  const bgColor = isActive ? "#f0fdf4" : "#f9fafb";
  const borderColor = isActive ? COLOR.borderSoft : "transparent";
  return (
    <span
      style={{
        color: textColor,
        backgroundColor: bgColor,
        padding: "4px 10px",
        borderRadius: RADIUS.pill,
        fontSize: 12,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: dotColor,
        }}
      />
      {isActive ? "Hoạt động" : "Tạm ngưng"}
    </span>
  );
}

function IndustryChip({ value }: { value: string }) {
  return (
    <span
      style={{
        color: COLOR.textBase,
        backgroundColor: COLOR.bgMuted,
        padding: "4px 10px",
        borderRadius: RADIUS.pill,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {value}
    </span>
  );
}

function getEnterpriseFacultyLabel(enterprise: Enterprise, faculties: Faculty[]): string {
  if (!Array.isArray(enterprise.faculties) || enterprise.faculties.length === 0) return "—";
  return enterprise.faculties
    .map((ef) => {
      if (ef.name) return ef.name;
      const matched = faculties.find((f) => String(f.id) === String(ef.id));
      return matched?.name ?? `Khoa #${ef.id}`;
    })
    .join(", ");
}

export default function EnterprisePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [facultyFilter, setFacultyFilter] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState({ page: 1, size: 8 });
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({ open: false, enterprise: null });

  const { enterprises, loading, total, setFacultyId, setPage, addEnterprise, editEnterprise, togglePartnerStatus } =
    useEnterprises({ page: query.page - 1, size: query.size });
  const { faculties = [], loading: facultiesLoading } = useFaculties();

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch = !keyword || e.name.toLowerCase().includes(keyword) || e.email.toLowerCase().includes(keyword);
      const matchIndustry = industry === "Tất cả ngành" || e.industry === industry;
      return matchSearch && matchIndustry;
    });
  }, [enterprises, search, industry]);

  const stats: StatCardProps[] = [
    {
      label: "Tổng doanh nghiệp",
      value: total,
      color: COLOR.textMuted,
      bg: COLOR.primaryTint,
      accentColor: COLOR.primary,
    },
    {
      label: "Đang hoạt động",
      value: enterprises.filter((e) => e.partnerStatus === "active").length,
      color: COLOR.textMuted,
      bg: "#f0fdf4",
      accentColor: COLOR.success,
    },
    {
      label: "Tạm ngưng",
      value: enterprises.filter((e) => e.partnerStatus === "inactive").length,
      color: COLOR.textMuted,
      bg: "#fef2f2",
      accentColor: COLOR.danger,
    },
    {
      label: "Vị trí tuyển dụng",
      value: enterprises
        .filter((e) => e.partnerStatus === "active")
        .reduce((sum, e) => sum + e.jobs, 0),
      color: COLOR.textMuted,
      bg: "#fdf4e3",
      accentColor: COLOR.gold,
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
        <span style={{ color: COLOR.textMuted, fontWeight: 500 }}>
          {(query.page - 1) * query.size + index + 1}
        </span>
      ),
    },
    {
      title: "Doanh nghiệp",
      key: "name",
      width: 270,
      render: (_value, r) => (
        <div>
          <div style={{ fontWeight: 600, color: COLOR.textDark }}>{r.name}</div>
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: COLOR.primaryMid, textDecoration: "none" }}
            >
              {r.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      width: 160,
      render: (value: string, r) => <IndustryChip value={value} />,
    },
    {
      title: "Khoa",
      key: "faculties",
      width: 190,
      render: (_value, r) => (
        <span style={{ color: COLOR.textBase, fontSize: 13, lineHeight: 1.6 }}>
          {getEnterpriseFacultyLabel(r, faculties)}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      render: (_value, r) => <StatusBadge status={r.partnerStatus} />,
    },
    {
      title: "Việc làm",
      dataIndex: "jobs",
      key: "jobs",
      align: "center",
      width: 90,
      render: (value: number, r) => (
        <span style={{ color: COLOR.textBase, fontWeight: 600, fontSize: 14 }}>{value}</span>
      ),
    },
  ];

  const hasFilter = search || industry !== "Tất cả ngành" || facultyFilter !== undefined;

  return (
    <AdminLayout>
      <div style={{ padding: 24, backgroundColor: COLOR.bgPage }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: COLOR.textDark, fontWeight: 700 }}>
              Doanh nghiệp đối tác
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }>
              Quản lý danh sách và trạng thái hợp tác doanh nghiệp
            </Text>
          </div>
          <Space>
            <Button type="primary" onClick={() => setModal({ open: true, enterprise: null })}>
              Thêm doanh nghiệp
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {stats.map((s, i) => (
            <Col key={i} xs={12} sm={12} lg={6}>
              <StatCard {...s} />
            </Col>
          ))}
        </Row>

        <div
          style={{
            background: COLOR.bgCard,
            padding: 24,
            borderRadius: RADIUS.lg,
            border: `1px solid ${COLOR.border}`,
            boxShadow: SHADOW.card,
          }}
        >
          <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <Input
              placeholder="Tìm kiếm tên, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 230, height: 36, borderRadius: RADIUS.md, fontSize: 13 }}
              allowClear
            />
            <Select
              value={industry}
              onChange={(v) => {
                setIndustry(v);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 185, height: 36, borderRadius: RADIUS.md }}
              options={[{ label: "Tất cả ngành", value: "Tất cả ngành" }, ...INDUSTRIES.map((i) => ({ label: i, value: i }))]}
            />
            <Select
              value={facultyFilter}
              onChange={(v) => {
                setFacultyFilter(v);
                const faculty = faculties.find((f) => String(f.id) === v);
                setFacultyId(faculty ? String(faculty.id) : undefined);
                setQuery((prev) => ({ ...prev, page: 1 }));
                setPage(0);
              }}
              style={{ width: 185, height: 36, borderRadius: RADIUS.md }}
              loading={facultiesLoading}
              notFoundContent={facultiesLoading ? "Đang tải..." : "Không có khoa"}
            >
              {(faculties ?? []).map((f: any) => (
                <Select.Option key={f.id} value={String(f.id)}>
                  {f.name ?? f.facultyName ?? `Khoa #${f.id ?? ""}`}
                </Select.Option>
              ))}
            </Select>
            {hasFilter && (
              <Button
                onClick={() => {
                  setSearch("");
                  setIndustry("Tất cả ngành");
                  setFacultyFilter(undefined);
                  setFacultyId(undefined);
                  setQuery((prev) => ({ ...prev, page: 1 }));
                  setPage(0);
                }}
                style={{
                  height: 36,
                  color: COLOR.danger,
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: RADIUS.md,
                  backgroundColor: "#fef2f2",
                  borderColor: "#fecaca",
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
            <span style={{ marginLeft: "auto", color: COLOR.textMuted, fontSize: 13 }}>
              {filtered.length} / {total} doanh nghiệp
            </span>
          </div>

          <CustomTable<Enterprise>
            rowKey="id"
            data={filtered}
            columns={columns}
            loading={loading}
            pagination={{
              current: query.page,
              pageSize: query.size,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [8, 10, 20, 50],
            }}
            handleTableChange={(pagination) => {
              const newPage = pagination.current || 1;
              const newSize = pagination.pageSize || query.size;
              setQuery({ page: newPage, size: newSize });
              setPage(newPage - 1);
            }}
            scroll={{ x: 820 }}
            onRow={(r) => ({
              onClick: () => navigate(`/admin/enterprises/${toSlug(r.name)}`),
              style: { cursor: "pointer", transition: "background 0.15s" },
            })}
          />
        </div>

        <EnterpriseFormModal
          open={modal.open}
          enterprise={modal.enterprise}
          faculties={faculties}
          onClose={() => setModal({ open: false, enterprise: null })}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}
