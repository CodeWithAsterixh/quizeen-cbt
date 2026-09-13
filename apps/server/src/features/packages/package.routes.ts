import { Router, Request, Response } from 'express';
import { packageService } from './package.service.js';

export const packageRouter = Router();

packageRouter.post('/compile', async (req: Request, res: Response) => {
  try {
    const { buffer, filename } = await packageService.compilePackage(req.body);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

packageRouter.post('/unpack', async (req: Request, res: Response) => {
  try {
    const { zipBase64 } = req.body;
    if (!zipBase64) return res.status(400).json({ success: false, error: 'zipBase64 required' });
    const buffer = Buffer.from(zipBase64, 'base64');
    const result = await packageService.unpackPackage(buffer);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});
