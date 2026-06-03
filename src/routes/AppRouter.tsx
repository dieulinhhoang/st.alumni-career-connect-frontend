import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import STAlumni from '../pages/client/Home/Home';
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
import StatIndicatorConfig from '../pages/admin/Statistics/StatIndicatorConfig';
import AuthCallback from '../pages/admin/Auth/AuthCallback';

const DashBoard = lazy(() => import('../pages/admin/DashBoard/index'));
const Loader = lazy(() => import('../components/common/loader'));
const SurveyPage = lazy(() => import('../pages/admin/Form/index'));
const BatchFormEditor = lazy(() => import('../pages/admin/Alumni/BatchFormEditor'));

//  Guards 
const isLoggedIn = () => !!localStorage.getItem('accessToken');

const ProtectedRoute = () =>
  isLoggedIn() ? <Outlet /> : <Navigate to="/" replace />;

//  Routes 
const routes = [
  {
    path: '/',
    children: [

      // PUBLIC
      {
        path: '',
        element: <Suspense fallback={<Loader />}><STAlumni /></Suspense>
      },
      {
        path: '/auth/callback',
        element: <Suspense fallback={<Loader />}><AuthCallback /></Suspense>
      },
      {
        path: '/survey/:slug',
        element: <Suspense fallback={<Loader />}><SurveyFillPage /></Suspense>
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

          // Forms
          {
            path: '/admin/allforms',
            element: <Suspense fallback={<Loader />}><SurveyPage /></Suspense>
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

          // // Users
          // {
          //   path: '/admin/studentlist',
          //   element: <Suspense fallback={<Loader />}><StudentList /></Suspense>
          // },
          // {
          //   path: '/admin/stafflist',
          //   element: <Suspense fallback={<Loader />}><StaffList /></Suspense>
          // },
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
        ],
      },

      // FALLBACK
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export default routes;