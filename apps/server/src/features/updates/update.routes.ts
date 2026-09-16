import fs from 'node:fs';
import { Router } from 'express';
import { updateService } from './update.service.js';

export const updateRouter = Router();

updateRouter.get('/check', (req, res) => {
  const app = String(req.query.app || 'student');
  const currentVersion = String(req.query.v || '1.0.0');

  const result = updateService.checkForUpdate(app, currentVersion);
  res.json({ success: true, data: result });
});

updateRouter.get('/status', (_req, res) => {
  const data = updateService.getStagedUpdates();
  res.json({ success: true, data });
});

updateRouter.get('/download/:app', (req, res) => {
  const { app } = req.params;
  const file = updateService.getUpdateFile(app);

  if (!file) {
    res.status(404).json({ success: false, message: `No update package available for ${app}` });
    return;
  }

  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', file.size);

  const stream = fs.createReadStream(file.filePath);
  stream.on('error', () => {
    if (!res.headersSent) res.status(500).json({ success: false, message: 'Read error' });
  });
  stream.pipe(res);
});
