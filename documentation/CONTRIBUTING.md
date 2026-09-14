# Contributing to Quizeen CBT

This guide describes the engineering standards, architecture rules, pull request workflows, and quality requirements for contributing to the Quizeen CBT platform.

---

## 1. Branching Strategy and Pull Request Process

The repository follows a trunk-based development workflow:

1. Base all work on the latest `main` branch.
2. Name feature and bugfix branches descriptively:
   - `feat/assessment-shuffling`
   - `fix/port-fallback-binding`
   - `docs/update-architecture-spec`
   - `refactor/server-discovery-listener`
3. Open small, focused pull requests. Include a clear summary of changes, testing steps, and confirmation that all type checks pass.

---

## 2. Code Quality and Engineering Constraints

Every contributor must adhere to the following four non-negotiable architectural rules:

### 2.1. Strict Source File Line Count Limit (Max 99 Lines)
Every `.ts`, `.tsx`, and `.css` source file must remain strictly under 100 lines (maximum 99 lines). Automated pull request checks reject any file that reaches or exceeds 100 lines.

- If a React component approaches 100 lines, extract sub-components, move form fields to separate files, or move state management into custom hooks.
- If a server service file approaches 100 lines, extract validation logic, helper functions, or database mapping routines into dedicated helper files.
- Documentation files (`.md`) and package configuration files (`package.json`, `tsconfig.json`) are exempt from this line limit.

### 2.2. Zero Emojis Anywhere
Do not include emojis anywhere in the codebase. This rule applies across:
- Source code and code comments
- User interface labels, buttons, and headers
- System notifications, banners, and error dialogs
- Commit messages and documentation files

### 2.3. Zero Em Dashes Anywhere
Do not use em dashes (neither the Unicode em dash character nor double-hyphen substitutes) in prose, comments, or documentation. Structure sentences cleanly using commas, parentheses, colons, or separate sentences. Double hyphens are permitted only in technical syntax where required (such as CSS custom properties like `var(--color-border)` or command-line flags like `--noEmit`).

### 2.4. Direct and Concise Language (Avoid AI Patterns)
Follow clean technical writing practices:
- Use direct, concrete statements rather than vague buzzwords.
- Avoid inflated metaphors or artificial phrasing (such as *delve*, *tapestry*, *testament to*, *realm*, *seamless*, or *meticulous*).
- State facts directly without hollow intensifiers (such as *genuinely*, *truly*, or *to be honest*).

---

## 3. UI Component Primitives

Do not write raw HTML `<input>`, `<select>`, or `<textarea>` tags directly in application feature views. Always use the shared UI primitives from `@cbt/shared`:

- `TextInput`: Standardized text input with label and error state handling.
- `NumberInput`: Numeric input with boundary clamping.
- `SelectDropdown`: Accessible dropdown selection.
- `Button`: Primary, secondary, and destructive button styles with loading states.
- `Badge`: Status badges for levels, statuses, and tags.
- `Card`: Container cards with standardized borders and padding.
- `Modal`: Accessible dialogs with backdrop blur and escape key listeners.
- `TitleBar`: Custom frameless window header integrating with Electron IPC controls.

In the Student Station, prioritize button selectors and toggle switches over dropdown menus to improve touch and kiosk ergonomics.

---

## 4. Verification and Validation Checklist

Before submitting a pull request, run all verification checks locally:

### 4.1. TypeScript Type Checks
Run strict type checking across each workspace:
```bash
cd apps/student && npx tsc --noEmit
cd ../manager && npx tsc --noEmit
cd ../server && npx tsc --noEmit
cd ../../packages/shared && npx tsc --noEmit
```
All commands must complete with zero errors.

### 4.2. Automated Line Count Check
Run this PowerShell check from the repository root:
```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.css -Exclude node_modules,dist,dist-electron,.next |
  ForEach-Object {
    $count = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($count -ge 100) { Write-Output "Violation: $($_.FullName) ($count lines)" }
  }
```
No violations should be reported.

### 4.3. API and Route Verification
If you modify server endpoints or client API wrappers, run the API audit script:
```bash
npm run api:audit
```
Confirm that client methods match implemented server routes.

---

## 5. Commit Message Convention

Format commit messages using Conventional Commits:

- `feat: add deterministic question shuffling to student runner`
- `fix: resolve port conflict on Windows dynamic port exclusions`
- `refactor: extract server controls into dedicated component`
- `docs: update database architecture for program data permissions`
- `chore: bump dependencies in shared package`
