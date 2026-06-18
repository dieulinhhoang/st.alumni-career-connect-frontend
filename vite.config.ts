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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-charts': ['recharts', '@ant-design/plots', '@antv/g2plot'],
          'vendor-editor': ['survey-core', 'survey-creator-core', 'survey-creator-react'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'vendor-misc': ['axios', 'dayjs', 'lodash', 'zustand', 'xlsx'],
        },
      },
    },
  },
})