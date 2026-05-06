import AdminLayout from "../../../components/layout/AdminLayout";
import { useEffect, useState } from "react";
import CustomTable from "../../../components/common/customTable";

interface TableData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const columns = [
  {
    title: 'Họ và Tên',
    dataIndex: 'fullName',
    key: 'fullName',
    sorter: (a: TableData, b: TableData) => a.fullName.localeCompare(b.fullName),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    align: 'center' as const,
  },
  {
    title: 'SDT',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center' as const,
  },
  {
    title: 'Chức vụ',
    dataIndex: 'role',
    key: 'role',
    align: 'center' as const,
  },
]

function StudentList() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(import.meta.env.VITE_API_URL + '/users')
      .then(res => {
        if (!res.ok) {
          throw new Error('Không thể tải dữ liệu !');
        }
        return res.json();
      })
      .then((fetchedData: TableData[]) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi fetch data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return <AdminLayout><h2>Lỗi: {error}</h2></AdminLayout>;
  }

  return (
    <AdminLayout>
      <CustomTable
        columns={columns}
        data={{ data }}
        loading={loading}
        rowKey="email"
        pagination={{
          pageSize: 8,
          total: data.length,
          showSizeChanger: true,
          pageSizeOptions: ['10'],
          position: ['bottomCenter'],
          showTotal: (total: number, range: [number, number]) =>
            `Hiển thị ${range[0]} đến ${range[1]} trong số ${total} bản ghi`,
        }}
      />
    </AdminLayout>
  );
}

export default StudentList;
