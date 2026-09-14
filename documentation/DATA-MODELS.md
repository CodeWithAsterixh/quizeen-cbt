# Data models and schemas

This document describes the TypeScript interfaces and data structures shared across all Quizeen applications via the `@cbt/shared` package.

For full details on disk structure, file partitioning, caching, and persistence, see [Database architecture and storage management](DATABASE.md).

---

## Assessment entity

An assessment represents a complete test or examination paper.

- **Storage on server**: `data/assessments/[id].json` (standalone file per assessment)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique identifier (for example, `exam_17892348912`). |
| `title` | `string` | Yes | Display title (for example, `Mathematics - SSS 2 (2024/2025)`). |
| `subject` | `string` | Yes | Subject name (for example, `Mathematics`, `English`). |
| `session` | `string` | No | Academic session (for example, `2024/2025`). |
| `assessmentType` | `'test' \| 'exam' \| string` | No | Distinguishes periodic tests from major term exams. |
| `educationLevel` | `EducationLevel` | Yes | `primary`, `junior_secondary`, or `senior_secondary`. |
| `targetClasses` | `string[]` | Yes | Targeted classes (for example, `['SSS 1', 'SSS 2']`). |
| `department` | `Department` | No | Academic stream: `science`, `arts`, or `commercial`. |
| `durationMinutes` | `number` | Yes | Time allowed in minutes. |
| `passingScore` | `number` | Yes | Passing score percentage threshold. |
| `totalPoints` | `number` | Yes | Sum of all question points. |
| `questions` | `Question[]` | Yes | Array of question objects. |
| `isAvailable` | `boolean` | No | Availability toggle for the student portal (defaults to `true`). |
| `availableFrom` | `string` | No | Optional ISO start timestamp. |
| `availableTo` | `string` | No | Optional ISO closing timestamp. |
| `unlockPin` | `string` | No | Optional PIN code required to open the assessment. |
| `createdAt` | `string` | Yes | ISO 8601 creation timestamp. |
| `isPublished` | `boolean` | Yes | Flag indicating whether the assessment is published. |

---

## Question entity

Individual questions belonging to an assessment.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique question identifier (for example, `q_17892348`). |
| `prompt` | `string` | Yes | Rich text HTML or plaintext question prompt. |
| `type` | `QuestionType` | Yes | `multiple_choice`, `true_false`, or `short_answer`. |
| `options` | `string[]` | No | Answer options for multiple-choice questions. |
| `correctAnswer` | `string` | Yes | Expected correct answer string. |
| `points` | `number` | Yes | Point weight awarded for the correct answer. |
| `explanation` | `string` | No | Optional educational explanation for review. |

---

## Student entity

Represents a registered student candidate eligible to take assessments.

- **Storage on server**: `data/students/[category].json` (partitioned by level: `primary.json`, `junior.json`, `senior.json`, `general.json`)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique student identifier. |
| `code` | `string` | No | Short 6-character access code for candidate login (for example, `K7M9P2`). |
| `name` | `string` | Yes | Full candidate name. |
| `educationLevel` | `EducationLevel` | Yes | School level (`primary`, `junior_secondary`, or `senior_secondary`). |
| `classGroup` | `string` | Yes | Class group (for example, `SSS 2A`). |
| `department` | `Department` | No | Academic stream (`science`, `arts`, or `commercial`). |
| `createdAt` | `string` | Yes | ISO 8601 creation timestamp. |

---

## Submission entity

Records a completed candidate exam attempt, scoring metrics, and integrity counters.

- **Storage on server**: `data/submissions/[examId].json` (grouped by assessment)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique submission identifier. |
| `examId` | `string` | Yes | References `Assessment.id`. |
| `examTitle` | `string` | Yes | Cached assessment title. |
| `studentName` | `string` | Yes | Full candidate name. |
| `educationLevel` | `EducationLevel` | Yes | School level of candidate. |
| `classGroup` | `string` | Yes | Class name (for example, `SSS 2`). |
| `department` | `Department` | No | Candidate stream (`science`, `arts`, or `commercial`). |
| `answers` | `Record<string, AnswerItem>` | Yes | Map of question identifiers to submitted answers. |
| `score` | `number` | Yes | Total points earned. |
| `totalPoints` | `number` | Yes | Total points possible. |
| `percentage` | `number` | Yes | Score divided by total points, multiplied by 100. |
| `status` | `'in_progress' \| 'awaiting_result' \| 'graded'` | Yes | Lifecycle status: in session, awaiting marking, or marked. |
| `timeSpentSeconds` | `number` | Yes | Elapsed test duration in seconds. |
| `infractionCount` | `number` | No | Count of window blur or application switch events recorded during the test. |
| `submittedAt` | `string` | Yes | Location-aware ISO 8601 submission timestamp with timezone offset. |
| `gradedAt` | `string` | No | Optional ISO 8601 grading timestamp when marked by a teacher. |

---

## Student session entity

Active candidate identity state inside the student portal.

```typescript
export interface StudentSession {
  studentId?: string;
  studentCode?: string;
  studentName: string;
  educationLevel: EducationLevel;
  classGroup: string;
  department?: Department;
  loggedInAt: string;
}
```
