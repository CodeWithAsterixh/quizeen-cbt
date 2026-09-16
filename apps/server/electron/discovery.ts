import dgram from 'node:dgram';
import os from 'node:os';

const DISCOVERY_PORT = 4001;

export function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  return ips.length > 0 ? ips : ['127.0.0.1'];
}

function getBroadcastTargets(): string[] {
  const interfaces = os.networkInterfaces();
  const targets = new Set<string>(['255.255.255.255', '127.0.0.1']);
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal && net.address && net.netmask) {
        const ip = net.address.split('.').map(Number);
        const mask = net.netmask.split('.').map(Number);
        const bcast = ip.map((p, i) => (p | (~mask[i] & 255))).join('.');
        targets.add(bcast);
      }
    }
  }
  return Array.from(targets);
}

export class ServerBeacon {
  private socket: dgram.Socket | null = null;
  private timer: NodeJS.Timeout | null = null;

  start(httpPort: number) {
    this.stop();
    try {
      this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      this.socket.on('error', () => { this.stop(); });
      this.socket.bind(() => {
        try { this.socket?.setBroadcast(true); } catch {}
      });
      this.timer = setInterval(() => {
        if (!this.socket) return;
        const ips = getLocalIpAddresses();
        const payload = JSON.stringify({
          service: 'quizeen-cbt-server',
          serverName: os.hostname(),
          ips,
          primaryIp: ips[0],
          port: httpPort,
          timestamp: Date.now(),
        });
        const msg = Buffer.from(payload);
        for (const target of getBroadcastTargets()) {
          try { this.socket.send(msg, 0, msg.length, DISCOVERY_PORT, target, () => {}); } catch {}
        }
      }, 2000);
    } catch {}
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.socket) { try { this.socket.close(); } catch {} this.socket = null; }
  }
}
