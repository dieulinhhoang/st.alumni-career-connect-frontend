import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";

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

const T = {
  primary: "#1d4ed8",
  primaryLight: "#eff6ff",
  primaryBorder: "#bfdbfe",
  success: "#16a34a",
  successLight: "#f0fdf4",
  successBorder: "#bbf7d0",
  warning: "#d97706",
  warningLight: "#fffbeb",
  warningBorder: "#fde68a",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
  dangerBorder: "#fecaca",
  neutral: "#6b7280",
  neutralLight: "#f9fafb",
  text: "#111827",
  textMuted: "#6b7280",
  textFaint: "#9ca3af",
  border: "#e5e7eb",
  surface: "#ffffff",
  bg: "#f3f4f6",
};

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
  accent: string;
}

function StatCard({ label, value, color, bg, border, accent }: StatCardProps) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "20px 24px",
        borderTop: `3px solid ${accent}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color,
          letterSpacing: "-0.5px",
          lineHeight: 1,
          marginBottom: 8,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value.toLocaleString("vi-VN")}
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.textMuted,
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PartnerStatus }) {
  const isActive = status === "active";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: isActive ? T.successLight : T.dangerLight,
        color: isActive ? T.success : T.danger,
        border: `1px solid ${isActive ? T.successBorder : T.dangerBorder}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isActive ? T.success : T.danger,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {isActive ? "Hoạt động" : "Tạm ngưng"}
    </span>
  );
}

function IndustryChip({ value, faded }: { value: string; faded?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        background: faded ? T.bg : T.primaryLight,
        color: faded ? T.textFaint : T.primary,
        border: `1px solid ${faded ? T.border : T.primaryBorder}`,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

function getEnterpriseFacultyLabel(
  enterprise: Enterprise,
  faculties: Faculty[]
): string {
  if (!Array.isArray(enterprise.faculties) || enterprise.faculties.length === 0)
    return "-";
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
  const [facultyFilter, setFacultyFilter] = useState<string | undefined>(
    undefined
  );
  const [query, setQuery] = useState({ page: 1, size: 8 });
  const [modal, setModal] = useState<{
    open: boolean;
    enterprise: Enterprise | null;
  }>({ open: false, enterprise: null });

  const {
    enterprises,
    loading,
    total,
    setFacultyId,
    setPage,
    addEnterprise,
    editEnterprise,
    togglePartnerStatus,
  } = useEnterprises({ page: query.page - 1, size: query.size });

  const { faculties = [], loading: facultiesLoading } = useFaculties();

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
      return matchSearch && matchIndustry;
    });
  }, [enterprises, search, industry]);

  const stats: StatCardProps[] = [
    {
      label: "Tổng doanh nghiệp",
      value: total,
      color: T.primary,
      bg: T.primaryLight,
      border: T.primaryBorder,
      accent: T.primary,
    },
    {
      label: "Đang hoạt động",
      value: enterprises.filter((e) => e.partnerStatus === "active").length,
      color: T.success,
      bg: T.successLight,
      border: T.successBorder,
      accent: T.success,
    },
    {
      label: "Tạm ngưng",
      value: enterprises.filter((e) => e.partnerStatus === "inactive").length,
      color: T.danger,
      bg: T.dangerLight,
      border: T.dangerBorder,
      accent: T.danger,
    },
    {
      label: "Vị trí tuyển dụng",
      value: enterprises
        .filter((e) => e.partnerStatus === "active")
        .reduce((sum, e) => sum + e.jobs, 0),
      color: T.warning,
      bg: T.warningLight,
      border: T.warningBorder,
      accent: T.warning,
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
        <span
          style={{
            fontSize: 13,
            color: T.textFaint,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {(query.page - 1) * query.size + index + 1}
        </span>
      ),
    },
    {
      title: "Doanh nghiệp",
      key: "name",
      width: 270,
      render: (_value, r) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: faded(r) ? 0.45 : 1,
          }}
        >
          <span
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
          </span>
          {r.website && (
            <span
              style={{ fontSize: 12, color: T.textFaint, fontWeight: 400 }}
            >
              {r.website}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      width: 160,
      render: (value: string, r) => (
        <IndustryChip value={value} faded={faded(r)} />
      ),
    },
    {
      title: "Khoa",
      key: "faculties",
      width: 190,
      render: (_value, r) => (
        <span
          style={{
            fontSize: 12,
            color: faded(r) ? T.textFaint : T.textMuted,
            fontWeight: 400,
          }}
        >
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
        <span
          style={{
            display: "inline-block",
            minWidth: 32,
            padding: "3px 10px",
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 13,
            color: faded(r) ? T.textFaint : T.primary,
            background: faded(r) ? T.bg : T.primaryLight,
            border: `1px solid ${faded(r) ? T.border : T.primaryBorder}`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  const hasFilter =
    search || industry !== "Tất cả ngành" || facultyFilter !== undefined;

  return (
    <AdminLayout>
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          padding: "28px 32px 40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: T.text,
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
              }}
            >
              Doanh nghiệp đối tác
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: T.textMuted,
                fontWeight: 400,
              }}
            >
              Quản lý danh sách và trạng thái hợp tác doanh nghiệp
            </p>
          </div>

          <Button
            type="primary"
            style={{
              background: T.primary,
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 38,
              paddingInline: 20,
              fontSize: 13,
              boxShadow: "0 1px 4px rgba(29,78,216,0.25)",
            }}
            onClick={() => setModal({ open: true, enterprise: null })}
          >
            + Thêm doanh nghiệp
          </Button>
        </div>

        {/* Stat Cards */}
        <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
          {stats.map((s) => (
            <Col key={s.label} xs={12} sm={6}>
              <StatCard {...s} />
            </Col>
          ))}
        </Row>

        {/* Table Card */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Filter Bar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
              background: T.surface,
            }}
          >
            <Input
              placeholder="Tìm kiếm tên, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{
                width: 230,
                height: 34,
                borderRadius: 7,
                fontSize: 13,
                border: `1px solid ${T.border}`,
              }}
              allowClear
            />

            <Select
              value={industry}
              onChange={(v) => {
                setIndustry(v);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 185, height: 34 }}
              options={[
                { label: "Tất cả ngành", value: "Tất cả ngành" },
                ...INDUSTRIES.map((i) => ({ label: i, value: i })),
              ]}
            />

            <Select
              allowClear
              placeholder="Lọc theo khoa"
              value={facultyFilter}
              onChange={(v) => {
                setFacultyFilter(v);
                const faculty = faculties.find((f) => String(f.id) === v);
                setFacultyId(faculty ? String(faculty.id) : undefined);
                setQuery((prev) => ({ ...prev, page: 1 }));
                setPage(0);
              }}
              style={{ width: 185, height: 34 }}
              loading={facultiesLoading}
              notFoundContent={
                facultiesLoading ? "Đang tải..." : "Không có khoa"
              }
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

            {hasFilter && (
              <Button
                type="text"
                onClick={() => {
                  setSearch("");
                  setIndustry("Tất cả ngành");
                  setFacultyFilter(undefined);
                  setFacultyId(undefined);
                  setQuery((prev) => ({ ...prev, page: 1 }));
                  setPage(0);
                }}
                style={{
                  height: 34,
                  color: T.danger,
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "0 10px",
                  borderRadius: 7,
                  border: `1px solid ${T.dangerBorder}`,
                  background: T.dangerLight,
                }}
              >
                Xóa bộ lọc
              </Button>
            )}

            <span
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: T.textFaint,
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
              }}
            >
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
              onClick: () =>
                navigate(`/admin/enterprises/${toSlug(r.name)}`),
              style: {
                cursor: "pointer",
                transition: "background 0.15s",
              },
            })}
          />
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
