import { useState, useEffect, useCallback, useMemo } from 'react';
import { DiscoveredServer } from '../types/server-discovery.js';
import { serverConfig } from './server-config.js';

interface BeaconPayload {
  ip: string;
  port: number;
  serverName?: string;
}

export function useDiscoveredServers() {
  const [serverMap, setServerMap] = useState<Map<string, DiscoveredServer>>(new Map());
  const [activeUrl, setActiveUrl] = useState(serverConfig.getUrl());

  useEffect(() => {
    return serverConfig.onUrlChange((newUrl) => {
      setActiveUrl(newUrl);
    });
  }, []);

  useEffect(() => {
    const electron = (window as any).electronApi;
    if (!electron?.onServerDiscovered) return;

    const cleanup = electron.onServerDiscovered((data: BeaconPayload) => {
      if (!data?.port) return;
      const url = `http://${data.ip || '127.0.0.1'}:${data.port}`;
      setServerMap((prev) => {
        const next = new Map(prev);
        const existing = next.get(url);
        next.set(url, {
          id: url,
          serverName: data.serverName || existing?.serverName || `Server on Port ${data.port}`,
          ip: data.ip || '127.0.0.1',
          port: data.port,
          url,
          lastSeen: Date.now(),
        });
        return next;
      });
    });

    const pruner = setInterval(() => {
      const cutoff = Date.now() - 8000;
      setServerMap((prev) => {
        let changed = false;
        const next = new Map(prev);
        for (const [key, val] of next.entries()) {
          if (val.lastSeen < cutoff) {
            next.delete(key);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 2500);

    return () => {
      cleanup?.();
      clearInterval(pruner);
    };
  }, []);

  const servers = useMemo(() => Array.from(serverMap.values()), [serverMap]);

  const connectTo = useCallback((url: string) => {
    serverConfig.setUrl(url);
  }, []);

  return {
    servers,
    activeUrl,
    connectTo,
  };
}
