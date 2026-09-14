# Testing, Verification, and Seeding Guide

This guide describes how to verify code quality, execute TypeScript type checks across workspaces, enforce codebase architectural constraints, test network port fallbacks, and initialize sample seed data for testing.

---

## 1. Type Checking and Workspace Verification

The monorepo uses TypeScript in strict mode across all applications and libraries. Run type checks in each workspace folder:

```bash
# Verify Student portal
cd apps/student
npx tsc --noEmit

# Verify Manager dashboard
cd apps/manager
npx tsc --noEmit

# Verify Central Server
cd apps/server
npx tsc --noEmit

# Verify Shared library
cd packages/shared
npx tsc --noEmit
```

All workspaces must compile cleanly with zero TypeScript diagnostics before code is merged.

---

## 2. Source Code Line Count Constraint Verification

To enforce modularity and maintainability, every application source code file (`.ts`, `.tsx`, and `.css`) must remain strictly under 100 lines (maximum 99 lines). Documentation files (`.md`) and package configuration files are exempt from this requirement.

Run this PowerShell command from the repository root to verify that no source file violates the limit:

```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.css -Exclude node_modules,dist,dist-electron,.next |
  ForEach-Object {
    $lineCount = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lineCount -ge 100) {
      Write-Output "Line count limit violation: $($_.FullName) has $lineCount lines"
    }
  }
```

If any file reaches 100 lines or more, break it down into smaller sub-components, extract custom hooks, or move pure business logic into helper files.

---

## 3. Testing Network Port Fallbacks and Discovery

### 3.1. Testing Automatic Port Fallback
To verify that the server handles occupied or Windows-restricted ports gracefully:
1. Open a terminal and bind a dummy process to port 4000:
   ```bash
   npx http-server -p 4000
   ```
2. In a second terminal, start the Central Server application:
   ```bash
   npm run server:electron
   ```
3. Click "Start Server" in the GUI.
4. Verify that:
   - The server does not crash with `EACCES: permission denied 0.0.0.0:4000`.
   - The server selects port 4050 automatically.
   - An informational banner displays:
     `Port 4000 is in use by another app or restricted by Windows. Started on fallback port 4050.`
   - The port input box and active IP address pills update to display port 4050.

### 3.2. Testing Active Queez Server Detection
1. Start one instance of the Central Server on port 4000.
2. Launch a second instance of the Server application.
3. Verify that the second instance detects the active server via `/health` probe and displays:
   `Active Queez Server detected at http://127.0.0.1:4000.`

### 3.3. Testing UDP Beacon Discovery
1. Start the Central Server on port 4000 or fallback port 4050.
2. Open the Assessment Manager application (`npm run manager:dev` or `npm run manager:electron`).
3. Click "Server Connection" in the sidebar.
4. Verify that the discovery listener on UDP port 4001 catches the beacon and reports:
   `Discovered server at http://<ip>:<port>.`

---

## 4. Testing Candidate-Seeded Assessment Shuffling

To verify that question and option shuffling functions properly without compromising scoring accuracy:

1. In the Assessment Manager, create a test with 5 multiple-choice questions.
2. In the Settings tab, enable both "Shuffle Question Order" and "Shuffle Option Choices".
3. Save the test.
4. Open the Student Station and log in using Candidate Code A (for example, `STU001`). Note the order of questions and the order of options for Question 1.
5. Close the exam runner and reopen using Candidate Code B (for example, `STU002`).
6. Verify that:
   - Candidate B sees a different question sequence than Candidate A.
   - For Question 1, Candidate B sees options in a different visual order than Candidate A.
   - Selecting the correct text answer on both workstations awards full points, confirming that answer key evaluation relies on canonical string matching rather than positional indices.
7. Refresh Candidate A's window mid-test and confirm that Candidate A's original question order is preserved deterministically.

---

## 5. Seed Data and Test Fixtures

### 5.1. Clean Initial State
By default, the Quizeen CBT Server initializes with an empty database to allow realistic end-to-end testing from scratch.

### 5.2. Pre-Built Academic Seed Modules
The `@cbt/shared` package provides academic test fixtures partitioned across subject areas (`packages/shared/src/seed/`):
- `seed-primary.ts`: Primary school mathematics, science, and English papers.
- `seed-junior.ts`: Junior secondary school tests.
- `seed-senior-science.ts`: Senior secondary physics, chemistry, and biology exams.
- `seed-senior-arts.ts`: Senior secondary literature and government papers.
- `seed-senior-commercial.ts`: Senior secondary accounting and commerce exams.

### 5.3. Resetting Database to Clean State
To wipe all stored test definitions, student candidates, and submissions back to an empty database state:
```bash
# Using curl or PowerShell
curl -X POST http://localhost:4000/api/analytics/reset
```

The server clears all in-memory maps, removes existing JSON files from `data/assessments/`, `data/students/`, and `data/submissions/`, and recreates empty directory structures.

### 5.4. Resetting Student Station Local Cache
To clear cached tests and candidate session state on an individual student workstation:
1. On the Student Station start screen, click the Settings gear icon.
2. Select "Delete All Tests on this Station".
3. Confirm the action to clear local IndexedDB tables.
