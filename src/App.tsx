import './App.css'
import routes from './routes/AppRouter';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

const router = createBrowserRouter(routes);

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          fontSize: 16,
          fontSizeSM: 14,
          fontSizeLG: 18,
          fontSizeXL: 20,
          fontSizeHeading1: 36,
          fontSizeHeading2: 28,
          fontSizeHeading3: 22,
          fontSizeHeading4: 18,
          fontSizeHeading5: 16,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
