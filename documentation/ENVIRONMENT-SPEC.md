# Environment configuration specification

This specification defines the runtime environment variables used by the Quizeen applications.

## Common variables

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` | Adjusts logging verbosity, sourcemap generation, and runtime assertions. |
| `PORT` | Number | `3001` | Network port for the server process. |

## Manager application (`apps/manager`)

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5175` | Development URL loaded by the Electron main process. |
| `VITE_API_URL` | URL string | `http://localhost:3001` | Base URL for assessment sync and submission retrieval. |
| `WEB_BUILD` | `true` \| `false` | `false` | When true, skips Electron plugin bundles to produce browser assets. |

## Student application (`apps/student`)

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `VITE_DEV_SERVER_URL` | URL string | `http://localhost:5174` | Development URL loaded by the Electron main process. |
| `VITE_API_URL` | URL string | `http://localhost:3001` | Base URL for loading online tests and posting completed submissions. |
| `VITE_ENABLE_FULLSCREEN` | `true` \| `false` | `true` | Requests full screen mode upon opening an exam runner. |
| `WEB_BUILD` | `true` \| `false` | `false` | When true, produces a browser-only single-page application. |

## Server application (`apps/server`)

| Variable name | Expected type | Default value | Description and impact |
| ------------- | ------------- | ------------- | ---------------------- |
| `PORT` | Number | `3001` | Port on which the Express HTTP server listens. |
| `CORS_ORIGIN` | Comma-delimited URLs or `*` | `*` | Controls Access-Control-Allow-Origin response headers. |
| `DATA_DIR` | Directory path | `./data` | File system location for JSON storage files and package archives. |

## Example configuration file (`apps/server/.env`)

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=http://localhost:5174,http://localhost:5175
DATA_DIR=./data
```
