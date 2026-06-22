import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  envDir: './',
  server: {
    proxy: {},
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) return 'vendor-react';
            if (id.includes('/antd/') || id.includes('@ant-design/icons')) return 'vendor-antd';
            if (id.includes('@ant-design/plots') || id.includes('@antv/')) return 'vendor-charts';
            if (id.includes('/recharts/')) return 'vendor-charts';
            if (id.includes('@tanstack/')) return 'vendor-query';
            if (id.includes('/survey-core/') || id.includes('/survey-creator')) return 'vendor-survey';
            if (id.includes('/pdfjs-dist/')) return 'vendor-pdfjs';
            if (id.includes('/mammoth/')) return 'vendor-mammoth';
            if (id.includes('@tinymce/')) return 'vendor-tinymce';
            if (id.includes('/jspdf') || id.includes('/html2canvas')) return 'vendor-pdf';
            if (id.includes('/dayjs/')) return 'vendor-dayjs';
            if (id.includes('@geoapify/')) return 'vendor-geo';
            if (id.includes('/lodash') || id.includes('/zustand') || id.includes('/xlsx/')) return 'vendor-misc';
          }
        },
      },
    },
  },
})