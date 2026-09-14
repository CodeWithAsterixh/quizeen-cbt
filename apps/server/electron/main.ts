import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ServerManager } from './server-manager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | null = null;

const serverManager = new ServerManager((entry) => {
  mainWindow?.webContents.send('server:request-logged', entry);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 840,
    title: 'Queez CBT Server',
    icon: path.join(__dirname, '../dist/icon.png'),
    frame: false,
    backgroundColor: '#f2f7f4',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5176';
  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  if (app.isPackaged && !process.env.QUEEZ_DATA_DIR) {
    const common = process.env.PROGRAMDATA || process.env.ALLUSERSPROFILE;
    process.env.QUEEZ_DATA_DIR = common
      ? path.join(common, 'Queez CBT Suite', 'data')
      : path.join(app.getPath('userData'), 'data');
  }
  createWindow();

  ipcMain.handle('server:start', async (_e, port) => serverManager.start(port));
  ipcMain.handle('server:stop', async () => { serverManager.stop(); return true; });
  ipcMain.handle('server:get-status', async () => serverManager.getStatus());
  ipcMain.handle('server:detect', async (_e, port) => serverManager.detectExisting(port));

  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
      return false;
    }
    mainWindow?.maximize();
    return true;
  });
  ipcMain.on('window:close', () => mainWindow?.close());
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);
});

app.on('window-all-closed', () => {
  serverManager.stop();
  if (process.platform !== 'darwin') app.quit();
});
