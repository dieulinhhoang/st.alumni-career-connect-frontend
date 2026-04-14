import { Table } from 'antd'

export default function CustomTable({ columns, data, handleTableChange, filter, minHeight = 430, ...props }: any) {
  return (
    <Table
      {...props}
      columns={columns}
      dataSource={data?.data}
      onChange={handleTableChange}
      pagination={{
        total: data?.page?.total_elements || 0,
        pageSize: filter?.size || 10,
        current: filter?.page + 1 || 1,
        showSizeChanger: true,
        showTotal: (total, range) => `Hiển thị ${range[0]} đến ${range[1]} trong số ${total} bản ghi`,
        position: ['bottomCenter'],
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      locale={{
        emptyText: 'Không có dữ liệu'
      }}
      size='middle'
      style={{
        minHeight: minHeight
      }}
    />
  )
}
