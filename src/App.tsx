
import './App.css'
import routes from './routes/AppRouter';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router=createBrowserRouter(routes) // tao router tu danh sach cac route v6.4 

function App() {
 
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
