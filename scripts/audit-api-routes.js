const fs = require('fs');
const path = require('path');

const root = 'c:/Users/peter/Documents/quizeen/cbt-system-prototype';

function getImplementedRoutes() {
  const routesDir = path.join(root, 'apps', 'server', 'src', 'features');
  const serverMounts = [
    { mount: '/health', file: null, inline: { method: 'GET', path: '/health', file: 'apps/server/src/app.ts' } },
    { mount: '/api/assessments', file: 'assessments/assessment.routes.ts' },
    { mount: '/api/exams', file: 'assessments/assessment.routes.ts' },
    { mount: '/api/submissions', file: 'submissions/submission.routes.ts' },
    { mount: '/api/packages', file: 'packages/package.routes.ts' },
    { mount: '/api/analytics', file: 'analytics/analytics.routes.ts' },
    { mount: '/api/students', file: 'students/students.routes.ts' },
  ];

  const routes = [];

  serverMounts.forEach((m) => {
    if (m.inline) {
      routes.push(m.inline);
      return;
    }
    const fPath = path.join(routesDir, m.file);
    if (!fs.existsSync(fPath)) return;
    const content = fs.readFileSync(fPath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const match = line.match(/\.(get|post|put|delete|patch)\(\s*['"`]([^'"`]+)['"`]/i);
      if (match) {
        const method = match[1].toUpperCase();
        const sub = match[2];
        const full = sub === '/' ? m.mount : `${m.mount}${sub}`;
        routes.push({
          method,
          path: full,
          file: `apps/server/src/features/${m.file}`,
          line: idx + 1,
        });
      }
    });
  });

  return routes;
}

function getClientCalls() {
  return [
    {
      name: 'testConnection',
      method: 'GET',
      endpoint: '/health',
      source: 'packages/shared/src/api/server-config.ts',
      purpose: 'Check server reachability and latency',
    },
    {
      name: 'getExams / getAssessments',
      method: 'GET',
      endpoint: '/api/assessments',
      queryParams: ['level', 'targetClass', 'department', 'assessmentType'],
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Fetch assessments with optional class and level filters',
    },
    {
      name: 'createExam / createAssessment',
      method: 'POST',
      endpoint: '/api/assessments',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Create new assessment record on the server',
    },
    {
      name: 'updateExam / updateAssessment',
      method: 'PUT',
      endpoint: '/api/assessments/:id',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Update or upsert assessment details and questions',
    },
    {
      name: 'deleteExam / deleteAssessment',
      method: 'DELETE',
      endpoint: '/api/assessments/:id',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Delete assessment record from server database',
    },
    {
      name: 'submitAnswers',
      method: 'POST',
      endpoint: '/api/submissions',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Submit student answers for automatic grading',
    },
    {
      name: 'getSubmissions',
      method: 'GET',
      endpoint: '/api/submissions',
      queryParams: ['examId'],
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'List graded candidate submission records',
    },
    {
      name: 'gradeSubmission',
      method: 'PUT',
      endpoint: '/api/submissions/:id/grade',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Save reviewed scores and teacher grading adjustments',
    },
    {
      name: 'compilePackage',
      method: 'POST',
      endpoint: '/api/packages/compile',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Export assessments and schedules into encrypted zip',
    },
    {
      name: 'unpackPackage',
      method: 'POST',
      endpoint: '/api/packages/unpack',
      source: 'packages/shared/src/api/api-client.ts',
      purpose: 'Import encrypted assessment zip file onto server',
    },
    {
      name: 'getStudents',
      method: 'GET',
      endpoint: '/api/students',
      source: 'packages/shared/src/api/student-api.ts',
      purpose: 'Fetch roster of registered students',
    },
    {
      name: 'getStudentByCode',
      method: 'GET',
      endpoint: '/api/students/code/:code',
      source: 'packages/shared/src/api/student-api.ts',
      purpose: 'Verify candidate 6-character OTP login code',
    },
    {
      name: 'saveStudent',
      method: 'POST',
      endpoint: '/api/students',
      source: 'packages/shared/src/api/student-api.ts',
      purpose: 'Create or update student profile record',
    },
    {
      name: 'generateStudentCode',
      method: 'POST',
      endpoint: '/api/students/:id/generate-code',
      source: 'packages/shared/src/api/student-api.ts',
      purpose: 'Generate individual 6-character OTP login code',
    },
    {
      name: 'generateAllStudentCodes',
      method: 'POST',
      endpoint: '/api/students/generate-all',
      source: 'packages/shared/src/api/student-api.ts',
      purpose: 'Batch-generate codes for selected students or class',
    },
    {
      name: 'deleteStudent',
      method: 'DELETE',
      endpoint: '/api/students/:id',
      source: 'packages/shared/src/api/student-api.ts',
      purpose: 'Remove student registration record',
    },
  ];
}

function runAudit() {
  const implemented = getImplementedRoutes();
  const called = getClientCalls();

  console.log('========================================================================');
  console.log('QUEEZ CBT SYSTEM - API ROUTE AND CLIENT CALL AUDIT');
  console.log('========================================================================\n');

  console.log(`Server Routes Implemented: ${implemented.length}`);
  console.log(`Client Methods Defined:    ${called.length}\n`);

  console.log('------------------------------------------------------------------------');
  console.log('CLIENT CALLS TO SERVER MAPPING:');
  console.log('------------------------------------------------------------------------');

  called.forEach((c) => {
    const match = implemented.find((r) => {
      if (r.method !== c.method) return false;
      const normR = r.path.replace(/:[a-zA-Z0-9_]+/g, ':param');
      const normC = c.endpoint.replace(/:[a-zA-Z0-9_]+/g, ':param');
      return normR === normC;
    });

    const status = match ? 'ACTIVE MATCH' : 'MISSING ROUTE';
    console.log(`[${c.method.padEnd(6)}] ${c.endpoint.padEnd(38)} -> ${c.name.padEnd(26)} [${status}]`);
  });

  console.log('\n------------------------------------------------------------------------');
  console.log('SERVER ROUTES NOT DIRECTLY CALLED BY FRONTEND CLIENT:');
  console.log('------------------------------------------------------------------------');

  implemented.forEach((r) => {
    const isCalled = called.some((c) => {
      if (r.method !== c.method) return false;
      const normR = r.path.replace(/:[a-zA-Z0-9_]+/g, ':param');
      const normC = c.endpoint.replace(/:[a-zA-Z0-9_]+/g, ':param');
      return normR === normC;
    });

    if (!isCalled) {
      console.log(`[${r.method.padEnd(6)}] ${r.path.padEnd(38)} (${r.file})`);
    }
  });

  console.log('\n========================================================================\n');
}

if (require.main === module) {
  runAudit();
}

module.exports = { getImplementedRoutes, getClientCalls, runAudit };
