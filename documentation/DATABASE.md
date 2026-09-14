# Database architecture and storage management

This document explains the database system used by Quizeen CBT, how records are structured on disk, and how the server manages read and write operations.

---

## Storage engine overview

Quizeen uses an embedded, file-based JSON document store paired with an in-memory cache.

### Why this design was chosen

1. **Complete offline independence**: Schools often run exams in computer rooms without internet connectivity. A file-based store runs locally without external database software such as PostgreSQL, MySQL, or MongoDB.
2. **Zero installation overhead**: The server starts instantly on any Windows desktop without configuring database services, ports, users, or background daemons.
3. **Inspectable records**: Teachers and administrators can open any data file in a text editor to verify records, verify student codes, or create manual backups.
4. **Simple backup and recovery**: Copying the `data` directory to a USB flash drive creates a complete snapshot of all exams, registered students, and student submissions.

---

## Directory layout and file structure

The server stores all persistent data in the `data` directory located at the project root:

```
cbt-system-prototype/
└── data/
    ├── assessments/
    │   ├── exam_17892348912.json
    │   └── exam_sss2_physics.json
    ├── students/
    │   ├── primary.json
    │   ├── junior.json
    │   ├── senior.json
    │   └── general.json
    ├── submissions/
    │   ├── exam_17892348912.json
    │   └── exam_sss2_physics.json
    └── cbt-store.json.bak (optional legacy backup)
```

### 1. Assessments store (`data/assessments/`)

Every assessment is stored in its own standalone JSON file named after its identifier: `[assessmentId].json`.

- **File name format**: `exam_17892348912.json`
- **File content**: A single JSON object containing:
  - Header data: `id`, `title`, `subject`, `session`, `educationLevel`, `targetClasses`, `durationMinutes`, `passingScore`, and `unlockPin`.
  - Question bank: An array of questions with prompt HTML, option choices, correct answers, point values, and explanations.
- **Isolation benefit**: Saving or editing one exam only touches that single file on disk. Other exams remain untouched.

### 2. Students store (`data/students/`)

Student candidate records are categorized by educational level into dedicated partition files:

- `primary.json`: Students in primary school classes (Primary 1 to Primary 6).
- `junior.json`: Students in junior secondary school (JSS 1 to JSS 3).
- `senior.json`: Students in senior secondary school (SSS 1 to SSS 3).
- `general.json`: Students with unspecified or custom educational levels.

Each file contains an array of student objects with their registration code, full name, assigned class, department (science, arts, or commercial), and active status.

### 3. Submissions store (`data/submissions/`)

Candidate submissions are partitioned by assessment identifier: `[examId].json`.

- **File name format**: `exam_sss2_physics.json` (special characters replaced with underscores).
- **File content**: An array of submission records for that specific examination.
- **Record data**: Candidate name, class group, answers map, calculated point total, final percentage score, elapsed time in seconds, window focus switch count, and submission timestamp.
- **Aggregation benefit**: When grading or viewing results for a class test, the server reads only the submission file for that exam instead of scanning submissions from every exam across the school.

---

## Storage management and lifecycle

The storage layer is implemented in `apps/server/src/core/db/` using four TypeScript classes:

- `AssessmentStore` (`assessment-store.ts`)
- `StudentStore` (`student-store.ts`)
- `SubmissionStore` (`submission-store.ts`)
- `DatabaseStore` (`database.ts`)

### 1. In-memory read caching

During an active exam session, hundreds of student computers may request questions or verify registration codes at the same time.

- On server startup, each store reads its JSON files from disk and populates an in-memory `Map<string, T>`.
- All read operations (`getAll`, `getById`, `getByCode`, `getByExamId`) return records directly from memory.
- This eliminates disk read operations during peak examination traffic.

### 2. Synchronous write-through updates

When a mutation occurs:

1. The in-memory `Map` is updated immediately.
2. The specific target file is written to disk using synchronous file system calls (`fs.writeFileSync`).
3. Only the affected partition file is updated. For example, saving a senior student record only rewrites `data/students/senior.json`.

### 3. Student category reclassification

If an administrator edits an existing student and changes their educational level (for instance, moving from junior to senior):

1. The store removes the student from the old category cache.
2. The store adds the student to the new category cache.
3. Both category files (`junior.json` and `senior.json`) are updated on disk to keep records consistent.

### 4. Automatic legacy migration

Older versions of Quizeen stored all exams, students, and submissions in a single monolithic file (`data/cbt-store.json`).

On server boot, the migration service (`database-migration.ts`) checks for this legacy file:

1. If `data/cbt-store.json` is found, the migration reads all records into memory.
2. It writes each exam to `data/assessments/[id].json`.
3. It sorts students by class level and writes them to `data/students/[category].json`.
4. It groups submissions by exam and writes them to `data/submissions/[examId].json`.
5. It renames `data/cbt-store.json` to `data/cbt-store.json.bak` to prevent repeated migrations and keep a safe copy of the original data.

---

## Client-side storage

The Student and Manager applications also maintain local client storage:

- **Browser and Electron Web Storage**: Active test state, unsaved answers, student registration session info, and network settings persist in `localStorage`.
- **Encrypted package archives (.qzn)**: Complete exam packages exported from Manager are packaged as AES-encrypted ZIP archives. The Student app can import these `.qzn` packages directly without an active server connection.

---

## Database operations guide

### How to backup data
To create a complete backup, copy the entire `data` folder to your backup location:

```bash
# Windows PowerShell example
Copy-Item -Recurse -Path ".\data" -Destination "D:\Quizeen-Backups\data-$(Get-Date -Format 'yyyy-MM-dd')"
```

### How to restore data
1. Stop the Quizeen Server application.
2. Copy the backed-up JSON files into their respective subfolders (`data/assessments/`, `data/students/`, `data/submissions/`).
3. Start the Quizeen Server application. The server will automatically load the restored files into memory.

### How to reset to empty state
To clear all data and start fresh:
1. Stop the server.
2. Delete the JSON files inside `data/assessments/`, `data/students/`, and `data/submissions/`.
3. Restart the server. The folders will be recreated automatically if they are missing.
