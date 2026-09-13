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

## Mock data seeding engine

Quizeen provides curriculum-aligned sample data located in `packages/shared/src/seed/`.

### Seed structure

The seed dataset contains curriculum models for Nigerian primary and secondary schools:

- **Primary school**: Primary 1 through Primary 6.
- **Junior secondary school**: JSS 1 through JSS 3.
- **Senior secondary school**: SSS 1 through SSS 3 across Science, Arts, and Commercial departments.

### Default assessments

The factory seed includes sample assessments for testing:

- **Senior secondary mathematics**: Algebra, linear equations, and calculus.
- **Senior secondary physics and English language**: Mechanics, comprehension, and grammar.
- **Primary general science and arithmetic**: Basic science concepts and arithmetic operations.

### Default submissions

Pre-populated student results provide immediate reporting data across different score ranges:

- Distinction grades (above 75 percent).
- Credit and pass grades (50 to 74 percent).
- Support needed grades (below 50 percent).
- Window blur incident counters for evaluating focus violation alerts.

---

## Resetting storage to defaults

When testing fresh states, use the built-in reset controls:

- **Manager dashboard**: Open `Settings` and select `Reset to Default Sample Data`.
- **Student portal**: Open `Settings` from the start screen and select `Reset to Default Assessments`.
