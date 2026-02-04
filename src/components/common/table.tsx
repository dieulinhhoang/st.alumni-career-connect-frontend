import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Spin, Alert } from 'antd';
import type { TableProps } from 'antd';

interface TableData {
    id: string,
    maSinhVien: string,
    hoTen: string,
    diemRenLuyen: number,
    xepLoai: string,
}

interface Props {
    apiURL: string;
}

// gắn tag xếp loai
const getTagColor = (xepLoai: string): string => {
    switch (xepLoai) {
        case 'Xuất sắc':
            return 'green';
        case 'Tốt':
            return 'cyan';
        case 'Khá':
            return 'blue';
        case 'Trung bình':
            return 'orange';
        case 'Yếu':
            return 'red';
        default:
            return 'gray';
    }
};

// đn các cột

const columns: TableProps<TableData>['columns'] = [
    {
        title: 'Mã Sinh Viên',
        dataIndex: 'maSinhVien',
        key: 'maSinhVien',
        sorter: (a, b) => a.maSinhVien.localeCompare(b.maSinhVien),
    },
    {
        title: 'Họ và Tên',
        dataIndex: 'hoTen',
        key: 'hoTen',
        sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
    },
    {
        title: 'Điểm Rèn Luyện',
        dataIndex: 'diemRenLuyen',
        key: 'diemRenLuyen',
        sorter: (a, b) => a.diemRenLuyen - b.diemRenLuyen,
        align: 'center',
    },
    {
        title: 'Xếp Loại',
        dataIndex: 'xepLoai',
        key: 'xepLoai',
        align: 'center',
        filters: [
            { text: 'Xuất sắc', value: 'Xuất sắc' },
            { text: 'Tốt', value: 'Tốt' },
            { text: 'Khá', value: 'Khá' },
            { text: 'Trung bình', value: 'Trung bình' },
            { text: 'Yếu', value: 'Yếu' },
        ],
        onFilter: (value, record) => record.xepLoai === value,
        render: (xepLoai: string) => (
            <Tag color={getTagColor(xepLoai)} key={xepLoai}>
                {xepLoai.toUpperCase()}
            </Tag>
        ),
    },

];


const StudentTable: React.FC<Props> = ({ apiURL }) => {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(apiURL)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Không thể tải dữ liệu');
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

    }, [apiURL]) // Fetch lại api

    if (loading) {
        return <Spin style={{ display: 'block', margin: '50px auto' }} />
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />
    }

    return (
        <Table<TableData>
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{
                position: ['bottomRight'],
                defaultPageSize: 3,
                showSizeChanger: true,
                pageSizeOptions: ['10'],

            }}
            scroll={{ x: 'max-content' }}
        ></Table>
    )
}

export default StudentTable;
