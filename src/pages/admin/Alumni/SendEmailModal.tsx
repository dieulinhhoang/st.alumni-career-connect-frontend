import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { sendInviteEmails } from '../../../feature/alumni/api';

interface Props {
    batchId: number;
    batchTitle: string;
    open: boolean;
    onClose: () => void;
}

export const SendEmailModal: React.FC<Props> = ({ batchId, batchTitle, open, onClose }) => {
    const [subject, setSubject] = useState(`Mời tham gia khảo sát việc làm - ${batchTitle}`);
    const [htmlBody, setHtmlBody] = useState(
        `<p>Kính gửi Anh/Chị,</p>
<p>Học viện Nông nghiệp Việt Nam kính mời Anh/Chị tham gia khảo sát việc làm sau tốt nghiệp.</p>
<p>Thông tin khảo sát của Anh/Chị sẽ giúp Học viện nâng cao chất lượng đào tạo.</p>
<p>Trân trọng cảm ơn!</p>`
    );
    const [loading, setLoading] = useState(false);

    // const handleSend = async () => {
    //     if (!subject.trim() || !htmlBody.trim()) {
    //         message.error('Vui lòng nhập tiêu đề và nội dung email');
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         const result = await sendInviteEmails(batchId, { subject, htmlBody });
    //         message.success(
    //             `Gửi thành công ${result.sent} email, thất bại ${result.failed}, bỏ qua ${result.skipped}`
    //         );
    //         onClose();
    //     } catch (err: any) {
    //         message.error(err?.response?.data?.message ?? 'Gửi email thất bại');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
const handleSend = async () => {
  console.log('Bắt đầu gửi email...', { subject, htmlBody }); // thêm dòng này
  if (!subject.trim() || !htmlBody.trim()) {
    message.error('Vui lòng nhập tiêu đề và nội dung email');
    return;
  }
  setLoading(true);
  try {
    console.log('Gọi API...', batchId); // thêm dòng này
    const result = await sendInviteEmails(batchId, { subject, htmlBody });
    console.log('Kết quả:', result); // thêm dòng này
    message.success(
      `Gửi thành công ${result.sent} email, thất bại ${result.failed}, bỏ qua ${result.skipped}`
    );
    onClose();
  } catch (err: any) {
    console.error('Lỗi:', err); // thêm dòng này
    message.error(err?.response?.data?.message ?? 'Gửi email thất bại');
  } finally {
    setLoading(false);
  }
};
    return (
        <Modal
            title={`Gửi email khảo sát — ${batchTitle}`}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Hủy</Button>,
                <Button key="send" type="primary" loading={loading} onClick={handleSend}>
                    Gửi email
                </Button>,
            ]}
            width={600}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Tiêu đề email</div>
                    <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Nhập tiêu đề email"
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Nội dung email</div>
                    <Input.TextArea
                        value={htmlBody}
                        onChange={(e) => setHtmlBody(e.target.value)}
                        rows={8}
                        placeholder="Nhập nội dung email"
                    />
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                        Link khảo sát sẽ được tự động thêm vào cuối email.
                    </div>
                </div>
            </div>
        </Modal>
    );
};