import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ResponseRow } from '../../../../feature/reports/types';
import { SheetWrapper } from './SheetWrapper';

// Helpers
const boolCol = (title: string, dataIndex: string, width = 120): any => ({
  title,
  dataIndex,
  width,
  align: 'center' as const,
  render: (v: boolean) => (v ? 'X' : ''),
});

const columns: ColumnsType<ResponseRow> = [
  { title: 'STT', render: (_, __, i) => i + 1, width: 42, align: 'center', fixed: 'left' },
  { title: 'Mã SV',    dataIndex: 'studentCode', width: 80 },
  { title: 'Họ và tên', dataIndex: 'fullName',   width: 150 },
  { title: 'Ngày sinh', dataIndex: 'dob',        width: 90 },
  { title: 'Giới tính', dataIndex: 'gender',     width: 70,  render: (v: string) => (v === 'female' ? 'Nữ' : 'Nam') },
  { title: 'Số CCCD',   dataIndex: 'cccd',       width: 110 },
  { title: 'Mã ngành',  dataIndex: 'majorCode',  width: 80 },

  boolCol('Có VL - Đúng ngành',        'dungNganh',        110),
  boolCol('Có VL - Liên quan',         'lienQuan',         110),
  boolCol('Có VL - Không liên quan',   'khongLienQuan',    140),
  boolCol('Tiếp tục học',              'tiepTucHoc',       100),
  boolCol('Chưa có VL',                'chuaCoVl',          90),

  boolCol('Khu vực nhà nước',          'kvNhaNuoc',        120),
  boolCol('Khu vực tư nhân',           'kvTuNhan',         120),
  boolCol('Tự tạo việc làm',           'kvTuTao',          120),
  boolCol('Có yếu tố nước ngoài',      'kvYNuocNgoai',     150),

  { title: 'Nơi làm việc (Tỉnh/TP)',  dataIndex: 'workLocation', width: 140 },

  boolCol('Dưới 3 tháng',             'thoiGianDuoi3Thang',     100),
  boolCol('Từ 3–6 tháng',             'thoiGian3Den6Thang',     110),
  boolCol('Từ 6–12 tháng',            'thoiGian6Den12Thang',    120),
  boolCol('Từ 12 tháng trở lên',      'thoiGian12ThangTroLen',  150),

  boolCol('Học được đủ kỹ năng',      'hocDu',            140),
  boolCol('Chỉ học được một phần',    'hocMotPhan',        160),
  boolCol('Không học được',           'khôngHocDuoc',      120),

  { title: 'Lương khởi điểm (triệu)',    dataIndex: 'salary',    width: 140, align: 'right' },
  { title: 'Thu nhập bình quân (triệu)', dataIndex: 'avgIncome', width: 160, align: 'right' },
  { title: 'Hình thức tìm việc',         dataIndex: 'searchMethod',  width: 130 },
  { title: 'Hình thức tuyển dụng',       dataIndex: 'hiringMethod',  width: 140 },

  boolCol('KN giao tiếp',      'knGiaoTiep',   110),
  boolCol('KN thuyết trình',   'knThuyetTrinh',120),
  boolCol('KN làm việc nhóm',  'knLamViecNhom',130),
  boolCol('KN viết báo cáo',   'knVietBaoCao', 130),
  boolCol('KN lãnh đạo',       'knLanhDao',    110),
  boolCol('KN tiếng Anh',      'knTiengAnh',   110),
  boolCol('KN tin học',        'knTinHoc',     110),
  boolCol('KN hội nhập quốc tế','knHoiNhap',   150),
  boolCol('Kỹ năng khác',      'knKhac',       110),

  { title: 'Khóa học sau tốt nghiệp', dataIndex: 'postGradCourse', width: 160 },
  { title: 'Đề xuất/giải pháp',        dataIndex: 'giaiPhap',       width: 160 },
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
    <Table
      size="small"
      pagination={false}
      bordered
      className="rp-formal-table"
      scroll={{ x: 'max-content' }}
      columns={columns as any}
      dataSource={rows}
      rowKey="key"
    />
  </SheetWrapper>
);
