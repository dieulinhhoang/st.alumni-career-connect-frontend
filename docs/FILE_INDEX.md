# File Index — st.alumni-career-connect-frontend

**Branch:** `feature/report`  
**Tech Stack:** React 19 + TypeScript + Vite + Ant Design 5  
**Last Updated:** 2026-05-11

---

## Project Root

| File | Purpose |
|------|--------|
| `index.html` | Entry HTML |
| `package.json` | Dependencies & scripts |
| `vite.config.ts` | Vite build config |
| `tsconfig.json` | TypeScript root config |
| `tsconfig.app.json` | App-specific TS config |
| `tsconfig.node.json` | Node-specific TS config |
| `eslint.config.js` | ESLint rules |
| `.hintrc` | Hint config |
| `.gitignore` | Git ignore rules |
| `.gitattributes` | Git attributes |
| `README.md` | Project readme |

---

## src/

### Root Files

| File | Purpose |
|------|--------|
| `main.tsx` | React app entry point, mounts App to DOM |
| `App.tsx` | Root component, sets up providers & router |
| `App.css` | Root styles |
| `index.css` | Global CSS (reset, vars) |

---

### src/assets/
Static assets (images, icons, logos).

---

### src/components/ — Shared UI Components

| Subfolder | Files | Purpose |
|-----------|-------|--------|
| `charts/` | `PieColumnChart.tsx` | Reusable pie/column chart component |
| `common/` | `FilterContainer.tsx` | Filter wrapper with search & pagination |
| `common/` | `FilterCustom.tsx` | Custom filter with initialValues prop |
| `common/` | `chart.tsx` | Base chart component |
| `common/` | `colchart.tsx` | Column chart component |
| `common/` | `customTable.tsx` | Reusable custom table with sorting/filtering |
| `common/` | `greetingcard.tsx` | Greeting card for dashboards |
| `common/` | `loader.tsx` | Loading spinner component |
| `common/` | `piechart.tsx` | Pie chart component |
| `common/` | `question.tsx` | Survey question component |
| `common/` | `table.tsx` | Generic table component |
| `common/` | `timeline.tsx` | Timeline display component |
| `common/` | `utils.ts` | Common utility functions |
| `css/` | `Forms.css` | Form-related styles |
| `css/` | `GreetingCard.css` | GreetingCard styles |
| `css/` | `card.css` | Card component styles |
| `css/` | `chart.css` | Chart styles |
| `css/` | `loader.css` | Loader styles |
| `css/` | `login.css` | Login page styles |
| `css/` | `survey.css` | Survey page styles |
| `layout/` | `AdminLayout.tsx` | Admin dashboard layout shell |

---

### src/feature/ — Domain Feature Modules (13 modules)

Each module encapsulates logic, types, and sub-components for one business domain.

| Module | Purpose |
|--------|--------|
| `adminProfile/` | Admin profile management |
| `alumni/` | Alumni information & flows |
| `auth/` | Authentication logic & types |
| `dashboard/` | Dashboard data & logic |
| `enterprise/` | Enterprise management |
| `faculty/` | Faculty/institution data |
| `form/` | Form shared logic & validation |
| `graduation/` | Graduation records |
| `home/` | Home page logic |
| `resources/` | Resources & content |
| `role/` | RBAC types & constants |
| `statistics/` | Statistics computation |
| `user/` | User CRUD logic & types |

---

### src/global/

| File/Folder | Purpose |
|-------------|--------|
| `globalType.ts` | Global TypeScript type definitions |
| `hooks/` | Shared custom React hooks |

---

### src/libs/ — Core Utilities

| File | Purpose |
|------|--------|
| `api.ts` | Axios instance & API base config |
| `cookieStorage.ts` | Cookie-based storage wrapper |
| `interceptors.ts` | Axios request/response interceptors |
| `localStorage.ts` | LocalStorage wrapper with typing |
| `rbac.ts` | Role-Based Access Control helpers |

---

### src/pages/ — Page-Level Components

#### admin/
Pages available only to authenticated admin users.

| Page | Purpose |
|------|--------|
| `AdminProfile/` | Admin personal profile |
| `Alumni/` | Alumni list & management |
| `Auth/Login/` | Login page |
| `DashBoard/` | Admin dashboard overview |
| `Enterprise/` | Enterprise directory |
| `EnterpriseDetail/` | Enterprise detail view |
| `Faculty/` | Faculty management |
| `Form/` | Form pages for surveys |
| `Graduation/` | Graduation records |
| `ManageUsers/` | User administration |
| **`Reports/`** | **Survey report & analytics** |
| `Resources/` | Resource management |
| `Role/` | Role management |
| `Statistics/FormStatisticsDetail/` | Statistics detail view |
| `Survey/` | Survey builder & list |
| `User/` | User management |

#### client/ — End-user pages

| Page | Purpose |
|------|--------|
| `client/Home/` | Public-facing home page |

---

### src/routes/

| File | Purpose |
|------|--------|
| `AppRouter.tsx` | React Router config — routes, guards, lazy loading |

---

## Report Page Deep Dive: src/pages/admin/Reports/

The `Reports` page was added in the `feature/report` branch. It provides analytics on student survey submissions.

### Files in Reports/

| File | Purpose |
|------|--------|
| `components/` | Sub-components (SubmissionPill, MiniBar) |
| `index.tsx` | Main page component (entry point) |
| `ReportPage.tsx` | Report page layout wrapper |
| `report-page.css` | Report page styles |
| `styles.css` | Additional styles |
| `types.ts` | TypeScript interfaces for report data |
| `useReportApi.ts` | Hook for fetching report data from API |
| `useReportData.ts` | Hook for processing/transforming report data |

### Reports/components/

| File | Purpose |
|------|--------|
| `SubmissionPill.tsx` | Submission progress indicator |
| `MiniBar.tsx` | Mini bar chart for faculty progress |

### Reports Feature Summary

- **Scope-based filtering**: Views differ based on user role (Super Admin / Faculty Officer / Major Officer)
- **KPI Cards**: Total graduates, submission rate, employment rate, relevant job rate
- **4 Tabs**: Major summary, Graduate list, Survey responses, Faculty progress
- **Ant Design**: Uses `Table`, `Tabs`, `Select`, `Tag`, `Spin`, `Empty`, `Skeleton`
