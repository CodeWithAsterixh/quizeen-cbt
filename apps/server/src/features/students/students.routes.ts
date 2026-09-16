import { Router, Request, Response } from 'express';
import { studentsService } from './students.service.js';
import { broadcastWsEvent } from '../../core/ws/ws-hub.js';

export const studentsRouter = Router();

studentsRouter.get('/', (_req: Request, res: Response) => {
  const list = studentsService.getAll();
  res.status(200).json({ success: true, statusCode: 200, message: 'Student list loaded successfully.', data: list });
});

studentsRouter.get('/code/:code', (req: Request, res: Response) => {
  const student = studentsService.getByCode(req.params.code as string);
  if (!student) {
    return res.status(404).json({ success: false, statusCode: 404, message: 'This student code was not recognized. Please check with your teacher.' });
  }
  res.status(200).json({ success: true, statusCode: 200, message: 'Student ID verified successfully.', data: student });
});

studentsRouter.post('/', (req: Request, res: Response) => {
  const { name, educationLevel, classGroup } = req.body;
  if (!name || !educationLevel || !classGroup) {
    return res.status(400).json({ success: false, statusCode: 400, message: 'Please enter the student full name, school level, and class group.' });
  }
  const student = studentsService.save(req.body);
  broadcastWsEvent('students:changed', { action: 'saved', id: student.id });
  res.status(201).json({ success: true, statusCode: 201, message: 'Student registered successfully.', data: student });
});

studentsRouter.post('/:id/generate-code', (req: Request, res: Response) => {
  const student = studentsService.generateCode(req.params.id as string, req.body);
  if (!student) return res.status(404).json({ success: false, statusCode: 404, message: 'Student profile was not found to generate code.' });
  broadcastWsEvent('students:changed', { action: 'code_generated', id: student.id });
  res.status(200).json({ success: true, statusCode: 200, message: 'New student access code generated.', data: student });
});

studentsRouter.post('/generate-all', (req: Request, res: Response) => {
  const updated = studentsService.generateAllCodes(req.body.classGroup, req.body.studentIds);
  broadcastWsEvent('students:changed', { action: 'batch_codes_generated' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Access codes generated for all selected students.', data: updated });
});

studentsRouter.delete('/:id', (req: Request, res: Response) => {
  const existed = studentsService.getAll().find((s) => s.id === req.params.id);
  studentsService.delete(req.params.id as string);
  if (!existed) return res.status(404).json({ success: false, statusCode: 404, message: 'Student was already removed or does not exist.' });
  broadcastWsEvent('students:changed', { action: 'deleted', id: req.params.id });
  res.status(200).json({ success: true, statusCode: 200, message: 'Student record removed.' });
});
