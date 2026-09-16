import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

export function setupIpc(getMainWindow: () => BrowserWindow | null) {
  const getFilePath = (key: string) => path.join(app.getPath('userData'), `${key}.json`);

  ipcMain.handle('storage:read', (_, key: string) => {
    const p = getFilePath(key);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null;
  });

  ipcMain.handle('storage:write', (_, key: string, data: string) => {
    try { fs.writeFileSync(getFilePath(key), data, 'utf-8'); return true; } catch { return false; }
  });

  ipcMain.handle('window:minimize', () => getMainWindow()?.minimize());
  ipcMain.handle('window:maximize', () => {
    const win = getMainWindow();
    if (win?.isMaximized()) { win.unmaximize(); return false; }
    win?.maximize();
    return true;
  });
  ipcMain.handle('window:close', () => getMainWindow()?.close());
  ipcMain.handle('window:isMaximized', () => getMainWindow()?.isMaximized() ?? false);

  // Exam kiosk mode: lock the window so students cannot leave the exam screen.
  // - setAlwaysOnTop keeps the window above everything else (Task Manager, alt-tab overlay)
  // - setFullScreen forces fullscreen without a title bar to grab
  // - intercept 'close' so clicking X or Alt+F4 has no effect during exam
  ipcMain.handle('exam:enter', () => {
    const win = getMainWindow();
    if (!win) return;
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setFullScreen(true);
    win.setMenuBarVisibility(false);
    win.setClosable(false);
    win.on('blur', refocusHandler);
  });

  ipcMain.handle('exam:exit', () => {
    const win = getMainWindow();
    if (!win) return;
    win.setAlwaysOnTop(false);
    win.setFullScreen(false);
    win.setMenuBarVisibility(false);
    win.setClosable(true);
    win.removeListener('blur', refocusHandler);
  });

  function refocusHandler() {
    const win = getMainWindow();
    if (!win) return;
    // Small delay prevents race condition on some Windows versions
    setTimeout(() => { try { win.focus(); } catch {} }, 80);
  }
}
