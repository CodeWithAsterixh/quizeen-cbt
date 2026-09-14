# Testing, verification, and seeding guide

This guide describes how to verify code quality, run type checks, enforce codebase constraints, and initialize sample seed data for testing.

---

## Verification and type checking

Run strict TypeScript compiler checks across each application and shared package to verify types:

```bash
# Student portal
cd apps/student && npx tsc --noEmit

# Manager dashboard
cd apps/manager && npx tsc --noEmit

# Central server
cd apps/server && npx tsc --noEmit

# Shared package
cd packages/shared && npx tsc --noEmit
```

### Automated line count verification

All application source files (`.ts`, `.tsx`, `.css`) must remain strictly under 100 lines to preserve modular architecture. Documentation files (`.md`) are exempt from this limit.

Run this PowerShell command from the repository root to check for violations:

```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.css -Exclude node_modules,dist,.next | 
  ForEach-Object { 
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines; 
    if ($lines -ge 100) { Write-Output "$($_.FullName): $lines lines" } 
  }
```

---

## Initial data state

Quizeen initializes with a clean slate to allow end-to-end testing from scratch. No default assessments or test submissions are pre-seeded into storage on first run.

### Data storage directories

- **Central server**: Stores runtime records in categorized JSON files under the `data/` directory (`data/assessments/`, `data/students/`, and `data/submissions/`). See [Database architecture and storage management](DATABASE.md) for full details.
- **Manager app**: Stores local assessments and submissions in offline IndexedDB/Electron local storage.
- **Student app**: Stores downloaded assessment packages and student attempts locally until submitted.

---

## Resetting storage

When testing fresh states, use the built-in reset controls:

- **Server endpoint**: Send a POST request to `/api/analytics/reset` to wipe stored exams and submissions back to an empty initial state.
- **Student portal**: Open supervisor tools from the start screen and select `Delete All Tests on this Station` to clear cached assessment packages.

