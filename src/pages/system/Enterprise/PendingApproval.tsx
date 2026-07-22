import { Typography } from "antd";
import AdminLayout from "../../../components/layout/AdminLayout";
import PendingApprovalContent from "./PendingApprovalContent";

const { Text } = Typography;

/**
 * Trang riêng "Đối tác chờ duyệt" — giữ để deep-link /admin/enterprises/pending còn hoạt động.
 * Nội dung chính đã nằm trong tab "Chờ duyệt" của trang Doanh nghiệp đối tác
 * (dùng chung component PendingApprovalContent).
 */
export default function PendingApprovalPage() {
  return (
    <AdminLayout>
      <div style={{ padding: "0 4px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          Hồ sơ đối tác chờ duyệt
        </h2>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Trang này cũng có sẵn trong Doanh nghiệp đối tác → tab “Chờ duyệt”.
        </Text>
        <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <PendingApprovalContent />
        </div>
      </div>
    </AdminLayout>
  );
}
