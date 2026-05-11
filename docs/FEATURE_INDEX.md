# Feature Index — st.alumni-career-connect-frontend

**Branch:** `feature/report`  
**Last Updated:** 2026-05-11

This document lists all 13 domain feature modules under `src/feature/`, organized by functional group.

---

## Authentication & Access Control

### auth
- **Path:** `src/feature/auth/`
- **Responsibility:** Authentication entry point — login/logout flows, session handling, token management.
- **Key types:** Auth context, token payload, login response shape.

### role
- **Path:** `src/feature/role/`
- **Responsibility:** Role-Based Access Control (RBAC) — role definitions, permission constants, scope resolution (school/faculty/major).
- **Key exports:** Role enum, scope types, permission masks.

---

## User & Profile Management

### user
- **Path:** `src/feature/user/`
- **Responsibility:** General user CRUD — list users, create, update, delete, role assignment.
- **Key types:** User entity, user filters, user actions.

### adminProfile
- **Path:** `src/feature/adminProfile/`
- **Responsibility:** Admin self-profile — edit personal info, change password, view own data.

### alumni
- **Path:** `src/feature/alumni/`
- **Responsibility:** Alumni-specific data — graduation records, career status, survey history.

---

## Platform Views

### home
- **Path:** `src/feature/home/`
- **Responsibility:** Home/landing page logic for authenticated users.

### dashboard
- **Path:** `src/feature/dashboard/`
- **Responsibility:** Dashboard data aggregation — KPI metrics, welcome greeting, quick stats.

### statistics
- **Path:** `src/feature/statistics/`
- **Responsibility:** Statistics computation — aggregation logic, filter transformations, chart data preparation.

---

## Academic Domain

### faculty
- **Path:** `src/feature/faculty/`
- **Responsibility:** Faculty-level management — faculty CRUD, faculty-to-major mapping, faculty statistics.

### graduation
- **Path:** `src/feature/graduation/`
- **Responsibility:** Graduation records — cohort data, graduation year, degree status tracking.

---

## Enterprise & Career

### enterprise
- **Path:** `src/feature/enterprise/`
- **Responsibility:** Enterprise/employer management — enterprise CRUD, industry classification, status.

### resources
- **Path:** `src/feature/resources/`
- **Responsibility:** Resource management — learning resources, job boards, content listing.

---

## Forms & Surveys

### form
- **Path:** `src/feature/form/`
- **Responsibility:** Shared form logic — dynamic form configuration, validation rules, field schemas for survey builders.

---

## Feature Dependency Map

```
auth ─────┬──────> role
          │
          └──────> user ─────┬──────> adminProfile
                             │
                             └──────> alumni

faculty ──────┬──────> graduation
              │
              └──────> dashboard

enterprise ───┬──────> resources
              │
              └──────> statistics

form ─────────────────────> statistics
                           > dashboard

statistics ──────────────> dashboard
```

---

## Page-to-Feature Mapping

| Page | Uses Features |
|------|---------------|
| `pages/admin/Auth/Login` | `auth`, `role` |
| `pages/admin/DashBoard` | `dashboard`, `statistics`, `home` |
| `pages/admin/ManageUsers` | `user`, `role` |
| `pages/admin/AdminProfile` | `adminProfile`, `user` |
| `pages/admin/Alumni` | `alumni`, `graduation`, `user` |
| `pages/admin/Graduation` | `graduation`, `faculty` |
| `pages/admin/Faculty` | `faculty` |
| `pages/admin/Enterprise` | `enterprise` |
| `pages/admin/EnterpriseDetail` | `enterprise` |
| `pages/admin/Resources` | `resources` |
| `pages/admin/Role` | `role`, `user` |
| `pages/admin/Form` | `form` |
| `pages/admin/Survey` | `form`, `statistics` |
| `pages/admin/Statistics/FormStatisticsDetail` | `statistics`, `form` |
| `pages/admin/Reports` | `statistics`, `alumni`, `form` |
| `pages/client/Home` | `home` |
