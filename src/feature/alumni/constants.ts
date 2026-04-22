export const GRADUATION_OPTIONS = [
  'DSSVTN ngành MMT&TTDL và KHDL&TTNT KSVL cho kiểm định 2026',
];

export const YEAR_OPTIONS = [2025, 2024, 2023];

export const KHOA_OPTIONS = [
  { value: 'cntt', label: 'Công nghệ thông tin' },
  { value: 'ktdt', label: 'Kỹ thuật điện tử' },
  { value: 'qtkd', label: 'Quản trị kinh doanh' },
  { value: 'ke',   label: 'Kế toán' },
];

export const NGANH_OPTIONS: Record<string, { value: string; label: string }[]> = {
  cntt: [
    { value: 'mmt',  label: 'Mạng máy tính & TT DL' },
    { value: 'khdl', label: 'Khoa học dữ liệu & TTNT' },
    { value: 'cnpm', label: 'Công nghệ phần mềm' },
  ],
  ktdt: [
    { value: 'dtvt', label: 'Điện tử viễn thông' },
    { value: 'dtth', label: 'Điện tử tự động hóa' },
  ],
  qtkd: [
    { value: 'qtdn', label: 'Quản trị doanh nghiệp' },
    { value: 'mk',   label: 'Marketing' },
  ],
  ke: [
    { value: 'ktoan', label: 'Kế toán doanh nghiệp' },
    { value: 'ktkt',  label: 'Kiểm toán' },
  ],
};

export const getLopOptions = (nganh: string | undefined) =>
  nganh
    ? ['A', 'B', 'C', 'D'].map(s => ({
        value: `${nganh.toUpperCase()}${s}`,
        label: `Lớp ${nganh.toUpperCase()}${s}`,
      }))
    : [];

export const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: '#fff',    bg: '#1D9E75', label: 'Hoạt động' },
  ended:  { color: '#595959', bg: '#f5f5f5', label: 'Kết thúc'  },
  draft:  { color: '#92400e', bg: '#fef9c3', label: 'Nháp'      },
};

export const getSurveyUrl = (batchId: number | string) =>
  `${window.location.origin}/survey/${batchId}`;