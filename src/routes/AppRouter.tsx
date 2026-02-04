import { Children, lazy, Suspense } from 'react'
import 'react-router-dom'
 import Chart from '../components/common/chart';
import Statistic from '../pages/admin/Statistics';
import AllForms from '../pages/admin/ManageScores/AllForms';
import StudentList from '../pages/admin/ManageUsers/StudentList';
import StaffList from '../pages/admin/ManageUsers/StaffList';
import CriteriaConfig from '../pages/admin/SystemConfig/CriteriaConfig';
import SemesterConfig from '../pages/admin/SystemConfig/SemesterConfig';
import ApproveScores from '../pages/admin/ManageScores/ApproveScores';


const DashBoard = lazy(() => import("../pages/admin/DashBoard"));
const Loader = lazy(() => import('../components/common/loader'))
const routes = [
    {
        path: '/',
        children: [
            {

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
                path: '/admin/criteriaconfig',
                element: (
                    <Suspense fallback={<Loader />}>
                        <CriteriaConfig />
                    </Suspense>
                )
            },
            {
                path: '/admin/semesterconfig',
                element: (
                    <Suspense>
                        <SemesterConfig />
                    </Suspense>
                )
            }
            , {
                path: '/admin/approvescore',
                element: (
                    <Suspense>
                        <ApproveScores />
                    </Suspense>
                )
            }

        ]
    }
]
export default routes;