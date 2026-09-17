process.env.WS_NO_BUFFER_UTIL = 'true';
process.env.WS_NO_UTF_8_VALIDATE = 'true';
import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

type WsMessageHandler = (event: string, data: any, ws: WebSocket) => void;
type WsDisconnectHandler = (ws: WebSocket) => void;

let wss: WebSocketServer | null = null;
let pingInterval: NodeJS.Timeout | null = null;
const messageHandlers = new Set<WsMessageHandler>();
const disconnectHandlers = new Set<WsDisconnectHandler>();

export function onWsMessage(handler: WsMessageHandler): () => void {
  messageHandlers.add(handler);
  return () => { messageHandlers.delete(handler); };
}

export function onWsDisconnect(handler: WsDisconnectHandler): () => void {
  disconnectHandlers.add(handler);
  return () => { disconnectHandlers.delete(handler); };
}

export function isDeviceConnected(deviceId: string): boolean {
  if (!wss) return false;
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && (client as any).deviceId === deviceId) return true;
  }
  return false;
}

export function initWebSocketServer(server: http.Server, getStatus?: () => any): WebSocketServer {
  closeWebSocketServer();
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    (ws as any).isAlive = true;
    ws.on('pong', () => { (ws as any).isAlive = true; });
    ws.on('error', () => { try { ws.close(); } catch {} });
    ws.on('message', (raw) => {
      try {
        const parsed = JSON.parse(raw.toString());
        if (parsed?.event === 'server:get-status' && getStatus) {
          try { ws.send(JSON.stringify({ event: 'server:status', data: getStatus(), timestamp: Date.now() })); } catch {}
        }
        if (parsed?.event) messageHandlers.forEach((fn) => { try { fn(parsed.event, parsed.data, ws); } catch {} });
      } catch {}
    });
    ws.on('close', () => disconnectHandlers.forEach((fn) => { try { fn(ws); } catch {} }));

    try {
      ws.send(JSON.stringify({ event: 'connection:ack', timestamp: Date.now() }));
      if (getStatus) ws.send(JSON.stringify({ event: 'server:status', data: getStatus(), timestamp: Date.now() }));
    } catch {}
  });

  pingInterval = setInterval(() => {
    if (!wss) return;
    wss.clients.forEach((ws) => {
      if ((ws as any).isAlive === false) {
        try { ws.terminate(); } catch {}
        return;
      }
      (ws as any).isAlive = false;
      try { ws.ping(); } catch {}
    });
  }, 15000);

  return wss;
}

export function broadcastWsEvent(event: string, data?: any): void {
  if (!wss || wss.clients.size === 0) return;
  const message = JSON.stringify({ event, data, timestamp: Date.now() });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch {}
    }
  });
}

export function closeWebSocketServer(): void {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (wss) {
    try {
      wss.clients.forEach((c) => { try { c.terminate(); } catch {} });
      wss.close();
    } catch {}
    wss = null;
  }
}
