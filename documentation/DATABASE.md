# Database Architecture and Storage Management

This document describes the embedded database engine used by the Quizeen CBT Server, directory organization on disk, Windows permissions handling in production, and how the storage layer manages read and write operations.

---

## 1. Storage Engine Overview

The Quizeen CBT Server uses an embedded, file-based JSON document store paired with an in-memory cache. It eliminates the need for external database servers like PostgreSQL, MySQL, SQLite native binaries, or MongoDB.

### 1.1. Why This Storage Architecture Was Chosen

1. **Complete Offline Independence**:
   School examinations frequently take place in computer rooms without active internet connections. A file-based store operates completely offline without needing cloud services or remote database connections.

2. **Zero Operating System Service Dependencies**:
   Third-party database management systems require background services, user accounts, authentication passwords, and port configurations that can fail or become blocked by school firewalls. The file-based JSON engine runs directly inside the Node.js runtime process.

3. **Human-Readable and Auditable Records**:
   All assessment papers, student candidate registrations, and submitted answer sheets are saved as standard JSON files. Proctors and school IT administrators can inspect any file using a text editor to verify records or troubleshoot issues directly.

4. **Rapid Disaster Recovery and Backups**:
   Creating a complete system backup requires copying the `data` directory to a USB flash drive. Restoring from a backup involves pasting the directory back into place.

---

## 2. Directory Layout and Partitioning Strategy

Records are partitioned into three dedicated subdirectories under the resolved data folder:

```
data/
├── assessments/
│   ├── exam_17892348912.json
│   └── exam_sss2_physics.json
├── students/
│   ├── primary.json
│   ├── junior.json
│   ├── senior.json
│   └── general.json
└── submissions/
    ├── exam_17892348912.json
    └── exam_sss2_physics.json
```

### 2.1. Assessments Store (`data/assessments/`)
Every assessment is saved into its own standalone JSON file named using its unique identifier: `[assessmentId].json`.

- **File name format**: `exam_17892348912.json`
- **Contents**: A single JSON object containing:
  - Assessment metadata: `id`, `title`, `subject`, `session`, `educationLevel`, `targetClasses`, `department`, `durationMinutes`, and `passingScore`.
  - Scheduling parameters: `isAvailable`, `availableFrom`, `availableTo`, and `unlockPin`.
  - Shuffling preferences: `shuffleQuestions` and `shuffleOptions`.
  - Question bank: An array of questions with prompt HTML, option choices, correct answers, point weights, and explanations.
- **Isolation Benefit**: Saving or modifying an assessment writes only to that specific file. An issue in one file never affects other exams.

### 2.2. Students Store (`data/students/`)
Student candidate records are categorized by educational level into dedicated partition files:

- `primary.json`: Candidates enrolled in primary grades (Primary 1 through Primary 6).
- `junior.json`: Candidates enrolled in junior secondary classes (JSS 1 through JSS 3).
- `senior.json`: Candidates enrolled in senior secondary classes (SSS 1 through SSS 3).
- `general.json`: Candidates with custom, remedial, or unassigned educational levels.

Each partition file contains an array of student candidate objects with their registration code, full name, assigned class group, academic stream, and creation timestamp. Partitioning candidates by educational level keeps individual file sizes small and prevents read latency degradation.

#### Level Reclassification
When an administrator edits a candidate in the Manager application and changes their educational level (for example, promoting a student from JSS 3 to SSS 1):
1. The server removes the student record from `data/students/junior.json`.
2. The server appends the updated student record to `data/students/senior.json`.
3. Both partition files are rewritten atomically, preventing duplicate entries.

### 2.3. Submissions Store (`data/submissions/`)
Candidate submissions are grouped by assessment identifier into individual files: `[examId].json`.

- **File name format**: `exam_17892348912.json` (with non-alphanumeric characters replaced by underscores).
- **Contents**: An array of submission records representing candidate attempts for that specific exam.
- **Record Data**: Candidate name, class group, stream, answer map, calculated score, total points, percentage, elapsed time, infraction count, and timestamp.
- **Query Efficiency**: When generating class score sheets or opening the grading queue for an exam, the server reads only the submission file for that exam instead of scanning submissions from every test across the school.

---

## 3. Data Directory Resolution and Windows Permissions

### 3.1. The Program Files Permission Problem
When an application is installed for all users on Windows, it is placed in `C:\Program Files\Queez CBT Suite\`. Under standard Windows user account controls (UAC), normal non-administrator accounts do not have write permissions to `C:\Program Files\`.

If the server attempts to create or update files in `C:\Program Files\Queez CBT Suite\data\`, the operating system denies the request with error `EACCES: permission denied`.

### 3.2. Dynamic Data Directory Resolution Algorithm
To resolve this issue reliably across both development and production environments, the server implements dynamic path resolution in `apps/server/src/core/db/database.ts`:

```typescript
function resolveDataDir(): string {
  // 1. Explicit override via environment variable
  if (process.env.QUEEZ_DATA_DIR) {
    return path.resolve(process.env.QUEEZ_DATA_DIR);
  }

  // 2. Development candidates checked in order
  const devCandidates = [
    path.resolve(process.cwd(), 'apps/server/data'),
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), '../data'),
  ];
  for (const candidate of devCandidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  // 3. Windows production environment resolution
  if (process.platform === 'win32') {
    const programData = process.env.ALLUSERSPROFILE || process.env.ProgramData;
    if (programData) {
      return path.join(programData, 'Queez CBT Suite', 'data');
    }
    const appData = process.env.APPDATA;
    if (appData) {
      return path.join(appData, 'Queez CBT Suite', 'data');
    }
  }

  // 4. Fallback for non-Windows operating systems
  return path.resolve(process.cwd(), 'data');
}
```

### 3.3. Installer Access Control Configuration (`icacls`)
During installation via the NSIS installer script (`installer/suite.nsi`), the installer creates the `%PROGRAMDATA%\Queez CBT Suite\data` directory and runs the Windows `icacls` command:

```nsis
CreateDirectory "$COMMONPROGRAMDATA\Queez CBT Suite\data"
ExecWait 'icacls "$COMMONPROGRAMDATA\Queez CBT Suite\data" /grant "Users":(OI)(CI)M /T /C'
```

This permission grant (`Users:(OI)(CI)M`) provides modify rights to all standard Windows user accounts, inheriting down to all subdirectories (`(OI)(CI)`). When students or teachers launch the server application on a computer, the server creates, updates, and deletes data files without requiring administrator elevation.

---

## 4. In-Memory Caching and Write-Through Lifecycle

The storage engine implements a two-tier architecture: an in-memory cache for fast read operations and synchronous file writes for durability.

```mermaid
flowchart TD
    Request[Incoming Client Request] --> MethodCheck{Request Method?}
    MethodCheck -- GET (Read) --> MemoryLookup["In-Memory Cache (Map&lt;string, T&gt;)"]
    MemoryLookup --> FastResponse[Instant O(1) JSON Response]
    MethodCheck -- POST / PUT / DELETE (Mutation) --> UpdateMap["Update In-Memory Cache (Map&lt;string, T&gt;)"]
    UpdateMap --> SyncWrite[Synchronous Write: fs.writeFileSync to Specific File]
    SyncWrite --> DiskPersist[("Durable Disk Partition File in %PROGRAMDATA%")]
    SyncWrite --> AckResponse[HTTP 200 / 201 Acknowledged Response]
```

### 4.1. Startup Initialization
When the Central Server launches:
1. `DatabaseStore` calls `initialize()` on each specialized store: `AssessmentStore`, `StudentStore`, and `SubmissionStore`.
2. Each store verifies that its target directory exists, creating the directory if missing.
3. The store scans the directory, reads every `.json` file, parses the JSON payload, and loads all entities into an internal `Map<string, T>`.
4. If a file contains invalid or corrupted JSON, an error is caught and logged, preserving the remaining valid files.

### 4.2. Read Operations
All query operations are satisfied directly from memory:
- `getAssessmentById(id)`: O(1) hash map lookup.
- `getAllAssessments()`: Returns an array of cached assessment objects.
- `getStudentByCode(code)`: Iterates through the in-memory candidate map, returning the matching student in sub-millisecond time.
- `getSubmissionsByExamId(examId)`: Returns cached submissions for the specified test.

This design enables the server to handle hundreds of concurrent candidate requests during examination start times without disk I/O bottlenecks.

### 4.3. Write-Through Durability
When an entity is created, updated, or deleted:
1. The internal `Map<string, T>` is updated immediately to reflect the change.
2. The specific affected partition file is serialized to formatted JSON with 2-space indentation.
3. The file is written to disk synchronously using `fs.writeFileSync`.
4. Writing synchronously guarantees that if the server process terminates abruptly, records from previously acknowledged HTTP requests are already persisted on the storage device.

---

## 5. Backup, Archival, and Migration Procedures

### 5.1. Creating a Manual Snapshot Backup
To create a complete backup of the testing system:
1. Stop the server in the Server GUI application to ensure no write operations are in flight.
2. Navigate to the data folder:
   - In production: `%PROGRAMDATA%\Queez CBT Suite\data`
   - In development: `cbt-system-prototype/data`
3. Copy the entire `data` directory to a backup drive or external USB storage device.

### 5.2. Restoring from a Snapshot Backup
1. Close the Server application.
2. Replace the contents of the active data directory with the backup copy.
3. Restart the Server application. The database engine scans the restored files and repopulates the in-memory cache automatically.

### 5.3. Resetting Data to Clean Initial State
Administrators can reset the system between academic terms:
- From the Manager application or API: Send `POST /api/analytics/reset`.
- The server clears all in-memory caches, deletes existing files in `data/assessments/`, `data/students/`, and `data/submissions/`, and recreates empty directory structures.
