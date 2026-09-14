import fs from 'node:fs';
import path from 'node:path';
import { resolveDataDir } from '../../core/db/database.js';

interface TrapRecord {
  highWaterTimestamp: number;
  lastUpdated: string;
  tamperCount: number;
}

class TamperTrapService {
  private trapFilePath = path.join(resolveDataDir(), 'security-trap.json');
  private isTampered = false;

  private loadTrap(): TrapRecord {
    try {
      if (fs.existsSync(this.trapFilePath)) {
        const raw = fs.readFileSync(this.trapFilePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch {}
    return { highWaterTimestamp: 0, lastUpdated: new Date().toISOString(), tamperCount: 0 };
  }

  private saveTrap(record: TrapRecord): void {
    try {
      fs.writeFileSync(this.trapFilePath, JSON.stringify(record, null, 2), 'utf8');
    } catch {}
  }

  public verifyAndRecordTimestamp(): { valid: boolean; reason?: string } {
    if (this.isTampered) {
      return { valid: false, reason: 'Clock rollback previously detected' };
    }

    const currentNow = Date.now();
    const trap = this.loadTrap();

    if (trap.highWaterTimestamp > 0 && currentNow < trap.highWaterTimestamp - 60000) {
      this.isTampered = true;
      trap.tamperCount += 1;
      this.saveTrap(trap);
      return {
        valid: false,
        reason: `System clock rollback detected. Current: ${new Date(currentNow).toISOString()}, Previous: ${new Date(trap.highWaterTimestamp).toISOString()}`,
      };
    }

    trap.highWaterTimestamp = Math.max(currentNow, trap.highWaterTimestamp);
    trap.lastUpdated = new Date().toISOString();
    this.saveTrap(trap);
    return { valid: true };
  }

  public getStatus(): { isTampered: boolean } {
    return { isTampered: this.isTampered };
  }
}

export const tamperTrapService = new TamperTrapService();
