/**
 * exportBatchExcel — xuất danh sách phản hồi của một đợt khảo sát ra file .xlsx
 * có định dạng: tiêu đề, header màu thương hiệu, viền, freeze header, auto-filter,
 * zebra rows và ô trạng thái tô màu.
 *
 * Dùng ExcelJS (styling đầy đủ) thay cho SheetJS bản community (không style được).
 */
import { saveAs } from 'file-saver';
// exceljs nặng (~950kB) → dynamic import trong hàm để không phình chunk trang

export interface ExportBatchExcelParams {
  batchTitle: string;
  graduationPeriod?: string;
  /** Chuỗi mô tả tiến độ, VD "1 / 13 (8%)" */
  progressText?: string;
  startDate?: string;
  endDate?: string;
  /** Tiêu đề các câu hỏi trong form snapshot */
  questionTitles: string[];
  /** Mỗi phần tử là 1 dòng dữ liệu, thứ tự cột khớp COLUMN_HEADERS + questionTitles */
  rows: (string | number)[][];
}

// Cột cố định trước phần câu hỏi động
const FIXED_HEADERS = ['STT', 'Mã SV', 'Họ và tên', 'Khoa', 'Ngành', 'Trạng thái', 'Ngày phản hồi'];
const STATUS_COL = 6; // 1-based: cột "Trạng thái"

const BRAND = 'FF1677FF';
const HEADER_TEXT = 'FFFFFFFF';
const ZEBRA = 'FFF5F8FF';
const BORDER = 'FFD9E1EC';
const GREEN_BG = 'FFE6F4EA';
const GREEN_TX = 'FF1D9E75';
const GRAY_BG = 'FFF1F3F5';
const GRAY_TX = 'FF868E96';

const thin = { style: 'thin' as const, color: { argb: BORDER } };
const allBorders = { top: thin, left: thin, bottom: thin, right: thin };

export async function exportBatchExcel(params: ExportBatchExcelParams): Promise<void> {
  const { batchTitle, graduationPeriod, progressText, startDate, endDate, questionTitles, rows } = params;
  const ExcelJS = (await import('exceljs')).default;

  const headers = [...FIXED_HEADERS, ...questionTitles];
  const lastColLetter = colLetter(headers.length);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Alumni Career Connect';
  wb.created = new Date();
  const ws = wb.addWorksheet('Danh sách SV', {
    views: [{ state: 'frozen', ySplit: 4 }], // freeze tới hết hàng header (hàng 4)
  });

  // ── Hàng 1: tiêu đề chính ──
  ws.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = ws.getCell('A1');
  titleCell.value = batchTitle || 'Danh sách phản hồi khảo sát';
  titleCell.font = { bold: true, size: 16, color: { argb: BRAND } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  ws.getRow(1).height = 26;

  // ── Hàng 2: thông tin đợt ──
  ws.mergeCells(`A2:${lastColLetter}2`);
  const metaParts = [
    graduationPeriod && `Đợt tốt nghiệp: ${graduationPeriod}`,
    progressText && `Tiến độ phản hồi: ${progressText}`,
    startDate && endDate && `Thời gian: ${startDate} → ${endDate}`,
  ].filter(Boolean);
  const metaCell = ws.getCell('A2');
  metaCell.value = metaParts.join('     |     ');
  metaCell.font = { size: 11, color: { argb: 'FF64748B' }, italic: true };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left' };
  ws.getRow(2).height = 18;

  // Hàng 3 để trống làm khoảng cách
  ws.getRow(3).height = 6;

  // ── Hàng 4: header ──
  const headerRow = ws.getRow(4);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: HEADER_TEXT }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = allBorders;
  });
  headerRow.height = 30;

  // ── Dữ liệu ──
  rows.forEach((r, ri) => {
    const excelRow = ws.getRow(5 + ri);
    const zebra = ri % 2 === 1;
    headers.forEach((_, ci) => {
      const cell = excelRow.getCell(ci + 1);
      cell.value = r[ci] ?? '';
      cell.border = allBorders;
      cell.alignment = {
        vertical: 'middle',
        horizontal: ci === 0 || ci === STATUS_COL - 1 ? 'center' : 'left',
        wrapText: ci >= FIXED_HEADERS.length, // câu trả lời dài thì wrap
      };
      cell.font = { size: 10.5, color: { argb: 'FF1F2937' } };
      if (zebra) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ZEBRA } };
    });

    // Tô màu ô Trạng thái
    const statusCell = excelRow.getCell(STATUS_COL);
    const isSubmitted = String(r[STATUS_COL - 1]).includes('Đã');
    statusCell.fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: isSubmitted ? GREEN_BG : GRAY_BG },
    };
    statusCell.font = { size: 10.5, bold: true, color: { argb: isSubmitted ? GREEN_TX : GRAY_TX } };
  });

  // ── Auto-filter trên hàng header ──
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: headers.length } };

  // ── Độ rộng cột ──
  ws.columns.forEach((col, i) => {
    if (i === 0) col.width = 6;            // STT
    else if (i === 1) col.width = 14;      // Mã SV
    else if (i === 2) col.width = 22;      // Họ tên
    else if (i <= 4) col.width = 20;       // Khoa / Ngành
    else if (i === 5) col.width = 14;      // Trạng thái
    else if (i === 6) col.width = 18;      // Ngày phản hồi
    else col.width = 26;                    // câu hỏi
  });

  const safeName = (batchTitle || 'danh-sach-sv')
    .replace(/[^\wÀ-ɏḀ-ỿ ]/g, '').trim().replace(/\s+/g, '_') || 'danh-sach-sv';
  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${safeName}.xlsx`);
}

/** Số cột (1-based) → chữ cái cột Excel (1→A, 27→AA) */
function colLetter(n: number): string {
  let s = '';
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
