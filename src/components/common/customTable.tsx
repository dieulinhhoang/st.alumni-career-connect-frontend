import { Table } from "antd";

export default function CustomTable({
  columns,
  data,
  handleTableChange,
  filter,
  minHeight = 430,
  scroll,
  pagination,
  ...props
}: any) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        {...props}
        className={`custom-responsive-table ${props.className || ""}`}
        columns={columns}
        dataSource={data?.data || []}
        onChange={handleTableChange}
        tableLayout="auto"
        scroll={
          scroll || {
            x: "max-content",
          }
        }
        scrollToFirstRowOnChange
        pagination={
          pagination ?? {
            total: data?.page?.total_elements || 0,
            pageSize: filter?.size || 10,
            current: (filter?.page ?? 0) + 1,
            showSizeChanger: true,
            showTotal: (total: number, range: [number, number]) =>
              `Hiển thị ${range[0]} đến ${range[1]} trong số ${total} bản ghi`,
            position: ["bottomCenter"],
            pageSizeOptions: ["10", "20", "50", "100"],
          }
        }
        locale={{
          emptyText: "Không có dữ liệu",
        }}
        size="middle"
        style={{
          minHeight,
          ...props.style,
        }}
      />
    </div>
  );
}