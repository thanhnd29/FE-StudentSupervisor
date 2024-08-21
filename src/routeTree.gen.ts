/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AdminLayoutImport } from './routes/_admin-layout'
import { Route as IndexImport } from './routes/index'
import { Route as PaymentSuccessImport } from './routes/payment/success'
import { Route as PaymentFailureImport } from './routes/payment/failure'
import { Route as AdminLayoutDashboardIndexImport } from './routes/_admin-layout.dashboard/index'
import { Route as AdminLayoutDashboardAnalyticsImport } from './routes/_admin-layout.dashboard/analytics'
import { Route as AdminLayoutDashboardIdImport } from './routes/_admin-layout.dashboard/$id'
import { Route as AdminLayoutDashboardYearPackagesIndexImport } from './routes/_admin-layout.dashboard/year-packages/index'
import { Route as AdminLayoutDashboardViolationsIndexImport } from './routes/_admin-layout.dashboard/violations/index'
import { Route as AdminLayoutDashboardViolationTypesIndexImport } from './routes/_admin-layout.dashboard/violation-types/index'
import { Route as AdminLayoutDashboardViolationGroupsIndexImport } from './routes/_admin-layout.dashboard/violation-groups/index'
import { Route as AdminLayoutDashboardViolationConfigsIndexImport } from './routes/_admin-layout.dashboard/violation-configs/index'
import { Route as AdminLayoutDashboardUserIndexImport } from './routes/_admin-layout.dashboard/user/index'
import { Route as AdminLayoutDashboardTimesIndexImport } from './routes/_admin-layout.dashboard/times/index'
import { Route as AdminLayoutDashboardTeachersIndexImport } from './routes/_admin-layout.dashboard/teachers/index'
import { Route as AdminLayoutDashboardStudentsIndexImport } from './routes/_admin-layout.dashboard/students/index'
import { Route as AdminLayoutDashboardStudentSupervisorsIndexImport } from './routes/_admin-layout.dashboard/student-supervisors/index'
import { Route as AdminLayoutDashboardStudentInClassesIndexImport } from './routes/_admin-layout.dashboard/student-in-classes/index'
import { Route as AdminLayoutDashboardSchoolYearIndexImport } from './routes/_admin-layout.dashboard/school-year/index'
import { Route as AdminLayoutDashboardSchoolConfigsIndexImport } from './routes/_admin-layout.dashboard/school-configs/index'
import { Route as AdminLayoutDashboardSchoolAdminIndexImport } from './routes/_admin-layout.dashboard/school-admin/index'
import { Route as AdminLayoutDashboardRegisteredSchoolsIndexImport } from './routes/_admin-layout.dashboard/registered-schools/index'
import { Route as AdminLayoutDashboardPenaltiesIndexImport } from './routes/_admin-layout.dashboard/penalties/index'
import { Route as AdminLayoutDashboardPatrolSchedulesIndexImport } from './routes/_admin-layout.dashboard/patrol-schedules/index'
import { Route as AdminLayoutDashboardPackagesIndexImport } from './routes/_admin-layout.dashboard/packages/index'
import { Route as AdminLayoutDashboardHighSchoolIndexImport } from './routes/_admin-layout.dashboard/high-school/index'
import { Route as AdminLayoutDashboardEvaluationsIndexImport } from './routes/_admin-layout.dashboard/evaluations/index'
import { Route as AdminLayoutDashboardEvaluationTopsIndexImport } from './routes/_admin-layout.dashboard/evaluation-tops/index'
import { Route as AdminLayoutDashboardEvaluationDetailsIndexImport } from './routes/_admin-layout.dashboard/evaluation-details/index'
import { Route as AdminLayoutDashboardDisciplinesIndexImport } from './routes/_admin-layout.dashboard/disciplines/index'
import { Route as AdminLayoutDashboardClassesIndexImport } from './routes/_admin-layout.dashboard/classes/index'
import { Route as AdminLayoutDashboardClassGroupIndexImport } from './routes/_admin-layout.dashboard/class-group/index'
import { Route as AdminLayoutDashboardViolationsCreateSupervisorImport } from './routes/_admin-layout.dashboard/violations/create-supervisor'
import { Route as AdminLayoutDashboardViolationsCreateStudentImport } from './routes/_admin-layout.dashboard/violations/create-student'
import { Route as AdminLayoutDashboardViolationTopsViolationTopStudentInClassImport } from './routes/_admin-layout.dashboard/violation-tops/violation-top-studentInClass'
import { Route as AdminLayoutDashboardViolationTopsViolationTopStudentImport } from './routes/_admin-layout.dashboard/violation-tops/violation-top-student'
import { Route as AdminLayoutDashboardViolationTopsViolationTopClassImport } from './routes/_admin-layout.dashboard/violation-tops/violation-top-class'
import { Route as AdminLayoutDashboardViolationTopsViolationInYearImport } from './routes/_admin-layout.dashboard/violation-tops/violation-in-year'
import { Route as AdminLayoutDashboardViolationTopsViolationInWeekImport } from './routes/_admin-layout.dashboard/violation-tops/violation-in-week'
import { Route as AdminLayoutDashboardViolationTopsViolationInClassImport } from './routes/_admin-layout.dashboard/violation-tops/violation-in-class'
import { Route as AdminLayoutDashboardPackagesBuyPackagesImport } from './routes/_admin-layout.dashboard/packages/buy-packages'
import { Route as AdminLayoutDashboardHighSchoolIdImport } from './routes/_admin-layout.dashboard/high-school/$id'
import { Route as AdminLayoutDashboardAuthViewImport } from './routes/_admin-layout.dashboard/auth/view'
import { Route as AdminLayoutDashboardAuthEditImport } from './routes/_admin-layout.dashboard/auth/edit'
import { Route as AdminLayoutDashboardViolationsIdIndexImport } from './routes/_admin-layout.dashboard/violations/$id/index'
import { Route as AdminLayoutDashboardDisciplinesIdIndexImport } from './routes/_admin-layout.dashboard/disciplines/$id/index'
import { Route as AdminLayoutDashboardClassesIdIndexImport } from './routes/_admin-layout.dashboard/classes/$id/index'
import { Route as AdminLayoutDashboardViolationsIdHistoryImport } from './routes/_admin-layout.dashboard/violations/$id/history'
import { Route as AdminLayoutDashboardViolationsIdEditImport } from './routes/_admin-layout.dashboard/violations/$id/edit'
import { Route as AdminLayoutDashboardStudentInClassesIdHistoryImport } from './routes/_admin-layout.dashboard/student-in-classes/$id/history'
import { Route as AdminLayoutDashboardDisciplinesIdHistoryImport } from './routes/_admin-layout.dashboard/disciplines/$id/history'
import { Route as AdminLayoutDashboardClassesIdHistoryImport } from './routes/_admin-layout.dashboard/classes/$id/history'

// Create/Update Routes

const AdminLayoutRoute = AdminLayoutImport.update({
  id: '/_admin-layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PaymentSuccessRoute = PaymentSuccessImport.update({
  path: '/payment/success',
  getParentRoute: () => rootRoute,
} as any)

const PaymentFailureRoute = PaymentFailureImport.update({
  path: '/payment/failure',
  getParentRoute: () => rootRoute,
} as any)

const AdminLayoutDashboardIndexRoute = AdminLayoutDashboardIndexImport.update({
  path: '/dashboard/',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutDashboardAnalyticsRoute =
  AdminLayoutDashboardAnalyticsImport.update({
    path: '/dashboard/analytics',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardIdRoute = AdminLayoutDashboardIdImport.update({
  path: '/dashboard/$id',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutDashboardYearPackagesIndexRoute =
  AdminLayoutDashboardYearPackagesIndexImport.update({
    path: '/dashboard/year-packages/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationsIndexRoute =
  AdminLayoutDashboardViolationsIndexImport.update({
    path: '/dashboard/violations/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTypesIndexRoute =
  AdminLayoutDashboardViolationTypesIndexImport.update({
    path: '/dashboard/violation-types/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationGroupsIndexRoute =
  AdminLayoutDashboardViolationGroupsIndexImport.update({
    path: '/dashboard/violation-groups/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationConfigsIndexRoute =
  AdminLayoutDashboardViolationConfigsIndexImport.update({
    path: '/dashboard/violation-configs/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardUserIndexRoute =
  AdminLayoutDashboardUserIndexImport.update({
    path: '/dashboard/user/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardTimesIndexRoute =
  AdminLayoutDashboardTimesIndexImport.update({
    path: '/dashboard/times/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardTeachersIndexRoute =
  AdminLayoutDashboardTeachersIndexImport.update({
    path: '/dashboard/teachers/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardStudentsIndexRoute =
  AdminLayoutDashboardStudentsIndexImport.update({
    path: '/dashboard/students/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardStudentSupervisorsIndexRoute =
  AdminLayoutDashboardStudentSupervisorsIndexImport.update({
    path: '/dashboard/student-supervisors/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardStudentInClassesIndexRoute =
  AdminLayoutDashboardStudentInClassesIndexImport.update({
    path: '/dashboard/student-in-classes/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSchoolYearIndexRoute =
  AdminLayoutDashboardSchoolYearIndexImport.update({
    path: '/dashboard/school-year/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSchoolConfigsIndexRoute =
  AdminLayoutDashboardSchoolConfigsIndexImport.update({
    path: '/dashboard/school-configs/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSchoolAdminIndexRoute =
  AdminLayoutDashboardSchoolAdminIndexImport.update({
    path: '/dashboard/school-admin/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardRegisteredSchoolsIndexRoute =
  AdminLayoutDashboardRegisteredSchoolsIndexImport.update({
    path: '/dashboard/registered-schools/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPenaltiesIndexRoute =
  AdminLayoutDashboardPenaltiesIndexImport.update({
    path: '/dashboard/penalties/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPatrolSchedulesIndexRoute =
  AdminLayoutDashboardPatrolSchedulesIndexImport.update({
    path: '/dashboard/patrol-schedules/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPackagesIndexRoute =
  AdminLayoutDashboardPackagesIndexImport.update({
    path: '/dashboard/packages/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardHighSchoolIndexRoute =
  AdminLayoutDashboardHighSchoolIndexImport.update({
    path: '/dashboard/high-school/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardEvaluationsIndexRoute =
  AdminLayoutDashboardEvaluationsIndexImport.update({
    path: '/dashboard/evaluations/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardEvaluationTopsIndexRoute =
  AdminLayoutDashboardEvaluationTopsIndexImport.update({
    path: '/dashboard/evaluation-tops/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardEvaluationDetailsIndexRoute =
  AdminLayoutDashboardEvaluationDetailsIndexImport.update({
    path: '/dashboard/evaluation-details/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardDisciplinesIndexRoute =
  AdminLayoutDashboardDisciplinesIndexImport.update({
    path: '/dashboard/disciplines/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardClassesIndexRoute =
  AdminLayoutDashboardClassesIndexImport.update({
    path: '/dashboard/classes/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardClassGroupIndexRoute =
  AdminLayoutDashboardClassGroupIndexImport.update({
    path: '/dashboard/class-group/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationsCreateSupervisorRoute =
  AdminLayoutDashboardViolationsCreateSupervisorImport.update({
    path: '/dashboard/violations/create-supervisor',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationsCreateStudentRoute =
  AdminLayoutDashboardViolationsCreateStudentImport.update({
    path: '/dashboard/violations/create-student',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTopsViolationTopStudentInClassRoute =
  AdminLayoutDashboardViolationTopsViolationTopStudentInClassImport.update({
    path: '/dashboard/violation-tops/violation-top-studentInClass',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTopsViolationTopStudentRoute =
  AdminLayoutDashboardViolationTopsViolationTopStudentImport.update({
    path: '/dashboard/violation-tops/violation-top-student',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTopsViolationTopClassRoute =
  AdminLayoutDashboardViolationTopsViolationTopClassImport.update({
    path: '/dashboard/violation-tops/violation-top-class',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTopsViolationInYearRoute =
  AdminLayoutDashboardViolationTopsViolationInYearImport.update({
    path: '/dashboard/violation-tops/violation-in-year',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTopsViolationInWeekRoute =
  AdminLayoutDashboardViolationTopsViolationInWeekImport.update({
    path: '/dashboard/violation-tops/violation-in-week',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationTopsViolationInClassRoute =
  AdminLayoutDashboardViolationTopsViolationInClassImport.update({
    path: '/dashboard/violation-tops/violation-in-class',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPackagesBuyPackagesRoute =
  AdminLayoutDashboardPackagesBuyPackagesImport.update({
    path: '/dashboard/packages/buy-packages',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardHighSchoolIdRoute =
  AdminLayoutDashboardHighSchoolIdImport.update({
    path: '/dashboard/high-school/$id',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardAuthViewRoute =
  AdminLayoutDashboardAuthViewImport.update({
    path: '/dashboard/auth/view',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardAuthEditRoute =
  AdminLayoutDashboardAuthEditImport.update({
    path: '/dashboard/auth/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationsIdIndexRoute =
  AdminLayoutDashboardViolationsIdIndexImport.update({
    path: '/dashboard/violations/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardDisciplinesIdIndexRoute =
  AdminLayoutDashboardDisciplinesIdIndexImport.update({
    path: '/dashboard/disciplines/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardClassesIdIndexRoute =
  AdminLayoutDashboardClassesIdIndexImport.update({
    path: '/dashboard/classes/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationsIdHistoryRoute =
  AdminLayoutDashboardViolationsIdHistoryImport.update({
    path: '/dashboard/violations/$id/history',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardViolationsIdEditRoute =
  AdminLayoutDashboardViolationsIdEditImport.update({
    path: '/dashboard/violations/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardStudentInClassesIdHistoryRoute =
  AdminLayoutDashboardStudentInClassesIdHistoryImport.update({
    path: '/dashboard/student-in-classes/$id/history',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardDisciplinesIdHistoryRoute =
  AdminLayoutDashboardDisciplinesIdHistoryImport.update({
    path: '/dashboard/disciplines/$id/history',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardClassesIdHistoryRoute =
  AdminLayoutDashboardClassesIdHistoryImport.update({
    path: '/dashboard/classes/$id/history',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_admin-layout': {
      preLoaderRoute: typeof AdminLayoutImport
      parentRoute: typeof rootRoute
    }
    '/payment/failure': {
      preLoaderRoute: typeof PaymentFailureImport
      parentRoute: typeof rootRoute
    }
    '/payment/success': {
      preLoaderRoute: typeof PaymentSuccessImport
      parentRoute: typeof rootRoute
    }
    '/_admin-layout/dashboard/$id': {
      preLoaderRoute: typeof AdminLayoutDashboardIdImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/analytics': {
      preLoaderRoute: typeof AdminLayoutDashboardAnalyticsImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/': {
      preLoaderRoute: typeof AdminLayoutDashboardIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/auth/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardAuthEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/auth/view': {
      preLoaderRoute: typeof AdminLayoutDashboardAuthViewImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/high-school/$id': {
      preLoaderRoute: typeof AdminLayoutDashboardHighSchoolIdImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/packages/buy-packages': {
      preLoaderRoute: typeof AdminLayoutDashboardPackagesBuyPackagesImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-tops/violation-in-class': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTopsViolationInClassImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-tops/violation-in-week': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTopsViolationInWeekImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-tops/violation-in-year': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTopsViolationInYearImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-tops/violation-top-class': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTopsViolationTopClassImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-tops/violation-top-student': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTopsViolationTopStudentImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-tops/violation-top-studentInClass': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTopsViolationTopStudentInClassImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violations/create-student': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationsCreateStudentImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violations/create-supervisor': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationsCreateSupervisorImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/class-group/': {
      preLoaderRoute: typeof AdminLayoutDashboardClassGroupIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/classes/': {
      preLoaderRoute: typeof AdminLayoutDashboardClassesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/disciplines/': {
      preLoaderRoute: typeof AdminLayoutDashboardDisciplinesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/evaluation-details/': {
      preLoaderRoute: typeof AdminLayoutDashboardEvaluationDetailsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/evaluation-tops/': {
      preLoaderRoute: typeof AdminLayoutDashboardEvaluationTopsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/evaluations/': {
      preLoaderRoute: typeof AdminLayoutDashboardEvaluationsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/high-school/': {
      preLoaderRoute: typeof AdminLayoutDashboardHighSchoolIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/packages/': {
      preLoaderRoute: typeof AdminLayoutDashboardPackagesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/patrol-schedules/': {
      preLoaderRoute: typeof AdminLayoutDashboardPatrolSchedulesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/penalties/': {
      preLoaderRoute: typeof AdminLayoutDashboardPenaltiesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/registered-schools/': {
      preLoaderRoute: typeof AdminLayoutDashboardRegisteredSchoolsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/school-admin/': {
      preLoaderRoute: typeof AdminLayoutDashboardSchoolAdminIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/school-configs/': {
      preLoaderRoute: typeof AdminLayoutDashboardSchoolConfigsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/school-year/': {
      preLoaderRoute: typeof AdminLayoutDashboardSchoolYearIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/student-in-classes/': {
      preLoaderRoute: typeof AdminLayoutDashboardStudentInClassesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/student-supervisors/': {
      preLoaderRoute: typeof AdminLayoutDashboardStudentSupervisorsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/students/': {
      preLoaderRoute: typeof AdminLayoutDashboardStudentsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/teachers/': {
      preLoaderRoute: typeof AdminLayoutDashboardTeachersIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/times/': {
      preLoaderRoute: typeof AdminLayoutDashboardTimesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/user/': {
      preLoaderRoute: typeof AdminLayoutDashboardUserIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-configs/': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationConfigsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-groups/': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationGroupsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violation-types/': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationTypesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violations/': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationsIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/year-packages/': {
      preLoaderRoute: typeof AdminLayoutDashboardYearPackagesIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/classes/$id/history': {
      preLoaderRoute: typeof AdminLayoutDashboardClassesIdHistoryImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/disciplines/$id/history': {
      preLoaderRoute: typeof AdminLayoutDashboardDisciplinesIdHistoryImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/student-in-classes/$id/history': {
      preLoaderRoute: typeof AdminLayoutDashboardStudentInClassesIdHistoryImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violations/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationsIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violations/$id/history': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationsIdHistoryImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/classes/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardClassesIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/disciplines/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardDisciplinesIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/violations/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardViolationsIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AdminLayoutRoute.addChildren([
    AdminLayoutDashboardIdRoute,
    AdminLayoutDashboardAnalyticsRoute,
    AdminLayoutDashboardIndexRoute,
    AdminLayoutDashboardAuthEditRoute,
    AdminLayoutDashboardAuthViewRoute,
    AdminLayoutDashboardHighSchoolIdRoute,
    AdminLayoutDashboardPackagesBuyPackagesRoute,
    AdminLayoutDashboardViolationTopsViolationInClassRoute,
    AdminLayoutDashboardViolationTopsViolationInWeekRoute,
    AdminLayoutDashboardViolationTopsViolationInYearRoute,
    AdminLayoutDashboardViolationTopsViolationTopClassRoute,
    AdminLayoutDashboardViolationTopsViolationTopStudentRoute,
    AdminLayoutDashboardViolationTopsViolationTopStudentInClassRoute,
    AdminLayoutDashboardViolationsCreateStudentRoute,
    AdminLayoutDashboardViolationsCreateSupervisorRoute,
    AdminLayoutDashboardClassGroupIndexRoute,
    AdminLayoutDashboardClassesIndexRoute,
    AdminLayoutDashboardDisciplinesIndexRoute,
    AdminLayoutDashboardEvaluationDetailsIndexRoute,
    AdminLayoutDashboardEvaluationTopsIndexRoute,
    AdminLayoutDashboardEvaluationsIndexRoute,
    AdminLayoutDashboardHighSchoolIndexRoute,
    AdminLayoutDashboardPackagesIndexRoute,
    AdminLayoutDashboardPatrolSchedulesIndexRoute,
    AdminLayoutDashboardPenaltiesIndexRoute,
    AdminLayoutDashboardRegisteredSchoolsIndexRoute,
    AdminLayoutDashboardSchoolAdminIndexRoute,
    AdminLayoutDashboardSchoolConfigsIndexRoute,
    AdminLayoutDashboardSchoolYearIndexRoute,
    AdminLayoutDashboardStudentInClassesIndexRoute,
    AdminLayoutDashboardStudentSupervisorsIndexRoute,
    AdminLayoutDashboardStudentsIndexRoute,
    AdminLayoutDashboardTeachersIndexRoute,
    AdminLayoutDashboardTimesIndexRoute,
    AdminLayoutDashboardUserIndexRoute,
    AdminLayoutDashboardViolationConfigsIndexRoute,
    AdminLayoutDashboardViolationGroupsIndexRoute,
    AdminLayoutDashboardViolationTypesIndexRoute,
    AdminLayoutDashboardViolationsIndexRoute,
    AdminLayoutDashboardYearPackagesIndexRoute,
    AdminLayoutDashboardClassesIdHistoryRoute,
    AdminLayoutDashboardDisciplinesIdHistoryRoute,
    AdminLayoutDashboardStudentInClassesIdHistoryRoute,
    AdminLayoutDashboardViolationsIdEditRoute,
    AdminLayoutDashboardViolationsIdHistoryRoute,
    AdminLayoutDashboardClassesIdIndexRoute,
    AdminLayoutDashboardDisciplinesIdIndexRoute,
    AdminLayoutDashboardViolationsIdIndexRoute,
  ]),
  PaymentFailureRoute,
  PaymentSuccessRoute,
])

/* prettier-ignore-end */
