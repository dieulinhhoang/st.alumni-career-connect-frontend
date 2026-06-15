import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Enterprise from '../pages/system/Enterprise/index';
import EnterpriseDetail from '../pages/system/EnterpriseDetail/index';
import Faculties from '../pages/system/Faculty';
import MajorDetail from '../pages/system/Faculty/MajorDetail';
import FacultyDetail from '../pages/system/Faculty/FacultyDetail';
import GraduationStudents from '../pages/system/Graduation/GraduationStudents';
import GraduationList from '../pages/system/Graduation/index';
import StudentDetail from '../pages/system/Graduation/Studentdetail';
import UserManagement from '../pages/system/User/UserManagement';
import RoleManagement from '../pages/system/Role/RoleManagement';
import ResourceManagement from '../pages/system/Resources/ResourceManagement';
import { ResponseDetail } from '../pages/system/Alumni/ResponseDetail';
import { BatchResults } from '../pages/system/Alumni/BatchResults';
import { BatchCreate } from '../pages/system/Alumni/BatchCreate';
import { BatchList } from '../pages/system/Alumni/BatchList';
import FormStatisticsDetailPage from '../pages/system/Statistics/FormStatisticsDetail';
import AdminProfile from '../pages/system/AdminProfile/AdminProfile';
import ReportsPage from '../pages/system/Reports/ReportsPage';
import SurveyFillPage from '../pages/client/Survey/SurveyFillPage';
import { DoneScreen } from '../pages/client/Survey/DoneScreen';
import StatIndicatorConfig from '../pages/system/Statistics/StatIndicatorConfig';
import AuthCallback from '../pages/system/Auth/AuthCallback';
import LoginPage from '../pages/system/Auth/LoginPage';
import FacultyReportPage from '../pages/system/Reports/components/FacultyReportPage';
import { PermissionRoute } from './PermissionRoute';
import { PermissionEnum } from '../feature/auth/type';
import ImportExcelForGraduation from '../pages/system/Graduation/ImportExcel';

const DashBoard = lazy(() => import('../pages/system/DashBoard/index'));
const KhoaDashBoard = lazy(() => import('../pages/customFaculty/DashBoard/index'));
const Loader = lazy(() => import('../components/common/loader'));
const BatchFormEditor = lazy(() => import('../pages/system/Alumni/BatchFormEditor'));
const LegacyImportPage = lazy(() => import('../pages/system/LegacyImport/LegacyImportPage'));

// Form pages — mỗi view 1 route riêng
const FormListPage    = lazy(() => import('../pages/system/Form/pages/FormListPage'));
const FormBuilderPage = lazy(() => import('../pages/system/Form/pages/FormBuilderPage'));
const FormPreviewPage = lazy(() => import('../pages/system/Form/pages/FormPreviewPage'));
const FormAIPage      = lazy(() => import('../pages/system/Form/pages/FormAIPage'));

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
        path: '/login',
        element: <Suspense fallback={<Loader />}><LoginPage /></Suspense>
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
          {
            path: '/khoa/dashboard',
            element: <Suspense fallback={<Loader />}><KhoaDashBoard /></Suspense>
          },
          {
            path: '/admin/profile',
            element: <Suspense fallback={<Loader />}><AdminProfile /></Suspense>
          },

          // Statistics & Reports
          {
            element: <PermissionRoute permission={PermissionEnum.REPORTS_READ} />,
            children: [
              {
                path: '/admin/statistics',
                element: <Suspense fallback={<Loader />}><FormStatisticsDetailPage /></Suspense>
              },
              {
                path: '/admin/statistics/indicators',
                element: <Suspense fallback={<Loader />}><StatIndicatorConfig /></Suspense>
              },
              {
                path: '/admin/reports',
                element: <Suspense fallback={<Loader />}><ReportsPage /></Suspense>
              },
              {
                path: '/admin/reports/faculty/:facultyId',
                element: <Suspense fallback={<Loader />}><FacultyReportPage /></Suspense>
              },
            ],
          },

          // Forms, alumni batches & legacy import
          {
            element: <PermissionRoute permission={PermissionEnum.SURVEYS_READ} />,
            children: [
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

              // Legacy Excel import
              {
                path: '/admin/legacy-import',
                element: <Suspense fallback={<Loader />}><LegacyImportPage /></Suspense>
              },
              {
                path:'admin/graduation-import',
                element:<Suspense fallback={<Loader />}><ImportExcelForGraduation /></Suspense>
              }
            ],
          },

          // Users
          {
            element: <PermissionRoute permission={PermissionEnum.USERS_READ} />,
            children: [
              {
                path: '/admin/users',
                element: <Suspense fallback={<Loader />}><UserManagement /></Suspense>
              },
            ],
          },

          // Roles & resources
          {
            element: <PermissionRoute permission={PermissionEnum.ROLES_READ} />,
            children: [
              {
                path: '/admin/roles',
                element: <Suspense fallback={<Loader />}><RoleManagement /></Suspense>
              },
              {
                path: '/admin/resources',
                element: <Suspense fallback={<Loader />}><ResourceManagement /></Suspense>
              },
            ],
          },

          // Enterprises
          {
            element: <PermissionRoute permission={PermissionEnum.ENTERPRISES_READ} />,
            children: [
              {
                path: '/admin/enterprises',
                element: <Suspense fallback={<Loader />}><Enterprise /></Suspense>
              },
              {
                path: '/admin/enterprises/:slug',
                element: <Suspense fallback={<Loader />}><EnterpriseDetail /></Suspense>
              },
            ],
          },

          // Faculties
          {
            element: <PermissionRoute permission={PermissionEnum.STUDENTS_READ} />,
            children: [
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
            ],
          },

          // Graduation
          {
            element: <PermissionRoute permission={PermissionEnum.GRADUATION_READ} />,
            children: [
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
            ],
          },
        ],
      },

      // FALLBACK
      { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
];

export default routes;