import { Router, Request, Response } from 'express';
import { analyticsService } from './analytics.service.js';
import { db } from '../../core/db/database.js';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', (_req: Request, res: Response) => {
  const overview = analyticsService.getOverview();
  res.json({ success: true, data: overview });
});

analyticsRouter.post('/reset', (_req: Request, res: Response) => {
  db.resetToSeed();
  res.json({ success: true, message: 'Database reset to starter curriculum demo state.' });
});
