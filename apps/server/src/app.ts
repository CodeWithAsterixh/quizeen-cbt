import express from 'express';
import cors from 'cors';
import { assessmentRouter } from './features/assessments/assessment.routes.js';
import { submissionRouter } from './features/submissions/submission.routes.js';
import { packageRouter } from './features/packages/package.routes.js';
import { analyticsRouter } from './features/analytics/analytics.routes.js';

export const createApp = (): express.Application => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'cbt-server', timestamp: new Date().toISOString() });
  });

  app.use('/api/assessments', assessmentRouter);
  app.use('/api/exams', assessmentRouter);
  app.use('/api/submissions', submissionRouter);
  app.use('/api/packages', packageRouter);
  app.use('/api/analytics', analyticsRouter);

  return app;
};
