import { Outlet, Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { haveAnyPermission } from '../feature/auth/permission';
import type { PermissionEnum } from '../feature/auth/type';

const Forbidden = () => (
  <Result
    status="403"
    title="403"
    subTitle="Bạn không có quyền truy cập trang này."
    extra={
      <Button type="primary">
        <Link to="/admin/dashboard">Về trang chủ</Link>
      </Button>
    }
  />
);

/** Chặn truy cập route nếu user không có ít nhất 1 trong các quyền yêu cầu. */
export const PermissionRoute = ({
  permission,
}: {
  permission: PermissionEnum | PermissionEnum[];
}) => {
  const required = Array.isArray(permission) ? permission : [permission];
  return haveAnyPermission(required) ? <Outlet /> : <Forbidden />;
};
