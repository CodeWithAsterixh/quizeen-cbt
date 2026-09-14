# Queez CBT System API Documentation

This document provides a complete inventory of all network requests called by the client applications, all routes implemented by the central server, and a diagnostic guide resolving 404 errors.

---

## 1. System Overview

- Default Server Base URL: `http://localhost:4000`
- Automatic Fallback Ports: `4050`, `4100`, `4200`, `4500`, `5000`, `5050`, `8080` (used when port 4000 is occupied or restricted by Windows)
- UDP Discovery Beacon Port: `4001` (broadcasts server network coordinates to LAN clients every 2 seconds)
- API Root Prefix: `/api`
- Health Endpoint: `/health`
- Client Calling Modules:
  - `serverConfig` (`packages/shared/src/api/server-config.ts`)
  - `apiClient` (`packages/shared/src/api/api-client.ts`)
  - `studentApi` (`packages/shared/src/api/student-api.ts`)
  - `packageApi` (`packages/shared/src/api/package-api.ts`)

---

## 2. Client Calls vs Server Routes Matrix

| Client Method | HTTP Method | Client Endpoint | Implemented Server Route | Match Status |
| ------------- | ----------- | --------------- | ------------------------ | ------------ |
| `testConnection` | GET | `/health` | `GET /health` | Active Match |
| `getAssessments` | GET | `/api/assessments` | `GET /api/assessments` | Active Match |
| `createAssessment` | POST | `/api/assessments` | `POST /api/assessments` | Active Match |
| `updateAssessment` | PUT | `/api/assessments/:id` | `PUT /api/assessments/:id` | Active Match |
| `deleteAssessment` | DELETE | `/api/assessments/:id` | `DELETE /api/assessments/:id` | Active Match |
| `submitAnswers` | POST | `/api/submissions` | `POST /api/submissions` | Active Match |
| `reportLiveSession` | POST | `/api/submissions/live` | `POST /api/submissions/live` | Active Match |
| `getSubmissions` | GET | `/api/submissions` | `GET /api/submissions` | Active Match |
| `gradeSubmission` | PUT | `/api/submissions/:id/grade` | `PUT /api/submissions/:id/grade` | Active Match |
| `compilePackage` | POST | `/api/packages/compile` | `POST /api/packages/compile` | Active Match |
| `unpackPackage` | POST | `/api/packages/unpack` | `POST /api/packages/unpack` | Active Match |
| `getStudents` | GET | `/api/students` | `GET /api/students` | Active Match |
| `getStudentByCode` | GET | `/api/students/code/:code` | `GET /api/students/code/:code` | Active Match |
| `saveStudent` | POST | `/api/students` | `POST /api/students` | Active Match |
| `generateStudentCode` | POST | `/api/students/:id/generate-code` | `POST /api/students/:id/generate-code` | Active Match |
| `generateAllStudentCodes` | POST | `/api/students/generate-all` | `POST /api/students/generate-all` | Active Match |
| `deleteStudent` | DELETE | `/api/students/:id` | `DELETE /api/students/:id` | Active Match |

---

## 3. Server Routes Not Directly Called by Frontend

The server also implements the following additional endpoints for internal management, aliases, and direct inspection:

| HTTP Method | Server Route | Purpose |
| ----------- | ------------ | ------- |
| GET | `/api/assessments/:id` | Direct single-assessment lookup by ID |
| POST | `/api/assessments/:id/verify-pin` | Verify unlock PIN for an assessment |
| GET | `/api/exams` | Alias route for `/api/assessments` |
| GET | `/api/exams/:id` | Alias route for `/api/assessments/:id` |
| POST | `/api/exams` | Alias route for `POST /api/assessments` |
| PUT | `/api/exams/:id` | Alias route for `PUT /api/assessments/:id` |
| DELETE | `/api/exams/:id` | Alias route for `DELETE /api/assessments/:id` |
| POST | `/api/exams/:id/verify-pin` | Alias route for PIN verification |
| GET | `/api/submissions/:id` | Direct single-submission lookup |
| GET | `/api/analytics/overview` | Assessment counts and system statistics |
| POST | `/api/analytics/reset` | Resets database to initial seed state |

---

## 4. Response Format & Detailed Endpoint Specifications

Every API response follows a consistent structure with an HTTP status code, a status flag, and a clear message written in plain language.

### Standard Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Assessments loaded.",
  "data": [...]
}
```

### Standard Error Response
```json
{
  "success": false,
  "statusCode": 404,
  "message": "This student code was not recognized. Please check with your teacher."
}
```

---

### Health & Connectivity

#### `GET /health`
- Purpose: Checks that the CBT server is running and reachable on the local network.
- Client Method: `apiClient.testConnection()`
- Success Response (200 OK):
  ```json
  {
    "status": "ok",
    "service": "cbt-server",
    "timestamp": "2026-09-14T04:00:00.000Z"
  }
  ```

---

### Assessments

#### `GET /api/assessments`
- Purpose: Lists all assessments matching optional filter parameters.
- Client Method: `apiClient.getAssessments(filters)`
- Query Parameters:
  - `level` (optional): Filter by education level (`primary`, `junior_secondary`, `senior_secondary`).
  - `targetClass` (optional): Filter by class name (such as `SSS 2`).
  - `department` (optional): Filter by department stream (`science`, `commercial`, `art`, `general`).
  - `assessmentType` (optional): Filter by assessment type (`test` or `exam`).
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Assessments loaded.",
    "data": [
      {
        "id": "exam_17892348912",
        "title": "Mathematics - SSS 2 (2024/2025)",
        "subject": "Mathematics",
        "session": "2024/2025",
        "assessmentType": "test",
        "educationLevel": "senior_secondary",
        "targetClasses": ["SSS 2"],
        "department": "science",
        "durationMinutes": 30,
        "passingScore": 50,
        "totalPoints": 40,
        "questions": [],
        "isAvailable": true,
        "createdAt": "2026-09-13T04:00:00.000Z"
      }
    ]
  }
  ```
- Empty Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "No assessments match criteria.",
    "data": []
  }
  ```

#### `GET /api/assessments/:id`
- Purpose: Looks up a single assessment by its ID.
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Assessment details loaded.",
    "data": { "id": "exam_17892348912", "title": "Mathematics - SSS 2" }
  }
  ```
- Failure Response (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "This assessment was not found. It may have been deleted."
  }
  ```

#### `POST /api/assessments`
- Purpose: Creates a new assessment.
- Client Method: `apiClient.createAssessment(data)`
- Success Response (201 Created):
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "New assessment saved and ready for students.",
    "data": { "id": "exam_17892348912", "title": "Mathematics - SSS 2" }
  }
  ```
- Validation Error (400 Bad Request):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Please provide a subject title."
  }
  ```

#### `PUT /api/assessments/:id`
- Purpose: Saves changes to an existing assessment. If the assessment does not exist on the server, it creates it automatically.
- Client Method: `apiClient.updateAssessment(id, updates)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Assessment updates saved successfully.",
    "data": { "id": "exam_17892348912", "title": "Mathematics - SSS 2 Updated" }
  }
  ```

#### `DELETE /api/assessments/:id`
- Purpose: Deletes an assessment by ID.
- Client Method: `apiClient.deleteAssessment(id)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Assessment was removed successfully."
  }
  ```
- Failure Response (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Assessment was already removed or does not exist."
  }
  ```

#### `POST /api/assessments/:id/verify-pin`
- Purpose: Verifies whether an entered unlock PIN matches the assessment PIN.
- Client Method: `apiClient.verifyPin(id, pin)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Access PIN verified. You can start the assessment.",
    "data": { "valid": true }
  }
  ```
- Wrong PIN Response (403 Forbidden):
  ```json
  {
    "success": false,
    "statusCode": 403,
    "message": "Incorrect PIN. Please check the code with your teacher.",
    "data": { "valid": false }
  }
  ```
- Missing Assessment (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Assessment not found.",
    "data": { "valid": false }
  }
  ```

---

### Students

#### `GET /api/students`
- Purpose: Retrieves all registered student profiles.
- Client Method: `apiClient.getStudents()`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Student list loaded successfully.",
    "data": [
      {
        "id": "stu_1789290000_a1b2",
        "code": "K8P2X4",
        "name": "Ibrahim Chukwuemeka",
        "educationLevel": "senior_secondary",
        "classGroup": "SSS 2",
        "department": "science",
        "createdAt": "2026-09-13T07:50:00.000Z"
      }
    ]
  }
  ```

#### `GET /api/students/code/:code`
- Purpose: Verifies a candidate by their 6-character access code.
- Client Method: `studentApi.lookupStudentByCode(code)` or `apiClient.getStudentByCode(code)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Student ID verified successfully.",
    "data": {
      "id": "stu_1789290000_a1b2",
      "code": "K8P2X4",
      "name": "Ibrahim Chukwuemeka",
      "educationLevel": "senior_secondary",
      "classGroup": "SSS 2"
    }
  }
  ```
- Invalid Code Response (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "This student code was not recognized. Please check with your teacher."
  }
  ```

#### `POST /api/students`
- Purpose: Registers a new student or updates an existing student profile.
- Client Method: `apiClient.saveStudent(data)`
- Success Response (201 Created):
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Student registered successfully.",
    "data": {
      "id": "stu_1789290000_a1b2",
      "name": "Ibrahim Chukwuemeka",
      "classGroup": "SSS 2"
    }
  }
  ```
- Validation Error (400 Bad Request):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Please enter the student full name, school level, and class group."
  }
  ```

#### `POST /api/students/:id/generate-code`
- Purpose: Generates a new 6-character access code for a student.
- Client Method: `apiClient.generateStudentCode(id, fallbackStudent)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "New student access code generated.",
    "data": {
      "id": "stu_1789290000_a1b2",
      "code": "K8P2X4",
      "name": "Ibrahim Chukwuemeka"
    }
  }
  ```
- Missing Profile (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Student profile was not found to generate code."
  }
  ```

#### `POST /api/students/generate-all`
- Purpose: Generates access codes for students in bulk.
- Client Method: `apiClient.generateAllStudentCodes(classGroup, studentIds)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Access codes generated for all selected students.",
    "data": [
      { "id": "stu_1", "code": "H4N9P2" },
      { "id": "stu_2", "code": "R7K3M8" }
    ]
  }
  ```

#### `DELETE /api/students/:id`
- Purpose: Deletes a student registration record.
- Client Method: `apiClient.deleteStudent(id)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Student record removed."
  }
  ```
- Failure Response (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Student was already removed or does not exist."
  }
  ```

---

### Submissions & Grading

#### `POST /api/submissions`
- Purpose: Submits student responses for scoring and recording.
- Client Method: `apiClient.submitAnswers(payload)`
- Success Response (201 Created):
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Your assessment has been submitted and recorded.",
    "data": {
      "id": "sub_1789239999",
      "examId": "exam_17892348912",
      "studentName": "Ibrahim Chukwuemeka",
      "score": 30,
      "totalPoints": 40,
      "percentage": 75,
      "status": "graded"
    }
  }
  ```
- Missing Data Error (400 Bad Request):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Missing student name or assessment reference for submission."
  }
  ```

#### `GET /api/submissions`
- Purpose: Lists submissions. Supports optional `?examId=<ID>` query filter.
- Client Method: `apiClient.getSubmissions(examId)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Submissions loaded successfully.",
    "data": []
  }
  ```

#### `GET /api/submissions/:id`
- Purpose: Loads details for a specific submission.
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Submission details loaded.",
    "data": { "id": "sub_1789239999" }
  }
  ```
- Not Found Response (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Submission record not found."
  }
  ```

#### `PUT /api/submissions/:id/grade`
- Purpose: Updates grades or teacher review notes on a submission.
- Client Method: `apiClient.gradeSubmission(id, answers)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Grades and review updated successfully.",
    "data": { "id": "sub_1789239999", "status": "graded" }
  }
  ```
- Failure Response (404 Not Found):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Could not find this submission to update grades."
  }
  ```

---

### Encrypted Package Bundles

#### `POST /api/packages/compile`
- Purpose: Bundles assessment files and exam schedules into an encrypted zip file.
- Client Method: `apiClient.compilePackage(payload)`
- Success Response (200 OK): Binary zip stream (`application/zip`) with header `X-Status-Message: Offline package created successfully.`.
- Error Response (400 Bad Request):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Please select at least one assessment to package."
  }
  ```

#### `POST /api/packages/unpack`
- Purpose: Unpacks and imports assessments from base64 encoded package content.
- Client Method: `apiClient.unpackPackage(zipBase64)`
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Unpacked 3 assessment(s) successfully.",
    "data": { "importedCount": 3, "packageId": "pkg_17892" }
  }
  ```
- Error Response (400 Bad Request):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Please provide an offline package file to unpack."
  }
  ```

---

### System Analytics

#### `GET /api/analytics/overview`
- Purpose: Returns counts of assessments, students, and submissions.
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "System summary metrics loaded.",
    "data": { "totalAssessments": 12, "totalStudents": 45, "totalSubmissions": 30 }
  }
  ```

#### `POST /api/analytics/reset`
- Purpose: Resets the database to default seed data for test environments.
- Success Response (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Database reset to initial sample data."
  }
  ```

---

## 5. Diagnostic Root Causes of 404 Errors & Resolutions

### 1. Assessment ID Replacement on Save
- **Problem**: When creating a new assessment, the client generated an ID such as `exam_12345`. The server's `createAssessment` method was ignoring the incoming ID and generating a new ID such as `assessment_67890`. Later, when the client updated that exam (`PUT /api/assessments/exam_12345`), the server could not find `exam_12345` and returned HTTP 404.
- **Resolution**: Updated `createAssessment` in `apps/server/src/features/assessments/assessment.service.ts` to preserve client-provided IDs. Updated `updateAssessment` to perform an upsert: if the ID does not yet exist on the server, it creates and saves it instead of returning null.

### 2. Clearing Seed Data with Residual Client Storage
- **Problem**: When seed data was cleared, the server began with an empty database. However, the manager app stored previous assessments and students in browser LocalStore. When saving an exam or student that existed only in the browser, the server returned 404.
- **Resolution**: All update routes now support upsert. If an item exists in local state but not on the server, saving it writes the record to the server rather than rejecting with 404.

### 3. Student Code Lookup (`GET /api/students/code/:code`)
- **Problem**: When a student enters an unregistered code, mistypes a character, or searches before the teacher generates a code, the server returned HTTP 404. In the live server log table, every 404 was flagged in red as an error.
- **Resolution**: Confirmed that the student app handles 404 responses cleanly by returning null and presenting a friendly verification prompt to the student.

### 4. Single Code Generation for Offline Students
- **Problem**: Calling `POST /api/students/:id/generate-code` for a student created while the server was disconnected failed with 404 because the student was not in the server database.
- **Resolution**: Updated `generateCode` to accept a fallback student payload from the request body. If the student ID is not found on the server, the server automatically registers the student first and generates their code.

---

## 6. How to Run the Route Audit Script

You can verify all client and server endpoints at any time by running:

```bash
npm run api:audit
```

---

## 7. Idempotency Support for Mutating Requests

All requests that create, update, or delete data (`POST`, `PUT`, `PATCH`, `DELETE`) are guarded against duplicate execution through idempotency.

### How Idempotency Works

1. **Client Header**: The client sends an `idempotency-key` HTTP header with a unique request token (e.g. `idem_sub_JohnDoe_assessment1`).
2. **Automatic Signature Fallback**: If an external client or custom script omits the `idempotency-key` header, the server automatically computes a SHA-256 hash from the HTTP method, endpoint URL, and JSON request body.
3. **In-Flight Deduplication**: If multiple identical requests arrive simultaneously, subsequent requests wait for the first request to complete.
4. **Cached Response Replay**: When a duplicate request arrives after completion, the server does not execute the database mutation a second time. It returns the original status code and response body with the following response headers:
   - `Idempotency-Key: <key>`
   - `Idempotent-Replayed: true`
5. **Cache Retention**: Completed idempotency entries are cached in memory for 15 minutes and expired automatically.

---

## 8. Timezone and Local Timestamp Standard

All server timestamps, request logs, and record creation dates use location-aware timestamps with timezone offset:

- **Format**: `YYYY-MM-DDTHH:mm:ss.sss+HH:MM` (e.g. `2026-09-14T06:53:19.852+01:00`).
- **Utility**: Implemented via `getLocalIsoTimestamp()` in `@cbt/shared` (`packages/shared/src/utils/date-utils.ts`).
- **Server Request Log**: Request entries in the server UI and exported JSON log files show the actual local time of the host machine rather than zero-offset UTC.
- **Heartbeat Filtering**: Internal `/health` pings from client pollers are excluded from the live request log table to keep the logs focused on real exam activity.

