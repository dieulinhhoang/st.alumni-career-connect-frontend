import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Input,
  Select,
  Button,
  Modal,
  Card,
  Statistic,
  Tag,
  Badge,
  Space,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ClearOutlined,
  BankOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
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
import { COLOR, RADIUS, SHADOW } from "../DashBoard/theme";

const { Title, Text } = Typography;

function StatusBadge({ status }: { status: PartnerStatus }) {
  const isActive = status === "active";
  return (
    <Badge
      status={isActive ? "success" : "default"}
      text={
        <Text type={isActive ? undefined : "secondary"} style={{ fontSize: 12 }}>
          {isActive ? "Hoạt động" : "Tạm ngưng"}
        </Text>
      }
    />
  );
}

function IndustryTag({ value, faded }: { value: string; faded?: boolean }) {
  return (
    <Tag color={faded ? "default" : "blue"} style={{ margin: 0 }}>
      {value}
    </Tag>
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

interface EnterpriseStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentColor: string;
  valueColor: string;
}

function EnterpriseStatCard({ icon, label, value, accentColor, valueColor }: EnterpriseStatCardProps) {
  const iconBg = `${accentColor}18`;
  return (
    <div
      style={{
        background: COLOR.bgCard,
        borderRadius: RADIUS.xl,
        padding: "16px 20px",
        height: "100%",
        border: `1px solid ${COLOR.border}`,
        boxShadow: SHADOW.card,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: "default",
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
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: RADIUS.lg,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: accentColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <Statistic
        title={
          <span style={{ fontSize: 12, color: COLOR.textMuted, fontWeight: 600 }}>
            {label}
          </span>
        }
        value={value}
        valueStyle={{
          fontSize: 26,
          fontWeight: 700,
          color: valueColor,
          lineHeight: 1.2,
          fontVariantNumeric: "tabular-nums",
        }}
      />
    </div>
  );
}

export default function EnterprisePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [facultyFilter, setFacultyFilter] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState({ page: 1, size: 8 });
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>(
    { open: false, enterprise: null }
  );

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
        <Text type="secondary" style={{ fontVariantNumeric: "tabular-nums", fontSize: 13 }}>
          {(query.page - 1) * query.size + index + 1}
        </Text>
      ),
    },
    {
      title: "Doanh nghiệp",
      key: "name",
      width: 270,
      render: (_value, r) => (
        <Space direction="vertical" size={2} style={{ opacity: faded(r) ? 0.45 : 1 }}>
          <Text strong style={{ fontSize: 14 }}>
            {r.name}
          </Text>
          {r.website && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {r.website}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      width: 160,
      render: (value: string, r) => <IndustryTag value={value} faded={faded(r)} />,
    },
    {
      title: "Khoa",
      key: "faculties",
      width: 190,
      render: (_value, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {getEnterpriseFacultyLabel(r, faculties)}
        </Text>
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
        <Tag
          color={faded(r) ? "default" : "blue"}
          style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, minWidth: 32, textAlign: "center" }}
        >
          {value}
        </Tag>
      ),
    },
  ];

  const hasFilter = search || industry !== "Tất cả ngành" || facultyFilter !== undefined;

  const activeCount = enterprises.filter((e) => e.partnerStatus === "active").length;
  const inactiveCount = enterprises.filter((e) => e.partnerStatus === "inactive").length;
  const totalJobs = enterprises
    .filter((e) => e.partnerStatus === "active")
    .reduce((sum, e) => sum + e.jobs, 0);

  const statCards = [
    {
      key: "total",
      icon: <BankOutlined />,
      label: "Tổng doanh nghiệp",
      value: total,
      accentColor: COLOR.primary,
      valueColor: COLOR.primary,
    },
    {
      key: "active",
      icon: <CheckCircleOutlined />,
      label: "Đang hoạt động",
      value: activeCount,
      accentColor: COLOR.success,
      valueColor: COLOR.success,
    },
    {
      key: "inactive",
      icon: <PauseCircleOutlined />,
      label: "Tạm ngưng",
      value: inactiveCount,
      accentColor: COLOR.textFaint,
      valueColor: COLOR.textMuted,
    },
    {
      key: "jobs",
      icon: <SolutionOutlined />,
      label: "Vị trí tuyển dụng",
      value: totalJobs,
      accentColor: COLOR.warning,
      valueColor: COLOR.warning,
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px 40px" }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} wrap>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Doanh nghiệp đối tác
            </Title>
            <Text type="secondary">Quản lý danh sách và trạng thái hợp tác doanh nghiệp</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModal({ open: true, enterprise: null })}
            >
              Thêm doanh nghiệp
            </Button>
          </Col>
        </Row>

        {/* Stat Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map((card) => (
            <Col xs={12} sm={6} key={card.key}>
              <EnterpriseStatCard {...card} />
            </Col>
          ))}
        </Row>

        {/* Table Card */}
        <Card
          variant="borderless"
          styles={{ body: { padding: 0 } }}
        >
          {/* Filter Bar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${COLOR.border}`,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm tên, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 230 }}
              allowClear
            />

            <Select
              value={industry}
              onChange={(v) => {
                setIndustry(v);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 185 }}
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
              style={{ width: 185 }}
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

            {hasFilter && (
              <Button
                danger
                icon={<ClearOutlined />}
                onClick={() => {
                  setSearch("");
                  setIndustry("Tất cả ngành");
                  setFacultyFilter(undefined);
                  setFacultyId(undefined);
                  setQuery((prev) => ({ ...prev, page: 1 }));
                  setPage(0);
                }}
              >
                Xóa bộ lọc
              </Button>
            )}

            <Text
              type="secondary"
              style={{
                marginLeft: "auto",
                fontSize: 12,
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
              style: { cursor: "pointer" },
            })}
          />
        </Card>
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
