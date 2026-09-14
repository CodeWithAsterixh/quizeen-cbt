# Data Models and Schema Definitions

This document defines the TypeScript interfaces, entity schemas, validation rules, and lifecycle states shared across the Quizeen CBT suite via the `@cbt/shared` package (`packages/shared/src/types/`).

For details on disk persistence, partitioning, and cache management, see [Database Architecture and Storage Management](DATABASE.md).

---

## 1. Assessment Entity (`Exam` / `Assessment`)

The `Assessment` entity represents an examination or periodic test paper. It contains structural parameters, scheduling windows, question banks, and anti-cheat display settings.

- **TypeScript Interface**: `Exam` (aliased as `Assessment`) in `packages/shared/src/types/types.ts`
- **Server Storage Path**: `data/assessments/[id].json`

### Field Definitions

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique identifier (for example, `exam_17892348912`). |
| `title` | `string` | Yes | Human-readable title (for example, `Mathematics - SSS 2 Second Term`). |
| `description` | `string` | No | Optional notes or syllabus scope for the test. |
| `subject` | `string` | Yes | Academic subject name (for example, `Mathematics`, `English Language`). |
| `session` | `string` | No | Academic session (for example, `2024/2025`). |
| `assessmentType` | `AssessmentType` | No | Distinguishes periodic continuous assessment from major exams: `'test'` or `'exam'`. |
| `educationLevel` | `EducationLevel` | Yes | School level: `'primary'`, `'junior_secondary'`, or `'senior_secondary'`. |
| `targetClasses` | `string[]` | Yes | Specific class groups eligible for this paper (for example, `['SSS 2A', 'SSS 2B']`). |
| `department` | `Department` | No | Academic stream: `'science'`, `'arts'`, or `'commercial'`. Applicable to Senior Secondary. |
| `durationMinutes` | `number` | Yes | Test time limit in minutes. Controls the countdown timer in the exam runner. |
| `passingScore` | `number` | Yes | Minimum percentage threshold required to pass (0 to 100). |
| `totalPoints` | `number` | Yes | Sum of point values across all constituent questions. |
| `questions` | `Question[]` | Yes | Array of question objects comprising the assessment paper. |
| `objectiveGrading` | `'automatic' \| 'manual'` | No | Defines whether multiple-choice questions score instantly upon submission. Defaults to `'automatic'`. |
| `instructions` | `string` | No | Candidate instructions displayed on the pre-exam launch screen. |
| `shuffleQuestions` | `boolean` | No | When `true`, randomizes question presentation order per candidate using candidate-seeded pseudo-randomization. |
| `shuffleOptions` | `boolean` | No | When `true`, randomizes multiple-choice option choices per candidate while preserving answer key scoring accuracy. |
| `scheduledDate` | `string` | No | Optional calendar date string for the test (YYYY-MM-DD). |
| `startTime` | `string` | No | Optional opening time string (HH:mm). |
| `endTime` | `string` | No | Optional closing time string (HH:mm). |
| `isAvailable` | `boolean` | No | Availability toggle for the student portal catalog. Defaults to `true`. |
| `availableFrom` | `string` | No | ISO 8601 opening timestamp. Candidates cannot start before this time. |
| `availableTo` | `string` | No | ISO 8601 closing timestamp. Candidates cannot start after this deadline. |
| `unlockPin` | `string` | No | Optional 4-digit PIN required from the proctor to open the exam runner. |
| `createdBy` | `string` | No | Identifier or username of the authoring educator. |
| `teacherName` | `string` | No | Name of the instructor responsible for the subject. |
| `createdAt` | `string` | Yes | ISO 8601 creation timestamp. |
| `isPublished` | `boolean` | Yes | Publication flag. Unpublished assessments are visible only in Manager. |

---

## 2. Question Entity (`Question`)

Individual questions associated with an assessment paper.

- **TypeScript Interface**: `Question` in `packages/shared/src/types/types.ts`

### Field Definitions

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique question identifier (for example, `q_17892348912_1`). |
| `prompt` | `string` | Yes | Rich text HTML or plaintext question stem. |
| `type` | `QuestionType` | Yes | Format: `'multiple_choice'`, `'true_false'`, or `'short_answer'`. |
| `options` | `string[]` | No | Array of answer choices for multiple-choice questions. |
| `correctAnswer` | `string` | Yes | Expected correct answer string. For multiple-choice, matches the exact text of the correct option. |
| `points` | `number` | Yes | Point weight awarded for a correct answer. |
| `explanation` | `string` | No | Optional educational rationale explaining the correct answer for post-test review. |

### Supported Question Types (`QuestionType`)
- `'multiple_choice'`: Multiple options presented with radio button selection. Supports option shuffling.
- `'true_false'`: Two standard binary choices: True or False.
- `'short_answer'`: Single-line text input scored either automatically via exact string match or manually by the teacher.

---

## 3. Student Candidate Entity (`Student`)

Represents an examinee eligible to take assessments.

- **TypeScript Interface**: `Student` in `packages/shared/src/types/student.ts`
- **Server Storage Path**: `data/students/[category].json` (partitioned by educational level)

### Field Definitions

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique student identifier (for example, `std_1789234567`). |
| `code` | `string` | No | 6-character alphanumeric access code used for candidate login (for example, `K7M9P2`). |
| `name` | `string` | Yes | Full candidate name (for example, `David Adeleke`). |
| `educationLevel` | `EducationLevel` | Yes | Educational tier: `'primary'`, `'junior_secondary'`, or `'senior_secondary'`. |
| `classGroup` | `string` | Yes | Specific class cohort (for example, `SSS 2A`, `JSS 1B`, `Primary 4`). |
| `department` | `Department` | No | Academic stream for Senior Secondary students: `'science'`, `'arts'`, or `'commercial'`. |
| `createdAt` | `string` | Yes | ISO 8601 creation timestamp. |

---

## 4. Submission Entity (`Submission`)

Records an examinee's completed test session, including candidate details, submitted answers, scoring statistics, and anti-cheat tracking metrics.

- **TypeScript Interface**: `Submission` in `packages/shared/src/types/types.ts`
- **Server Storage Path**: `data/submissions/[examId].json` (grouped by assessment)

### Field Definitions

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | `string` | Yes | Unique submission identifier (for example, `sub_17893456789`). |
| `examId` | `string` | Yes | References `Assessment.id`. |
| `examTitle` | `string` | Yes | Cached assessment title for reporting without cross-file lookups. |
| `studentName` | `string` | Yes | Full candidate name. |
| `educationLevel` | `EducationLevel` | Yes | Candidate school level at test time. |
| `classGroup` | `string` | Yes | Candidate class cohort. |
| `department` | `Department` | No | Candidate stream (`science`, `arts`, or `commercial`). |
| `answers` | `Record<string, AnswerItem>` | Yes | Map where keys are question IDs and values are `AnswerItem` objects. |
| `timeSpentSeconds` | `number` | Yes | Total elapsed time spent in the exam runner. |
| `score` | `number` | Yes | Total points earned. |
| `totalPoints` | `number` | Yes | Total maximum points available on the paper. |
| `percentage` | `number` | Yes | Score divided by totalPoints multiplied by 100, rounded to one decimal place. |
| `status` | `SubmissionStatus` | Yes | Lifecycle status: `'in_progress'`, `'awaiting_result'`, or `'graded'`. |
| `infractionCount` | `number` | No | Count of window blur or application switch events recorded during the session. |
| `submittedAt` | `string` | Yes | ISO 8601 timestamp with local timezone offset recording when the test was submitted. |
| `gradedAt` | `string` | No | Optional ISO 8601 timestamp recording when a teacher marked or adjusted scores. |

### 4.1. Answer Item Entity (`AnswerItem`)
Represents an individual response to a question within a submission:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `questionId` | `string` | Yes | References `Question.id`. |
| `selectedAnswer` | `string` | Yes | The textual answer selected or typed by the student. |
| `awardedPoints` | `number` | No | Points awarded for this answer. |
| `teacherRemarks` | `string` | No | Optional instructor feedback or grading rationale. |

---

## 5. Candidate Session Entity (`StudentSession`)

Represents the active local session on a student workstation:

- **TypeScript Interface**: `StudentSession` in `packages/shared/src/types/student.ts`

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `studentId` | `string` | Yes | Identifier of the authenticated candidate. |
| `studentCode` | `string` | No | The 6-character access code used to authenticate. |
| `name` | `string` | Yes | Full name of the student. |
| `educationLevel` | `EducationLevel` | Yes | Level of the candidate. |
| `classGroup` | `string` | Yes | Class group. |
| `department` | `Department` | No | Department stream. |
| `seed` | `string` | Yes | Deterministic seed string (for example, `std_1001_exam_17892348912`) used by the PRNG to generate stable question and option shuffling order. |

---

## 6. Offline Package Manifest Entity (`PackageManifest`)

Metadata contained within the `manifest.json` file of an exported `.qzn` archive:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `version` | `string` | Yes | Package format specification version (for example, `"1.0.0"`). |
| `packageId` | `string` | Yes | Unique package identifier. |
| `title` | `string` | Yes | Assessment title. |
| `createdAt` | `string` | Yes | ISO 8601 compilation timestamp. |
| `checksum` | `string` | Yes | SHA-256 hash of the encapsulated `assessment.json` payload. |
| `assessmentCount` | `number` | Yes | Number of assessments bundled inside the package. |
