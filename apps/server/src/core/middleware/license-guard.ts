import { Request, Response, NextFunction } from 'express';
import { cryptoLicenseService } from '../../features/license/crypto-license.service.js';

export function licenseGuardMiddleware(_req: Request, res: Response, next: NextFunction) {
  const state = cryptoLicenseService.getLicenseState();
  if (state.status === 'tampered' || state.status === 'hardware_mismatch') {
    return res.status(403).json({
      success: false,
      error: state.message || 'License verification failed',
      code: 'LICENSE_INVALID',
      data: state,
    });
  }
  next();
}
