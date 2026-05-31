import React from 'react';
import { Empty } from 'antd';
import type { EmptyProps } from 'antd';

interface EmptyStateProps extends Omit<EmptyProps, 'description'> {
  /** Mô tả hiển thị dưới icon. Mặc định: "Không có dữ liệu" */
  description?: React.ReactNode;
  /** Padding xung quanh. Mặc định: 80 */
  padding?: number | string;
  /** Action button hoặc nội dung thêm bên dưới */
  extra?: React.ReactNode;
}

/**
 * EmptyState – component thống nhất cho tất cả trạng thái "không có dữ liệu" trong app.
 *
 * @example
 * // Dùng mặc định
 * <EmptyState />
 *
 * @example
 * // Tuỳ chỉnh mô tả và padding
 * <EmptyState description="Không tìm thấy kết quả" padding={40} />
 *
 * @example
 * // Kèm action
 * <EmptyState
 *   description="Chưa có biểu mẫu nào"
 *   extra={<Button type="primary">Tạo mới</Button>}
 * />
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  description = 'Không có dữ liệu',
  padding = 80,
  extra,
  ...rest
}) => {
  return (
    <div style={{ padding, textAlign: 'center' }}>
      <Empty description={description} {...rest} />
      {extra && <div style={{ marginTop: 16 }}>{extra}</div>}
    </div>
  );
};

export default EmptyState;
