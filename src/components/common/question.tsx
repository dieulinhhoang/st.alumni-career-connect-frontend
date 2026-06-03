import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

/**
 * Bug #4 fix: file này trước đó rỗng (0 bytes) gây lỗi import.
 * TODO: Triển khai component Question đầy đủ theo yêu cầu.
 */
const Question: React.FC = () => {
  return (
    <Text type="secondary">
      Question component (chưa triển khai)
    </Text>
  );
};

export default Question;
