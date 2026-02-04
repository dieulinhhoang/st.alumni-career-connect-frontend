import { Table, type TableProps } from "antd";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useEffect, useState } from "react";
interface TableData {
    fullName: string,
    email: string,
    phone: string,
    role: string,
}
const columns: TableProps<TableData>['columns'] = [
    // {
    //     title: 'Mã Sinh Viên',
    //     dataIndex: 'smaSinhVien',
    //     key: 'maSinhVien',
    //     sorter: (a, b) => a.maSinhVien.localeCompare(b.maSinhVien),
    // },
    {
        title: 'Họ và Tên',
        dataIndex: 'fullName',
        key: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        align: 'center',
    }, {
        title: 'SDT ',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
    }, {
        title: 'Chức vụ ',
        dataIndex: 'role',
        key: 'role',
        align: 'center',
    }
]
function StudentList() {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // console.log(import.meta.env.API_URL + '/users');

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
                console.error("Lỗi fecth data : ", err);
                setError(err.message);
                setLoading(false);
            })
    }, [])
    if (error) {
        return <AdminLayout><h2>Lỗi: {error}</h2></AdminLayout>
    }
    return (
        <AdminLayout>
            <Table<TableData>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="email"
                pagination={{
                    position: ['bottomRight'],
                    defaultPageSize: 8,
                    showSizeChanger: true,
                    pageSizeOptions: ['10'],

                }}
                scroll={{ x: 'max-content' }} >
            </Table>
        </AdminLayout>
    )
}
export default StudentList;