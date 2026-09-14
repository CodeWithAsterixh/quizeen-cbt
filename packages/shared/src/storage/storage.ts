import { IDataStore } from './storage-types.js';
export * from './storage-types.js';


export class LocalStore<T extends { id: string }> implements IDataStore<T> {
  private key: string;
  private memoryCache: T[] = [];

  constructor(key: string) {
    this.key = `cbt_${key}`;
  }

  private async read(): Promise<T[]> {
    const g = globalThis as any;
    if (g.window?.electronApi) {
      try {
        const fileContent = await g.window.electronApi.readStorage(this.key);
        if (fileContent) return JSON.parse(fileContent) as T[];
      } catch {
        // fallback
      }
    }
    if (g.localStorage) {
      const raw = g.localStorage.getItem(this.key);
      if (raw) {
        try { return JSON.parse(raw) as T[]; } catch { return []; }
      }
    }
    return this.memoryCache;
  }

  private async write(items: T[]): Promise<void> {
    this.memoryCache = [...items];
    const serialized = JSON.stringify(items);
    const g = globalThis as any;
    if (g.localStorage) g.localStorage.setItem(this.key, serialized);
    if (g.window?.electronApi) await g.window.electronApi.writeStorage(this.key, serialized);
  }

  async getAll(): Promise<T[]> { return this.read(); }
  async getById(id: string): Promise<T | null> {
    const items = await this.read();
    return items.find((item) => item.id === id) ?? null;
  }

  async save(item: T): Promise<T> {
    const items = await this.read();
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) items[index] = item;
    else items.push(item);
    await this.write(items);
    return item;
  }

  async saveBatch(newItems: T[]): Promise<void> {
    const items = await this.read();
    const map = new Map<string, T>();
    items.forEach((item) => map.set(item.id, item));
    newItems.forEach((item) => map.set(item.id, item));
    await this.write(Array.from(map.values()));
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.read();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    await this.write(filtered);
    return true;
  }

  async clear(): Promise<void> { await this.write([]); }
}
