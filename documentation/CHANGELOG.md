# Changelog

All notable changes to the Quizeen CBT platform are documented in this file following Semantic Versioning (vMAJOR.MINOR.PATCH) and Keep a Changelog conventions.

---

## [1.2.0] - 2026-09-14

### Added
- **Automatic Port Fallback Engine**:
  - Implemented automatic port fallback in `apps/server/electron/port-fallback.ts` and `server-manager.ts`.
  - When port 4000 is occupied or restricted by Windows dynamic port exclusions (`WSAEACCES 10013`), the server automatically binds to the first open port among `[4050, 4100, 4200, 4500, 5000, 5050, 8080]`.
  - Port 4001 is strictly reserved for the background UDP discovery beacon and excluded from HTTP candidate ports.
  - The UDP beacon immediately advertises the active fallback port so Manager and Student stations connect seamlessly without manual configuration.
- **Active Queez Server Detection**:
  - Added background probe to `/health` on server launch.
  - The server distinguishes between another running Queez Server instance and third-party application conflicts or Windows port blocks, displaying informative notifications in the Server GUI.
- **Candidate-Seeded Assessment Shuffling**:
  - Added `shuffleQuestions` and `shuffleOptions` toggles to assessment settings in the Manager application.
  - Implemented deterministic pseudo-random shuffling in `apps/student/src/features/runner/runnerShuffleHelper.ts` seeded by candidate session and assessment identifier.
  - Ensures question order and option choices differ across examinees while maintaining 100% scoring precision against canonical answer keys.
- **Manager .qzn Package Loader**:
  - Added `QznLoaderModal.tsx` in `apps/manager` allowing educators to import `.qzn` test archives from external drives directly into the central server database.
- **Student Station Package Persistence**:
  - Updated `apps/student/src/store/studentStoreSync.ts` to use ID-based non-destructive merging.
  - Locally imported `.qzn` offline exams are preserved in the student catalog and never wiped during server synchronization.

### Fixed
- **Windows Program Files Permission Denial (`EACCES`)**:
  - Fixed permission errors when the server runs from `C:\Program Files` under standard user accounts.
  - Implemented `resolveDataDir()` in `apps/server/src/core/db/database.ts` to locate data in `%PROGRAMDATA%\Queez CBT Suite\data` on Windows production installs.
  - Added NSIS installer steps executing `icacls` to grant `Users:(OI)(CI)M` modify permissions.
- **NSIS Installer Elevation Loop**:
  - Fixed an issue where choosing "Install for all users" caused the installer to restart at the initial wizard page.
  - Added `$Relaunched` detection in `installer/suite.nsi` using the `/allusers` flag, skipping redundant Welcome and License pages on elevation.
- **Server UI Port Synchronization**:
  - Linked the port input box and active IP address pills in `ServerControls.tsx` to the active running port state.
  - When the server falls back to an alternate port, both the input box and connection pills update to reflect the running port.

---

## [1.1.0] - 2026-09-13

### Added
- **Centralized Client-Server Architecture**:
  - Transitioned platform from isolated air-gapped packages to a local client-server network architecture.
  - Introduced Express REST API in `apps/server` with endpoints for assessments, students, submissions, and packages.
  - Added zero-configuration UDP discovery beacon on port 4001, allowing client apps to find the server automatically.
- **Real-Time Exam Integrity and Focus Monitoring**:
  - Integrated `window.onblur` and `document.onvisibilitychange` listeners in the exam runner.
  - Added `POST /api/submissions/live` heartbeat endpoint to stream window blur infraction counts to the server in real time.
  - Added live infraction alerts in the Manager monitoring queue.
- **Mutating Request Idempotency**:
  - Added idempotency middleware caching mutating requests (`POST`, `PUT`, `DELETE`) by hash to prevent duplicate submissions on network retries.

### Changed
- Refactored all source code files (`.ts`, `.tsx`, `.css`) across all workspaces to strictly obey the 99-line maximum file limit.
- Removed all emojis and em dashes across user interface elements, error messages, and documentation.

---

## [1.0.0] - 2026-09-12

### Initial Release
- Assessment taxonomy generalizing continuous assessment tests and major term examinations.
- Availability and scheduling controls with start dates, deadlines, and unlock PIN enforcement.
- Custom `.qzn` archive compiler and unpacker for offline test distribution.
- Multi-class analytics hierarchy providing class overview cards, subject breakdowns, and student rosters with letter grades (A to F).
- Fullscreen student examination kiosk with on-screen scientific calculator.
- Unified NSIS installer packaging Server, Manager, and Student applications into a single Windows installer executable.
