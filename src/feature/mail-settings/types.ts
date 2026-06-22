export interface EmailConfig {
  id: number;
  mailer: string;
  host: string;
  port: number;
  account: string;
  password: string | null;
  senderName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmailConfigPayload {
  mailer?: string;
  host?: string;
  port?: number;
  account?: string;
  password?: string | null;
  senderName?: string;
  isActive?: boolean;
}

export interface EmailTemplate {
  id: number;
  type: string;
  name: string;
  description: string;
  subject: string;
  sections: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmailTemplatePayload {
  subject?: string;
  sections?: Record<string, string>;
  isActive?: boolean;
}

// Định nghĩa các section cho từng loại template
export interface SectionDef {
  key: string;
  label: string;
  multiline: boolean;
}

export interface VariableDef {
  key: string;
  label: string;
  desc: string;
}

export const TEMPLATE_SECTIONS: Record<string, SectionDef[]> = {
  enterprise_invite: [
    { key: 'greeting', label: 'Lời chào', multiline: false },
    { key: 'intro', label: 'Đoạn giới thiệu', multiline: true },
    { key: 'button_label', label: 'Chữ trên nút', multiline: false },
    { key: 'signature', label: 'Chữ ký', multiline: true },
    { key: 'footer', label: 'Chú thích', multiline: true },
  ],
  job_application: [
    { key: 'greeting', label: 'Lời chào', multiline: false },
    { key: 'intro', label: 'Đoạn giới thiệu', multiline: true },
    { key: 'signature', label: 'Chữ ký', multiline: true },
    { key: 'footer', label: 'Chú thích', multiline: true },
  ],
  password_setup: [
    { key: 'greeting', label: 'Lời chào', multiline: false },
    { key: 'intro', label: 'Đoạn giới thiệu', multiline: true },
    { key: 'button_label', label: 'Chữ trên nút', multiline: false },
    { key: 'signature', label: 'Chữ ký', multiline: true },
    { key: 'footer', label: 'Chú thích', multiline: true },
  ],
  password_reset: [
    { key: 'greeting', label: 'Lời chào', multiline: false },
    { key: 'intro', label: 'Đoạn giới thiệu', multiline: true },
    { key: 'button_label', label: 'Chữ trên nút', multiline: false },
    { key: 'signature', label: 'Chữ ký', multiline: true },
    { key: 'footer', label: 'Chú thích', multiline: true },
  ],
  survey_invite: [
    { key: 'greeting', label: 'Lời chào', multiline: false },
    { key: 'intro', label: 'Đoạn giới thiệu', multiline: true },
    { key: 'button_label', label: 'Chữ trên nút', multiline: false },
    { key: 'signature', label: 'Chữ ký', multiline: true },
    { key: 'footer', label: 'Chú thích', multiline: true },
  ],
};

export const TEMPLATE_VARIABLES: Record<string, VariableDef[]> = {
  enterprise_invite: [
    { key: 'ten_doanh_nghiep', label: '{{ten_doanh_nghiep}}', desc: 'Tên doanh nghiệp' },
    { key: 'button_url', label: '{{button_url}}', desc: 'Link kích hoạt tài khoản' },
  ],
  job_application: [
    { key: 'ten_viec', label: '{{ten_viec}}', desc: 'Tên vị trí tuyển dụng' },
    { key: 'ten_ung_vien', label: '{{ten_ung_vien}}', desc: 'Tên ứng viên' },
    { key: 'email_ung_vien', label: '{{email_ung_vien}}', desc: 'Email ứng viên' },
    { key: 'sdt_ung_vien', label: '{{sdt_ung_vien}}', desc: 'Số điện thoại ứng viên' },
    { key: 'loi_nhan', label: '{{loi_nhan}}', desc: 'Lời nhắn của ứng viên' },
  ],
  password_setup: [
    { key: 'ten_nguoi_dung', label: '{{ten_nguoi_dung}}', desc: 'Tên người dùng' },
    { key: 'button_url', label: '{{button_url}}', desc: 'Link thiết lập mật khẩu' },
  ],
  password_reset: [
    { key: 'ten_nguoi_dung', label: '{{ten_nguoi_dung}}', desc: 'Tên người dùng' },
    { key: 'button_url', label: '{{button_url}}', desc: 'Link đặt lại mật khẩu' },
  ],
  survey_invite: [
    { key: 'ten_nguoi_dung', label: '{{ten_nguoi_dung}}', desc: 'Tên người dùng' },
    { key: 'ten_khao_sat', label: '{{ten_khao_sat}}', desc: 'Tên khảo sát' },
    { key: 'button_url', label: '{{button_url}}', desc: 'Link tham gia khảo sát' },
  ],
};
