import { Router, Request, Response } from 'express';
import { gradingService } from './grading.service.js';

export const submissionRouter = Router();

submissionRouter.get('/', (req: Request, res: Response) => {
  const { examId } = req.query;
  const submissions = gradingService.listSubmissions(examId as string | undefined);
  res.json({ success: true, data: submissions });
});

submissionRouter.get('/:id', (req: Request, res: Response) => {
  const submissions = gradingService.listSubmissions();
  const sub = submissions.find((s) => s.id === (req.params.id as string));
  if (!sub) return res.status(404).json({ success: false, error: 'Submission not found' });
  res.json({ success: true, data: sub });
});

submissionRouter.post('/', (req: Request, res: Response) => {
  try {
    const submission = gradingService.submitAndGrade(req.body);
    res.status(201).json({
      success: true,
      message: 'Your exams have been sent for grading.',
      data: submission,
    });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

submissionRouter.put('/:id/grade', (req: Request, res: Response) => {
  try {
    const updated = gradingService.reviewSubmission(req.params.id as string, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Submission not found' });
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});
