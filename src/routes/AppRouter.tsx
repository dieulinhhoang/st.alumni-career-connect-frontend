import { lazy, Suspense } from 'react';
import Statistic         from '../pages/admin/Statistics';
import StudentList        from '../pages/admin/ManageUsers/StudentList';
import StaffList          from '../pages/admin/ManageUsers/StaffList';
import STAlumni           from '../pages/client/Home/Home';
import Enterprise         from '../pages/admin/Enterprise/index';
import EnterpriseDetail   from '../pages/admin/EnterpriseDetail/index';
import Faculties          from '../pages/admin/Faculty';
import MajorDetail        from '../pages/admin/Faculty/MajorDetail';
import FacultyDetail      from '../pages/admin/Faculty/FacultyDetail';
import GraduationStudents from '../pages/admin/Graduation/GraduationStudents';
import GraduationList     from '../pages/admin/Graduation/index';
import StudentDetail      from '../pages/admin/Graduation/Studentdetail';

const DashBoard   = lazy(() => import('../pages/admin/DashBoard/index'));
const Loader      = lazy(() => import('../components/common/loader'));
 const SurveyPage  = lazy(() => import('../pages/admin/Form/index'));

const routes = [
    {
        path: '/',
        children: [
            {
                path: '',
                element: (
                    <Suspense fallback={<Loader />}>
                        <STAlumni />
                    </Suspense>
                )
            },
            {
                path: '/admin/dashboard',
                element: (
                    <Suspense fallback={<Loader />}>
                        <DashBoard />
                    </Suspense>
                )
            },
            {
                path: '/admin/statistics',
                element: (
                    <Suspense fallback={<Loader />}>
                        <Statistic />
                    </Suspense>
                )
            },

            //  Survey / Form 
            {
                // SurveyPage tự điều hướng nội bộ giữa list / builder / ai / preview / theme
                path: '/admin/allforms',
                element: (
                    <Suspense fallback={<Loader />}>
                        <SurveyPage />
                    </Suspense>
                )
            },

            //  Users 
            {
                path: '/admin/studentlist',
                element: (
                    <Suspense fallback={<Loader />}>
                        <StudentList />
                    </Suspense>
                )
            },
            {
                path: '/admin/stafflist',
                element: (
                    <Suspense fallback={<Loader />}>
                        <StaffList />
                    </Suspense>
                )
            },

            //  Enterprises 
            {
                path: '/admin/enterprises',
                element: (
                    <Suspense fallback={<Loader />}>
                        <Enterprise />
                    </Suspense>
                )
            },
            {
                path: '/admin/enterprises/:slug',
                element: (
                    <Suspense fallback={<Loader />}>
                        <EnterpriseDetail />
                    </Suspense>
                )
            },

            //  Faculties 
            {
                path: '/admin/faculties',
                element: (
                    <Suspense fallback={<Loader />}>
                        <Faculties />
                    </Suspense>
                )
            },
            {
                path: '/admin/faculties/:facultySlug',
                element: (
                    <Suspense fallback={<Loader />}>
                        <FacultyDetail />
                    </Suspense>
                )
            },
            {
                path: '/admin/faculties/:facultySlug/:majorSlug',
                element: (
                    <Suspense fallback={<Loader />}>
                        <MajorDetail />
                    </Suspense>
                )
            },

            //  Graduation 
            {
                path: '/admin/graduation',
                element: (
                    <Suspense fallback={<Loader />}>
                        <GraduationList />
                    </Suspense>
                )
            },
            {
                path: '/admin/graduation/:id/:slug/students',
                element: (
                    <Suspense fallback={<Loader />}>
                        <GraduationStudents />
                    </Suspense>
                )
            },
            {
                path: '/admin/graduation/:id/:slug/students/:studentId/:studentSlug',
                element: (
                    <Suspense fallback={<Loader />}>
                        <StudentDetail />
                    </Suspense>
                )
            },
        ]
    }
];

export default routes;