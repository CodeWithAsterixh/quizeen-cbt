import { Router } from 'express';
import { cryptoLicenseService } from './crypto-license.service.js';

export const licenseRouter = Router();

licenseRouter.get('/', (_req, res) => {
  const state = cryptoLicenseService.getLicenseState();
  res.json({ success: true, data: state });
});

licenseRouter.post('/activate', (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, error: 'Token string is required' });
  }

  const result = cryptoLicenseService.activateLicense(token);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error, state: result.state });
  }

  res.json({ success: true, message: 'License activated successfully', state: result.state });
});

licenseRouter.post('/sync', async (req, res) => {
  const { cloudUrl } = req.body || {};
  const current = cryptoLicenseService.getLicenseState();

  if (!cloudUrl) {
    return res.json({ success: true, message: 'Offline validation verified', state: current });
  }

  try {
    const resp = await fetch(`${cloudUrl}/api/license/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hardwareId: current.hardwareId,
        licenseId: current.license?.licenseId,
      }),
    });

    if (!resp.ok) {
      return res.status(400).json({ success: false, error: 'Cloud sync rejected by server' });
    }

    const cloudData = await resp.json();
    if (cloudData.token) {
      const act = cryptoLicenseService.activateLicense(cloudData.token);
      return res.json({ success: true, message: 'Term renewed from cloud', state: act.state });
    }

    res.json({ success: true, message: 'License confirmed active', state: current });
  } catch (err: any) {
    res.status(502).json({ success: false, error: err?.message || 'Failed to reach cloud server' });
  }
});
