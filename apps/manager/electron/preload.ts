import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronApi {
  readStorage: (key: string) => Promise<string | null>;
  writeStorage: (key: string, content: string) => Promise<boolean>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
}

const api: ElectronApi = {
  readStorage: (key: string) => ipcRenderer.invoke('storage:read', key),
  writeStorage: (key: string, content: string) => ipcRenderer.invoke('storage:write', key, content),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
};

contextBridge.exposeInMainWorld('electronApi', api);
