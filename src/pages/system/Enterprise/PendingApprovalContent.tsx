import { useCallback, useEffect, useState } from "react";
import { Button, Descriptions, Input, message, Modal, Space, Tag, Typography } from "antd";
import { CheckOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import CustomTable from "../../../components/common/customTable";
import {
  fetchPendingEnterprises,
  approveEnterprise,
  rejectEnterprise,
} from "../../../feature/enterprise/api";
import type { Enterprise } from "../../../feature/enterprise/type";
import { havePermission } from "../../../feature/auth/permission";
import { PermissionEnum } from "../../../feature/auth/type";

const { Text, Paragraph } = Typography;

const COLOR = {
  primary: "#16a34a",
  warning: "#f59e0b",
  text: "#0f172a",
  sub: "#64748b",
  border: "#e5e7eb",
  surface: "#ffffff",
};

/**
 * Nội dung "Đối tác chờ duyệt" — dùng chung cho tab trong trang Doanh nghiệp đối tác.
 * DN tự đăng ký qua API (status='pending') hiện ở đây để admin Duyệt / Từ chối.
 * `onCount` báo số lượng chờ duyệt lên cha (để hiển thị badge trên tab).
 */
export default function PendingApprovalContent({ onCount }: { onCount?: (n: number) => void }) {
  const canReview = havePermission(PermissionEnum.ENTERPRISES_UPDATE);

  const [items, setItems] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPendingEnterprises({ page: 0, size: 100 });
      setItems(data);
      onCount?.(data.length);
    } catch {
      message.error("Không tải được danh sách chờ duyệt");
    } finally {
      setLoading(false);
    }
  }, [onCount]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = (record: Enterprise) => {
    Modal.confirm({
      title: `Duyệt "${record.name}"?`,
      content: "Doanh nghiệp sẽ trở thành đối tác chính thức và được kích hoạt.",
      okText: "Duyệt",
      cancelText: "Huỷ",
      okButtonProps: { style: { background: COLOR.primary } },
      onOk: async () => {
        setBusyId(record.id);
        try {
          await approveEnterprise(record.id);
          message.success(`Đã duyệt "${record.name}"`);
          setItems((prev) => {
            const next = prev.filter((e) => e.id !== record.id);
            onCount?.(next.length);
            return next;
          });
        } catch {
          message.error("Duyệt thất bại");
        } finally {
          setBusyId(null);
        }
      },
    });
  };

  const handleReject = (record: Enterprise) => {
    let reason = "";
    Modal.confirm({
      title: `Từ chối "${record.name}"?`,
      content: (
        <Input.TextArea
          rows={3}
          placeholder="Lý do từ chối (không bắt buộc)"
          onChange={(e) => (reason = e.target.value)}
        />
      ),
      okText: "Từ chối",
      okButtonProps: { danger: true },
      cancelText: "Huỷ",
      onOk: async () => {
        setBusyId(record.id);
        try {
          await rejectEnterprise(record.id, reason);
          message.success(`Đã từ chối "${record.name}"`);
          setItems((prev) => {
            const next = prev.filter((e) => e.id !== record.id);
            onCount?.(next.length);
            return next;
          });
        } catch {
          message.error("Từ chối thất bại");
        } finally {
          setBusyId(null);
        }
      },
    });
  };

  const columns: ColumnsType<Enterprise> = [
    {
      title: "Doanh nghiệp",
      key: "name",
      render: (_v, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.text }}>{r.name}</div>
          {r.industry && (
            <Tag style={{ marginTop: 4, borderRadius: 99 }} color="default">
              {r.industry}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 240,
      render: (_v, r) => (
        <div style={{ fontSize: 13, color: COLOR.sub }}>
          {r.contactPerson && <div>👤 {r.contactPerson}</div>}
          {r.email && <div>✉ {r.email}</div>}
          {r.phone && <div>☎ {r.phone}</div>}
          {r.website && <div>🔗 {r.website}</div>}
        </div>
      ),
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (v?: string) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—"),
    },
    ...(canReview
      ? [
          {
            title: "Thao tác",
            key: "action",
            width: 200,
            align: "center" as const,
            render: (_v: unknown, record: Enterprise) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  loading={busyId === record.id}
                  onClick={() => handleApprove(record)}
                  style={{ background: COLOR.primary }}
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  disabled={busyId === record.id}
                  onClick={() => handleReject(record)}
                >
                  Từ chối
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button icon={<ReloadOutlined />} onClick={load} loading={loading}>
          Làm mới
        </Button>
      </div>

      <CustomTable<Enterprise>
        rowKey="id"
        data={items}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 760 }}
        expandable={{
          expandedRowRender: (r) => (
            <Descriptions size="small" column={1} style={{ maxWidth: 720 }}>
              <Descriptions.Item label="Quy mô">{r.size || "—"}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{r.address || "—"}</Descriptions.Item>
              <Descriptions.Item label="Giới thiệu">
                <Paragraph style={{ margin: 0 }}>{r.description || "—"}</Paragraph>
              </Descriptions.Item>
            </Descriptions>
          ),
        }}
      />

      {!canReview && (
        <Text type="secondary" style={{ fontSize: 13 }}>
          Bạn chỉ có quyền xem. Cần quyền cập nhật doanh nghiệp để duyệt/từ chối.
        </Text>
      )}
    </div>
  );
}
