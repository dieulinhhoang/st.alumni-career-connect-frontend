/**
 * actingFaculty — "đóng vai khoa" trong phiên cho tài khoản admin.
 *
 * Admin (isAdmin) mặc định thấy toàn trường. Header cho phép chọn tạm 1 khoa để
 * xem/quản lý dữ liệu với phạm vi khoa đó — KHÔNG đổi dữ liệu DB, chỉ ảnh hưởng
 * client + tham số facultyId gửi lên API (backend đã cho admin truyền facultyId bất kỳ).
 *
 * Lưu ở localStorage để giữ qua reload. Đổi khoa → reload trang để mọi màn hình
 * và cache react-query áp scope mới.
 */
const ID_KEY = 'actingFacultyId';
const NAME_KEY = 'actingFacultyName';

export const getActingFacultyId = (): string | null =>
  localStorage.getItem(ID_KEY) || null;

export const getActingFacultyName = (): string | null =>
  localStorage.getItem(NAME_KEY) || null;

export const setActingFaculty = (id: string | null, name: string | null): void => {
  if (id) {
    localStorage.setItem(ID_KEY, id);
    localStorage.setItem(NAME_KEY, name ?? '');
  } else {
    localStorage.removeItem(ID_KEY);
    localStorage.removeItem(NAME_KEY);
  }
};

export const clearActingFaculty = (): void => {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(NAME_KEY);
};
