import dgram from 'node:dgram';

export function startDiscoveryListener(onDiscovered: (data: { ip: string; port: number }) => void): () => void {
  try {
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    socket.on('message', (msg) => {
      try {
        const data = JSON.parse(msg.toString('utf8'));
        if (data.service === 'quizeen-cbt-server' && data.port) {
          onDiscovered({ ip: data.primaryIp || data.ips?.[0] || '127.0.0.1', port: data.port });
        }
      } catch {}
    });
    socket.bind(4001);
    return () => {
      try { socket.close(); } catch {}
    };
  } catch {
    return () => {};
  }
}
