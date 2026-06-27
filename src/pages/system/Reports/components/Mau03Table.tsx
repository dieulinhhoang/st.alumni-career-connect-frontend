import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { ResponseRow } from '../../../../feature/reports/types';
import { SheetWrapper } from './SheetWrapper';
import CustomTable from '../../../../components/common/customTable';

// Mẫu 3 = bảng TĨNH cột cố định theo ĐÚNG mẫu công văn (file bao-cao-tong-hop):
// header nhóm nhiều tầng, mỗi lựa chọn 1 cột đánh "X". Dữ liệu lấy từ responseRows.

const CENTER = 'center' as const;

function fmtDate(d?: string): string {
  if (!d) return '';
  const t = new Date(d);
  if (isNaN(t.getTime())) return d;
  return `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(2, '0')}/${t.getFullYear()}`;
}

/** Cột đánh "X" theo 1 trường boolean của responseRow */
const boolCol = (title: string, dataIndex: keyof ResponseRow, width = 90): any => ({
  title,
  width,
  align: CENTER,
  render: (_: any, r: ResponseRow) => (r[dataIndex] ? 'X' : ''),
});

/** Cột đánh "X" khi chuỗi trả lời (đa lựa chọn) có chứa nhãn tương ứng */
const inclCol = (title: string, dataIndex: keyof ResponseRow, match: string, width = 110): any => ({
  title,
  width,
  align: CENTER,
  render: (_: any, r: ResponseRow) =>
    String(r[dataIndex] ?? '').toLowerCase().includes(match.toLowerCase()) ? 'X' : '',
});

/** Cột đánh "X" cho khoảng thu nhập (avgIncome quy đổi: <5, 5–<10, 10–<15, ≥15) */
const incomeCol = (title: string, lo: number, hi: number | null, width = 130): any => ({
  title,
  width,
  align: CENTER,
  render: (_: any, r: ResponseRow) => {
    const v = r.avgIncome;
    if (!v || v <= 0) return '';
    return v >= lo && (hi === null || v < hi) ? 'X' : '';
  },
});

const columns: ColumnsType<ResponseRow> = [
  { title: 'TT', render: (_, __, i) => i + 1, width: 42, align: CENTER, fixed: 'left' },
  { title: 'Mã sinh viên',       dataIndex: 'studentCode', width: 100, fixed: 'left' },
  { title: 'Họ và tên',          dataIndex: 'fullName',    width: 150, fixed: 'left' },
  { title: 'Ngày sinh',          dataIndex: 'dob',         width: 95, align: CENTER, render: (v: string) => fmtDate(v) },
  { title: 'Giới tính',          dataIndex: 'gender',      width: 70, align: CENTER, render: (v: string) => (v === 'female' ? 'Nữ' : 'Nam') },
  { title: 'Số thẻ CCCD/CMTND',  dataIndex: 'cccd',        width: 120 },
  { title: 'Mã ngành đào tạo',   dataIndex: 'majorCode',   width: 110 },
  { title: 'Điện thoại',         dataIndex: 'phone',       width: 110 },
  { title: 'Email',              dataIndex: 'email',       width: 170 },

  {
    title: 'Tình hình việc làm',
    children: [
      {
        title: 'Có việc làm',
        children: [
          boolCol('Đúng ngành đào tạo', 'dungNganh', 110),
          boolCol('Liên quan đến ngành đào tạo', 'lienQuan', 120),
          boolCol('Không liên quan đến ngành đào tạo', 'khongLienQuan', 130),
        ],
      },
      boolCol('Tiếp tục học', 'tiepTucHoc', 90),
      boolCol('Chưa có việc làm', 'chuaCoVl', 95),
    ],
  },

  {
    title: 'Khu vực làm việc',
    children: [
      boolCol('Nhà nước', 'kvNhaNuoc', 80),
      boolCol('Tư nhân', 'kvTuNhan', 80),
      boolCol('Tự tạo việc làm', 'kvTuTao', 100),
      boolCol('Có yếu tố nước ngoài', 'kvYNuocNgoai', 120),
    ],
  },

  { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 140 },

  {
    title: 'Thời gian tìm được việc làm sau tốt nghiệp',
    children: [
      boolCol('Dưới 3 tháng', 'thoiGianDuoi3Thang', 90),
      boolCol('Từ 3 tháng đến dưới 6 tháng', 'thoiGian3Den6Thang', 120),
      boolCol('Từ 6 tháng đến dưới 12 tháng', 'thoiGian6Den12Thang', 120),
      boolCol('Từ 12 tháng trở lên', 'thoiGian12ThangTroLen', 110),
    ],
  },

  {
    title: 'Sinh viên có học được kiến thức, kỹ năng cần thiết từ nhà trường',
    children: [
      boolCol('Đã học được', 'hocDu', 100),
      boolCol('Chỉ học được một phần', 'hocMotPhan', 120),
      boolCol('Không học được', 'khôngHocDuoc', 110),
    ],
  },

  { title: 'Mức lương khởi điểm/1 tháng (triệu đồng)', dataIndex: 'salary', width: 130, align: 'right', render: (v: number) => (v > 0 ? v : '') },

  {
    title: 'Thu nhập bình quân/1 tháng',
    children: [
      incomeCol('Dưới 5 triệu', 0, 5),
      incomeCol('Từ 5 triệu đến dưới 10 triệu', 5, 10),
      incomeCol('Từ 10 triệu đến dưới 15 triệu', 10, 15),
      incomeCol('Từ 15 triệu trở lên', 15, null),
    ],
  },

  {
    title: 'Hình thức tìm việc làm',
    children: [
      inclCol('Do Học viện/khoa giới thiệu', 'searchMethod', 'học viện'),
      inclCol('Bạn bè, người quen giới thiệu', 'searchMethod', 'bạn bè'),
      inclCol('Tự tìm việc làm', 'searchMethod', 'tự tìm'),
      inclCol('Tự tạo việc làm', 'searchMethod', 'tự tạo'),
      inclCol('Hình thức khác', 'searchMethod', 'khác'),
    ],
  },

  {
    title: 'Hình thức tuyển dụng',
    children: [
      inclCol('Thi tuyển', 'hiringMethod', 'thi tuyển'),
      inclCol('Hợp đồng', 'hiringMethod', 'hợp đồng'),
      inclCol('Điều động', 'hiringMethod', 'điều động'),
      inclCol('Xét tuyển', 'hiringMethod', 'xét tuyển'),
      inclCol('Biệt phái', 'hiringMethod', 'biệt phái'),
      inclCol('Hình thức khác', 'hiringMethod', 'khác'),
    ],
  },

  {
    title: 'Kỹ năng mềm cần thiết cho công việc',
    children: [
      boolCol('Kỹ năng giao tiếp', 'knGiaoTiep', 100),
      boolCol('Kỹ năng thuyết trình', 'knThuyetTrinh', 110),
      boolCol('Kỹ năng làm việc nhóm', 'knLamViecNhom', 110),
      boolCol('Kỹ năng viết báo cáo tài liệu', 'knVietBaoCao', 130),
      boolCol('Kỹ năng lãnh đạo', 'knLanhDao', 100),
      boolCol('Kỹ năng Tiếng Anh', 'knTiengAnh', 100),
      boolCol('Kỹ năng Tin học', 'knTinHoc', 90),
      boolCol('Kỹ năng hội nhập quốc tế', 'knHoiNhap', 120),
      boolCol('Kỹ năng khác', 'knKhac', 100),
    ],
  },

  {
    title: 'Khóa học đã tham gia sau khi tốt nghiệp để đáp ứng yêu cầu công việc',
    children: [
      inclCol('Nâng cao kiến thức chuyên môn', 'postGradCourse', 'kiến thức chuyên môn', 130),
      inclCol('Nâng cao kỹ năng chuyên môn nghiệp vụ', 'postGradCourse', 'nghiệp vụ', 130),
      inclCol('Nâng cao kỹ năng về công nghệ thông tin', 'postGradCourse', 'công nghệ thông tin', 130),
      inclCol('Nâng cao kỹ năng ngoại ngữ', 'postGradCourse', 'ngoại ngữ', 120),
      inclCol('Phát triển kỹ năng quản lý', 'postGradCourse', 'quản lý', 110),
      inclCol('Tiếp tục học thạc sĩ, tiến sĩ', 'postGradCourse', 'thạc sĩ', 120),
    ],
  },

  {
    title: 'Giải pháp tăng tỷ lệ sinh viên có việc làm đúng ngành đào tạo',
    children: [
      inclCol('Học viện tổ chức các buổi trao đổi, chia sẻ kinh nghiệm tìm kiếm việc làm giữa cựu sinh viên với sinh viên', 'giaiPhap', 'cựu sinh viên', 160),
      inclCol('Học viện tổ chức các buổi trao đổi giữa đơn vị sử dụng lao động với sinh viên', 'giaiPhap', 'trao đổi giữa đơn vị', 160),
      inclCol('Đơn vị sử dụng lao động tham gia vào quá trình đào tạo', 'giaiPhap', 'tham gia vào quá trình', 150),
      inclCol('Chương trình đào tạo được điều chỉnh và cập nhật theo nhu cầu của thị trường lao động', 'giaiPhap', 'điều chỉnh', 160),
      inclCol('Tăng cường các hoạt động thực hành và chuyên môn tại cơ sở', 'giaiPhap', 'thực hành', 150),
      inclCol('Giải pháp khác', 'giaiPhap', 'giải pháp khác', 110),
    ],
  },
];

interface Props {
  rows: ResponseRow[];
  orgLine1: string;
  orgLine2: string;
  title: string;
  note?: string;
  signLabel: string;
}

export const Mau03Table: React.FC<Props> = ({ rows, orgLine1, orgLine2, title, note, signLabel }) => (
  <SheetWrapper orgLine1={orgLine1} orgLine2={orgLine2} title={title} signLabel={signLabel} note={note}>
    <CustomTable<ResponseRow>
      size="small"
      pagination={false}
      bordered
      striped={false}
      className="rp-formal-table"
      scroll={{ x: 'max-content' }}
      columns={columns as any}
      data={rows}
      rowKey="key"
    />
  </SheetWrapper>
);
