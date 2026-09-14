import { Router, Request, Response } from 'express';
import { gradingService } from './grading.service.js';

export const submissionRouter = Router();

submissionRouter.get('/', (req: Request, res: Response) => {
  const submissions = gradingService.listSubmissions(req.query.examId as string | undefined);
  res.status(200).json({ success: true, statusCode: 200, message: 'Submissions loaded successfully.', data: submissions });
});

submissionRouter.get('/:id', (req: Request, res: Response) => {
  const sub = gradingService.listSubmissions().find((s) => s.id === (req.params.id as string));
  if (!sub) return res.status(404).json({ success: false, statusCode: 404, message: 'Submission record not found.' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Submission details loaded.', data: sub });
});

submissionRouter.post('/', (req: Request, res: Response) => {
  try {
    if (!req.body.studentName || !req.body.examId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Missing student name or assessment reference for submission.' });
    }
    const submission = gradingService.submitAndGrade(req.body);
    res.status(201).json({ success: true, statusCode: 201, message: 'Your assessment has been submitted and recorded.', data: submission });
  } catch (err: unknown) {
    res.status(400).json({ success: false, statusCode: 400, message: (err as Error).message || 'Unable to submit your answers.' });
  }
});

submissionRouter.post('/live', (req: Request, res: Response) => {
  try {
    if (!req.body.studentName || !req.body.examId) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Missing student name or assessment reference.' });
    }
    const live = gradingService.recordLiveSession(req.body);
    res.status(200).json({ success: true, statusCode: 200, message: 'Live session updated.', data: live });
  } catch (err: unknown) {
    res.status(400).json({ success: false, statusCode: 400, message: (err as Error).message || 'Unable to update live session.' });
  }
});

submissionRouter.put('/:id/grade', (req: Request, res: Response) => {
  try {
    const updated = gradingService.reviewSubmission(req.params.id as string, req.body);
    if (!updated) return res.status(404).json({ success: false, statusCode: 404, message: 'Could not find this submission to update grades.' });
    res.status(200).json({ success: true, statusCode: 200, message: 'Grades and review updated successfully.', data: updated });
  } catch (err: unknown) {
    res.status(400).json({ success: false, statusCode: 400, message: (err as Error).message || 'Unable to save grades.' });
  }
});
