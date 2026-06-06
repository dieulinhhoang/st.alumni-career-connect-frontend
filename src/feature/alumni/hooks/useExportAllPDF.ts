/**
 * useExportAllPDF
 *
 * Nhận một danh sách { filename, el } (DOM node đã render sẵn),
 * render mỗi node thành PDF blob rồi đóng gói thành một file ZIP để tải xuống.
 *
 * Usage:
 *   const { exporting, progress, exportAll } = useExportAllPDF();
 *   await exportAll(items, 'phanhoi_dot1.zip');
 */
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

const A4_WIDTH_PX = 794;
const SCALE = 2;

/** Chụp một DOM element → Blob PDF (nhiều trang A4) */
export async function domToPdfBlob(el: HTMLElement): Promise<Blob> {
  // Đợi tất cả ảnh bên trong load xong
  await Promise.all(
    Array.from(el.querySelectorAll<HTMLImageElement>('img')).map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>(res => {
            img.onload  = () => res();
            img.onerror = () => res();
          })
    )
  );

  const canvas = await html2canvas(el, {
    scale:           SCALE,
    useCORS:         true,
    allowTaint:      false,
    backgroundColor: '#ffffff',
    width:           A4_WIDTH_PX,
    windowWidth:     A4_WIDTH_PX,
    scrollX:         0,
    scrollY:         0,
    logging:         false,
  });

  const imgH     = Math.round(canvas.height / SCALE);
  const pdf      = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
  const pdfW     = pdf.internal.pageSize.getWidth();
  const pdfH     = pdf.internal.pageSize.getHeight();
  const ratio    = pdfW / A4_WIDTH_PX;
  const pageH_px = Math.round(pdfH / ratio);
  let   yOffset  = 0;

  while (yOffset < imgH) {
    if (yOffset > 0) pdf.addPage();

    const sliceH     = Math.min(pageH_px, imgH - yOffset);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width  = canvas.width;
    pageCanvas.height = Math.round(sliceH * SCALE);
    const ctx = pageCanvas.getContext('2d')!;
    ctx.drawImage(
      canvas,
      0, Math.round(yOffset * SCALE), canvas.width, Math.round(sliceH * SCALE),
      0, 0,                           canvas.width, Math.round(sliceH * SCALE),
    );
    pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pdfW, sliceH * ratio);
    yOffset += pageH_px;
  }

  return pdf.output('blob');
}

// ─── Public types ──────────────────────────────────────────────────────────────

export interface ExportItem {
  /** Tên file bên trong ZIP, VD: "phanhoi_SV001_Nguyen_Van_A.pdf" */
  filename: string;
  /** DOM node đã được render sẵn nội dung cần xuất */
  el: HTMLElement;
}

export interface UseExportAllPDFResult {
  exporting: boolean;
  /** 0–100, tiến độ xuất từng PDF */
  progress: number;
  exportAll: (items: ExportItem[], zipName?: string) => Promise<void>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useExportAllPDF(): UseExportAllPDFResult {
  const [exporting, setExporting] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const exportAll = useCallback(async (items: ExportItem[], zipName = 'phan-hoi.zip') => {
    if (!items.length) return;
    setExporting(true);
    setProgress(0);

    const zip = new JSZip();

    for (let i = 0; i < items.length; i++) {
      const { filename, el } = items[i];
      try {
        const blob = await domToPdfBlob(el);
        zip.file(filename, blob);
      } catch (err) {
        console.error(`[useExportAllPDF] Lỗi export ${filename}:`, err);
        // Bỏ qua file lỗi, tiếp tục các file còn lại
      }
      setProgress(Math.round(((i + 1) / items.length) * 100));
    }

    const zipBlob = await zip.generateAsync({
      type:               'blob',
      compression:        'DEFLATE',
      compressionOptions: { level: 6 },
    });

    // Trigger download
    const url  = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExporting(false);
    setProgress(0);
  }, []);

  return { exporting, progress, exportAll };
}