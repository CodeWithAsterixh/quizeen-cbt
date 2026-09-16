import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | null = null;
let pingInterval: NodeJS.Timeout | null = null;

export function initWebSocketServer(server: http.Server): WebSocketServer {
  closeWebSocketServer();

  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    (ws as any).isAlive = true;
    ws.on('pong', () => { (ws as any).isAlive = true; });
    ws.on('error', () => { try { ws.close(); } catch {} });

    // Send initial connected ack
    try {
      ws.send(JSON.stringify({ event: 'connection:ack', timestamp: Date.now() }));
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
