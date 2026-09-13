import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Queez Student Portal',
    backgroundColor: '#f2f7f4',
    frame: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5174';

  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  setupIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function setupIpc() {
  const getFilePath = (key: string) => path.join(app.getPath('userData'), `${key}.json`);

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

  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
      return false;
    }
    mainWindow?.maximize();
    return true;
  });
  ipcMain.handle('window:close', () => mainWindow?.close());
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);
}
