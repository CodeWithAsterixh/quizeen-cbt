import { ExamScheduleConfig } from '../types/index.js';
import { createIdempotencyKey } from '../utils/idempotency.js';
import { serverConfig } from './server-config.js';

export const packageApi = {
  async compilePackage(payload: { packageName: string; examIds: string[]; schedules: ExamScheduleConfig[] }): Promise<Blob> {
    const res = await fetch(`${serverConfig.getApiBase()}/packages/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': createIdempotencyKey('compile_pkg'),
      },
      body: JSON.stringify(payload),
    });
    return res.blob();
  },

  async unpackPackage(zipBase64: string): Promise<{ importedCount: number; packageId: string; message?: string }> {
    const res = await fetch(`${serverConfig.getApiBase()}/packages/unpack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': createIdempotencyKey('unpack_pkg'),
      },
      body: JSON.stringify({ zipBase64 }),
    });
    const json = await res.json();
    return { ...(json.data || {}), message: json.message };
  },
};
