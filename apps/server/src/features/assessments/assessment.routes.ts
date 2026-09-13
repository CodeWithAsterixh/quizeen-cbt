import { Router, Request, Response } from 'express';
import { assessmentService } from './assessment.service.js';
import { EducationLevel, Department } from '@cbt/shared';

export const assessmentRouter = Router();

assessmentRouter.get('/', (req: Request, res: Response) => {
  const { level, targetClass, department, assessmentType } = req.query;
  const items = assessmentService.listAssessments({
    level: level as EducationLevel | undefined,
    targetClass: targetClass as string | undefined,
    department: department as Department | undefined,
    assessmentType: assessmentType as string | undefined,
  });
  res.json({ success: true, data: items });
});

assessmentRouter.get('/:id', (req: Request, res: Response) => {
  const item = assessmentService.getAssessment(req.params.id as string);
  if (!item) return res.status(404).json({ success: false, error: 'Assessment not found' });
  res.json({ success: true, data: item });
});

assessmentRouter.post('/', (req: Request, res: Response) => {
  try {
    const item = assessmentService.createAssessment(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

assessmentRouter.put('/:id', (req: Request, res: Response) => {
  const updated = assessmentService.updateAssessment(req.params.id as string, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Assessment not found' });
  res.json({ success: true, data: updated });
});

assessmentRouter.delete('/:id', (req: Request, res: Response) => {
  const ok = assessmentService.deleteAssessment(req.params.id as string);
  if (!ok) return res.status(404).json({ success: false, error: 'Assessment not found' });
  res.json({ success: true, message: 'Assessment deleted successfully' });
});

assessmentRouter.post('/:id/verify-pin', (req: Request, res: Response) => {
  const { pin = '' } = req.body;
  const valid = assessmentService.verifyPin(req.params.id as string, pin);
  res.json({ success: true, data: { valid } });
});

export const examRouter = assessmentRouter;
