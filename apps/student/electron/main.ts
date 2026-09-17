import { app, BrowserWindow, Menu, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { startDiscoveryListener } from './discovery-listener.js';
import { setupIpc } from './ipc.js';
import { applyCachedBranding, getInitialAppName } from './branding-service.js';

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=256');
app.commandLine.appendSwitch('enable-features', 'NetworkServiceInProcess');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  Menu.setApplicationMenu(null);
  const appTitle = getInitialAppName();
  app.name = appTitle;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: appTitle,
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
      devTools: true,
      spellcheck: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('unresponsive', () => {
    dialog.showMessageBox(mainWindow!, {
      type: 'warning',
      title: appTitle,
      message: `${appTitle} is not responding`,
      detail: 'The application is taking longer than expected. You can wait or restart.',
      buttons: ['Wait', 'Restart Application', 'Close'],
      defaultId: 0,
      cancelId: 0,
    }).then(({ response }) => {
      if (response === 1) { app.relaunch(); app.exit(0); }
      else if (response === 2) { mainWindow?.destroy(); }
    });
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  const devUrl = (process.env.VITE_DEV_SERVER_URL && process.env.VITE_DEV_SERVER_URL.includes('5174'))
    ? process.env.VITE_DEV_SERVER_URL : 'http://localhost:5174';

  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

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
