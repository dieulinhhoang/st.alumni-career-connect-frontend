import AdminLayout from "../../../components/layout/AdminLayout";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

export default function ImportExcelForGraduation() {
  
    return (
        <AdminLayout>
            <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>Nhập dữ liệu tốt nghiệp từ file Excel</h3>
                
                <a
                    href={`/public/templates/graduation_students_template.xlsx`}
                    download="Mau_Danh_Sach_Tot_Nghiep.xlsx"
                    style={{ textDecoration: 'none' }}
                >
                    <Button type="primary" icon={<DownloadOutlined />}>
                        Tải xuống file mẫu Excel
                    </Button>
                </a>
                <a
                    href={`/public/templates/graduation_students_template.xlsx`}
                    download="Mau_Danh_Sach_Tot_Nghiep.xlsx"
                    style={{ textDecoration: 'none' }}
                >
                    <Button type="primary" icon={<DownloadOutlined />}>
                        Tải lên file excel
                    </Button>
                </a>
            </div>
        </AdminLayout>
    );
}
