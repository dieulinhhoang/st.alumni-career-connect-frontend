import { resourceLimits } from "worker_threads";

export const RESOURCE_LABEL_VI: Record<string, string> = {
  assignments: 'Bài tập',
  categories: 'Danh mục',
  classes: 'Lớp học',
  files: 'Tệp tin',
  organizations: 'Trường học',
  'program-types': 'Hệ đào tạo',
  roles: 'Vai trò',
  schedules: 'Thời khóa biểu',
  'school-years': 'Năm học',
  students: 'Học sinh',
  subjects: 'Môn học',
  'teacher-assistants': 'Trợ giảng',
  teachers: 'Giáo viên',
  resources: 'Tài nguyên',
  users: 'Người dùng',
  'learning-programs': 'Chương trình học',
  countries: 'Quốc gia',
  'class-schedules': 'Lịch học',
};

export const ACTION_LABEL_VI: Record<string, string> = {
  read: 'Xem',
  create: 'Tạo mới',
  update: 'Cập nhật',
  delete: 'Xóa',

  upload: 'Tải lên',

  'read-recruitment': 'Xem tuyển dụng',
  'read-coordinator': 'Xem điều phối',
};
