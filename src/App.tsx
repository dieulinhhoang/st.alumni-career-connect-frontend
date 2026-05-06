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
        components: {
          Table: {
            fontSize: 15,
            headerBg: '#fafafa',
          },
          Menu: {
            fontSize: 15,
            itemHeight: 42,
          },
          Pagination: {
            fontSize: 14,
          },
          Select: {
            fontSize: 15,
          },
          Input: {
            fontSize: 15,
          },
          Button: {
            fontSize: 15,
          },
          Modal: {
            fontSize: 15,
          },
          Drawer: {
            fontSize: 15,
          },
          Form: {
            fontSize: 15,
          },
          Tag: {
            fontSize: 13,
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
