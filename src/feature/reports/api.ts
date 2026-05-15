import type {
  FilterState,
  CurrentUser,
  Stats,
  MajorSummaryRow,
  GraduateRow,
  ResponseRow,
  FacultySubmissionRow,
  ReportMeta,
} from './types';

export type ReportApiResponse = {
  currentUser: CurrentUser;
  stats: Stats;
  majorRows: MajorSummaryRow[];
  graduateRows: GraduateRow[];
  responseRows: ResponseRow[];
  facultyRows: FacultySubmissionRow[];
  reportMeta: ReportMeta;
};

export async function fetchReportData(
  filters: FilterState,
  userIndex: number
): Promise<ReportApiResponse> {
  const demoUsers: CurrentUser[] = [
    { id: 'u1', name: 'Super Admin', scope: 'school' },
    {
      id: 'u2',
      name: 'Cán bộ khoa CNTT',
      scope: 'faculty',
      facultyName: 'Khoa Công nghệ thông tin',
    },
    {
      id: 'u3',
      name: 'Cán bộ ngành KTPM',
      scope: 'major',
      facultyName: 'Khoa Công nghệ thông tin',
      majorName: 'Ngành Kỹ thuật phần mềm',
    },
  ];

  const currentUser = demoUsers[userIndex] ?? demoUsers[0];

  const stats: Stats = {
    totalGraduates: 1200,
    submitted: 980,
    submissionRate: 82,
    employed: 870,
    employmentRate: 73,
    relevantJobRate: 68,
    avgSalary: '12 triệu',
  };

  const majorRows: MajorSummaryRow[] = [
    {
      key: '1',
      majorCode: 'KTPM',
      majorName: 'Kỹ thuật phần mềm',
      total: 300,
      totalNu: 150,
      submitted: 260,
      submittedNu: 130,
      coViecLam: 240,
      tiepTucHoc: 5,
      chuaCoViecLam: 15,
      approved: 240,
      kvNhaNuoc: 50,
      kvTuNhan: 160,
      kvTuTao: 20,
      kvYNuocNgoai: 10,
      workLocation: 'Hà Nội',
    },
  ];

  const graduateRows: GraduateRow[] = [
    {
      key: 'g1',
      studentCode: 'HV2026001',
      fullName: 'Nguyễn Văn A',
      gender: 'male',
      certification: 'QP001',
      cccd: '012345678901',
      majorCode: 'KTPM',
      decision: 'QĐ 01',
      certDate: '01/07/2026',
      phone: '0912345678',
      email: '[email protected]',
      surveyMethod: 'online',
      status: 'submitted',
      note: '',
      majorName: 'Kỹ thuật phần mềm',
      cohort: 'CNTT',
    },
  ];

  const responseRows: ResponseRow[] = [
    {
      key: 'r1',
      studentCode: 'HV2026001',
      fullName: 'Nguyễn Văn A',
      dob: '01/01/2004',
      gender: 'male',
      cccd: '012345678901',
      majorCode: 'KTPM',
      dungNganh: true,
      lienQuan: false,
      khongLienQuan: false,
      tiepTucHoc: false,
      chuaCoVl: false,
      kvNhaNuoc: false,
      kvTuNhan: true,
      kvTuTao: false,
      kvYNuocNgoai: false,
      workLocation: 'Hà Nội',
      thoiGianDuoi3Thang: false,
      thoiGian3Den6Thang: true,
      thoiGian6Den12Thang: false,
      thoiGian12ThangTroLen: false,
      hocDu: true,
      hocMotPhan: false,
      khôngHocDuoc: false,
      salary: 12,
      avgIncome: 15,
      searchMethod: 'Qua mạng',
      hiringMethod: 'Phỏng vấn trực tiếp',
      knGiaoTiep: true,
      knThuyetTrinh: true,
      knLamViecNhom: true,
      knVietBaoCao: true,
      knLanhDao: false,
      knTiengAnh: true,
      knTinHoc: true,
      knHoiNhap: false,
      knKhac: false,
      postGradCourse: '',
      giaiPhap: '',
    },
  ];

  const facultyRows: FacultySubmissionRow[] = [
    {
      key: '1',
      facultyCode: 'CNTT',
      facultyName: 'Khoa Công nghệ thông tin',
      status: 'submitted',
      submittedBy: 'Nguyễn B',
      submittedAt: '10/02/2026',
      deadline: '15/02/2026',
      feedback: 'Cần bổ sung phần thống kê lương',
    },
  ];

  const reportMeta: ReportMeta = {
    mau01Title:
      'BÁO CÁO TÌNH HÌNH VIỆC LÀM CỦA SINH VIÊN TỐT NGHIỆP NĂM 2026',
    mau02Title: 'DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM 2026',
    mau03Title:
      'DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM 2026 PHẢN HỒI VỀ TÌNH HÌNH VIỆC LÀM',
    mau01Note:
      'Ghi chú: Ghi theo mã ngành tuyển sinh theo Thông tư số 24/2017/TT-BGDĐT. Khoa lấy thông tin mã ngành tại danh sách sinh viên tốt nghiệp.',
    mau02Note:
      'Ghi chú: Do Ban QLT, CTCTCTSV cung cấp. Khoa bổ sung thông tin CCCD đối với sinh viên chưa có CCCD. Trường hợp CCCD của sinh viên bị sai, Khoa chỉnh sửa thông tin vào cột ghi chú.',
    mau03Note:
      'Ghi chú: Ghi bằng số theo mã ngành tuyển sinh theo Thông tư số 24/2017/TT-BGDĐT. Không in thông tin email của sinh viên do Học viện cấp.',
  };

  await new Promise((r) => setTimeout(r, 300));

  return {
    currentUser,
    stats,
    majorRows,
    graduateRows,
    responseRows,
    facultyRows,
    reportMeta,
  };
}