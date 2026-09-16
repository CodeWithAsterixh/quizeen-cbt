import { Router } from 'express';
import { themeService } from './theme.service.js';
import { broadcastWsEvent } from '../../core/ws/ws-hub.js';

export const themeRouter = Router();

type ThemeChangeCallback = (theme: any) => void;
const listeners: Set<ThemeChangeCallback> = new Set();

export function onServerThemeChange(cb: ThemeChangeCallback): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

themeRouter.get('/', (_req, res) => {
  const theme = themeService.getTheme();
  res.json({ success: true, data: theme });
});

themeRouter.post('/', (req, res) => {
  const payload = req.body || {};
  const updated = themeService.saveTheme(payload);
  broadcastWsEvent('theme:changed', updated);
  listeners.forEach((cb) => {
    try { cb(updated); } catch {}
  });
  res.json({ success: true, data: updated, message: 'Theme updated successfully' });
});
