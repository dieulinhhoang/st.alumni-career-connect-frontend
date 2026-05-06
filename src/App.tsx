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
          fontSizeLG: 17,
          fontSizeXL: 19,
          fontSizeHeading1: 34,
          fontSizeHeading2: 26,
          fontSizeHeading3: 21,
          fontSizeHeading4: 17,
          fontSizeHeading5: 15,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
