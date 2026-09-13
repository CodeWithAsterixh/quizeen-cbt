import { Router, Request, Response } from 'express';
import { studentsService } from './students.service.js';

export const studentsRouter = Router();

studentsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: studentsService.getAll() });
});

studentsRouter.get('/code/:code', (req: Request, res: Response) => {
  const student = studentsService.getByCode(req.params.code as string);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found with this code.' });
  }
  res.json({ success: true, data: student });
});

studentsRouter.post('/', (req: Request, res: Response) => {
  const { name, educationLevel, classGroup } = req.body;
  if (!name || !educationLevel || !classGroup) {
    return res.status(400).json({ success: false, message: 'Name, level, and class group are required.' });
  }
  const student = studentsService.save(req.body);
  res.status(201).json({ success: true, data: student });
});

studentsRouter.post('/:id/generate-code', (req: Request, res: Response) => {
  const student = studentsService.generateCode(req.params.id as string);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, data: student });
});

studentsRouter.post('/generate-all', (req: Request, res: Response) => {
  const updated = studentsService.generateAllCodes(req.body.classGroup, req.body.studentIds);
  res.json({ success: true, data: updated });
});

studentsRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = studentsService.delete(req.params.id as string);
  res.json({ success: deleted });
});
