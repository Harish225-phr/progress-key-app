# Frontend Integration Checklist – SMS Backend

Base URL for all APIs: **`/api/v1/`** (see `VITE_API_BASE_URL` or default in `src/api/endpoints.ts`).

## 1. Authentication

| Check | Status |
|-------|--------|
| Store both `accessToken` and `refreshToken` after login | Done – `authService.setAuthTokens()` |
| Use `Authorization: Bearer <accessToken>` for protected requests | Done – `api/client.ts` uses `getAccessToken()` (prefers `accessToken`, fallback `token`) |
| On 401: call refresh with `refreshToken`; retry request on success | Done – 401 interceptor in `api/client.ts` |
| On refresh failure: redirect to login | Done – `setOnRefreshFailure` in `main.tsx` |
| Logout: call `POST /auth/logout` with `refreshToken`, clear tokens | Done – `authService.logout()` in all layouts |
| Logout all: `POST /auth/logout-all` with Bearer, then clear tokens | Done – `authService.logoutAll()` |
| Active sessions: `GET /auth/sessions`; revoke: `DELETE /auth/sessions/:sessionId` | Done – `authService.getSessions()`, `authService.revokeSession()` |

## 2. Academic Year

| Check | Status |
|-------|--------|
| On load: call `GET /academic-years/current`; if 404/none, show message | Done – `AcademicYearBanner` in admin layout when no current year |
| Academic year dropdown from `GET /academic-years` | Done – `useAcademicYear()` hook, used in ClassTeachers, Marks, Fees |
| Use selected year in: Results, Fees (structure/assign/payment/student), Class teacher | Done where applicable |

## 3. Exams & Results

| Check | Status |
|-------|--------|
| Create exam: `POST /results/exams` with optional `academicYear`, `examDate` | Done – `examService.create()`, Marks page uses academic year dropdown |
| Student results: `GET /results/results/student/:studentId?examId=...` or `?academicYear=...` | Done – `resultService.getByStudent(studentId, { examId?, academicYear? })` |

## 4. Fees

| Check | Status |
|-------|--------|
| Create structure: `POST /fees/structure`; optional `academicYear` | Done – `feeService.createStructure()` |
| Assign: `POST /fees/assign/:studentId`; optional `academicYear` | Done – `feeService.assign()` |
| Record payment: `POST /fees/payment/:studentId`; optional `academicYear` | Done – `feeService.recordPayment()` |
| Student fee details: `GET /fees/student/:studentId?academicYear=...` | Done – `feeService.getStudentDetails()`, student Fees page |

## 5. Teacher Assignments

| Check | Status |
|-------|--------|
| Subject–class–section: `POST/GET /teacher-assignments` | Done – `teacherAssignmentService` + endpoints |
| Class teacher: `POST /class-teacher/assign` with **required** `academicYear` | Done – ClassTeachers page, academic year dropdown |
| List: `GET /class-teacher?academicYear=&classId=` | Done – `classTeacherService.getAll({ academicYear?, classId? })` |
| My classes: `GET /class-teacher/my-classes` | Done – `classTeacherService.getMyClasses()` |
| Check: `GET /class-teacher/check/:classId/:sectionId` | Done – `classTeacherService.checkClassTeacher()` |
| Get by class: `GET /class-teacher/by-class/:classId/:sectionId` | Endpoint in `endpoints.ts` |
| Remove: `DELETE /class-teacher/:id` | Done – `classTeacherService.delete()` |

## 6. Reports

| Check | Status |
|-------|--------|
| Report card: `GET .../report-card/:studentId/:examId` (download), `.../view` (inline) | Done – `reportService.getReportCardPdf()`, `openReportCard()` |
| Bulk: `POST /reports/report-cards/bulk` body `{ classId, sectionId, examId }` | Done – `reportService.bulkReportCards()` |
| Attendance PDF: `GET /reports/attendance/:studentId?startDate=&endDate=` | Done – `reportService.getAttendanceReportPdf()`, `openAttendanceReport()` |

## 7. Audit Logs

| Check | Status |
|-------|--------|
| List: `GET /audit-logs` with query params | Done – `auditLogService.list()`, Admin → Audit Logs page |
| Stats: `GET /audit-logs/stats?startDate=&endDate=` | Done – `auditLogService.stats()` |
| User activity: `GET /audit-logs/user/:userId` | Done – `auditLogService.getUserActivity()` |

## Quick reference

- **API base**: `src/api/endpoints.ts` – `API_BASE_URL`, `API_ENDPOINTS`
- **Auth**: `src/services/authService.ts` – login, refresh, logout, sessions
- **Client**: `src/api/client.ts` – 401 refresh retry, `getAccessToken()`
- **Academic year**: `src/services/academicYearService.ts`, `src/hooks/useAcademicYear.ts`
- **Reports**: `src/services/reportService.ts`
- **Audit**: `src/services/auditLogService.ts`

API docs (Swagger): `GET /api-docs` on the API host.
