import type { Form } from "../../../feature/form/types";

interface Props {
  form: Form | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

const IcAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export function DeleteModal({ form, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "#fef2f2", border: "1px solid #fca5a5",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#dc2626", marginBottom: 16,
        }}>
          <IcAlertTriangle />
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
          Xóa form này?
        </div>
        <div style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, marginBottom: 24 }}>
          Form <strong style={{ color: "#111827" }}>"{form?.name}"</strong> sẽ bị xóa vĩnh viễn.
          Hành động này không thể hoàn tác.
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onCancel}>Hủy</button>
          <button
            className="btn"
            style={{ background: "#dc2626", color: "#fff", border: "none", boxShadow: "0 1px 3px rgba(220,38,38,.3)" }}
            onClick={onConfirm}
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
}