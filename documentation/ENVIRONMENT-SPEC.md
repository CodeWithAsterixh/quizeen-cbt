# Environment Configuration Specification

This specification defines the runtime environment variables, default port assignments, storage directory paths, and client storage preferences across the Quizeen CBT suite.

---

## 1. Port Assignments and Network Matrix

The CBT platform uses two primary network ports and a set of reserved fallback ports:

| Port | Protocol | Usage | Description |
| ---- | -------- | ----- | ----------- |
| `4000` | TCP / HTTP | Central REST API | Primary port on which the Express server listens for requests from Student and Manager stations. |
| `4001` | UDP | Discovery Beacon | Strictly reserved for UDP broadcast beacons. The server broadcasts on 4001; clients listen on 4001. |
| `4050` | TCP / HTTP | Automatic Fallback 1 | Selected automatically if port 4000 is occupied or restricted by Windows dynamic port reservations. |
| `4100` | TCP / HTTP | Automatic Fallback 2 | Second fallback option if 4000 and 4050 are unavailable. |
| `4200` | TCP / HTTP | Automatic Fallback 3 | Third fallback option. |
| `4500` | TCP / HTTP | Automatic Fallback 4 | Fourth fallback option. |
| `5000` | TCP / HTTP | Automatic Fallback 5 | Fifth fallback option. |
| `5174` | TCP / HTTP | Student Dev Server | Vite development server for the Student application. |
| `5175` | TCP / HTTP | Manager Dev Server | Vite development server for the Manager application. |
| `5176` | TCP / HTTP | Server GUI Dev Server | Vite development server for the Central Server GUI window. |

Note: Port 4001 must never be used as an HTTP fallback port because doing so creates a conflict with the background UDP discovery listener.

---

## 2. Common Environment Variables

These variables apply across all applications and scripts:

| Variable Name | Type | Default Value | Description |
| ------------- | ---- | ------------- | ----------- |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` | Adjusts logging verbosity, sourcemap generation, and optimization pipelines. |
| `PORT` | Number | `4000` | Overrides the default HTTP port for the central REST API server. |
| `CBT_DISCOVERY_PORT` | Number | `4001` | Overrides the default UDP discovery port for network announcements. |

---

## 3. Central Server (`apps/server`)

The server manages HTTP request handling, background UDP beacon broadcasting, and database persistence:

| Variable Name | Type | Default Value | Description |
| ------------- | ---- | ------------- | ----------- |
| `PORT` | Number | `4000` | Requested port for the Express HTTP server. |
| `QUEEZ_DATA_DIR` | File path string | *Resolved dynamically* | Explicit directory path where JSON database files and uploaded packages are stored. |
| `DATA_DIR` | File path string | *Resolved dynamically* | Legacy alias for `QUEEZ_DATA_DIR`. |
| `CORS_ORIGIN` | Comma-delimited URLs or `*` | `*` | Configures the `Access-Control-Allow-Origin` HTTP response header. |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5176` | Development URL loaded by the Server Electron window during development. |

### Data Directory Resolution Order
If `QUEEZ_DATA_DIR` is not explicitly set in the environment:
1. In development mode: Local candidates checked in order: `apps/server/data`, `data`, `../data`.
2. In production mode on Windows: `%PROGRAMDATA%\Queez CBT Suite\data` (resolved via `process.env.ALLUSERSPROFILE` or `process.env.ProgramData`).
3. Fallback on Windows: `%APPDATA%\Queez CBT Suite\data`.
4. Fallback on Linux/macOS: `./data` relative to the current working directory.

---

## 4. Assessment Manager (`apps/manager`)

Workstation application used by teachers and administrators:

| Variable Name | Type | Default Value | Description |
| ------------- | ---- | ------------- | ----------- |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5175` | Development URL loaded by the Manager Electron window. |
| `VITE_API_URL` | URL string | `http://localhost:4000` | Default fallback server address before discovery or manual configuration. |
| `WEB_BUILD` | `true` \| `false` | `false` | When true, skips Electron bundling to output static browser assets. |

---

## 5. Student Examination Station (`apps/student`)

Examination kiosk application used by candidates:

| Variable Name | Type | Default Value | Description |
| ------------- | ---- | ------------- | ----------- |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5174` | Development URL loaded by the Student Electron window. |
| `VITE_API_URL` | URL string | `http://localhost:4000` | Default fallback server address before discovery or manual configuration. |
| `VITE_ENABLE_FULLSCREEN` | `true` \| `false` | `true` | Requests full screen mode upon launching an exam runner. |
| `WEB_BUILD` | `true` \| `false` | `false` | When true, produces a browser-only single-page application. |

---

## 6. Client Storage Preferences

Client applications persist preferences and local state in browser localStorage and IndexedDB:

| Storage Key | Storage Type | Default Value | Description |
| ----------- | ------------ | ------------- | ----------- |
| `cbt_server_url` | localStorage | `http://localhost:4000` | Active server base URL used by the HTTP API client. Updated by auto-discovery or manual entry. |
| `cbt_server_autostart` | localStorage | `false` | When `true`, the Server GUI automatically starts the HTTP service upon opening. |
| `cbt_student_session` | localStorage | `null` | Persists candidate login details (`studentId`, `name`, `classGroup`, `seed`) on the station. |
| `cbt_assessments` | IndexedDB | `[]` | Caches assessment definitions locally on the student station, ensuring tests continue during network interruptions. |
| `cbt_submissions` | IndexedDB | `[]` | Queues completed submissions locally until confirmed received by the central server. |

---

## 7. Windows Firewall and Network Rules

To allow zero-configuration discovery and student connections across the local network:

1. **Inbound TCP Traffic on Port 4000 (and fallbacks 4050 to 5000)**:
   The computer hosting the Server application must allow inbound TCP connections on port 4000 so student terminals can send requests.
2. **Inbound UDP Traffic on Port 4001**:
   Workstations running Student and Manager apps must allow inbound UDP packets on port 4001 to receive discovery beacons.
3. **Subnet Broadcast Permission**:
   Local Wi-Fi access points or managed network switches must permit subnet broadcast packets (`255.255.255.255`) and must have Client Isolation (AP Isolation) turned off.
