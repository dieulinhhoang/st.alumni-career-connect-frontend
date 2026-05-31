import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Input, Select, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

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

function getEnterpriseFacultyLabel(enterprise: Enterprise, faculties: Faculty[]): string {
  if (!Array.isArray(enterprise.faculties) || enterprise.faculties.length === 0) return "-";
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
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({
    open: false,
    enterprise: null,
  });

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

  // Client-side filter chỉ cho search text và industry (nhẹ, không cần server round-trip)
  // facultyId đã được xử lý server-side qua useEnterprises hook
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

  const stats = [
    { label: "Tổng doanh nghiệp", value: total, color: T.accent },
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
      title: "Khoa",
      key: "faculties",
      width: 180,
      render: (_value, r) => (
        <span style={{ fontSize: 12, color: T.sub }}>
          {getEnterpriseFacultyLabel(r, faculties)}
        </span>
      ),
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
                style={{ width: 180, height: 34 }}
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
                  const faculty = faculties.find(
                    (f) => String(f.id) === v
                  );
                  setFacultyId(faculty ? String(faculty.id) : undefined);
                  setQuery((prev) => ({ ...prev, page: 1 }));
                  setPage(0);
                }}
                style={{ width: 180, height: 34 }}
                loading={facultiesLoading}
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

              {(search || industry !== "Tất cả ngành" || facultyFilter !== undefined) && (
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
                    padding: "0 10px",
                    borderRadius: 8,
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}

              <span style={{ marginLeft: "auto", fontSize: 12, color: T.muted }}>
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
              scroll={{ x: 760 }}
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
