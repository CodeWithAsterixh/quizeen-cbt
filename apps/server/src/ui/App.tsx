import React, { useState, useEffect } from 'react';
import { TitleBar, applyThemeCustomization, serverConfig } from '@cbt/shared';
import { ServerSidebar, ServerTab } from './ServerSidebar';
import { ServerOverviewTab } from './ServerOverviewTab';
import { ServerDevicesTab } from './ServerDevicesTab';
import { ServerLicenseTab } from './ServerLicenseTab';
import { ServerVisualGraphTab } from './ServerVisualGraphTab';
import { ServerLiveRequestsTab } from './ServerLiveRequestsTab';
import { CloseWarningModal } from './CloseWarningModal';
import { LogEntry, ServerStatus } from './types';

const defaultStatus: ServerStatus = { running: false, port: 4000, uptimeSeconds: 0, ips: ['127.0.0.1'], totalRequests: 0 };

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ServerTab>('overview');
  const [status, setStatus] = useState<ServerStatus>(defaultStatus);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    const api = (window as any).serverApi;
    if (!api) return;
    if (localStorage.getItem('cbt_server_autostart') === 'true') api.startServer(4000);
    api.detectExisting?.(4000).then((r: any) => { if (r?.active) setInfoMessage(`Active Queez Server detected at ${r.url}.`); }).catch(() => {});
    api.getTheme?.().then((t: any) => { if (t) applyThemeCustomization(t); }).catch(() => {});
    const unsubTheme = api.onThemeChanged?.((t: any) => { if (t) applyThemeCustomization(t); });

    fetch('http://127.0.0.1:4000/api/license').then(r => r.json()).then(d => {
      if (d?.data?.license?.branding) {
        setBranding(d.data.license.branding);
        (window as any).electronApi?.applyBranding?.(d.data.license.branding);
      }
    }).catch(() => {});

    const poll = async () => {
      try {
        const s = await api.getStatus();
        if (s) {
          setStatus(s);
          if (s.running) {
            setErrorMessage(null);
            const target = `http://127.0.0.1:${s.port}`;
            if (serverConfig.getUrl() !== target) serverConfig.setUrl(target);
          }
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 1000);
    const cleanup = api.onRequestLogged?.((entry: LogEntry) => { setLogs((prev) => [...prev.slice(-499), entry]); });
    return () => { clearInterval(interval); cleanup?.(); unsubTheme?.(); };
  }, []);

  const handleToggle = async (port: number) => {
    const api = (window as any).serverApi;
    if (!api) return;
    setErrorMessage(null); setInfoMessage(null);
    try {
      if (status.running) await api.stopServer();
      else {
        const res = await api.startServer(port);
        if (res && !res.success && res.error) setErrorMessage(res.error);
        if (res?.fallbackFrom) setInfoMessage(res.message || `Started on fallback port ${res.port}.`);
      }
      const s = await api.getStatus();
      if (s) setStatus(s);
    } catch (err: any) { setErrorMessage(err?.message || 'Failed to communicate with server'); }
  };

  const handleClose = () => status.running ? setIsWarningOpen(true) : (window as any).electronApi?.closeWindow();
  const handleExit = async () => { await (window as any).serverApi?.stopServer(); (window as any).electronApi?.closeWindow(); };

  return (
    <div className="server-window">
      <TitleBar title={branding?.appName || branding?.schoolName || 'Queez'} badge="CBT Server" iconUrl={branding?.appIconUrl || branding?.logoUrl} onClose={handleClose} />
      <div className="server-body">
        <ServerSidebar currentTab={currentTab} onSelectTab={setCurrentTab} requestCount={logs.length} isRunning={Boolean(status?.running)} port={status?.port || 4000} />
        <main className="server-content">
          {currentTab === 'overview' && <ServerOverviewTab status={status || defaultStatus} onToggle={handleToggle} errorMessage={errorMessage} infoMessage={infoMessage} />}
          {currentTab === 'devices' && <ServerDevicesTab />}
          {currentTab === 'license' && <ServerLicenseTab port={status?.port || 4000} />}
          {currentTab === 'graph' && <ServerVisualGraphTab logs={logs || []} />}
          {currentTab === 'requests' && <ServerLiveRequestsTab logs={logs || []} onClear={() => setLogs([])} />}
        </main>
      </div>
      <CloseWarningModal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} onConfirm={handleExit} />
    </div>
  );
};
