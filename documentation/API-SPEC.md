# REST API specification

The Quizeen CBT Server exposes a local REST API for synchronizing assessment definitions and collecting candidate submissions across an examination network.

Base URL: `http://localhost:3001/api`

---

## System health

### Check server status

```http
GET /health
```

Returns the operational status of the central server.

#### Response: 200 OK

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600
}
```

---

## Assessments

### List assessments

```http
GET /assessments
```

Alternate route: `GET /exams`

Returns all published assessments available on the server.

#### Query parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `educationLevel` | string | No | Filter by level: `primary`, `junior_secondary`, or `senior_secondary`. |
| `classGroup` | string | No | Filter by class group (for example, `SSS 2`, `Primary 5`). |
| `type` | string | No | Filter by assessment type: `test` or `exam`. |

#### Response: 200 OK

```json
[
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
    "isAvailable": true,
    "availableFrom": "2026-09-15T08:00",
    "availableTo": "2026-09-15T16:00",
    "questions": [
      {
        "id": "q_1",
        "prompt": "<p>Solve for x: 2x + 4 = 10</p>",
        "type": "multiple_choice",
        "options": ["x = 2", "x = 3", "x = 4", "x = 5"],
        "correctAnswer": "x = 3",
        "points": 10
      }
    ],
    "createdAt": "2026-09-13T04:00:00.000Z",
    "isPublished": true
  }
]
```

### Save assessment

```http
POST /assessments
```

Creates a new assessment or updates an existing assessment record on the server.

#### Request body

A complete Assessment JSON object matching the schema defined in the data models specification.

```json
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
  "isAvailable": true,
  "availableFrom": "2026-09-15T08:00",
  "availableTo": "2026-09-15T16:00",
  "questions": [
    {
      "id": "q_1",
      "prompt": "<p>Solve for x: 2x + 4 = 10</p>",
      "type": "multiple_choice",
      "options": ["x = 2", "x = 3", "x = 4", "x = 5"],
      "correctAnswer": "x = 3",
      "points": 10
    }
  ],
  "createdAt": "2026-09-13T04:00:00.000Z",
  "isPublished": true
}
```

#### Response: 201 Created

```json
{
  "success": true,
  "id": "exam_17892348912",
  "message": "Assessment saved successfully."
}
```

---

## Submissions

### List submissions

```http
GET /submissions
```

Retrieves completed student assessment records for grading and score compilation.

#### Query parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `examId` | string | No | Filter records by assessment identifier. |
| `classGroup` | string | No | Filter records by class name. |
| `educationLevel` | string | No | Filter by school section. |

#### Response: 200 OK

```json
[
  {
    "id": "sub_1789239999",
    "examId": "exam_17892348912",
    "examTitle": "Mathematics - SSS 2 (2024/2025)",
    "studentName": "Chimamanda Ngozi",
    "educationLevel": "senior_secondary",
    "classGroup": "SSS 2",
    "department": "science",
    "score": 30,
    "totalPoints": 40,
    "percentage": 75,
    "status": "graded",
    "timeSpentSeconds": 1140,
    "windowSwitchCount": 0,
    "submittedAt": "2026-09-13T05:20:00.000Z"
  }
]
```

### Submit assessment attempt

```http
POST /submissions
```

Records a candidate attempt at an assessment.

#### Request body

```json
{
  "examId": "exam_17892348912",
  "studentName": "Chimamanda Ngozi",
  "educationLevel": "senior_secondary",
  "classGroup": "SSS 2",
  "department": "science",
  "answers": {
    "q_1": {
      "questionId": "q_1",
      "selectedAnswer": "x = 3"
    }
  },
  "timeSpentSeconds": 1140,
  "windowSwitchCount": 0
}
```

#### Response: 201 Created

```json
{
  "id": "sub_1789239999",
  "examId": "exam_17892348912",
  "examTitle": "Mathematics - SSS 2 (2024/2025)",
  "studentName": "Chimamanda Ngozi",
  "score": 30,
  "totalPoints": 40,
  "percentage": 75,
  "status": "graded",
  "submittedAt": "2026-09-13T05:20:00.000Z"
}
```

---

## Students

### List students

```http
GET /students
```

Returns all registered candidate student profiles.

#### Response: 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "stu_1789290000000_a1b2",
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

### Lookup student by login code

```http
GET /students/code/:code
```

Finds a student profile matching the provided 6-character case-insensitive login code.

#### Response: 200 OK

```json
{
  "success": true,
  "data": {
    "id": "stu_1789290000000_a1b2",
    "code": "K8P2X4",
    "name": "Ibrahim Chukwuemeka",
    "educationLevel": "senior_secondary",
    "classGroup": "SSS 2",
    "department": "science",
    "createdAt": "2026-09-13T07:50:00.000Z"
  }
}
```

### Create or update student

```http
POST /students
```

#### Request body

```json
{
  "name": "Ibrahim Chukwuemeka",
  "educationLevel": "senior_secondary",
  "classGroup": "SSS 2",
  "department": "science"
}
```

#### Response: 201 Created

```json
{
  "success": true,
  "data": {
    "id": "stu_1789290000000_a1b2",
    "name": "Ibrahim Chukwuemeka",
    "educationLevel": "senior_secondary",
    "classGroup": "SSS 2",
    "department": "science",
    "createdAt": "2026-09-13T07:50:00.000Z"
  }
}
```

### Generate student login code

```http
POST /students/:id/generate-code
```

Generates a fresh unique 6-character alphanumeric login code for the specified student.

#### Response: 200 OK

```json
{
  "success": true,
  "data": {
    "id": "stu_1789290000000_a1b2",
    "code": "K8P2X4",
    "name": "Ibrahim Chukwuemeka",
    "educationLevel": "senior_secondary",
    "classGroup": "SSS 2",
    "department": "science"
  }
}
```

### Generate codes for class or all students

```http
POST /students/generate-all
```

#### Request body

```json
{
  "classGroup": "SSS 2"
}
```

#### Response: 200 OK

```json
{
  "success": true,
  "data": []
}
```

### Delete student

```http
DELETE /students/:id
```

#### Response: 200 OK

```json
{
  "success": true
}
```

