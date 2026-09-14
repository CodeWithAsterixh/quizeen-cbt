# Quizeen CBT Documentation

This folder contains the technical specifications, architectural blueprints, database storage guides, and operating manuals for the Quizeen Computer-Based Testing suite.

## Documentation Index

| Document | Description |
| -------- | ----------- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System topology, client-server networking, UDP discovery, IPC design, and offline capabilities. |
| [API-SPEC.md](API-SPEC.md) | REST API specification covering request payloads, query parameters, and response structures. |
| [API-DOCUMENTATION.md](API-DOCUMENTATION.md) | Full API matrix mapping client method calls to implemented server routes with troubleshooting notes. |
| [DATABASE.md](DATABASE.md) | Embedded JSON document store, file partitioning, in-memory caching, and Windows ProgramData permissions. |
| [DATA-MODELS.md](DATA-MODELS.md) | TypeScript interface definitions for assessments, shuffling options, student codes, and submissions. |
| [ENVIRONMENT-SPEC.md](ENVIRONMENT-SPEC.md) | Runtime configuration variables, default ports (HTTP 4000, UDP 4001, fallbacks), and data path resolution. |
| [USER-FLOWS.md](USER-FLOWS.md) | Detailed user journeys for examinees, test creators, proctors, and scoring reviewers. |
| [USER-MANUAL.md](USER-MANUAL.md) | Operational walkthroughs for running the Server, creating tests in Manager, and sitting exams in Student. |
| [SECURITY.md](SECURITY.md) | Focus tracking, anti-cheat detection, package archive integrity, and IPC process isolation. |
| [TESTING-AND-SEEDING.md](TESTING-AND-SEEDING.md) | Verification scripts, TypeScript compilation, line count limit audits, and database reset tools. |
| [CHANGELOG.md](CHANGELOG.md) | Detailed log of architectural changes, feature additions, and platform fixes. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Engineering standards, strict file line limit rules (< 100 lines for source code), and pull request policies. |

---

## Architectural Summary

Quizeen transitioned from a purely disconnected package-distribution model to a local client-server architecture:

1. **Central Server (`apps/server`)**:
   - Hosts the central Express API service on HTTP port 4000.
   - Automatically falls back to open ports (such as 4050, 4100, 4500, or 5000) if port 4000 is occupied or restricted by Windows dynamic port exclusions.
   - Detects whether an existing Queez Server is already active on the network or machine, reporting the active URL to the proctor.
   - Transmits a UDP discovery beacon on port 4001 every 2 seconds, allowing client apps to find the server automatically without manual IP configuration.
   - Persists data to `%PROGRAMDATA%\Queez CBT Suite\data` in production to prevent Windows `EACCES` write permission errors inside `Program Files`.

2. **Assessment Manager (`apps/manager`)**:
   - Provides test creation, question editing, and exam scheduling.
   - Supports randomized question and answer option shuffling toggles per assessment.
   - Manages student candidates and generates 6-character alphanumeric ID codes individually or in batch.
   - Listens for UDP beacons to auto-connect to the server, and supports manual connection testing.
   - Monitors student examination sessions live, tracking window switch violations in real time.
   - Offers two-way `.qzn` package support: exporting compiled test archives for air-gapped rooms and importing `.qzn` archives into the server.

3. **Student Examination Station (`apps/student`)**:
   - Kiosk client supporting both Electron desktop mode and standard web browsers.
   - Candidate authentication via 6-character Student ID codes validated against the Central Server.
   - Implements a candidate-seeded pseudo-random shuffling algorithm for questions and answer choices, ensuring candidates sitting next to each other receive different question and option sequences while preserving answer key scoring accuracy.
   - Tracks application focus loss and window blur events, reporting infractions live to the server via `POST /api/submissions/live`.
   - Caches exams locally to endure temporary local network drops without disrupting the student.
   - Allows importing offline `.qzn` test packages without losing existing server-synced tests.
