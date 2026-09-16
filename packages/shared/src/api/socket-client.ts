import { serverConfig } from './server-config.js';

type Listener = (data?: any) => void;
type ConnectionListener = (connected: boolean) => void;

class SocketClient {
  private ws: WebSocket | null = null;
  private connected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private connListeners = new Set<ConnectionListener>();

  constructor() {
    if (typeof window !== 'undefined') {
      serverConfig.onUrlChange(() => { this.connect(true); });
      this.connect();
    }
  }
  private toWsUrl(httpUrl: string): string {
    return httpUrl.trim().replace(/\/+$/, '').replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://');
  }
  public connect(force = false): void {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
    if (this.ws && !force && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    this.disconnect();

    try {
      const socket = new WebSocket(this.toWsUrl(serverConfig.getUrl()));
      this.ws = socket;

      socket.onopen = () => {
        if (this.ws !== socket) return;
        this.connected = true;
        this.connListeners.forEach((fn) => { try { fn(true); } catch {} });
      };

      socket.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          if (parsed?.event) this.listeners.get(parsed.event)?.forEach((fn) => { try { fn(parsed.data); } catch {} });
        } catch {}
      };

      socket.onclose = () => {
        if (this.ws !== socket) return;
        this.connected = false;
        this.connListeners.forEach((fn) => { try { fn(false); } catch {} });
        this.scheduleReconnect();
      };

      socket.onerror = () => { try { socket.close(); } catch {} };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => { this.reconnectTimer = null; this.connect(); }, 2500);
  }

  public disconnect(): void {
    if (this.reconnectTimer) { clearInterval(this.reconnectTimer); this.reconnectTimer = null; }
    if (this.ws) {
      try { this.ws.onopen = null; this.ws.onclose = null; this.ws.onerror = null; this.ws.close(); } catch {}
      this.ws = null;
    }
    if (this.connected) {
      this.connected = false;
      this.connListeners.forEach((fn) => { try { fn(false); } catch {} });
    }
  }

  public on(event: string, callback: Listener): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback);
    return () => { this.listeners.get(event)?.delete(callback); };
  }

  public onConnectionChange(callback: ConnectionListener): () => void {
    this.connListeners.add(callback);
    callback(this.connected);
    return () => { this.connListeners.delete(callback); };
  }

  public send(event: string, data?: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try { this.ws.send(JSON.stringify({ event, data })); return true; } catch { return false; }
    }
    return false;
  }

  public isConnected(): boolean { return this.connected; }
}

export const socketClient = new SocketClient();
