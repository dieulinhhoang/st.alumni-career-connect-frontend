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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            fontSize: 14,
            fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            colorPrimary: '#16a34a',
            borderRadius: 8,
          },
          components: {
            Menu: { itemHeight: 40, itemBorderRadius: 6 },
            Table: { fontSize: 14 },
            Button: { borderRadius: 8 },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);