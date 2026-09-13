import dgram from 'node:dgram';
import os from 'node:os';

const DISCOVERY_PORT = 4001;

export function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips.length > 0 ? ips : ['127.0.0.1'];
}

export class ServerBeacon {
  private socket: dgram.Socket | null = null;
  private timer: NodeJS.Timeout | null = null;

  start(httpPort: number) {
    this.stop();
    this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this.socket.bind(() => {
      this.socket?.setBroadcast(true);
    });

    this.timer = setInterval(() => {
      if (!this.socket) return;
      const ips = getLocalIpAddresses();
      const payload = JSON.stringify({
        service: 'quizeen-cbt-server',
        ips,
        primaryIp: ips[0],
        port: httpPort,
        timestamp: Date.now(),
      });
      const message = Buffer.from(payload);
      this.socket.send(message, 0, message.length, DISCOVERY_PORT, '255.255.255.255');
    }, 2000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.socket) {
      try { this.socket.close(); } catch {}
      this.socket = null;
    }
  }
}
