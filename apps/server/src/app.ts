import express from 'express';
import cors from 'cors';
import { assessmentRouter } from './features/assessments/assessment.routes.js';
import { submissionRouter } from './features/submissions/submission.routes.js';
import { packageRouter } from './features/packages/package.routes.js';
import { analyticsRouter } from './features/analytics/analytics.routes.js';

export interface RequestLogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number;
  durationMs: number;
  ip: string;
}

export const createApp = (onRequest?: (entry: RequestLogEntry) => void): express.Application => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  if (onRequest) {
    app.use((req, res, next) => {
      const start = Date.now();
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      res.on('finish', () => {
        onRequest({
          id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.originalUrl || req.url,
          status: res.statusCode,
          durationMs: Date.now() - start,
          ip: ip.replace(/^.*:/, ''),
        });
      });
      next();
    });
  }

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
