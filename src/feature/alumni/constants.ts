import { toSlug } from "../../components/common/utils";

/**
 * constants.ts — Alumni feature
 *
 * LƯU Ý: KHOA_OPTIONS, NGANH_OPTIONS, getLopOptions đã được XÓA.
 * Thay vào đó, dùng hook `useFacultyFilter` từ ./hooks/useFacultyFilter
 * để lấy dữ liệu khoa/ngành/lớp từ API thật.
 *
 * Ví dụ:
 *   const { khoaOptions, nganhOptions, classOptions } = useFacultyFilter(selectedKhoa, selectedNganh);
 */

export const YEAR_OPTIONS = [2025, 2024, 2023];

export const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: '#fff',    bg: '#1D9E75', label: 'Hoạt động' },
  ended:  { color: '#595959', bg: '#f5f5f5', label: 'Kết thúc'  },
  draft:  { color: '#92400e', bg: '#fef9c3', label: 'Nháp'      },
};

export const getSurveyUrl = (batchId: number | string, batchTitle: string) =>
  `${window.location.origin}/survey/${batchId}/${toSlug(batchTitle)}`;