import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, DatePicker, Form, Input, InputNumber, Upload, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import AdminLayout from "../../../components/layout/AdminLayout";
import {
  createGraduation,
  importGraduationStudents,
  type ImportGraduationStudentsResult,
} from "../../../feature/graduation/api";

interface FormValues {
  name: string;
  schoolYear?: number;
  certification?: string;
  certificationDate?: dayjs.Dayjs;
}

export default function ImportExcelForGraduation() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportGraduationStudentsResult | null>(null);

  const handleSubmit = async (values: FormValues) => {
    const file = fileList[0]?.originFileObj as File | undefined;
    if (!file) {
      message.warning("Vui lòng chọn file Excel (.xlsx)");
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const graduation = await createGraduation({
        name: values.name,
        schoolYear: values.schoolYear,
        certification: values.certification,
        certificationDate: values.certificationDate
          ? values.certificationDate.format("YYYY-MM-DD")
          : undefined,
      });

      const res = await importGraduationStudents(graduation.id, file);
      setResult(res);
      message.success("Tạo đợt tốt nghiệp và nhập danh sách sinh viên thành công");
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Tạo đợt tốt nghiệp thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 20, maxWidth: 720 }}>
        <h3 style={{ marginBottom: 16 }}>Thêm đợt tốt nghiệp</h3>

        <div style={{ marginBottom: 16 }}>
          <a
            href={`/public/templates/graduation_students_template.xlsx`}
            download="Mau_Danh_Sach_Tot_Nghiep.xlsx"
            style={{ textDecoration: "none" }}
          >
            <Button icon={<DownloadOutlined />}>Tải xuống file mẫu Excel</Button>
          </a>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên đợt tốt nghiệp"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đợt tốt nghiệp" }]}
          >
            <Input placeholder="VD: Đợt tốt nghiệp tháng 6/2026" />
          </Form.Item>

          <Form.Item label="Năm học" name="schoolYear">
            <InputNumber style={{ width: "100%" }} placeholder="VD: 2026" />
          </Form.Item>

          <Form.Item label="Số quyết định" name="certification">
            <Input placeholder="VD: 123/QĐ-ĐHKHTN" />
          </Form.Item>

          <Form.Item label="Ngày quyết định" name="certificationDate">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item
            label="File Excel danh sách sinh viên"
            required
            help="Tải file mẫu ở trên, điền danh sách sinh viên rồi tải lên ở đây"
          >
            <Upload
              accept=".xlsx,.xls"
              fileList={fileList}
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList: list }) => setFileList(list)}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={submitting}>
            Tạo đợt tốt nghiệp và nhập dữ liệu
          </Button>
        </Form>

        {result && (
          <div style={{ marginTop: 24 }}>
            <Alert
              type={result.errors.length > 0 ? "warning" : "success"}
              showIcon
              message="Kết quả nhập dữ liệu"
              description={
                <div>
                  <div>Tổng số dòng: {result.totalRows}</div>
                  <div>Sinh viên mới được tạo: {result.studentsCreated}</div>
                  <div>Sinh viên được gắn vào đợt tốt nghiệp: {result.studentsLinked}</div>
                  <div>Sinh viên đã có trong đợt (bỏ qua): {result.alreadyLinked}</div>
                  {result.errors.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontWeight: 500 }}>Lỗi ({result.errors.length} dòng):</div>
                      <ul style={{ marginTop: 4 }}>
                        {result.errors.map((e, idx) => (
                          <li key={idx}>
                            Dòng {e.row}: {e.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button
                    type="link"
                    style={{ paddingLeft: 0, marginTop: 8 }}
                    onClick={() => navigate("/admin/graduation")}
                  >
                    Về danh sách đợt tốt nghiệp
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
