import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Col, Row, Tag, Button, Badge, Divider, Space, Modal, Spin,
} from "antd";
import {
  ArrowLeftOutlined, GlobalOutlined, MailOutlined, PhoneOutlined,
  PlusOutlined, EnvironmentOutlined, SafetyCertificateOutlined,
  PauseCircleOutlined, PlayCircleOutlined, EditOutlined, TeamOutlined,
} from "@ant-design/icons";

import AdminLayout from "../../../components/layout/AdminLayout";
import { findBySlug } from "../../../components/common/utils";
import { useEnterpriseDetail } from "../../../feature/enterprise/hooks/useEnterpriseDetail";
import { useJobs } from "../../../feature/enterprise/hooks/useJobs";
import { useFacultyColors } from "../../../feature/enterprise/hooks/useFacultyColors";
import { fetchEnterprises } from "../../../feature/enterprise/api";
import {
  FACULTY_VI_NAME,
  type Enterprise, type Job, type JobFormValues, type PartnerStatus,
} from "../../../feature/enterprise/type";

 import { JobFormModal } from "./JobFormModal";
import { JobCard } from "./JobCard";
import { EditEnterpriseModal } from "../Enterprise/EnterpriseFormModal";

export default function EnterpriseDetailPage() {
  const { slug }     = useParams<{ slug: string }>();
  const navigate     = useNavigate();
  const { getColor } = useFacultyColors();

  // Resolve slug
  const [entId, setEntId] = useState<string | undefined>();
  useEffect(() => {
    fetchEnterprises().then(list => {
      const found = findBySlug(list, slug ?? "");
      setEntId(found?.id);
    });
  }, [slug]);

  const { enterprise: ent, loading: entLoading, edit, verify, togglePartnerStatus } = useEnterpriseDetail(entId);
  const { jobs, activeJobs, closedJobs, addJob, editJob, removeJob } = useJobs(entId);

  const [jobTab,   setJobTab]   = useState("all");
  const [editOpen, setEditOpen] = useState(false);
  const [jobModal, setJobModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });

  if (entLoading) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
    </AdminLayout>
  );

  if (!ent) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
        <div>Không tìm thấy doanh nghiệp</div>
        <Button style={{ marginTop: 16 }} onClick={() => navigate("/admin/enterprises")}>Quay lại</Button>
      </div>
    </AdminLayout>
  );

  const displayJobs = jobTab === "active" ? activeJobs : jobTab === "closed" ? closedJobs : jobs;

  const handleTogglePartner = () => {
    if (ent.partnerStatus === "active") {
      Modal.confirm({
        title: "Ngừng hợp tácđối tác?",
        content: `"${ent.name}" sẽ bị hủy kích hoạt. Tin tuyển dụng sẽ bị ẩn với sinh viên.`,
        okText: "Hủy kích hoạt", okType: "danger", cancelText: "Quay lại",
        onOk: () => togglePartnerStatus("inactive" as PartnerStatus),
      });
    } else {
      togglePartnerStatus("active" as PartnerStatus);
    }
  };

  const handleSaveJob = async (values: JobFormValues) => {
    if (jobModal.job) {
      await editJob(jobModal.job.id, values as Partial<Job>);
    } else {
      await addJob(values);
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Back */}
        <Button icon={<ArrowLeftOutlined />} type="text"
          style={{ marginBottom: 16, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate("/admin/enterprises")}
        >Quay lại danh sách</Button>

        {/* Hero card */}
        <Card style={{ borderRadius: 16, marginBottom: 20, border: "1px solid #ede9fe", overflow: "hidden" }}>
          <div style={{ height: 120, background: `linear-gradient(135deg, ${ent.color}22, ${ent.color}44)`, margin: "-24px -24px 0", borderBottom: `2px solid ${ent.color}30`, position: "relative" }}>
            <div style={{ position: "absolute", right: 20, top: 16, display: "flex", gap: 8 }}>
              <Tag icon={<SafetyCertificateOutlined />} color={ent.verified ? "success" : "warning"}>
                {ent.verified ? "Đã xác minh" : "Chờ xác minh"}
              </Tag>
              <Tag color={ent.partnerStatus === "active" ? "blue" : "error"}>
                {ent.partnerStatus === "active" ? "Đang hoạt động" : "Không hoạt động"}
              </Tag>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", marginTop: -40, position: "relative", flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: 16, background: ent.color + "18", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: ent.color }}>{ent.abbr}</span>
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b" }}>{ent.name}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span>{ent.industry}</span>
                {ent.size && <>
                  <span style={{ color: "#d1d5db" }}>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <TeamOutlined style={{ fontSize: 12 }} />{ent.size}
                  </span>
                </>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, paddingBottom: 4, flexWrap: "wrap" }}>
              <Button icon={<PlusOutlined />} type="primary"
                style={{ background: ent.color, border: "none", borderRadius: 8 }}
                onClick={() => setJobModal({ open: true, job: null })}
              >Thêm tin tuyển dụng</Button>
              <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)} style={{ borderRadius: 8 }}>Chỉnh sửa</Button>
              {!ent.verified && (
                <Button icon={<SafetyCertificateOutlined />}
                  style={{ background: "#059669", border: "none", color: "white", borderRadius: 8 }}
                  onClick={verify}
                >Xác minh</Button>
              )}
              <Button
                icon={ent.partnerStatus === "active" ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                style={{ borderColor: ent.partnerStatus === "active" ? "#ef4444" : "#059669", color: ent.partnerStatus === "active" ? "#ef4444" : "#059669", borderRadius: 8 }}
                onClick={handleTogglePartner}
              >
                {ent.partnerStatus === "active" ? "Hủy kích hoạt" : "Kích hoạt lại"}
              </Button>
            </div>
          </div>
        </Card>

        <Row gutter={[20, 20]}>
          {/* Left panel */}
          <Col xs={24} lg={8}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Contact */}
              <Card style={{ borderRadius: 14, border: "1px solid #ede9fe" }} title={<span style={{ fontSize: 14, fontWeight: 700 }}>Thông tin liên hệ</span>}>
                {[
                  { icon: <GlobalOutlined style={{ color: ent.color }} />,      label: "Website",    value: ent.website },
                  { icon: <MailOutlined   style={{ color: ent.color }} />,      label: "Email",      value: ent.email   },
                  { icon: <PhoneOutlined  style={{ color: ent.color }} />,      label: "Điện thoại", value: ent.phone   },
                  { icon: <EnvironmentOutlined style={{ color: ent.color }} />, label: "Địa chỉ",   value: ent.address },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
                <Divider style={{ margin: "8px 0 12px" }} />
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Đối tác từ</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: ent.color }}>{ent.joinedDate}</div>
              </Card>

              {/* Faculties */}
              <Card style={{ borderRadius: 14, border: "1px solid #ede9fe" }} title={<span style={{ fontSize: 14, fontWeight: 700 }}>Khoa đối tác</span>}>
                {(ent.faculties ?? []).length === 0
                  ? <span style={{ color: "#9ca3af", fontSize: 13 }}>Chưa có khoa liên kết</span>
                  : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {ent.faculties.map(k => (
                        <span key={k} style={{ padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: getColor(k) + "15", color: getColor(k), border: `1px solid ${getColor(k)}30` }}>
                          {FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}
                        </span>
                      ))}
                    </div>
                  )
                }
              </Card>

              {/* Stats */}
              <Card style={{ borderRadius: 14, border: "1px solid #ede9fe" }} title={<span style={{ fontSize: 14, fontWeight: 700 }}>Thống kê tuyển dụng</span>}>
                <Row gutter={[12, 12]}>
                  {[
                    { label: "Tổng tin",   value: jobs.length,       color: ent.color, bg: ent.color + "12" },
                    { label: "Đang tuyển", value: activeJobs.length, color: "#059669", bg: "#d1fae5" },
                    { label: "Đã đóng",   value: closedJobs.length,  color: "#d97706", bg: "#fef3c7" },
                  ].map(s => (
                    <Col key={s.label} span={8}>
                      <div style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: s.bg }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          </Col>

          {/* Right panel */}
          <Col xs={24} lg={16}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Description */}
              <Card style={{ borderRadius: 14, border: "1px solid #ede9fe" }} title={<span style={{ fontSize: 14, fontWeight: 700 }}>Giới thiệu</span>}>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{ent.description}</p>
              </Card>

              {/* Jobs */}
              <Card
                style={{ borderRadius: 14, border: "1px solid #ede9fe" }}
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Tin tuyển dụng</span>
                    <Badge count={activeJobs.length} style={{ backgroundColor: ent.color }} />
                  </div>
                }
                extra={
                  <Space>
                    {[
                      { key: "all",    label: "Tất cả",     count: jobs.length },
                      { key: "active", label: "Đang tuyển", count: activeJobs.length },
                      { key: "closed", label: "Đã đóng",    count: closedJobs.length },
                    ].map(tab => (
                      <Button key={tab.key} size="small"
                        type={jobTab === tab.key ? "primary" : "default"}
                        style={jobTab === tab.key ? { background: ent.color, border: "none" } : {}}
                        onClick={() => setJobTab(tab.key)}
                      >
                        {tab.label} ({tab.count})
                      </Button>
                    ))}
                  </Space>
                }
              >
                {displayJobs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                    <div>Chưa có tin tuyển dụng</div>
                    <Button type="primary" icon={<PlusOutlined />}
                      style={{ marginTop: 12, background: ent.color, border: "none" }}
                      onClick={() => setJobModal({ open: true, job: null })}
                    >Thêm tin mới</Button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {displayJobs.map(j => (
                      <JobCard
                        key={j.id} job={j} entColor={ent.color} getColor={getColor}
                        onEdit={job => setJobModal({ open: true, job })}
                        onDelete={removeJob}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      <EditEnterpriseModal
        open={editOpen} ent={ent}
        onClose={() => setEditOpen(false)}
        onSave={edit as (v: Partial<Enterprise>) => Promise<void>}
      />

      <JobFormModal
        open={jobModal.open} job={jobModal.job}
        entColor={ent.color} entFaculties={ent.faculties ?? []}
        onClose={() => setJobModal({ open: false, job: null })}
        onSave={handleSaveJob}
      />
    </AdminLayout>
  );
}