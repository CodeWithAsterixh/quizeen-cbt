import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=256');
app.commandLine.appendSwitch('enable-features', 'NetworkServiceInProcess');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 950,
    minHeight: 650,
    title: 'Queez CBT Manager',
    icon: path.join(__dirname, '../dist/icon.png'),
    backgroundColor: '#f2f7f4',
    frame: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: false,
      spellcheck: false,
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

  const devUrl = (process.env.VITE_DEV_SERVER_URL && process.env.VITE_DEV_SERVER_URL.includes('5175'))
    ? process.env.VITE_DEV_SERVER_URL : 'http://localhost:5175';

  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

import { startDiscoveryListener } from './discovery-listener.js';
import { setupIpc } from './ipc.js';
import { applyCachedBranding } from './branding-service.js';

app.whenReady().then(() => {
  setupIpc(() => mainWindow);
  createWindow();
  applyCachedBranding(mainWindow);
  startDiscoveryListener((d) => mainWindow?.webContents.send('server:discovered', d));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
