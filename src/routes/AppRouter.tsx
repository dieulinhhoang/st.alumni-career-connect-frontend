import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Enterprise from '../pages/admin/Enterprise/index';
import EnterpriseDetail from '../pages/admin/EnterpriseDetail/index';
import Faculties from '../pages/admin/Faculty';
import MajorDetail from '../pages/admin/Faculty/MajorDetail';
import FacultyDetail from '../pages/admin/Faculty/FacultyDetail';
import GraduationStudents from '../pages/admin/Graduation/GraduationStudents';
import GraduationList from '../pages/admin/Graduation/index';
import StudentDetail from '../pages/admin/Graduation/Studentdetail';
import UserManagement from '../pages/admin/User/UserManagement';
import RoleManagement from '../pages/admin/Role/RoleManagement';
import ResourceManagement from '../pages/admin/Resources/ResourceManagement';
import { ResponseDetail } from '../pages/admin/Alumni/ResponseDetail';
import { BatchResults } from '../pages/admin/Alumni/BatchResults';
import { BatchCreate } from '../pages/admin/Alumni/BatchCreate';
import { BatchList } from '../pages/admin/Alumni/BatchList';
import FormStatisticsDetailPage from '../pages/admin/Statistics/FormStatisticsDetail';
import AdminProfile from '../pages/admin/AdminProfile/AdminProfile';
import ReportsPage from '../pages/admin/Reports/ReportsPage';
import SurveyFillPage from '../pages/client/Survey/SurveyFillPage';
import { DoneScreen } from '../pages/client/Survey/DoneScreen';
import StatIndicatorConfig from '../pages/admin/Statistics/StatIndicatorConfig';
import AuthCallback from '../pages/admin/Auth/AuthCallback';
import FacultyReportPage from '../pages/admin/Reports/components/FacultyReportPage';

const DashBoard = lazy(() => import('../pages/admin/DashBoard/index'));
const Loader = lazy(() => import('../components/common/loader'));
const BatchFormEditor = lazy(() => import('../pages/admin/Alumni/BatchFormEditor'));

// Form pages — mỗi view 1 route riêng
const FormListPage    = lazy(() => import('../pages/admin/Form/pages/FormListPage'));
const FormBuilderPage = lazy(() => import('../pages/admin/Form/pages/FormBuilderPage'));
const FormPreviewPage = lazy(() => import('../pages/admin/Form/pages/FormPreviewPage'));
const FormAIPage      = lazy(() => import('../pages/admin/Form/pages/FormAIPage'));

//  Guards
const isLoggedIn = () => !!localStorage.getItem('accessToken');

// Khi chưa đăng nhập → redirect sang SSO của BE thay vì loop lại dashboard
const SsoRedirect = () => {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!redirecting) {
      setRedirecting(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/sso/redirect`;
    }
  }, [redirecting]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {/* <span>Đang chuyển hướng đến trang đăng nhập...</span> */}
      <Loader />
    </div>
  );
};

const ProtectedRoute = () =>
  isLoggedIn() ? <Outlet /> : <SsoRedirect />;

//  Routes
const routes = [
  {
    path: '/',
    children: [

      // PUBLIC
      {
        path: '',
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: '/auth/callback',
        element: <Suspense fallback={<Loader />}><AuthCallback /></Suspense>
      },
      {
        path: '/survey/:id/:slug',
        element: <Suspense fallback={<Loader />}><SurveyFillPage /></Suspense>
      },
      {
        path: '/survey/:id/done',
        element: <Suspense fallback={<Loader />}><DoneScreen /></Suspense>
      },

      // PROTECTED
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/admin/dashboard',
            element: <Suspense fallback={<Loader />}><DashBoard /></Suspense>
          },

          // Statistics
          {
            path: '/admin/statistics',
            element: <Suspense fallback={<Loader />}><FormStatisticsDetailPage /></Suspense>
          },
          {
            path: '/admin/statistics/indicators',
            element: <Suspense fallback={<Loader />}><StatIndicatorConfig /></Suspense>
          },

          // Forms — mỗi view 1 route riêng
          {
            path: '/admin/allforms',
            element: <Navigate to="/admin/forms" replace />
          },
          {
            path: '/admin/forms',
            element: <Suspense fallback={<Loader />}><FormListPage /></Suspense>
          },
          {
            path: '/admin/forms/create',
            element: <Suspense fallback={<Loader />}><FormBuilderPage /></Suspense>
          },
          {
            path: '/admin/forms/ai',
            element: <Suspense fallback={<Loader />}><FormAIPage /></Suspense>
          },
          {
            path: '/admin/forms/:id/edit',
            element: <Suspense fallback={<Loader />}><FormBuilderPage /></Suspense>
          },
          {
            path: '/admin/forms/:id/preview',
            element: <Suspense fallback={<Loader />}><FormPreviewPage /></Suspense>
          },

          // Reports
          {
            path: '/admin/reports',
            element: <Suspense fallback={<Loader />}><ReportsPage /></Suspense>
          },

          // Alumni batches
          {
            path: '/admin/alumni/batches',
            element: <Suspense fallback={<Loader />}><BatchList /></Suspense>
          },
          {
            path: '/admin/alumni/batches/create',
            element: <Suspense fallback={<Loader />}><BatchCreate /></Suspense>
          },
          {
            path: '/admin/alumni/batches/:id/results',
            element: <Suspense fallback={<Loader />}><BatchResults /></Suspense>
          },
          {
            path: '/admin/alumni/batches/:id/responses',
            element: <Suspense fallback={<Loader />}><BatchResults /></Suspense>
          },
          {
            path: '/admin/alumni/batches/:id/responses/:responseId',
            element: <Suspense fallback={<Loader />}><ResponseDetail /></Suspense>
          },
          {
            path: '/admin/alumni/batches/:id/responses/:responseId/edit',
            element: <Suspense fallback={<Loader />}><ResponseDetail /></Suspense>
          },
          {
            path: '/admin/alumni/batches/:id/edit-form',
            element: <Suspense fallback={<Loader />}><BatchFormEditor /></Suspense>
          },

          // Users
          {
            path: '/admin/users',
            element: <Suspense fallback={<Loader />}><UserManagement /></Suspense>
          },
          {
            path: '/admin/roles',
            element: <Suspense fallback={<Loader />}><RoleManagement /></Suspense>
          },
          {
            path: '/admin/resources',
            element: <Suspense fallback={<Loader />}><ResourceManagement /></Suspense>
          },

          // Enterprises
          {
            path: '/admin/enterprises',
            element: <Suspense fallback={<Loader />}><Enterprise /></Suspense>
          },
          {
            path: '/admin/enterprises/:slug',
            element: <Suspense fallback={<Loader />}><EnterpriseDetail /></Suspense>
          },

          // Faculties
          {
            path: '/admin/faculties',
            element: <Suspense fallback={<Loader />}><Faculties /></Suspense>
          },
          {
            path: '/admin/faculties/:facultySlug',
            element: <Suspense fallback={<Loader />}><FacultyDetail /></Suspense>
          },
          {
            path: '/admin/faculties/:facultySlug/:majorSlug',
            element: <Suspense fallback={<Loader />}><MajorDetail /></Suspense>
          },

          // Graduation
          {
            path: '/admin/graduation',
            element: <Suspense fallback={<Loader />}><GraduationList /></Suspense>
          },
          {
            path: '/admin/graduation/:id/:slug/students',
            element: <Suspense fallback={<Loader />}><GraduationStudents /></Suspense>
          },
          {
            path: '/admin/graduation/:id/:slug/students/:studentId/:studentSlug',
            element: <Suspense fallback={<Loader />}><StudentDetail /></Suspense>
          },

          // Profile
          {
            path: '/admin/profile',
            element: <Suspense fallback={<Loader />}><AdminProfile /></Suspense>
          },
          {
            path: '/admin/reports/faculty/:facultyId',
            element: <Suspense fallback={<Loader />}><FacultyReportPage /></Suspense>
          },
        ],
      },

      // FALLBACK
      { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
];

export default routes;