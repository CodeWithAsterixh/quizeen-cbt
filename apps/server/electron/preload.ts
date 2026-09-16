import { contextBridge, ipcRenderer } from 'electron';

const serverApi = {
  startServer: (port?: number) => ipcRenderer.invoke('server:start', port),
  stopServer: () => ipcRenderer.invoke('server:stop'),
  getStatus: () => ipcRenderer.invoke('server:get-status'),
  detectExisting: (port?: number) => ipcRenderer.invoke('server:detect', port),
  getTheme: () => ipcRenderer.invoke('server:get-theme'),
  onThemeChanged: (callback: (theme: any) => void) => {
    const handler = (_e: any, theme: any) => callback(theme);
    ipcRenderer.on('server:theme-changed', handler);
    return () => { ipcRenderer.removeListener('server:theme-changed', handler); };
  },
  onRequestLogged: (callback: (entry: any) => void) => {
    const handler = (_e: any, entry: any) => callback(entry);
    ipcRenderer.on('server:request-logged', handler);
    return () => { ipcRenderer.removeListener('server:request-logged', handler); };
  },
};

const electronApi = {
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  applyBranding: (branding: any) => ipcRenderer.invoke('app:apply-branding', branding),
};

contextBridge.exposeInMainWorld('serverApi', serverApi);
contextBridge.exposeInMainWorld('electronApi', electronApi);
