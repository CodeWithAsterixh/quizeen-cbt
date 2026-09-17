process.env.WS_NO_BUFFER_UTIL = 'true';
process.env.WS_NO_UTF_8_VALIDATE = 'true';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import { ServerManager } from './server-manager.js';
import { onServerThemeChange } from '../src/features/theme/theme.routes.js';
import { themeService } from '../src/features/theme/theme.service.js';
import { applyRuntimeBranding, applyCachedBranding, getInitialAppName } from './branding-service.js';
import { cryptoLicenseService } from '../src/features/license/crypto-license.service.js';
import { bakedWhitelabelConfig } from '@cbt/shared';

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=384');
app.commandLine.appendSwitch('enable-features', 'NetworkServiceInProcess');

let mainWindow: BrowserWindow | null = null;
const serverManager = new ServerManager((entry) => mainWindow?.webContents.send('server:request-logged', entry));
onServerThemeChange((theme) => mainWindow?.webContents.send('server:theme-changed', theme));

function createWindow() {
  const appTitle = getInitialAppName();
  app.name = appTitle;
  mainWindow = new BrowserWindow({
    width: 1080, height: 720, minWidth: 840,
    title: appTitle, icon: path.join(__dirname, '../dist/icon.png'),
    frame: false, backgroundColor: '#f2f7f4', show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, contextIsolation: true, sandbox: false, devTools: true,
      spellcheck: false,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('unresponsive', () => {
    dialog.showMessageBox(mainWindow!, {
      type: 'warning',
      title: appTitle,
      message: `${appTitle} is not responding`,
      detail: 'The server application is taking longer than expected. You can wait or restart.',
      buttons: ['Wait', 'Restart Application', 'Close'],
      defaultId: 0,
      cancelId: 0,
    }).then(({ response }) => {
      if (response === 1) { app.relaunch(); app.exit(0); }
      else if (response === 2) { mainWindow?.destroy(); }
    });
  });
  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5176';
  mainWindow.webContents.on('did-fail-load', (_e, code, desc) => {
    console.warn(`Server UI load failed (${code}: ${desc}), retrying...`);
    setTimeout(() => { if (!app.isPackaged) mainWindow?.loadURL(devUrl); else mainWindow?.loadFile(path.join(__dirname, '../dist/index.html')); }, 1000);
  });
  setTimeout(() => { if (mainWindow && !mainWindow.isVisible()) mainWindow.show(); }, 3500);
  mainWindow.webContents.on('before-input-event', (e, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') { mainWindow?.webContents.toggleDevTools(); e.preventDefault(); }
  });
  if (!app.isPackaged) mainWindow.loadURL(devUrl);
  else mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(() => {
  if (app.isPackaged && !process.env.QUEEZ_DATA_DIR) {
    const common = process.env.PROGRAMDATA || process.env.ALLUSERSPROFILE;
    const suite = bakedWhitelabelConfig?.suiteName || 'Queez CBT Suite';
    process.env.QUEEZ_DATA_DIR = common ? path.join(common, suite, 'data') : path.join(app.getPath('userData'), 'data');
  }
  createWindow();
  try {
    const lic = cryptoLicenseService.getLicenseState();
    if (lic.status === 'active' && lic.license?.branding) applyRuntimeBranding(lic.license.branding, mainWindow);
    else applyCachedBranding(mainWindow);
  } catch { applyCachedBranding(mainWindow); }

  ipcMain.handle('server:start', async (_e, port) => serverManager.start(port));
  ipcMain.handle('server:stop', async () => { serverManager.stop(); return true; });
  ipcMain.handle('server:get-status', async () => serverManager.getStatus());
  ipcMain.handle('server:detect', async (_e, port) => serverManager.detectExisting(port));
  ipcMain.handle('server:get-theme', async () => themeService.getTheme());
  ipcMain.handle('app:apply-branding', async (_e, b) => applyRuntimeBranding(b, mainWindow));
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) { mainWindow.unmaximize(); return false; }
    mainWindow?.maximize(); return true;
  });
  ipcMain.on('window:close', () => mainWindow?.close());
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);
});

app.on('window-all-closed', () => {
  serverManager.stop();
  if (process.platform !== 'darwin') app.quit();
});
