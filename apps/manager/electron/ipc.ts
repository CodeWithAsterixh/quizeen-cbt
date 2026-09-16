import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

import { applyRuntimeBranding } from './branding-service.js';

export function setupIpc(getMainWindow: () => BrowserWindow | null) {
  const getFilePath = (key: string) => path.join(app.getPath('userData'), `${key}.json`);

  ipcMain.handle('app:apply-branding', (_, b) => applyRuntimeBranding(b, getMainWindow()));

  ipcMain.handle('storage:read', (_, key: string) => {
    const p = getFilePath(key);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null;
  });

  ipcMain.handle('storage:write', (_, key: string, data: string) => {
    try {
      fs.writeFileSync(getFilePath(key), data, 'utf-8');
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('window:minimize', () => getMainWindow()?.minimize());
  ipcMain.handle('window:maximize', () => {
    const win = getMainWindow();
    if (win?.isMaximized()) {
      win.unmaximize();
      return false;
    }
    win?.maximize();
    return true;
  });
  ipcMain.handle('window:close', () => getMainWindow()?.close());
  ipcMain.handle('window:isMaximized', () => getMainWindow()?.isMaximized() ?? false);
}
