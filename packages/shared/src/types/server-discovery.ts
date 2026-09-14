export interface DiscoveredServer {
  id: string;
  serverName: string;
  ip: string;
  port: number;
  url: string;
  lastSeen: number;
  latencyMs?: number;
}
