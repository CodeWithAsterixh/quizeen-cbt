# Changelog

All notable changes to the Quizeen CBT System Prototype are recorded in this document following Semantic Versioning (vMAJOR.MINOR.PATCH) and Keep a Changelog conventions.

## [1.0.0] - 2026-09-13

### Added
- Assessment taxonomy generalizing tests and exams under an extensible assessment registry.
- Availability and scheduling controls with active status toggle, start date, and deadline enforcement.
- Custom .qzn archive format for exporting and importing test packages without an internet connection.
- Multi-class analytics hierarchy providing class overview cards, subject breakdowns, and student score rosters with letter grades (A to F) and remarks.
- Release automation script (`scripts/build-release.js`) creating versioned folders in `.qzn-releases/v{version}` with duplicate version prevention.
- Icon generation utility (`scripts/generate-icons.js`) outputting 256x256 `.ico` and `.png` assets for Windows application packaging.
- In-exam scientific calculator with trigonometric, logarithmic, and parenthetical calculations.

### Changed
- Assessment editor structure split into two tabs: Questions and Settings & Availability.
- Question list view now presents questions in compact preview cards, expanding the full editor only when an edit button is pressed.
- Student portal class selection updated to use button toggles rather than native select dropdowns.
- Student portal header updated with an explicit Leave Exam Room button that clears candidate session state.
- Desktop title bar logic moved into a reusable `useTitleBar` hook with window resize listeners.

### Removed
- Redundant Already Submitted badges on student test cards.
- Legacy exam prefixes across source files, standardized to assessment terminology.

### Security
- Window focus tracking that monitors student window blurs and increments an audit counter during exam sessions.
- Offline storage verification with checksums on exported assessment packages.
