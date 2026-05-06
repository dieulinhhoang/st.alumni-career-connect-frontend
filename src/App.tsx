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
          fontSize: 15,
          fontSizeSM: 13,
          fontSizeLG: 16,
          fontSizeXL: 18,
          fontSizeHeading1: 28,
          fontSizeHeading2: 22,
          fontSizeHeading3: 18,
          fontSizeHeading4: 16,
          fontSizeHeading5: 15,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
