# Environment configuration specification

This specification defines the runtime environment variables used by the Quizeen applications.

## Common variables

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` | Adjusts logging verbosity, sourcemap generation, and runtime assertions. |
| `PORT` | Number | `4000` | Network port for the central HTTP API server. |
| `CBT_DISCOVERY_PORT` | Number | `4001` | UDP port used for local network broadcast discovery beacons. |

## Manager application (`apps/manager`)

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5175` | Development URL loaded by the Electron main process. |
| `VITE_API_URL` | URL string | `http://localhost:4000` | Fallback base URL for assessment sync and submission retrieval. |
| `WEB_BUILD` | `true` \| `false` | `false` | When true, skips Electron plugin bundles to produce browser assets. |

Note: The active server address can also be set or auto-discovered dynamically in the Manager Settings interface.

## Student application (`apps/student`)

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5174` | Development URL loaded by the Electron main process. |
| `VITE_API_URL` | URL string | `http://localhost:4000` | Fallback base URL for loading tests and posting completed submissions. |
| `VITE_ENABLE_FULLSCREEN` | `true` \| `false` | `true` | Requests full screen mode upon opening an exam runner. |
| `WEB_BUILD` | `true` \| `false` | `false` | When true, produces a browser-only single-page application. |

Note: The active server address can also be set or auto-discovered dynamically in the Student Settings interface.

## Server application (`apps/server`)

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `PORT` | Number | `4000` | Port on which the Express HTTP server listens. |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5176` | Development URL loaded by the Electron GUI window. |
| `CORS_ORIGIN` | Comma-delimited URLs or `*` | `*` | Controls Access-Control-Allow-Origin response headers. |
| `DATA_DIR` | Directory path | `./data` | File system location for JSON storage files and package archives. |

## Client storage preferences

The following keys persist client-side preferences in local browser storage:

| Storage key | Default | Description |
| ----------- | ------- | ----------- |
| `cbt_server_url` | `http://localhost:4000` | Current active server base URL used by `apiClient`. |
| `cbt_server_autostart` | `false` | When true, the Server app automatically launches the HTTP service on startup. |
