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
  Tag,
  Space,
  Typography,
  Tooltip,
} from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import AdminLayout from "../../../components/layout/AdminLayout";
import CustomTable from "../../../components/common/customTable";
import { toSlug } from "../../../components/common/utils";
import { useEnterprises } from "../../../feature/enterprise/hooks/useEnterprises";
import {
  INDUSTRIES,
  type EnterpriseFormValues,
  type Enterprise,
} from "../../../feature/enterprise/type";
import { EnterpriseFormModal } from "../EnterpriseDetail/EditEnterpriseModal";

const { Text } = Typography;

const T = {
  accent: "#16a34a",
  warning: "#f59e0b",
  text: "#1e2433",
  sub: "#8791a6",
  muted: "#adb5c4",
  border: "#eceef2",
  surface: "#ffffff",
};

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#f4f5f7",
        borderRadius: 14,
        padding: "20px 24px",
        minHeight: 96,
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
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.sub,
          marginTop: 8,
          fontWeight: 400,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function IndustryPill({ value }: { value: string }) {
  return (
    <Tag
      style={{
        margin: 0,
        borderRadius: 8,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 500,
        color: "#667085",
        background: "#f2f4f7",
        border: "1px solid #eaecf0",
      }}
    >
      {value}
    </Tag>
  );
}

export default function EnterprisePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Tất cả ngành");
  const [query, setQuery] = useState({ page: 1, size: 8 });
  const [modal, setModal] = useState<{ open: boolean; enterprise: Enterprise | null }>({
    open: false,
    enterprise: null,
  });

  const {
    enterprises,
    loading,
    total,
    setPage,
    addEnterprise,
    editEnterprise,
  } = useEnterprises({ page: query.page - 1, size: query.size });

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

  const activeCount = enterprises.filter((e) => e.partnerStatus === "active").length;
  const inactiveCount = enterprises.filter((e) => e.partnerStatus === "inactive").length;
  const totalJobs = enterprises.reduce((sum, e) => sum + e.jobs, 0);

  const columns: ColumnsType<Enterprise> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 70,
      render: (_value, _record, index) => (
        <span style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>
          {(query.page - 1) * query.size + index + 1}
        </span>
      ),
    },
    {
      title: "Doanh nghiệp",
      key: "name",
      dataIndex: "name",
      render: (value: string) => (
        <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{value}</span>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      width: 320,
      render: (value: string) => <IndustryPill value={value} />,
    },
    {
      title: "Việc làm",
      dataIndex: "jobs",
      key: "jobs",
      width: 120,
      align: "center",
      render: (value: number) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: T.accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      width: 80,
      align: "center",
      render: (_value, record) => (
        <Tooltip title="Chỉnh sửa">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setModal({ open: true, enterprise: record });
            }}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              width: 34,
              height: 34,
              color: "#98a2b3",
              background: "#fff",
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Row justify="space-between" align="top" wrap style={{ gap: 12 }}>
          <Col>
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
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setModal({ open: true, enterprise: null })}
              style={{
                height: 44,
                borderRadius: 12,
                paddingInline: 18,
                fontWeight: 600,
              }}
            >
              Thêm doanh nghiệp
            </Button>
          </Col>
        </Row>

        <Row gutter={[14, 14]}>
          <Col xs={12} sm={12} md={6}>
            <StatCard label="Tổng doanh nghiệp" value={total} color={T.accent} />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <StatCard label="Đang hoạt động" value={activeCount} color="#d4a106" />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <StatCard label="Tạm ngưng" value={inactiveCount} color="#6b5a3a" />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <StatCard label="Vị trí tuyển dụng" value={totalJobs} color="#9a6b21" />
          </Col>
        </Row>

        <Card
          variant="borderless"
          styles={{ body: { padding: 0 } }}
          style={{
            background: T.surface,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              padding: "16px 22px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              background: "#fff",
            }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: "#98a2b3", fontSize: 12 }} />}
              placeholder="Tìm kiếm doanh nghiệp..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 250, height: 38, fontSize: 13 }}
              variant="filled"
              allowClear
            />

            <Select
              value={industry}
              onChange={(v) => {
                setIndustry(v);
                setQuery((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ width: 170, height: 38 }}
              options={[
                { label: "Tất cả ngành", value: "Tất cả ngành" },
                ...INDUSTRIES.map((i) => ({ label: i, value: i })),
              ]}
            />

            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                color: T.sub,
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
              total: filtered.length,
              showSizeChanger: true,
              pageSizeOptions: [8, 10, 20, 50],
              showTotal: (total, range) =>
                `Hiển thị ${range[0]} đến ${range[1]} trong số ${total} bản ghi`,
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
              style: { cursor: "pointer" },
            })}
          />
        </Card>

        <EnterpriseFormModal
          open={modal.open}
          enterprise={modal.enterprise}
          faculties={[]}
          onClose={() => setModal({ open: false, enterprise: null })}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}