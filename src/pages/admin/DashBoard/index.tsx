import { Col, Row, Typography } from "antd";
import { FileTextOutlined, SolutionOutlined, ReadOutlined, StarOutlined } from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import GreetingCard from "../../../components/common/greetingcard";
import { StatCard }       from "./Statcard";
import { FacultyCard }       from "./FacultyCard";
import { EnterpriseList } from "./Enterpriselist";
import { ChartSection }   from "./Chartsection";
import { useChartFilter } from "../../../feature/dashboard/hooks/useChartFilter";
import { getFilteredDotData, getLatestDot, KHOA_LIST } from "../../../feature/dashboard/api";

const { Title, Text } = Typography;


export function DashBoard() {
  const { chartMode, setChartMode, khoa, setKhoa, nganh, setNganh } = useChartFilter();

  const LATEST_DOT      = getLatestDot();
  const dotData         = getFilteredDotData("all", "all");
  const dotKeys         = Object.keys(dotData);
  const latest          = dotData[LATEST_DOT];
  const prev            = dotKeys.length >= 2 ? dotData[dotKeys[dotKeys.length - 2]] : null;
  const tongSVTotnghiep = KHOA_LIST.filter(k => k.daNop).reduce((s, k) => s + k.tongSV, 0);

  const totalPhanhoi    = latest.coViec + latest.chuaCoViec;
  const tyLePhanhoi     = Math.round((totalPhanhoi / tongSVTotnghiep) * 100);
  const employed        = Math.round((latest.coViec / totalPhanhoi) * 100);
  const overGrad        = Math.round((latest.coViec / tongSVTotnghiep) * 100);
  const relevant        = Math.round((latest.dungNganh + latest.lienQuan + latest.tiepTucHoc) / totalPhanhoi * 100);

  //so sánh với đợt trước
  const calcTrend = (curr: number, prevVal: number | undefined) => {
    if (!prevVal) return undefined;
    const diff = curr - prevVal;
    return (diff >= 0 ? "+" : "") + diff + "%";
  };
  const prevPhanhoi  = prev ? prev.coViec + prev.chuaCoViec : 0;
  const trendPhanhoi = prev ? calcTrend(tyLePhanhoi,  Math.round((prevPhanhoi / tongSVTotnghiep) * 100)) : undefined;
  const trendViec    = prev ? calcTrend(employed,      Math.round((prev.coViec / prevPhanhoi) * 100))     : undefined;
  const trendTN      = prev ? calcTrend(overGrad,      Math.round((prev.coViec / tongSVTotnghiep) * 100)) : undefined;
  const trendRel     = prev ? calcTrend(relevant,      Math.round((prev.dungNganh + prev.lienQuan + prev.tiepTucHoc) / prevPhanhoi * 100)) : undefined;

  const STAT_CARDS = [
    { index: 1, label: "Tỷ lệ phản hồi",      value: `${tyLePhanhoi}%`,  sub: `${totalPhanhoi} / ${tongSVTotnghiep} SV`,       icon: <FileTextOutlined />, accentColor: "#6366f1", trend: trendPhanhoi },
    { index: 2, label: "Có việc / phản hồi",   value: `${employed}%`, sub: "Trên số SV đã trả lời",              icon: <SolutionOutlined />, accentColor: "#10b981", trend: trendViec },
    { index: 3, label: "Có việc / tốt nghiệp", value: `${overGrad}%`, sub: "Trên tổng số SV tốt nghiệp",         icon: <ReadOutlined />,     accentColor: "#f59e0b", trend: trendTN },
    { index: 4, label: "Việc làm phù hợp",     value: `${relevant}%`, sub: "Đúng ngành + Liên quan + Học tiếp",  icon: <StarOutlined />,     accentColor: "#ec4899", trend: trendRel },
  ];

  return (
    <AdminLayout>
      {/* <GreetingCard /> */}

      {/* Page header */}
      <div style={{
        marginBottom: 24,
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
        borderRadius: 20, padding: "20px 24px",
        position: "relative", overflow: "hidden",
        border: "1px solid #e8e5ff",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(99,102,241,0.06)" }} />
        <div style={{ position: "absolute", bottom: -20, right: 80, width: 80, height: 80, borderRadius: "50%", background: "rgba(139,92,246,0.05)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative" }}>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e1b4b", fontWeight: 800, fontSize: 20 }}>
              Tổng quan hệ thống
            </Title>
            <Text style={{ fontSize: 13, color: "#64748b" }}>
              Thống kê việc làm sinh viên · Đợt mới nhất:{" "}
              <strong style={{ color: "#6366f1" }}>{LATEST_DOT}</strong>
            </Text>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#fff", borderRadius: 100, padding: "6px 14px",
            border: "1px solid #e8e5ff", boxShadow: "0 1px 4px rgba(99,102,241,0.1)",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 0 2px rgba(74,222,128,0.4)" }} />
            <Text style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>Dữ liệu cập nhật</Text>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="top">
        {STAT_CARDS.map(item => (
          <Col xs={24} sm={12} md={12} lg={6} key={item.index}>
            <StatCard {...item} />
          </Col>
        ))}
      </Row>

      {/* Lists */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="top">
        <Col xs={24} lg={14}>
          <FacultyCard />
        </Col>
        <Col xs={24} lg={10}>
          <EnterpriseList />
        </Col>
      </Row>

      {/* Chart */}
      <ChartSection
        chartMode={chartMode} setChartMode={setChartMode}
        khoa={khoa} setKhoa={setKhoa}
        nganh={nganh} setNganh={setNganh}
      />

      <style>{`
        .ant-select-selector { border-radius: 20px !important; }
        .ant-btn { border-radius: 8px !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </AdminLayout>
  );
}

export default DashBoard;