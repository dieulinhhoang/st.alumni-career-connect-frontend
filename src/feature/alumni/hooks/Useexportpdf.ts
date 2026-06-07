import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_WIDTH_PX  = 794;
const A4_HEIGHT_PX = 1123;
const SCALE        = 2;

/** Fetch ảnh qua proxy blob để tránh CORS, trả về base64 data URL */
async function toBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Nếu CORS thật sự bị block → trả về URL gốc, html2canvas sẽ bỏ qua ảnh
    return url;
  }
}

/** Thay tất cả src ảnh trong el thành base64, trả về hàm restore */
async function inlineImages(el: HTMLElement): Promise<() => void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
  const originals = imgs.map(img => img.src);

  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src') ?? '';
      if (!src || src.startsWith('data:')) return; // đã là base64
      const b64 = await toBase64(src);
      img.src = b64;
    })
  );

  // Đợi ảnh re-render sau khi đổi src
  await Promise.all(
    imgs.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); })
    )
  );

  return () => { imgs.forEach((img, i) => { img.src = originals[i]; }); };
}

export function useExportPDF(filename = 'export.pdf') {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPDF = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    setExporting(true);
    let restore: (() => void) | undefined;
    try {
      // Inline tất cả ảnh thành base64 để html2canvas không bị CORS block
      restore = await inlineImages(el);

      const canvas = await html2canvas(el, {
        scale: SCALE,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        windowWidth: A4_WIDTH_PX,
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });

      const imgW   = A4_WIDTH_PX;
      const imgH   = Math.round(canvas.height / SCALE);
      const pdf    = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
      const pdfW   = pdf.internal.pageSize.getWidth();
      const pdfH   = pdf.internal.pageSize.getHeight();
      const ratio  = pdfW / imgW;

      const pageHeightPx = Math.round(pdfH / ratio);
      let yOffset = 0;

      while (yOffset < imgH) {
        if (yOffset > 0) pdf.addPage();
        const sliceH = Math.min(pageHeightPx, imgH - yOffset);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width  = canvas.width;
        pageCanvas.height = Math.round(sliceH * SCALE);
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(
          canvas,
          0, Math.round(yOffset * SCALE),
          canvas.width, Math.round(sliceH * SCALE),
          0, 0,
          canvas.width, Math.round(sliceH * SCALE)
        );

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, sliceH * ratio);
        yOffset += pageHeightPx;
      }

      pdf.save(filename);
    } finally {
      restore?.();
      setExporting(false);
    }
  }, [filename]);

  return { containerRef, exporting, exportPDF };
}