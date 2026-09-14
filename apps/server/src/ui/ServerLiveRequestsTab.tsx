import React from 'react';
import { LogEntry } from './types';
import { RequestLogTable } from './RequestLogTable';

interface Props {
  logs: LogEntry[];
  onClear: () => void;
}

export const ServerLiveRequestsTab: React.FC<Props> = ({ logs, onClear }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '420px' }}>
      <RequestLogTable logs={logs} onClear={onClear} />
    </div>
  );
};
