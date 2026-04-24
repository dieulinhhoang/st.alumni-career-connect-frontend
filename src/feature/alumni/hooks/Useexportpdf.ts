import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_WIDTH_PX  = 794;   // px tương đương A4 ở 96dpi
const A4_HEIGHT_PX = 1123;  // px tương đương A4 ở 96dpi
const SCALE        = 2;     // retina — càng cao càng nét, nhưng chậm hơn

export function useExportPDF(filename = 'export.pdf') {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPDF = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    setExporting(true);
    try {
      // Đợi tất cả ảnh (logo) load xong
      await Promise.all(
        Array.from(el.querySelectorAll<HTMLImageElement>('img')).map(
          img => img.complete
            ? Promise.resolve()
            : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); })
        )
      );

      const canvas = await html2canvas(el, {
        scale: SCALE,
        useCORS: true,          // cho phép load logo từ domain khác
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        windowWidth: A4_WIDTH_PX,
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });

      const imgW   = A4_WIDTH_PX;
      const imgH   = Math.round(canvas.height / SCALE); // chiều cao thực tế
      const pdf    = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
      const pdfW   = pdf.internal.pageSize.getWidth();
      const pdfH   = pdf.internal.pageSize.getHeight();
      const ratio  = pdfW / imgW;

      // Cắt canvas thành từng trang A4
      const pageHeightPx = Math.round(pdfH / ratio); // chiều cao 1 trang tính bằng px ảnh gốc
      let yOffset = 0;

      while (yOffset < imgH) {
        if (yOffset > 0) pdf.addPage();

        const sliceH = Math.min(pageHeightPx, imgH - yOffset);

        // Cắt slice từ canvas
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width  = canvas.width;
        pageCanvas.height = Math.round(sliceH * SCALE);
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(
          canvas,
          0, Math.round(yOffset * SCALE),          // source x,y
          canvas.width, Math.round(sliceH * SCALE), // source w,h
          0, 0,                                      // dest x,y
          canvas.width, Math.round(sliceH * SCALE)   // dest w,h
        );

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, sliceH * ratio);
        yOffset += pageHeightPx;
      }

      pdf.save(filename);
    } finally {
      setExporting(false);
    }
  }, [filename]);

  return { containerRef, exporting, exportPDF };
}