# Contributing to Quizeen CBT

Review these contribution guidelines, code standards, and pull request procedures before opening pull requests or filing issues.

## Branching strategy and pull requests

The repository uses a trunk-based workflow:

1. Base your work on the `main` branch.
2. Name feature branches descriptively: `feat/scheduling-controls` or `fix/question-reorder`.
3. Submit pull requests with a clear summary of changes, reproduction steps for fixes, and confirmation that all type checks pass.

## Coding rules

### 1. File line count limit
Every `.ts`, `.tsx`, and `.css` source file must stay under 100 lines (maximum 99 lines). Automated validation rejects files at or above 100 lines. Break large components into sub-components, custom hooks, or utility modules.

### 2. UI component primitives
Do not write raw `<input>`, `<select>`, or `<textarea>` tags directly in application pages. Use shared UI components from `@cbt/shared`:
- `TextInput`
- `SelectDropdown`
- `Button`
- `Badge`
- `Card`
- `Modal`

In the student portal, use button selectors and toggle controls instead of dropdown menus.

### 3. TypeScript validation
Every package must compile without errors under strict TypeScript checks. Run `npx tsc --noEmit` in each workspace before opening a pull request.

## Commit message style

Use conventional commit messages:

- `feat: add date range fields to assessment settings`
- `fix: prevent duplicate versions in release packaging`
- `refactor: extract title bar state into useTitleBar hook`
- `docs: update data model definitions`
- `chore: update build script dependencies`

## Pull request checklist

Check these points before submitting:
- All workspace TypeScript checks pass with zero errors.
- No `.ts`, `.tsx`, or `.css` file equals or exceeds 100 lines.
- Views adapt correctly across mobile, tablet, and desktop viewports.
- Related documentation files reflect any changes to data structures or configuration parameters.
