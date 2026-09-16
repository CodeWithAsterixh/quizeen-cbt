import { Router, Request, Response } from 'express';
import { studentsService } from './students.service.js';
import { broadcastWsEvent } from '../../core/ws/ws-hub.js';

export const studentsRouter = Router();

studentsRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, statusCode: 200, message: 'Students loaded.', data: studentsService.getAll() });
});

studentsRouter.get('/code/:code', (req: Request, res: Response) => {
  const student = studentsService.getByCode(req.params.code as string);
  if (!student) return res.status(404).json({ success: false, statusCode: 404, message: 'Student code was not recognized.' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Student verified.', data: student });
});

studentsRouter.post('/', (req: Request, res: Response) => {
  const { name, educationLevel, classGroup } = req.body;
  if (!name || !educationLevel || !classGroup) {
    return res.status(400).json({ success: false, statusCode: 400, message: 'Missing required student fields.' });
  }
  const student = studentsService.save(req.body);
  broadcastWsEvent('students:changed', { action: 'saved', id: student.id });
  res.status(201).json({ success: true, statusCode: 201, message: 'Student registered successfully.', data: student });
});

studentsRouter.put('/:id', (req: Request, res: Response) => {
  const updated = studentsService.update(req.params.id as string, req.body);
  if (!updated) return res.status(404).json({ success: false, statusCode: 404, message: 'Student not found.' });
  broadcastWsEvent('students:changed', { action: 'updated', id: updated.id });
  res.status(200).json({ success: true, statusCode: 200, message: 'Student updated.', data: updated });
});

studentsRouter.post('/promote', (req: Request, res: Response) => {
  const { studentIds, targetClass, educationLevel, department } = req.body;
  if (!Array.isArray(studentIds) || !targetClass) {
    return res.status(400).json({ success: false, statusCode: 400, message: 'Missing students or target class.' });
  }
  const updated = studentsService.promote(studentIds, targetClass, educationLevel, department);
  broadcastWsEvent('students:changed', { action: 'promoted', count: updated.length });
  res.status(200).json({ success: true, statusCode: 200, message: 'Students moved to next class.', data: updated });
});

studentsRouter.post('/:id/generate-code', (req: Request, res: Response) => {
  const student = studentsService.generateCode(req.params.id as string, req.body);
  if (!student) return res.status(404).json({ success: false, statusCode: 404, message: 'Student not found.' });
  broadcastWsEvent('students:changed', { action: 'code_generated', id: student.id });
  res.status(200).json({ success: true, statusCode: 200, message: 'New code generated.', data: student });
});

studentsRouter.post('/generate-all', (req: Request, res: Response) => {
  const updated = studentsService.generateAllCodes(req.body.classGroup, req.body.studentIds);
  broadcastWsEvent('students:changed', { action: 'batch_codes_generated' });
  res.status(200).json({ success: true, statusCode: 200, message: 'Batch codes generated.', data: updated });
});

studentsRouter.delete('/:id', (req: Request, res: Response) => {
  const existed = studentsService.getAll().some((s) => s.id === req.params.id);
  studentsService.delete(req.params.id as string);
  if (!existed) return res.status(404).json({ success: false, statusCode: 404, message: 'Student not found.' });
  broadcastWsEvent('students:changed', { action: 'deleted', id: req.params.id });
  res.status(200).json({ success: true, statusCode: 200, message: 'Student removed.' });
});
