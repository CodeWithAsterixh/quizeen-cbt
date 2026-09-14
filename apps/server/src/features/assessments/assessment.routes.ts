import { Router, Request, Response } from 'express';
import { assessmentService } from './assessment.service.js';
import { EducationLevel, Department } from '@cbt/shared';

export const assessmentRouter = Router();

assessmentRouter.get('/', (req: Request, res: Response) => {
  const { level, targetClass, department, assessmentType } = req.query;
  const items = assessmentService.listAssessments({
    level: level as EducationLevel | undefined, targetClass: targetClass as string | undefined,
    department: department as Department | undefined, assessmentType: assessmentType as string | undefined,
  });
  res.status(200).json({ success: true, statusCode: 200, message: items.length > 0 ? 'Assessments loaded.' : 'No assessments match criteria.', data: items });
});

assessmentRouter.get('/:id', (req: Request, res: Response) => {
  const item = assessmentService.getAssessment(req.params.id as string);
  if (!item) return res.status(404).json({ success: false, statusCode: 404, message: 'This assessment was not found. It may have been deleted.' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Assessment details loaded.', data: item });
});

assessmentRouter.post('/', (req: Request, res: Response) => {
  try {
    if (!req.body.subject?.trim()) return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide a subject title.' });
    const item = assessmentService.createAssessment(req.body);
    res.status(201).json({ success: true, statusCode: 201, message: 'New assessment saved and ready for students.', data: item });
  } catch (err: unknown) {
    res.status(400).json({ success: false, statusCode: 400, message: (err as Error).message || 'Unable to save assessment.' });
  }
});

assessmentRouter.put('/:id', (req: Request, res: Response) => {
  const updated = assessmentService.updateAssessment(req.params.id as string, req.body);
  if (!updated) return res.status(404).json({ success: false, statusCode: 404, message: 'Could not update because assessment was not found.' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Assessment updates saved successfully.', data: updated });
});

assessmentRouter.delete('/:id', (req: Request, res: Response) => {
  const existed = assessmentService.getAssessment(req.params.id as string);
  assessmentService.deleteAssessment(req.params.id as string);
  if (!existed) return res.status(404).json({ success: false, statusCode: 404, message: 'Assessment was already removed or does not exist.' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Assessment was removed successfully.' });
});

assessmentRouter.post('/:id/verify-pin', (req: Request, res: Response) => {
  const assessment = assessmentService.getAssessment(req.params.id as string);
  if (!assessment) return res.status(404).json({ success: false, statusCode: 404, message: 'Assessment not found.', data: { valid: false } });
  const valid = assessmentService.verifyPin(req.params.id as string, req.body.pin || '');
  if (!valid) return res.status(403).json({ success: false, statusCode: 403, message: 'Incorrect PIN. Please check the code with your teacher.', data: { valid: false } });
  res.status(200).json({ success: true, statusCode: 200, message: 'Access PIN verified. You can start the assessment.', data: { valid: true } });
});

export const examRouter = assessmentRouter;
