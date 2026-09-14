import { Router, Request, Response } from 'express';
import { packageService } from './package.service.js';

export const packageRouter = Router();

packageRouter.post('/compile', async (req: Request, res: Response) => {
  try {
    if (!req.body.examIds || req.body.examIds.length === 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Please select at least one assessment to package.' });
    }
    const { buffer, filename } = await packageService.compilePackage(req.body);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Status-Message', 'Offline package created successfully.');
    res.status(200).send(buffer);
  } catch (err: unknown) {
    res.status(400).json({ success: false, statusCode: 400, message: (err as Error).message || 'Unable to build offline package.' });
  }
});

packageRouter.post('/unpack', async (req: Request, res: Response) => {
  try {
    const { zipBase64 } = req.body;
    if (!zipBase64) return res.status(400).json({ success: false, statusCode: 400, message: 'Please provide an offline package file to unpack.' });
    const buffer = Buffer.from(zipBase64, 'base64');
    const result = await packageService.unpackPackage(buffer);
    res.status(200).json({ success: true, statusCode: 200, message: `Unpacked ${result.importedCount} assessment(s) successfully.`, data: result });
  } catch (err: unknown) {
    res.status(400).json({ success: false, statusCode: 400, message: (err as Error).message || 'Unable to unpack this package file.' });
  }
});
