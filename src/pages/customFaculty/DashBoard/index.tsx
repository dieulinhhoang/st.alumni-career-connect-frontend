import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Button, Col, Row, Spin } from "antd";
import {
  TeamOutlined, BankOutlined,
  FileTextOutlined, RiseOutlined, ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/layout/AdminLayout";
import { FacultyCard } from "../../system/DashBoard/FacultyCard";
import { EnterpriseList } from "../../system/DashBoard/Enterpriselist";
import { StatCard } from "../../system/DashBoard/Statcard";
import { getCurrentUser, getEffectiveFacultyId } from "../../../feature/auth/permission";
import api from "../../../libs/api";
import { COLOR, RADIUS, SHADOW } from "../../system/DashBoard/theme";
import { useChartFilter } from "../../../feature/dashboard/hooks/useChartFilter";

const ChartSection = lazy(() => import("../../system/DashBoard/Chartsection").then(m => ({ default: m.ChartSection })));

type FacultyInfo = {
  name: string;
  abbr: string;
  color: string;
  majorCount: number;
};

type ReportStatus = {
  responded: number;
  total: number;
  daNop: boolean;
};

export function KhoaDashBoard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  // Faculty hiệu lực: cán bộ khoa → khoa mình; admin đóng vai → khoa đang chọn
  const facultyId = getEffectiveFacultyId();

  const { state: chartState, setField: setChartField, setKhoa: setChartKhoa, nganhOptions } = useChartFilter();
  const [reloadKey] = useState(0);
  const [faculty, setFaculty] = useState<FacultyInfo | null>(null);
  const [report, setReport] = useState<ReportStatus | null>(null);
  const [totalEnterprises, setTotalEnterprises] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!facultyId) return;
    let cancelled = false;

    const run = async () => {
      setStatsLoading(true);
      try {
        const [facRes, rptRes, entRes] = await Promise.all([
          api.get(`/faculty/${facultyId}`),
          api.get("/dashboard/faculty-report-status"),
          api.get("/enterprises", { params: { facultyId, size: 200 } }),
        ]);
        if (cancelled) return;

        setFaculty({
          name: facRes.data.name,
          abbr: facRes.data.abbr,
          color: facRes.data.color ?? COLOR.primary,
          majorCount: facRes.data.majorCount ?? 0,
        });

        const statuses: any[] = Array.isArray(rptRes.data?.value)
          ? rptRes.data.value
          : Array.isArray(rptRes.data) ? rptRes.data : [];
        const mine = statuses.find(s => String(s.facultyId) === String(facultyId));
        if (mine) {
          setReport({ responded: mine.responded ?? 0, total: mine.total ?? 0, daNop: !!mine.daNop });
        }

        const items: any[] = Array.isArray(entRes.data?.items)
          ? entRes.data.items
          : Array.isArray(entRes.data) ? entRes.data : [];
        setTotalEnterprises(entRes.data?.total ?? items.length);
        setTotalJobs(items.reduce((s: number, e: any) => s + (e.jobs ?? 0), 0));
      } catch {
        // child components handle their own errors
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [facultyId, reloadKey]);

  useEffect(() => {
    if (faculty?.abbr && chartState.khoa !== faculty.abbr) setChartKhoa(faculty.abbr);
  }, [faculty?.abbr, chartState.khoa, setChartKhoa]);

  const chartKhoaOptions = useMemo(
    () => (faculty ? [{ value: faculty.abbr, label: faculty.name }] : []),
    [faculty],
  );

  const responseRate = useMemo(() => {
    if (!report || report.total === 0) return 0;
    return Math.round((report.responded / report.total) * 100);
  }, [report]);

  const statCards = useMemo(() => [
    {
      index: 1,
      label: "Sinh viên phản hồi",
      value: statsLoading ? "—" : `${report?.responded ?? 0}`,
      sub: statsLoading ? "Đang tải..." : `Trên tổng ${report?.total ?? 0} SV tốt nghiệp`,
      icon: <TeamOutlined />,
      accentColor: COLOR.primary,
    },
    {
      index: 2,
      label: "Tỉ lệ phản hồi",
      value: statsLoading ? "—" : `${responseRate}%`,
      sub: statsLoading ? "Đang tải..." : `${report?.responded ?? 0} / ${report?.total ?? 0} SV trả lời`,
      icon: <FileTextOutlined />,
      accentColor: COLOR.success,
    },
    {
      index: 3,
      label: "Doanh nghiệp liên kết",
      value: statsLoading ? "—" : `${totalEnterprises}`,
      sub: "DN đối tác hợp tác với khoa",
      icon: <BankOutlined />,
      accentColor: COLOR.gold,
    },
    {
      index: 4,
      label: "Vị trí tuyển dụng",
      value: statsLoading ? "—" : `${totalJobs}`,
      sub: "Tổng job đang tuyển từ DN liên kết",
      icon: <RiseOutlined />,
      accentColor: COLOR.pink,
    },
  ], [statsLoading, report, responseRate, totalEnterprises, totalJobs]);

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── HERO BANNER ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLOR.primaryTint} 0%, #f1f8f4 40%, #ffffff 100%)`,
            borderRadius: RADIUS.xl,
            padding: "20px 24px",
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${COLOR.borderSoft}`,
            boxShadow: SHADOW.sm,
          }}
        >
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: `${COLOR.primary}08`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, right: 80, width: 80, height: 80, borderRadius: "50%", background: `${COLOR.primary}05`, pointerEvents: "none" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: COLOR.textDark, marginBottom: 6, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {faculty ? `Khoa ${faculty.name}` : (currentUser.name ?? "Bảng điều khiển")}
                {faculty?.abbr && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: COLOR.textMuted,
                    background: COLOR.bgMuted, padding: "2px 10px",
                    borderRadius: RADIUS.pill, border: `1px solid ${COLOR.border}`,
                  }}>
                    {faculty.abbr}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: COLOR.textMuted, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {faculty && <span>{faculty.majorCount} ngành đào tạo</span>}
                {report && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "3px 10px", borderRadius: RADIUS.pill, fontSize: 12, fontWeight: 600,
                    color: report.daNop ? COLOR.success : COLOR.warning,
                    background: report.daNop ? "#f0fdf4" : "#fdf4e3",
                    border: `1px solid ${report.daNop ? "#a7f3d0" : "#fde68a"}`,
                  }}>
                    {report.daNop ? "Đã nộp báo cáo" : "Chưa nộp báo cáo"}
                  </span>
                )}
              </div>
            </div>

            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate(`/admin/reports/faculty/${facultyId}`)}
              style={{ background: COLOR.primary, borderColor: COLOR.primary, borderRadius: RADIUS.md }}
            >
              Xem báo cáo khoa
            </Button>
          </div>
        </div>

        {/* ── 4 STAT CARDS ── */}
        <Row gutter={[16, 16]}>
          {statCards.map(card => (
            <Col key={card.index} xs={12} sm={12} lg={6}>
              <StatCard {...card} />
            </Col>
          ))}
        </Row>

        {/* ── FACULTY CARD + ENTERPRISE LIST ── */}
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={12}>
            <FacultyCard />
          </Col>
          <Col xs={24} lg={12}>
            <EnterpriseList
              key={reloadKey}
              facultyId={facultyId}
            />
          </Col>
        </Row>

        {/* ── CHART ── */}
        <Suspense fallback={<div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}><Spin size="large" /></div>}>
          <ChartSection
            state={chartState}
            setField={setChartField}
            khoaOptions={chartKhoaOptions}
            nganhOptions={nganhOptions}
          />
        </Suspense>
      </div>
    </AdminLayout>
  );
}

export default KhoaDashBoard;
