import React from 'react'
import { Table } from 'antd'
import type { TableProps, TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'

// Data format 1: dùng bởi BatchList
// data = { data: T[], page: { total_elements, size, page } }
interface PagedData<T> {
  data: T[]
  page: {
    total_elements: number
    size: number
    page: number
  }
}

// Data format 2: dùng bởi UserListView / Enterprise
// data = { items: T[], total: number }
interface ListData<T> {
  items: T[]
  total: number
}

type TableData<T> = PagedData<T> | ListData<T> | T[] | null | undefined

function resolveDataSource<T extends object>(data: TableData<T>): T[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if ('data' in data && Array.isArray(data.data)) return data.data
  if ('items' in data && Array.isArray(data.items)) return data.items
  return []
}

const DEFAULT_PAGINATION: TablePaginationConfig = {
  pageSize: 10,
  showSizeChanger: false,
  showTotal: (total: number, range: [number, number]) =>
    `Hiển thị ${range[0]}–${range[1]} / ${total} bản ghi`,
  position: ['bottomCenter'],
}

function mergePagination(
  base: TablePaginationConfig,
  override?: TablePaginationConfig | false,
): TablePaginationConfig | false {
  if (override === false) return false

  if (!override) return base

  return {
    ...base,
    ...override,
    locale: {
      ...base.locale,
      ...override.locale,
    },
  }
}

function resolvePagination<T extends object>(
  data: TableData<T>,
  overridePagination?: TablePaginationConfig | false,
): TablePaginationConfig | false {
  if (!data || Array.isArray(data)) {
    return mergePagination(DEFAULT_PAGINATION, overridePagination)
  }

  if ('page' in data) {
    return mergePagination(
      {
        ...DEFAULT_PAGINATION,
        total: data.page.total_elements,
        pageSize: data.page.size,
        current: data.page.page + 1,
      },
      overridePagination,
    )
  }

  if ('total' in data) {
    return mergePagination(
      {
        ...DEFAULT_PAGINATION,
        total: data.total,
      },
      overridePagination,
    )
  }

  return mergePagination(
    {
      showSizeChanger: false,
      position: ['bottomCenter'],
    },
    overridePagination,
  )
}

// Props
interface CustomTableProps<T extends object>
  extends Omit<TableProps<T>, 'dataSource' | 'columns' | 'pagination'> {
  /** Dữ liệu bảng — hỗ trợ 3 format: PagedData, ListData, hoặc mảng T[] */
  data: TableData<T>
  columns: ColumnsType<T>
  /** Ghi đè pagination. Truyền `false` để ẩn phân trang. */
  pagination?: TablePaginationConfig | false
  /** Chiều cao tối thiểu của bảng (px). Mặc định: 430 */
  minHeight?: number
  /** Callback khi thay đổi trang / sort / filter */
  handleTableChange?: TableProps<T>['onChange']
  /** Bật zebra striping (hàng chẵn lẻ). Mặc định: true */
  striped?: boolean
}

// Component — memo để tránh re-render khi parent thay đổi state không liên quan
function CustomTable<T extends object>({
  data,
  columns,
  pagination,
  minHeight = 430,
  handleTableChange,
  striped = true,
  scroll,
  ...rest
}: CustomTableProps<T>) {
  const dataSource = resolveDataSource(data)
  const resolvedPagination = resolvePagination(data, pagination)

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table<T>
        {...rest}
        className={`custom-responsive-table${striped ? ' custom-table-striped' : ''}${rest.className ? ` ${rest.className}` : ''}`}
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        tableLayout="auto"
        scroll={scroll ?? { x: 'max-content' }}
        pagination={resolvedPagination}
        rowClassName={
          striped
            ? (_record: T, index: number) =>
                index % 2 === 1 ? 'custom-table-row-even' : ''
            : undefined
        }
        locale={{ emptyText: 'Không có dữ liệu' }}
        size="middle"
        style={{ minHeight, ...rest.style }}
      />

      <style>{`
        .custom-table-striped .custom-table-row-even > td {
          background: #f9fafb !important;
        }
        .custom-responsive-table .ant-table-thead > tr > th {
          background: #f4f5f7;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }
        .custom-responsive-table .ant-table-tbody > tr:hover > td {
          background: #f0fdf4 !important;
          transition: background 0.15s;
        }
        .custom-responsive-table .ant-table-pagination {
          margin-top: 16px;
        }
      `}</style>
    </div>
  )
}

export default React.memo(CustomTable) as typeof CustomTable