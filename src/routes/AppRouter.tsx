import { Children, lazy, Suspense } from 'react'
import 'react-router-dom'
 import Chart from '../components/common/chart';
import Statistic from '../pages/admin/Statistics';
import AllForms from '../pages/admin/Survey/Forms';
import StudentList from '../pages/admin/ManageUsers/StudentList';
import StaffList from '../pages/admin/ManageUsers/StaffList';
import STAlumni from '../pages/client/Home/Home';
import Enterprise from '../pages/admin/Enterprise/index';
import  EnterpriseDetail  from '../pages/admin/EnterpriseDetail/index';

const DashBoard = lazy(() => import("../pages/admin/DashBoard/index"));
const Loader = lazy(() => import('../components/common/loader'))
const routes = [
    {
        path: '/',
        children: [
            {
                path:'',
                element: (<Suspense fallback={<Loader />} >
                   <STAlumni />
                </Suspense>
                )
            }
            ,
            {
                path: '/admin/dashboard',
                element: (
                    <Suspense fallback={<Loader />} >
                        <DashBoard />
                    </Suspense>
                )
            },
            // {
            //     path: '/login',
            //     element: (
            //         <Suspense fallback={<Loader />}>
            //             <Login />
            //         </Suspense>
            //     )
            // },

            {
                path: '/admin/statistics',
                element: (
                    <Suspense fallback={<Loader />}>
                        <Statistic />
                    </Suspense>
                )
            },
            {
                path: '/admin/allforms',
                element: (
                    <Suspense fallback={<Loader />}>
                        <AllForms />
                    </Suspense>
                )
            },
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
            }

        ]
    }
]
export default routes;