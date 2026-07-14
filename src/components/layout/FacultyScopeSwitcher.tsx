import React from 'react';
import { Select, Tooltip } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { useFaculties } from '../../feature/faculty/hooks/useFaculties';
import { getCurrentUser } from '../../feature/auth/permission';
import { getActingFacultyId, setActingFaculty } from '../../feature/auth/actingFaculty';

/**
 * FacultyScopeSwitcher — cho admin "đóng vai" một khoa trong phiên.
 * Chọn khoa → lưu localStorage rồi reload để mọi trang áp phạm vi khoa mới.
 * Chỉ hiển thị với tài khoản admin (cán bộ khoa đã bị khóa theo khoa của mình).
 */
const ALL_VALUE = '__all__';

const FacultyScopeSwitcher: React.FC = () => {
  const currentUser = getCurrentUser();
  const { faculties, loading } = useFaculties();

  if (!currentUser.isAdmin) return null;

  const current = getActingFacultyId() ?? ALL_VALUE;

  const handleChange = (value: string) => {
    if (value === ALL_VALUE) {
      setActingFaculty(null, null);
      // Về chế độ toàn trường → dashboard admin
      window.location.href = '/admin/dashboard';
    } else {
      const f = faculties.find((x) => String(x.id) === value);
      setActingFaculty(value, f?.name ?? null);
      // Vào chế độ khoa → dashboard khoa (full load để mọi trang + cache áp scope mới)
      window.location.href = '/khoa/dashboard';
    }
  };

  return (
    <Tooltip title="Xem/quản lý dữ liệu với tư cách khoa" placement="bottom">
      <Select
        value={current}
        onChange={handleChange}
        loading={loading}
        size="middle"
        style={{ minWidth: 190 }}
        suffixIcon={<ApartmentOutlined />}
        options={[
          { value: ALL_VALUE, label: 'Toàn trường' },
          ...faculties.map((f) => ({ value: String(f.id), label: f.name })),
        ]}
      />
    </Tooltip>
  );
};

export default FacultyScopeSwitcher;
