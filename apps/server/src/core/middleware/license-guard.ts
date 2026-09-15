import { Request, Response, NextFunction } from 'express';
import { cryptoLicenseService } from '../../features/license/crypto-license.service.js';

export function licenseGuardMiddleware(_req: Request, res: Response, next: NextFunction) {
  const state = cryptoLicenseService.getLicenseState();
  if (state.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: state.message || 'Central Server requires an active license',
      code: 'LICENSE_REQUIRED',
      data: state,
    });
  }
  next();
}
