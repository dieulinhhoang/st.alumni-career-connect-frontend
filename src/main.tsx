import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import App from './App';
import './index.css';

dayjs.locale('vi');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 phút — không refetch nếu data còn fresh
      gcTime: 1000 * 60 * 10,        // 10 phút — giữ cache sau khi unmount
      retry: 1,
      refetchOnWindowFocus: false,   // không refetch mỗi lần focus tab
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            fontSize: 15,
            fontSizeSM: 14,
            fontSizeLG: 17,
            fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            colorPrimary: '#16a34a',
            borderRadius: 8,
          },
          components: {
            Menu: { itemHeight: 46, itemBorderRadius: 6, fontSize: 15 },
            Table: { fontSize: 14 },
            Button: { borderRadius: 8, fontSize: 14 },
            Input: { fontSize: 14 },
            Select: { fontSize: 14 },
            Form: { labelFontSize: 14 },
            Modal: { titleFontSize: 18 },
            Card: { headerFontSize: 16 },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);