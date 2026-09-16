import { contextBridge, ipcRenderer, app } from 'electron';

export interface ElectronApi {
  readStorage: (key: string) => Promise<string | null>;
  writeStorage: (key: string, content: string) => Promise<boolean>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onServerDiscovered: (callback: (data: { ip: string; port: number; serverName?: string }) => void) => () => void;
  enterExamMode: () => Promise<void>;
  exitExamMode: () => Promise<void>;
  applyBranding: (branding: any) => Promise<boolean>;
}

const api: ElectronApi = {
  readStorage: (key: string) => ipcRenderer.invoke('storage:read', key),
  writeStorage: (key: string, content: string) => ipcRenderer.invoke('storage:write', key, content),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onServerDiscovered: (callback: (data: { ip: string; port: number; serverName?: string }) => void) => {
    const handler = (_e: any, data: any) => callback(data);
    ipcRenderer.on('server:discovered', handler);
    return () => { ipcRenderer.removeListener('server:discovered', handler); };
  },
  enterExamMode: () => ipcRenderer.invoke('exam:enter'),
  exitExamMode: () => ipcRenderer.invoke('exam:exit'),
  applyBranding: (branding: any) => ipcRenderer.invoke('app:apply-branding', branding),
};

contextBridge.exposeInMainWorld('electronApi', api);
