import { useEffect, useMemo, useState } from "react";
import { Alert, Col, Row, Spin, Typography } from "antd";
import {
  FileTextOutlined,
  SolutionOutlined,
  ReadOutlined,
  StarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { StatCard } from "./Statcard";
import { FacultyCard } from "./FacultyCard";
import { EnterpriseList } from "./Enterpriselist";
import { ChartSection } from "./Chartsection";
import { useChartFilter } from "../../../feature/dashboard/hooks/useChartFilter";
import {
  fetchDashboardSummary,
  type DashboardSummary,
} from "../../../feature/dashboard/api";
import { COLOR } from "./theme";

const { Title, Text } = Typography;

type StatCardItem = {
  index: number;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accentColor: string;
  trend?: string;
};

export function DashBoard() {
  const { state, setField } = useChartFilter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchDashboardSummary();
        if (!cancelled) setSummary(res);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Không thể tải dữ liệu dashboard."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards: StatCardItem[] = useMemo(() => {
    if (!summary) return [];

    return [
      {
        index: 1,
        label: "Tỷ lệ phản hồi",
        value: `${summary.responseRate.value}%`,
        sub:
          summary.responseRate.total != null
            ? `${summary.responseRate.value} / ${summary.responseRate.total} SV`
            : "Trên tổng số SV tốt nghiệp",
        icon: <FileTextOutlined />,
        accentColor: COLOR.primary,
        trend: summary.responseRate.trend,
      },
      {
        index: 2,
        label: "Có việc / phản hồi",
        value: `${summary.employedRateOnResponses.value}%`,
        sub: "Trên số SV đã trả lời",
        icon: <SolutionOutlined />,
        accentColor: COLOR.success,
        trend: summary.employedRateOnResponses.trend,
      },
      {
        index: 3,
        label: "Có việc / tốt nghiệp",
        value: `${summary.employedRateOnGraduates.value}%`,
        sub: "Trên tổng số SV tốt nghiệp",
        icon: <ReadOutlined />,
        accentColor: COLOR.warning,
        trend: summary.employedRateOnGraduates.trend,
      },
      {
        index: 4,
        label: "Việc làm phù hợp",
        value: `${summary.relevantJobRate.value}%`,
        sub: "Đúng ngành + Liên quan + Học tiếp",
        icon: <StarOutlined />,
        accentColor: COLOR.pink,
        trend: summary.relevantJobRate.trend,
      },
    ];
  }, [summary]);

  return (
    <AdminLayout>
      <div className="">
        <div
          style={{
            marginBottom: 24,
            background:
              "linear-gradient(135deg, #e0f2e9 0%, #f1f8f4 40%, #ffffff 100%)",
            borderRadius: 20,
            padding: "20px 24px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #cce3d7",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(0,114,63,0.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: 80,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(0,114,63,0.04)",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              position: "relative",
            }}
          >
            <div>
              <Title
                level={4}
                style={{
                  margin: 0,
                  color: "#064e3b",
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                Tổng quan hệ thống
              </Title>
              <Text style={{ fontSize: 13, color: COLOR.textMuted }}>
                Thống kê việc làm sinh viên · Đợt mới nhất:{" "}
                <strong style={{ color: COLOR.primary }}>
                  {summary?.latestDot ?? "—"}
                </strong>
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#ffffff",
                borderRadius: 100,
                padding: "6px 14px",
                border: "1px solid #d1fae5",
                boxShadow: "0 1px 4px rgba(22,163,74,0.14)",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 0 2px rgba(34,197,94,0.45)",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: COLOR.primary,
                  fontWeight: 600,
                }}
              >
                Dữ liệu cập nhật
              </Text>
            </div>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            message="Không thể tải dashboard"
            description={error}
            style={{ marginBottom: 16, borderRadius: 12 }}
          />
        )}

        {loading ? (
          <div
            style={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin />
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="top">
              {statCards.map((item) => (
                <Col xs={24} sm={12} md={12} lg={6} key={item.index}>
                  <StatCard {...item} />
                </Col>
              ))}
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="top">
              <Col xs={24} lg={14}>
                <FacultyCard />
              </Col>
              <Col xs={24} lg={10}>
                <EnterpriseList />
              </Col>
            </Row>

            <ChartSection state={state} setField={setField} />
          </>
        )}

        <style>{`
          .ant-select-selector { border-radius: 8px !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        `}</style>
      </div>
    </AdminLayout>
  );
}

export default DashBoard;