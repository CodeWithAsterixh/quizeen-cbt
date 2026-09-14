import { Router, Request, Response } from 'express';
import { analyticsService } from './analytics.service.js';
import { db } from '../../core/db/database.js';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', (_req: Request, res: Response) => {
  const overview = analyticsService.getOverview();
  res.status(200).json({ success: true, statusCode: 200, message: 'System summary metrics loaded.', data: overview });
});

analyticsRouter.post('/reset', (_req: Request, res: Response) => {
  db.resetToSeed();
  res.status(200).json({ success: true, statusCode: 200, message: 'Database reset to initial sample data.' });
});
