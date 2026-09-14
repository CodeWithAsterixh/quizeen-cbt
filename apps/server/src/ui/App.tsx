import React, { useState, useEffect } from 'react';
import { TitleBar } from '@cbt/shared';
import { ServerSidebar, ServerTab } from './ServerSidebar';
import { ServerOverviewTab } from './ServerOverviewTab';
import { ServerVisualGraphTab } from './ServerVisualGraphTab';
import { ServerLiveRequestsTab } from './ServerLiveRequestsTab';
import { CloseWarningModal } from './CloseWarningModal';
import { LogEntry, ServerStatus } from './types';

const defaultStatus: ServerStatus = {
  running: false, port: 4000, uptimeSeconds: 0, ips: ['127.0.0.1'], totalRequests: 0,
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ServerTab>('overview');
  const [status, setStatus] = useState<ServerStatus>(defaultStatus);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  useEffect(() => {
    const api = (window as any).serverApi;
    if (!api) return;
    if (localStorage.getItem('cbt_server_autostart') === 'true') api.startServer(4000);

    const poll = async () => {
      try {
        const s = await api.getStatus();
        if (s) setStatus(s);
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 1000);

    const cleanupLogs = api.onRequestLogged?.((entry: LogEntry) => {
      setLogs((prev) => [...prev.slice(-499), entry]);
    });

    return () => { clearInterval(interval); cleanupLogs?.(); };
  }, []);

  const handleToggle = async (port: number) => {
    const api = (window as any).serverApi;
    if (!api) return;
    if (status.running) await api.stopServer();
    else await api.startServer(port);
    const s = await api.getStatus();
    if (s) setStatus(s);
  };

  const handleCloseAttempt = () => {
    if (status.running) setIsWarningOpen(true);
    else (window as any).electronApi?.closeWindow();
  };

  const handleConfirmExit = async () => {
    const api = (window as any).serverApi;
    if (api) await api.stopServer();
    (window as any).electronApi?.closeWindow();
  };

  return (
    <div className="server-window">
      <TitleBar title="Queez" badge="CBT Server" onClose={handleCloseAttempt} />
      <div className="server-body">
        <ServerSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          requestCount={logs.length}
          isRunning={Boolean(status?.running)}
          port={status?.port || 4000}
        />
        <main className="server-content">
          {currentTab === 'overview' && <ServerOverviewTab status={status || defaultStatus} onToggle={handleToggle} />}
          {currentTab === 'graph' && <ServerVisualGraphTab logs={logs || []} />}
          {currentTab === 'requests' && <ServerLiveRequestsTab logs={logs || []} onClear={() => setLogs([])} />}
        </main>
      </div>
      <CloseWarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
};
