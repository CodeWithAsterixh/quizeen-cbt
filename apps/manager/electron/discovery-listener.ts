import dgram from 'node:dgram';

export function startDiscoveryListener(
  onDiscovered: (data: { ip: string; port: number; serverName?: string }) => void
): () => void {
  try {
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    socket.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString('utf8'));
        if (data.service === 'quizeen-cbt-server' && data.port) {
          const senderIp = rinfo?.address && rinfo.address !== '127.0.0.1' ? rinfo.address : '';
          const resolvedIp = senderIp || data.primaryIp || data.ips?.[0] || '127.0.0.1';
          onDiscovered({ ip: resolvedIp, port: data.port, serverName: data.serverName });
        }
      } catch {}
    });
    socket.on('error', () => {});
    socket.bind({ port: 4001, exclusive: false });
    return () => {
      try { socket.close(); } catch {}
    };
  } catch {
    return () => {};
  }
}
