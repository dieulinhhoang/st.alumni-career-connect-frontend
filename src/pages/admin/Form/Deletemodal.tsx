// Deletemodal.tsx
import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { Form } from "../../../feature/form/types";

interface Props {
  form: Form | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ form, onConfirm, onCancel }: Props) {
  return (
    <Modal
      open={true}
      onCancel={onCancel}
      onOk={onConfirm}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: "#dc2626" }} />
          <span>Xóa form này?</span>
        </div>
      }
      okText="Xóa vĩnh viễn"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
      centered
    >
      <div style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65 }}>
        Form <strong style={{ color: "#111827" }}>"{form?.name}"</strong> sẽ bị xóa vĩnh viễn.
        Hành động này không thể hoàn tác.
      </div>
    </Modal>
  );
}