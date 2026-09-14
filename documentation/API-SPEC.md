# REST API Specification

The Quizeen CBT Server exposes a local REST API for managing assessment definitions, validating candidate access codes, collecting exam submissions, and reporting live session integrity metrics across a local school network.

- **Default Base URL**: `http://localhost:4000/api`
- **Fallback Base URLs**: `http://localhost:4050/api`, `http://localhost:4100/api`, `http://localhost:4500/api`, `http://localhost:5000/api`
- **Root Health URL**: `http://localhost:4000/health`
- **Content Type**: `application/json`

---

## 1. Global Request and Response Conventions

### 1.1. Response Headers
All API responses include strict caching headers to prevent stale assessment content or cached exam answers:
```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```

### 1.2. Idempotency Support
All mutating endpoints (`POST`, `PUT`, `DELETE`) pass through the server idempotency middleware (`apps/server/src/core/middleware/idempotency.ts`):
- Clients may include an optional `Idempotency-Key` header with a unique request UUID.
- If no header is provided, the server calculates a SHA-256 hash of the request method, path, and request body.
- If an identical mutating request is submitted within 10 seconds (for example, due to a network retry), the server returns the cached response without creating duplicate database entries.

### 1.3. Standard Success Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### 1.4. Standard Error Envelope
```json
{
  "success": false,
  "statusCode": 404,
  "message": "The requested resource was not found."
}
```

---

## 2. System Health and Diagnostic Endpoints

### 2.1. Check Server Health
Probes server operational status and confirms whether the service running on this port is an authentic Quizeen CBT Server.

```http
GET /health
```

#### Request Headers
None required.

#### Response: 200 OK
```json
{
  "status": "ok",
  "service": "cbt-server",
  "timestamp": "2026-09-14T15:30:00.000Z"
}
```

#### Client Calling Method
`apiClient.testConnection()` in `packages/shared/src/api/api-client.ts`.

---

## 3. Assessment Endpoints

Assessments represent complete examination or test papers containing metadata, scheduling parameters, display preferences, and an array of questions.

### 3.1. List Assessments
Retrieves all assessments saved on the central server.

```http
GET /api/assessments
```

*Alias Route*: `GET /api/exams`

#### Query Parameters
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `educationLevel` | string | No | Filter by level: `primary`, `junior_secondary`, or `senior_secondary`. |
| `classGroup` | string | No | Filter by class (for example, `SSS 2`, `Primary 5`). |
| `type` | string | No | Filter by type: `test` or `exam`. |
| `published` | boolean | No | When `true`, returns only published papers. |

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
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
      "shuffleQuestions": true,
      "shuffleOptions": true,
      "isAvailable": true,
      "availableFrom": "2026-09-15T08:00",
      "availableTo": "2026-09-15T16:00",
      "unlockPin": "1234",
      "questions": [
        {
          "id": "q_1",
          "prompt": "<p>Solve for x: 2x + 4 = 10</p>",
          "type": "multiple_choice",
          "options": ["x = 2", "x = 3", "x = 4", "x = 5"],
          "correctAnswer": "x = 3",
          "points": 10,
          "explanation": "Subtract 4 from both sides to get 2x = 6, then divide by 2."
        }
      ],
      "createdAt": "2026-09-13T04:00:00.000Z",
      "isPublished": true
    }
  ]
}
```

### 3.2. Get Assessment by ID
Retrieves a single assessment by its unique identifier.

```http
GET /api/assessments/:id
```

*Alias Route*: `GET /api/exams/:id`

#### URL Parameters
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id` | string | Yes | Unique assessment identifier (for example, `exam_17892348912`). |

#### Response: 200 OK
Returns the complete assessment object.

#### Response: 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Assessment not found."
}
```

### 3.3. Create Assessment
Creates a new assessment record on the server.

```http
POST /api/assessments
```

*Alias Route*: `POST /api/exams`

#### Request Body
A complete Assessment JSON object. If `id` is omitted, the server generates a unique identifier automatically.

```json
{
  "id": "exam_17892348912",
  "title": "Physics - SSS 2 Second Term",
  "subject": "Physics",
  "session": "2024/2025",
  "assessmentType": "exam",
  "educationLevel": "senior_secondary",
  "targetClasses": ["SSS 2"],
  "department": "science",
  "durationMinutes": 45,
  "passingScore": 60,
  "totalPoints": 50,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "isAvailable": true,
  "availableFrom": "2026-09-15T09:00",
  "availableTo": "2026-09-15T12:00",
  "questions": [
    {
      "id": "q_physics_1",
      "prompt": "<p>What is the SI unit of force?</p>",
      "type": "multiple_choice",
      "options": ["Joule", "Newton", "Watt", "Pascal"],
      "correctAnswer": "Newton",
      "points": 5
    }
  ],
  "createdAt": "2026-09-14T10:00:00.000Z",
  "isPublished": true
}
```

#### Response: 201 Created
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Assessment created successfully.",
  "data": {
    "id": "exam_17892348912"
  }
}
```

### 3.4. Update Assessment
Updates an existing assessment on the server.

```http
PUT /api/assessments/:id
```

*Alias Route*: `PUT /api/exams/:id`

#### Request Body
Partial or complete Assessment object with updated properties.

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Assessment updated successfully."
}
```

### 3.5. Delete Assessment
Permanently deletes an assessment and removes its storage file (`data/assessments/[id].json`).

```http
DELETE /api/assessments/:id
```

*Alias Route*: `DELETE /api/exams/:id`

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Assessment deleted successfully."
}
```

### 3.6. Verify Assessment Unlock PIN
Validates the unlock PIN required to open a protected examination on a student station.

```http
POST /api/assessments/:id/verify-pin
```

*Alias Route*: `POST /api/exams/:id/verify-pin`

#### Request Body
```json
{
  "pin": "1234"
}
```

#### Response: 200 OK (Valid PIN)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "PIN verified successfully.",
  "valid": true
}
```

#### Response: 401 Unauthorized (Invalid PIN)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Incorrect unlock PIN. Please contact your invigilator.",
  "valid": false
}
```

---

## 4. Student Management Endpoints

The student service maintains registered candidate accounts and handles 6-character access codes used for login.

### 4.1. List Students
Retrieves all registered students across all classes and levels.

```http
GET /api/students
```

#### Query Parameters
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `educationLevel` | string | No | Filter by level: `primary`, `junior_secondary`, `senior_secondary`. |
| `classGroup` | string | No | Filter by class: `SSS 1`, `JSS 2`, etc. |
| `department` | string | No | Filter by stream: `science`, `arts`, `commercial`. |

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "std_1001",
      "code": "K7M9P2",
      "name": "David Adeleke",
      "educationLevel": "senior_secondary",
      "classGroup": "SSS 2A",
      "department": "science",
      "createdAt": "2026-09-13T08:00:00.000Z"
    }
  ]
}
```

### 4.2. Get Student by Access Code
Looks up a candidate account using their 6-character alphanumeric student code. Called during student login.

```http
GET /api/students/code/:code
```

#### URL Parameters
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `code` | string | Yes | 6-character alphanumeric code (for example, `K7M9P2`). Case-insensitive. |

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "std_1001",
    "code": "K7M9P2",
    "name": "David Adeleke",
    "educationLevel": "senior_secondary",
    "classGroup": "SSS 2A",
    "department": "science"
  }
}
```

#### Response: 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Student code not found. Please verify with your proctor."
}
```

### 4.3. Save Student
Creates a new student candidate or updates an existing record.

```http
POST /api/students
```

#### Request Body
```json
{
  "id": "std_1001",
  "code": "K7M9P2",
  "name": "David Adeleke",
  "educationLevel": "senior_secondary",
  "classGroup": "SSS 2A",
  "department": "science"
}
```

#### Response: 201 Created
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Student saved successfully.",
  "data": {
    "id": "std_1001",
    "code": "K7M9P2"
  }
}
```

### 4.4. Generate Access Code for Student
Generates a new unique 6-character access code for an individual candidate.

```http
POST /api/students/:id/generate-code
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student code generated.",
  "code": "R4W8T1"
}
```

### 4.5. Generate Access Codes for All Students
Generates unique 6-character access codes in batch for all candidates currently lacking a code.

```http
POST /api/students/generate-all
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Generated codes for 45 students.",
  "count": 45
}
```

### 4.6. Delete Student
Removes a student account from the system.

```http
DELETE /api/students/:id
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student deleted successfully."
}
```

---

## 5. Submissions and Scoring Endpoints

Submissions record completed candidate test attempts, scoring details, and anti-cheat tracking metrics.

### 5.1. List Submissions
Retrieves test submissions for review and score compilation.

```http
GET /api/submissions
```

#### Query Parameters
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `examId` | string | No | Filter submissions by assessment identifier. |
| `classGroup` | string | No | Filter by class group. |
| `status` | string | No | Filter by status: `in_progress`, `awaiting_result`, or `graded`. |

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "sub_1789345678",
      "examId": "exam_17892348912",
      "examTitle": "Mathematics - SSS 2 (2024/2025)",
      "studentName": "David Adeleke",
      "educationLevel": "senior_secondary",
      "classGroup": "SSS 2A",
      "department": "science",
      "answers": {
        "q_1": {
          "questionId": "q_1",
          "selectedAnswer": "x = 3",
          "awardedPoints": 10
        }
      },
      "score": 40,
      "totalPoints": 40,
      "percentage": 100,
      "status": "graded",
      "timeSpentSeconds": 1420,
      "infractionCount": 0,
      "submittedAt": "2026-09-14T11:25:00.000Z"
    }
  ]
}
```

### 5.2. Submit Completed Assessment
Called by the student exam runner upon finishing a test or when time runs out. The server scores objective questions automatically and saves the record to disk.

```http
POST /api/submissions
```

#### Request Body
```json
{
  "id": "sub_1789345678",
  "examId": "exam_17892348912",
  "examTitle": "Mathematics - SSS 2 (2024/2025)",
  "studentName": "David Adeleke",
  "educationLevel": "senior_secondary",
  "classGroup": "SSS 2A",
  "department": "science",
  "answers": {
    "q_1": {
      "questionId": "q_1",
      "selectedAnswer": "x = 3"
    }
  },
  "timeSpentSeconds": 1420,
  "infractionCount": 0,
  "submittedAt": "2026-09-14T11:25:00.000Z"
}
```

#### Response: 201 Created
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Submission recorded successfully.",
  "data": {
    "id": "sub_1789345678",
    "score": 40,
    "totalPoints": 40,
    "percentage": 100,
    "status": "graded"
  }
}
```

### 5.3. Report Live Session Heartbeat
Called by the student kiosk when an assessment begins and whenever the window loses focus. Allows proctors to monitor active examinees and observe application switching violations in real time.

```http
POST /api/submissions/live
```

#### Request Body
```json
{
  "examId": "exam_17892348912",
  "examTitle": "Mathematics - SSS 2 (2024/2025)",
  "studentName": "David Adeleke",
  "classGroup": "SSS 2A",
  "infractionCount": 2,
  "timestamp": "2026-09-14T11:10:15.000Z"
}
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Live session updated."
}
```

### 5.4. Grade or Update Submission
Used by teachers in the Manager application to mark theory or essay questions, add remarks, or adjust scores.

```http
PUT /api/submissions/:id/grade
```

#### Request Body
```json
{
  "score": 38,
  "status": "graded",
  "answers": {
    "q_essay_1": {
      "questionId": "q_essay_1",
      "selectedAnswer": "Photosynthesis is the process...",
      "awardedPoints": 8,
      "teacherRemarks": "Good explanation of light reaction."
    }
  }
}
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Submission graded successfully."
}
```

---

## 6. Offline Package Endpoints

Package endpoints support compiling and extracting `.qzn` archive files on the server.

### 6.1. Compile Assessment Package
Compiles an assessment into a `.qzn` zip archive on the server.

```http
POST /api/packages/compile
```

#### Request Body
```json
{
  "assessmentId": "exam_17892348912"
}
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "filename": "Mathematics_SSS_2.qzn",
    "packageSize": 45210,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

### 6.2. Unpack Assessment Package
Unpacks an uploaded `.qzn` file and saves the extracted assessment directly into the server database.

```http
POST /api/packages/unpack
```

#### Request Body
```json
{
  "packageData": "base64_encoded_zip_data"
}
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Package unpacked and assessment saved.",
  "data": {
    "assessmentId": "exam_17892348912",
    "title": "Mathematics - SSS 2 (2024/2025)"
  }
}
```

---

## 7. Analytics and System Administration Endpoints

### 7.1. Get System Overview Statistics
Provides system totals for assessments, registered students, and completed submissions.

```http
GET /api/analytics/overview
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "assessmentCount": 12,
    "studentCount": 350,
    "submissionCount": 840,
    "activeSessions": 42
  }
}
```

### 7.2. Reset Storage
Wipes stored assessments, students, and submissions, restoring the database to a clean initial state. Intended for test environments and new academic terms.

```http
POST /api/analytics/reset
```

#### Response: 200 OK
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Database storage reset to clean initial state."
}
```
