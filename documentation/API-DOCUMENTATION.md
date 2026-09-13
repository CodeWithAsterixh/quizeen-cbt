# Queez CBT System API Documentation

This document provides a complete inventory of all network requests called by the client applications, all routes implemented by the central server, and a diagnostic guide resolving 404 errors.

---

## 1. System Overview

- Default Server Base URL: `http://localhost:4000`
- API Root Prefix: `/api`
- Health Endpoint: `/health`
- Client Calling Modules:
  - `serverConfig` (`packages/shared/src/api/server-config.ts`)
  - `apiClient` (`packages/shared/src/api/api-client.ts`)
  - `studentApi` (`packages/shared/src/api/student-api.ts`)

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

## 4. Detailed Endpoint Specifications

### Health & Connectivity

#### `GET /health`
- **Purpose**: Verifies that the CBT backend server is running and reachable over the local network.
- **Client Method**: `apiClient.testConnection()`
- **Success Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "service": "cbt-server",
    "timestamp": "2026-09-13T20:00:00.000Z"
  }
  ```

---

### Assessments

#### `GET /api/assessments`
- **Purpose**: Lists all assessments.
- **Client Method**: `apiClient.getAssessments(filters)`
- **Query Parameters**:
  - `level` (optional): Filter by education level (`primary`, `junior_secondary`, `senior_secondary`).
  - `targetClass` (optional): Filter by class name (e.g. `SSS 2`).
  - `department` (optional): Filter by department stream (e.g. `science`).
  - `assessmentType` (optional): Filter by type (`test` or `exam`).
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
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

#### `POST /api/assessments`
- **Purpose**: Creates an assessment record.
- **Client Method**: `apiClient.createAssessment(data)`
- **Request Body**: JSON object containing assessment fields and question array.
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": { "id": "exam_17892348912", "title": "Mathematics - SSS 2" }
  }
  ```

#### `PUT /api/assessments/:id`
- **Purpose**: Updates an assessment. Operates as an idempotent upsert. If the assessment ID does not exist on the server, it creates it automatically.
- **Client Method**: `apiClient.updateAssessment(id, updates)`
- **Request Body**: Partial or complete Assessment object.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "id": "exam_17892348912", "title": "Mathematics - SSS 2 Updated" }
  }
  ```

#### `DELETE /api/assessments/:id`
- **Purpose**: Removes an assessment by ID.
- **Client Method**: `apiClient.deleteAssessment(id)`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Assessment deleted successfully"
  }
  ```

---

### Students

#### `GET /api/students`
- **Purpose**: Retrieves all registered student profiles.
- **Client Method**: `apiClient.getStudents()`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
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
- **Purpose**: Looks up a candidate by their 6-character alphanumeric OTP login code. Not case sensitive.
- **Client Method**: `apiClient.getStudentByCode(code)`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "stu_1789290000_a1b2",
      "code": "K8P2X4",
      "name": "Ibrahim Chukwuemeka",
      "educationLevel": "senior_secondary",
      "classGroup": "SSS 2"
    }
  }
  ```
- **When Code Is Not Found (404 Not Found)**:
  ```json
  {
    "success": false,
    "message": "Student not found with this code."
  }
  ```

#### `POST /api/students`
- **Purpose**: Registers a new student or updates an existing student profile.
- **Client Method**: `apiClient.saveStudent(data)`
- **Request Body**:
  ```json
  {
    "name": "Ibrahim Chukwuemeka",
    "educationLevel": "senior_secondary",
    "classGroup": "SSS 2",
    "department": "science"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "stu_1789290000_a1b2",
      "name": "Ibrahim Chukwuemeka",
      "classGroup": "SSS 2"
    }
  }
  ```

#### `POST /api/students/:id/generate-code`
- **Purpose**: Generates a fresh unique 6-character OTP login code for a single student.
- **Client Method**: `apiClient.generateStudentCode(id, fallbackStudent)`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "stu_1789290000_a1b2",
      "code": "K8P2X4",
      "name": "Ibrahim Chukwuemeka"
    }
  }
  ```

#### `POST /api/students/generate-all`
- **Purpose**: Generates unique 6-character OTP login codes in bulk for a list of student IDs or for all students in a class.
- **Client Method**: `apiClient.generateAllStudentCodes(classGroup, studentIds)`
- **Request Body**:
  ```json
  {
    "classGroup": "SSS 2",
    "studentIds": ["stu_1", "stu_2"]
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      { "id": "stu_1", "code": "H4N9P2" },
      { "id": "stu_2", "code": "R7K3M8" }
    ]
  }
  ```

#### `DELETE /api/students/:id`
- **Purpose**: Deletes a student registration record.
- **Client Method**: `apiClient.deleteStudent(id)`
- **Success Response (200 OK)**:
  ```json
  { "success": true }
  ```

---

### Submissions & Grading

#### `POST /api/submissions`
- **Purpose**: Submits completed exam responses for automatic scoring.
- **Client Method**: `apiClient.submitAnswers(payload)`
- **Request Body**:
  ```json
  {
    "studentName": "Ibrahim Chukwuemeka",
    "examId": "exam_17892348912",
    "classGroup": "SSS 2",
    "department": "science",
    "answers": { "q_1": "Option B" },
    "infractionCount": 0,
    "totalElapsedSeconds": 1200
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Your exams have been sent for grading.",
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

#### `GET /api/submissions`
- **Purpose**: Lists submissions. Supports optional `?examId=<ID>` query filter.
- **Client Method**: `apiClient.getSubmissions(examId)`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": []
  }
  ```

#### `PUT /api/submissions/:id/grade`
- **Purpose**: Teacher manual grading review.
- **Client Method**: `apiClient.gradeSubmission(id, answers)`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "id": "sub_1789239999", "status": "graded" }
  }
  ```

---

### Encrypted Package Bundles

#### `POST /api/packages/compile`
- **Purpose**: Bundles assessment files and exam schedules into an encrypted zip file.
- **Client Method**: `apiClient.compilePackage(payload)`
- **Success Response (200 OK)**: Binary zip stream (`application/zip`).

#### `POST /api/packages/unpack`
- **Purpose**: Unpacks and imports assessments from base64 encoded package content.
- **Client Method**: `apiClient.unpackPackage(zipBase64)`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "importedCount": 3, "packageId": "pkg_17892" }
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
