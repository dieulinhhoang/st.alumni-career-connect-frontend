import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isEnterpriseUser } from '../utils/jwt';
import { PermissionRoute } from './PermissionRoute';
import { PermissionEnum } from '../feature/auth/type';

const Loader = lazy(() => import('../components/common/loader'));

// Auth
const LoginPage           = lazy(() => import('../pages/system/Auth/LoginPage'));
const AuthCallback        = lazy(() => import('../pages/system/Auth/AuthCallback'));

// Enterprise
const EnterpriseLoginPage = lazy(() => import('../pages/enterprise/EnterpriseLoginPage'));
const AcceptInvitePage    = lazy(() => import('../pages/enterprise/AcceptInvitePage'));
const EnterpriseDashboard = lazy(() => import('../pages/enterprise/EnterpriseDashboard'));

// Client
const SurveyFillPage = lazy(() => import('../pages/client/Survey/SurveyFillPage'));
const DoneScreen     = lazy(() => import('../pages/client/Survey/DoneScreen'));
const JobsPage       = lazy(() => import('../pages/client/Jobs/JobsPage'));

// Admin — core
const DashBoard      = lazy(() => import('../pages/system/DashBoard/index'));
const KhoaDashBoard  = lazy(() => import('../pages/customFaculty/DashBoard/index'));
const AdminProfile   = lazy(() => import('../pages/system/AdminProfile/AdminProfile'));

// Admin — statistics & reports
const FormStatisticsDetailPage = lazy(() => import('../pages/system/Statistics/FormStatisticsDetail'));
const StatIndicatorConfig      = lazy(() => import('../pages/system/Statistics/StatIndicatorConfig'));
const ReportsPage              = lazy(() => import('../pages/system/Reports/ReportsPage'));
const FacultyReportPage        = lazy(() => import('../pages/system/Reports/components/FacultyReportPage'));

// Admin — forms
const FormListPage    = lazy(() => import('../pages/system/Form/pages/FormListPage'));
const FormBuilderPage = lazy(() => import('../pages/system/Form/pages/FormBuilderPage'));
const FormPreviewPage = lazy(() => import('../pages/system/Form/pages/FormPreviewPage'));
const FormAIPage      = lazy(() => import('../pages/system/Form/pages/FormAIPage'));

// Admin — alumni batches & import
const BatchList       = lazy(() => import('../pages/system/Alumni/BatchList').then(m => ({ default: m.BatchList })));
const BatchCreate     = lazy(() => import('../pages/system/Alumni/BatchCreate').then(m => ({ default: m.BatchCreate })));
const BatchResults    = lazy(() => import('../pages/system/Alumni/BatchResults').then(m => ({ default: m.BatchResults })));
const ResponseDetail  = lazy(() => import('../pages/system/Alumni/ResponseDetail').then(m => ({ default: m.ResponseDetail })));
const BatchFormEditor = lazy(() => import('../pages/system/Alumni/BatchFormEditor'));
const LegacyImportPage         = lazy(() => import('../pages/system/LegacyImport/LegacyImportPage'));
const ImportExcelForGraduation = lazy(() => import('../pages/system/Graduation/ImportExcel'));

// Admin — users & roles
const UserManagement     = lazy(() => import('../pages/system/User/UserManagement'));
const RoleManagement     = lazy(() => import('../pages/system/Role/RoleManagement'));
const ResourceManagement = lazy(() => import('../pages/system/Resources/ResourceManagement'));

// External API
const ApiKeyManagement = lazy(() => import('../pages/system/ExternalApi/ApiKeyManagement'));

// Admin — mail settings
const MailSettingsPage       = lazy(() => import('../pages/system/MailSettings/index'));
const EmailTemplateEditor    = lazy(() => import('../pages/system/MailSettings/EmailTemplateEditor'));

// Admin — enterprises
const Enterprise       = lazy(() => import('../pages/system/Enterprise/index'));
const EnterprisePending = lazy(() => import('../pages/system/Enterprise/PendingApproval'));
const EnterpriseDetail = lazy(() => import('../pages/system/EnterpriseDetail/index'));

// Admin — faculties
const Faculties     = lazy(() => import('../pages/system/Faculty'));
const FacultyDetail = lazy(() => import('../pages/system/Faculty/FacultyDetail'));
const MajorDetail   = lazy(() => import('../pages/system/Faculty/MajorDetail'));

// Admin — graduation
const GraduationList     = lazy(() => import('../pages/system/Graduation/index'));
const GraduationStudents = lazy(() => import('../pages/system/Graduation/GraduationStudents'));
const StudentDetail      = lazy(() => import('../pages/system/Graduation/Studentdetail'));

//  Guards
const isLoggedIn = () => !!localStorage.getItem('accessToken');

const SsoRedirect = () => {
  useEffect(() => {
    window.location.replace('/login');
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Loader />
    </div>
  );
};

const ProtectedRoute = () =>
  isLoggedIn() ? <Outlet /> : <SsoRedirect />;

const EnterpriseRoute = () =>
  isEnterpriseUser() ? <Outlet /> : <Navigate to="/enterprise/login" replace />;

//  Routes
const routes = [
  {
    path: '/',
    children: [

      // PUBLIC
      {
        path: '',
        element: <Navigate to="/login" replace />
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
        path: '/enterprise/login',
        element: <Suspense fallback={<div />}><EnterpriseLoginPage /></Suspense>,
      },
      {
        path: '/enterprise/accept-invite',
        element: <Suspense fallback={<div />}><AcceptInvitePage /></Suspense>,
      },
      {
        element: <EnterpriseRoute />,
        children: [
          {
            path: '/enterprise/dashboard',
            element: <Suspense fallback={<Loader />}><EnterpriseDashboard /></Suspense>,
          },
          {
            path: '/enterprise/jobs',
            element: <Navigate to="/enterprise/dashboard" replace />,
          },
          {
            path: '/enterprise/applicants',
            element: <Navigate to="/enterprise/dashboard" replace />,
          },
        ],
      },
      {
        path: '/jobs',
        element: <Suspense fallback={<Loader />}><JobsPage /></Suspense>,
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

          // Forms — quyền riêng, tách khỏi surveys
          {
            element: <PermissionRoute permission={PermissionEnum.FORMS_READ} />,
            children: [
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
            ],
          },

          // Alumni batches & legacy import
          {
            element: <PermissionRoute permission={PermissionEnum.SURVEYS_READ} />,
            children: [
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

          // External API keys
          {
            path: '/admin/api-keys',
            element: <Suspense fallback={<Loader />}><ApiKeyManagement /></Suspense>
          },

          // Mail settings
          {
            path: '/admin/mail-settings',
            element: <Suspense fallback={<Loader />}><MailSettingsPage /></Suspense>
          },
          {
            path: '/admin/mail-settings/templates/:id',
            element: <Suspense fallback={<Loader />}><EmailTemplateEditor /></Suspense>
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
                path: '/admin/enterprises/pending',
                element: <Suspense fallback={<Loader />}><EnterprisePending /></Suspense>
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