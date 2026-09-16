import { Router } from 'express';
import { cryptoLicenseService } from './crypto-license.service.js';
import { getLicensingPortalUrl, setLicensingPortalUrl } from './portal-config.service.js';
import { broadcastWsEvent } from '../../core/ws/ws-hub.js';

export const licenseRouter = Router();

licenseRouter.get('/', (_req, res) => {
  const state = cryptoLicenseService.getLicenseState();
  res.json({ success: true, data: state, portalUrl: getLicensingPortalUrl() });
});

licenseRouter.post('/portal-url', (req, res) => {
  const { url } = req.body || {};
  if (typeof url === 'string') setLicensingPortalUrl(url);
  res.json({ success: true, portalUrl: getLicensingPortalUrl() });
});

licenseRouter.post('/activate', async (req, res) => {
  const input = String(req.body?.key || req.body?.token || '').trim();
  if (!input) return res.status(400).json({ success: false, error: 'Activation key or token is required' });

  if (input.startsWith('{') || input.startsWith('[')) {
    const result = cryptoLicenseService.activateLicense(input);
    if (!result.success) return res.status(400).json({ success: false, error: result.error, state: result.state });
    broadcastWsEvent('license:changed', result.state);
    return res.json({ success: true, message: 'License activated successfully', state: result.state });
  }

  const cloudUrl = getLicensingPortalUrl(req.body?.cloudUrl);
  if (!cloudUrl) return res.status(400).json({ success: false, error: 'Licensing portal URL is not configured' });

  const current = cryptoLicenseService.getLicenseState();
  try {
    const resp = await fetch(`${cloudUrl}/api/license/activate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: input, hardwareId: current.hardwareId }),
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ success: false, error: data.error || 'Portal activation failed' });

    const tokenStr = typeof data.token === 'string' ? data.token : JSON.stringify(data.token);
    const result = cryptoLicenseService.activateLicense(tokenStr);
    if (!result.success) return res.status(400).json({ success: false, error: result.error, state: result.state });
    broadcastWsEvent('license:changed', result.state);
    return res.json({ success: true, message: 'License activated successfully from portal', state: result.state });
  } catch (err: any) {
    return res.status(502).json({ success: false, error: err?.message || 'Could not connect to licensing portal' });
  }
});

licenseRouter.post('/sync', async (req, res) => {
  const cloudUrl = getLicensingPortalUrl(req.body?.cloudUrl);
  if (!cloudUrl) return res.status(400).json({ success: false, error: 'Licensing portal URL is not configured' });

  const current = cryptoLicenseService.getLicenseState();
  try {
    const resp = await fetch(`${cloudUrl}/api/license/sync`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hardwareId: current.hardwareId, licenseId: current.license?.licenseId }),
    });
    if (!resp.ok) return res.status(400).json({ success: false, error: 'Cloud sync rejected by server' });

    const cloudData = await resp.json();
    if (cloudData.status === 'revoked') {
      cryptoLicenseService.removeLicense();
      const state = cryptoLicenseService.getLicenseState();
      broadcastWsEvent('license:changed', state);
      return res.json({ success: false, message: 'License revoked', state });
    }
    if (cloudData.token) {
      const tokenStr = typeof cloudData.token === 'string' ? cloudData.token : JSON.stringify(cloudData.token);
      const act = cryptoLicenseService.activateLicense(tokenStr);
      broadcastWsEvent('license:changed', act.state);
      return res.json({ success: true, message: 'Term renewed from cloud', state: act.state });
    }
    res.json({ success: true, message: 'License confirmed active', state: current });
  } catch (err: any) {
    res.status(502).json({ success: false, error: err?.message || 'Failed to reach cloud server' });
  }
});
