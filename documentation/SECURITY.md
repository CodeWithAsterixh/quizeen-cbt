# Security policy and disclosure

This document defines the vulnerability reporting policy, service level agreements, and security architecture boundaries for Quizeen CBT.

## Supported software versions

Security patches and bug fixes are maintained for the following release branch:

| Version | Supported | Notes |
| ------- | --------- | ----- |
| 1.0.x   | Yes       | Active production release |
| < 1.0.0 | No        | Prototype releases, unsupported |

## Reporting a vulnerability

Do not report security vulnerabilities in public GitHub issues or forums.

To disclose an issue privately:
1. Send an email to `security@quizeen.internal` or `admin@quizeen.internal`.
2. Provide a technical summary of the finding.
3. Include step-by-step reproduction steps or a working proof of concept.
4. Specify the affected client application (Manager Electron, Student Electron, Student Web, or Central Server).

## Service level agreements

The security team handles incoming reports according to the following schedule:

- Initial acknowledgement: within 24 hours of receipt.
- Triage and severity assessment: within 48 hours.
- Critical patch delivery (CVSS 9.0 or higher): within 72 hours.
- High severity patch delivery (CVSS 7.0 to 8.9): within 7 days.
- Medium and low severity fixes: scheduled in the next minor version release.

## Security architecture rules

### 1. Electron IPC isolation
All Electron window instances must set `contextIsolation: true` and `nodeIntegration: false`. The renderer process communicates with the operating system strictly through predefined IPC channels exposed in `preload.ts`.

### 2. Air-gap package verification
Assessment packages (.qzn) contain manifest checksums. The unpacker verifies archive structure before storing question prompts or answer keys into application storage.

### 3. Focus tracking and test integrity
Student examination clients monitor window blur events. When an examinee leaves the active window, the application increments `windowSwitchCount` and displays a warning dialog. The accumulated switch count is recorded in the final submission payload.
