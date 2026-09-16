import { Router } from 'express';
import { deviceService } from './device.service.js';

export const deviceRouter = Router();

deviceRouter.post('/heartbeat', (req, res) => {
  const body = req.body || {};
  if (!body.deviceId) {
    res.status(400).json({ success: false, message: 'deviceId is required' });
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)
    || req.socket.remoteAddress
    || body.ip
    || '127.0.0.1';

  const cleanedIp = clientIp.replace(/^.*:/, '');
  const result = deviceService.recordHeartbeat({
    ...body,
    ip: cleanedIp,
  });

  res.json(result);
});

deviceRouter.get('/', (_req, res) => {
  const devices = deviceService.getAllDevices();
  res.json({ success: true, data: devices });
});

deviceRouter.post('/:id/push-update', (req, res) => {
  const { id } = req.params;
  const result = deviceService.pushUpdate(id);
  res.status(result.success ? 200 : 400).json(result);
});

deviceRouter.delete('/offline', (_req, res) => {
  deviceService.clearOffline();
  res.json({ success: true, message: 'Offline devices cleared' });
});
