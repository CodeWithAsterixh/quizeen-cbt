# Quizeen CBT System Prototype

Quizeen is an offline-capable Computer-Based Testing (CBT) platform for secondary and primary schools. It packages assessments into encrypted archive files (.qzn), runs exams locally without active internet access, monitors window focus during test sessions, and aggregates grading analytics across multiple class levels.

## Repository layout

The project uses an NPM workspaces monorepo structure:

```
cbt-system-prototype/
├── apps/
│   ├── manager/          # Administrator and teacher desktop application
│   ├── student/          # Student examination client (Desktop and Web)
│   └── server/           # Central synchronization and distribution service
├── packages/
│   └── shared/           # Core models, UI components, and .qzn archive utilities
├── scripts/              # Build, release, and icon generation scripts
├── documentation/        # System documentation and operational guides
└── .qzn-releases/        # Production installers organized by version
```

## Quick start

### Prerequisites
- Node.js version 20 or higher
- NPM version 10 or higher

### Installation
Clone the repository and install dependencies from the project root:

```bash
git clone https://github.com/quizeen/cbt-system-prototype.git
cd cbt-system-prototype
npm install
```

### Running development servers

Start any application with the following npm workspace commands:

```bash
# Student examination client (Web browser interface)
npm run student:dev       # http://localhost:5174

# Student examination client (Electron desktop container)
npm run student:electron

# Manager dashboard (Web browser interface)
npm run manager:dev       # http://localhost:5175

# Manager dashboard (Electron desktop container)
npm run manager:electron

# Backend synchronization server
npm run server:dev        # http://localhost:3001
```

## Building production releases

The build pipeline packages Electron applications into standalone Windows installers and saves them into the `.qzn-releases` folder:

```bash
# Interactive release build (prompts for version update level)
npm run release

# Generate Windows application icons (.ico and .png)
npm run release:icons

# Version bump only with duplicate release protection
npm run release:bump
```

Compiled installers are placed in `.qzn-releases/v{version}/`:
- `Queez CBT Manager-Setup-{version}.exe`
- `Queez CBT Student-Setup-{version}.exe`
- `release-manifest.json`

## Documentation index

- [System architecture](ARCHITECTURE.md): System layout, offline model, and security controls.
- [REST API specification](API-SPEC.md): Endpoints, payloads, and response structures.
- [Data models](DATA-MODELS.md): TypeScript definitions and entity schemas.
- [User flows](USER-FLOWS.md): Student registration, runner lifecycle, and authoring workflows.
- [Environment configuration](ENVIRONMENT-SPEC.md): Environment variables and port assignments.
- [Security policy](SECURITY.md): Vulnerability reporting instructions and response timelines.
- [Testing and seeding](TESTING-AND-SEEDING.md): Verification commands and sample data generators.
- [User manual](USER-MANUAL.md): Step-by-step instructions for teachers and students.

# quizeen-cbt
