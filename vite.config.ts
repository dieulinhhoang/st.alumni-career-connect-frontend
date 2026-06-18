import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  envDir: './',
  server: {
    proxy: {},
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) return 'vendor-react';
            if (id.includes('/antd/') || id.includes('@ant-design/icons')) return 'vendor-antd';
            if (id.includes('@ant-design/plots') || id.includes('@antv/')) return 'vendor-charts';
            if (id.includes('/recharts/')) return 'vendor-charts';
            if (id.includes('@tanstack/')) return 'vendor-query';
            if (id.includes('/survey-core/') || id.includes('/survey-creator')) return 'vendor-editor';
            if (id.includes('/jspdf') || id.includes('/html2canvas')) return 'vendor-pdf';
            if (id.includes('/lodash') || id.includes('/zustand') || id.includes('/xlsx/')) return 'vendor-misc';
          }
        },
      },
    },
  },
})