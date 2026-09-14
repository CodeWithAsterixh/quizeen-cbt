export interface IDataStore<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  save(item: T): Promise<T>;
  saveBatch(items: T[]): Promise<void>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
}

declare global {
  interface Window {
    electronApi?: {
      readStorage: (key: string) => Promise<string | null>;
      writeStorage: (key: string, content: string) => Promise<boolean>;
      isMaximized?: () => Promise<boolean>;
      minimizeWindow?: () => Promise<void> | void;
      maximizeWindow?: () => Promise<boolean>;
      closeWindow?: () => Promise<void> | void;
      onMaximizeChange?: (callback: (isMax: boolean) => void) => () => void;
    };
  }
}
