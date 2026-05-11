import React, { useState, useEffect } from 'react';
import './report-page.css';

export interface MajorReportRow {
  index: number;
  major_code: string;
  major_name: string;
  total_student: number;
  total_nu: number;
  total_res: number;
  total_res_nu: number;
  dung_nganh: number;
  lien_quan: number;
  khong_lien_quan: number;
  tiep_tuc_hoc: number;
  chua_co_viec: number;
  nha_nuoc: number;
  tu_nhan: number;
  tu_tao: number;
  ty_le_co_viec_phan_hoi: number;
  ty_le_co_viec_tot_nghiep: number;
  noi_lam_viec: string;
}

export interface ReportSummary {
  total_student: number;
  total_nu: number;
  total_res: number;
  total_res_nu: number;
  dung_nganh: number;
  lien_quan: number;
  khong_lien_quan: number;
  tiep_tuc_hoc: number;
}

export interface GraduateRow {
  stt: number;
  code: string;
  full_name: string;
  gender: string;
  identification_card_number: string;
  industry_code: string;
  certification: string;
  certification_date: string;
  phone: string;
  email: string;
  survey_method: string;
  has_response: boolean;
  note: string;
  major_name: string;
  faculty_name: string;
}

export interface ResponseRow {
  stt: number;
  code_student: string;
  full_name: string;
  dob: string;
  gender: string;
  identification_card_number: string;
  training_industry_code: string;
  phone_number: string;
  email: string;
  trained_field: 1 | 2 | 3;
  employment_status: 1 | 2 | 3;
  work_area: 1 | 2 | 3 | 4;
  city: string;
  employed_since: 1 | 2 | 3 | 4;
  level_knowledge_acquired: 1 | 2 | 3 | 4;
  starting_salary: number;
  average_income: 1 | 2 | 3 | 4;
  job_search_method: string[];
  recruitment_form: string[];
  soft_skills: string[];
  post_grad_courses: string;
  suggestions: string;
}

export interface ReportData {
  survey_id: number;
  mau_01: { majors: MajorReportRow[]; tong_hop: ReportSummary };
  mau_02: { students: GraduateRow[] };
  mau_03: { responses: ResponseRow[] };
}

// ==================== HELPERS ====================
const fmtDate = (d: string) => (!d ? '-' : new Date(d).toLocaleDateString('vi-VN'));
const genderLabel = (g: string) => (g === 'male' ? 'Nam' : 'Nu');
const employLabel = (s: number) => (['', 'Co viec', 'Tiep tuc hoc', 'Chua co viec'][s] ?? '-');
const areaLabel = (a: number) => (['', 'Nha nuoc', 'Tu nhan', 'Tu tao', 'Nuoc ngoai'][a] ?? '-');
const fieldLabel = (f: number) => (['', 'Dung nganh', 'Lien quan', 'Khong lien quan'][f] ?? '-');
const incomeLabel = (i: number) => (['', '<5tr', '5-10tr', '10-15tr', '>=15tr'][i] ?? '-');
const sinceLabel = (s: number) => (['', '<3 thang', '3-6 thang', '6-12 thang', '>=12 thang'][s] ?? '-');
const knowledgeLabel = (k: number) => (['', 'Rat tot', 'Tot', 'Trung binh', 'Yeu'][k] ?? '-');

// ==================== TABLE 1 ====================
const Table1: React.FC<{ majors: MajorReportRow[]; tongHop?: ReportSummary }> = ({ majors, tongHop }) => (
  <div className="rp-table-wrap">
    <table className="rp-table">
      <thead>
        <tr>
          <th rowSpan={3}>STT</th>
          <th rowSpan={3}>Ma nganh</th>
          <th rowSpan={3}>Ten nganh</th>
          <th colSpan={4}>So luong tot nghiep</th>
          <th colSpan={6}>Tinh trang viec lam</th>
          <th colSpan={3}>Loai hinh cong viec</th>
          <th colSpan={2}>Ti le co viec</th>
          <th rowSpan={3}>Noi lam viec</th>
        </tr>
        <tr>
          <th rowSpan={2}>Tong SV TN</th>
          <th rowSpan={2}>Nu</th>
          <th rowSpan={2}>SV phan hoi</th>
          <th rowSpan={2}>Nu</th>
          <th rowSpan={2}>Dung nganh</th>
          <th rowSpan={2}>Lien quan</th>
          <th rowSpan={2}>Khong LQ</th>
          <th rowSpan={2}>Tiep tuc hoc</th>
          <th rowSpan={2}>Chua co viec</th>
          <th rowSpan={2}>Tong co viec</th>
          <th rowSpan={2}>Nha nuoc</th>
          <th rowSpan={2}>Tu nhan</th>
          <th rowSpan={2}>Tu tao</th>
          <th rowSpan={2}>% theo PH</th>
          <th rowSpan={2}>% theo TN</th>
        </tr>
        <tr></tr>
      </thead>
      <tbody>
        {majors.map((row) => (
          <tr key={row.index}>
            <td>{row.index}</td>
            <td>{row.major_code}</td>
            <td>{row.major_name}</td>
            <td>{row.total_student}</td>
            <td>{row.total_nu}</td>
            <td>{row.total_res}</td>
            <td>{row.total_res_nu}</td>
            <td>{row.dung_nganh}</td>
            <td>{row.lien_quan}</td>
            <td>{row.khong_lien_quan}</td>
            <td>{row.tiep_tuc_hoc}</td>
            <td>{row.chua_co_viec}</td>
            <td>{row.dung_nganh + row.lien_quan + row.khong_lien_quan}</td>
            <td>{row.nha_nuoc}</td>
            <td>{row.tu_nhan}</td>
            <td>{row.tu_tao}</td>
            <td>{row.ty_le_co_viec_phan_hoi?.toFixed(1)}%</td>
            <td>{row.ty_le_co_viec_tot_nghiep?.toFixed(1)}%</td>
            <td>{row.noi_lam_viec}</td>
          </tr>
        ))}
        {tongHop && (
          <tr className="rp-row-total">
            <td colSpan={3}><strong>Tong hop</strong></td>
            <td>{tongHop.total_student}</td>
            <td>{tongHop.total_nu}</td>
            <td>{tongHop.total_res}</td>
            <td>{tongHop.total_res_nu}</td>
            <td>{tongHop.dung_nganh}</td>
            <td>{tongHop.lien_quan}</td>
            <td>{tongHop.khong_lien_quan}</td>
            <td>{tongHop.tiep_tuc_hoc}</td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// ==================== TABLE 2 ====================
const Table2: React.FC<{ students: GraduateRow[] }> = ({ students }) => (
  <div className="rp-table-wrap">
    <table className="rp-table">
      <thead>
        <tr>
          <th>STT</th><th>Ma SV</th><th>Ho va ten</th><th>Gioi tinh</th>
          <th>CCCD</th><th>Ma nganh</th><th>So QD</th><th>Ngay cap QD</th>
          <th>SDT</th><th>Email</th><th>Hinh thuc KS</th><th>Phan hoi</th><th>Ghi chu</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.stt}>
            <td>{s.stt}</td>
            <td>{s.code}</td>
            <td>{s.full_name}</td>
            <td>{genderLabel(s.gender)}</td>
            <td>{s.identification_card_number}</td>
            <td>{s.industry_code}</td>
            <td>{s.certification}</td>
            <td>{fmtDate(s.certification_date)}</td>
            <td>{s.phone}</td>
            <td>{s.email}</td>
            <td>{s.survey_method}</td>
            <td className={s.has_response ? 'rp-yes' : 'rp-no'}>{s.has_response ? 'Co' : 'Chua'}</td>
            <td>{s.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==================== TABLE 3 ====================
const Table3: React.FC<{ responses: ResponseRow[] }> = ({ responses }) => (
  <div className="rp-table-wrap">
    <table className="rp-table">
      <thead>
        <tr>
          <th>STT</th><th>Ma SV</th><th>Ho va ten</th><th>Ngay sinh</th><th>Gioi tinh</th>
          <th>CCCD</th><th>Ma nganh</th><th>SDT</th><th>Email</th>
          <th>Linh vuc</th><th>Tinh trang</th><th>Loai hinh</th><th>Noi LV</th>
          <th>TG co viec</th><th>Kien thuc</th><th>Luong KD</th><th>Thu nhap TB</th>
        </tr>
      </thead>
      <tbody>
        {responses.map((r) => (
          <tr key={r.stt}>
            <td>{r.stt}</td>
            <td>{r.code_student}</td>
            <td>{r.full_name}</td>
            <td>{fmtDate(r.dob)}</td>
            <td>{r.gender}</td>
            <td>{r.identification_card_number}</td>
            <td>{r.training_industry_code}</td>
            <td>{r.phone_number}</td>
            <td>{r.email}</td>
            <td>{fieldLabel(r.trained_field)}</td>
            <td>{employLabel(r.employment_status)}</td>
            <td>{areaLabel(r.work_area)}</td>
            <td>{r.city}</td>
            <td>{sinceLabel(r.employed_since)}</td>
            <td>{knowledgeLabel(r.level_knowledge_acquired)}</td>
            <td>{r.starting_salary}</td>
            <td>{incomeLabel(r.average_income)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==================== KPI CARDS ====================
const KpiCards: React.FC<{ data: ReportData }> = ({ data }) => {
  const s = data.mau_01.tong_hop;
  const coViec = s.dung_nganh + s.lien_quan + s.khong_lien_quan;
  const cards = [
    { label: 'Tong SV tot nghiep', value: s.total_student, color: '#6366f1' },
    { label: 'Da phan hoi', value: s.total_res, color: '#0ea5e9' },
    { label: 'Co viec lam', value: coViec, color: '#10b981' },
    { label: 'Dung nganh', value: s.dung_nganh, color: '#14b8a6' },
    { label: 'Tiep tuc hoc', value: s.tiep_tuc_hoc, color: '#f59e0b' },
    { label: 'Chua co viec', value: s.total_res - coViec - s.tiep_tuc_hoc, color: '#ef4444' },
  ];
  return (
    <div className="rp-kpi-grid">
      {cards.map((c) => (
        <div key={c.label} className="rp-kpi-card" style={{ borderTop: `4px solid ${c.color}` }}>
          <div className="rp-kpi-value" style={{ color: c.color }}>{c.value}</div>
          <div className="rp-kpi-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
};

// ==================== MOCK DATA ====================
const MOCK: ReportData = {
  survey_id: 1,
  mau_01: {
    majors: [
      {
        index: 1, major_code: '7480201', major_name: 'Cong nghe thong tin',
        total_student: 120, total_nu: 45, total_res: 98, total_res_nu: 30,
        dung_nganh: 60, lien_quan: 20, khong_lien_quan: 10, tiep_tuc_hoc: 5, chua_co_viec: 3,
        nha_nuoc: 15, tu_nhan: 55, tu_tao: 10,
        ty_le_co_viec_phan_hoi: 91.8, ty_le_co_viec_tot_nghiep: 75.0, noi_lam_viec: 'Ha Noi',
      },
      {
        index: 2, major_code: '7340301', major_name: 'Ke toan',
        total_student: 80, total_nu: 60, total_res: 65, total_res_nu: 48,
        dung_nganh: 35, lien_quan: 12, khong_lien_quan: 8, tiep_tuc_hoc: 6, chua_co_viec: 4,
        nha_nuoc: 10, tu_nhan: 40, tu_tao: 5,
        ty_le_co_viec_phan_hoi: 84.6, ty_le_co_viec_tot_nghiep: 68.8, noi_lam_viec: 'Ha Noi, HCM',
      },
    ],
    tong_hop: {
      total_student: 200, total_nu: 105, total_res: 163, total_res_nu: 78,
      dung_nganh: 95, lien_quan: 32, khong_lien_quan: 18, tiep_tuc_hoc: 11,
    },
  },
  mau_02: {
    students: [
      {
        stt: 1, code: 'SV001', full_name: 'Nguyen Van A', gender: 'male',
        identification_card_number: '001234567890', industry_code: '7480201',
        certification: 'QD123/2024', certification_date: '2024-06-30',
        phone: '0912345678', email: 'a@example.com', survey_method: 'Online',
        has_response: true, note: '', major_name: 'CNTT', faculty_name: 'Khoa CNTT',
      },
    ],
  },
  mau_03: {
    responses: [
      {
        stt: 1, code_student: 'SV001', full_name: 'Nguyen Van A',
        dob: '2002-01-15', gender: 'Nam', identification_card_number: '001234567890',
        training_industry_code: '7480201', phone_number: '0912345678', email: 'a@example.com',
        trained_field: 1, employment_status: 1, work_area: 2, city: 'Ha Noi',
        employed_since: 1, level_knowledge_acquired: 2, starting_salary: 8.5, average_income: 3,
        job_search_method: ['Internet'], recruitment_form: ['Chinh quy'],
        soft_skills: ['Giao tiep'], post_grad_courses: '', suggestions: '',
      },
    ],
  },
};

// ==================== SURVEYS ====================
const SURVEYS = [
  { id: 1, name: 'Dot khao sat 2024' },
  { id: 2, name: 'Dot khao sat 2025' },
];

const TABS = [
  'Mau 1 - Tong hop theo nganh',
  'Mau 2 - Danh sach SV tot nghiep',
  'Mau 3 - Chi tiet phan hoi',
];

// ==================== MAIN PAGE ====================
const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [surveyId, setSurveyId] = useState(1);
  const [data, setData] = useState<ReportData>(MOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reports?survey_id=${surveyId}`);
        if (!res.ok) throw new Error('Loi tai du lieu');
        const json: ReportData = await res.json();
        setData(json);
      } catch {
        setData(MOCK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surveyId]);

  return (
    <div className="rp-root">
      <div className="rp-header">
        <div className="rp-header-left">
          <h1 className="rp-title">Bao cao Viec lam Sinh vien Tot nghiep</h1>
          <p className="rp-subtitle">Theo Thong tu 24/2017/TT-BGDDT</p>
        </div>
        <div className="rp-header-right">
          <select
            className="rp-select"
            value={surveyId}
            onChange={(e) => setSurveyId(Number(e.target.value))}
          >
            {SURVEYS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button className="rp-btn-print" onClick={() => window.print()}>
            In bao cao
          </button>
        </div>
      </div>

      {loading && <div className="rp-loading">Dang tai du lieu...</div>}
      {error && <div className="rp-error">{error}</div>}

      {!loading && (
        <>
          <KpiCards data={data} />
          <div className="rp-tabs">
            {TABS.map((t, i) => (
              <button
                key={i}
                className={`rp-tab${activeTab === i ? ' rp-tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="rp-tab-content">
            {activeTab === 0 && (
              <Table1 majors={data.mau_01.majors} tongHop={data.mau_01.tong_hop} />
            )}
            {activeTab === 1 && <Table2 students={data.mau_02.students} />}
            {activeTab === 2 && <Table3 responses={data.mau_03.responses} />}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;
