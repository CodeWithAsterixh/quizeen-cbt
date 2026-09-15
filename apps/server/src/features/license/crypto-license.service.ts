import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { LicenseState, SignedLicenseToken } from '@cbt/shared';
import { resolveDataDir } from '../../core/db/database.js';
import { getHardwareId } from './hardware.service.js';
import { tamperTrapService } from './tamper-trap.service.js';
import { getLicensePublicKey } from './license-key.service.js';

class CryptoLicenseService {
  private licenseFile = path.join(resolveDataDir(), 'license.json');

  private canonicalize(obj: any): string {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) return `[${obj.map((item) => this.canonicalize(item)).join(',')}]`;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${this.canonicalize(obj[k])}`).join(',')}}`;
  }

  public verifySignature(token: SignedLicenseToken): boolean {
    try {
      const pubKey = getLicensePublicKey();
      if (!pubKey) return false;
      const data = Buffer.from(this.canonicalize(token.payload), 'utf8');
      const isHex = /^[0-9a-fA-F]+$/.test(token.signature);
      const sig = Buffer.from(token.signature, isHex ? 'hex' : 'base64');
      return crypto.verify(null, data, pubKey, sig);
    } catch {
      return false;
    }
  }

  public getLicenseState(): LicenseState {
    const hwId = getHardwareId();
    const trap = tamperTrapService.verifyAndRecordTimestamp();
    if (!trap.valid) {
      return { status: 'tampered', hardwareId: hwId, message: trap.reason };
    }

    if (!fs.existsSync(this.licenseFile)) {
      return { status: 'unlicensed', hardwareId: hwId, message: 'No license installed' };
    }

    try {
      const raw = fs.readFileSync(this.licenseFile, 'utf8');
      const token: SignedLicenseToken = JSON.parse(raw);
      if (!this.verifySignature(token)) {
        return { status: 'unlicensed', hardwareId: hwId, message: 'Cryptographic signature is invalid' };
      }

      const p = token.payload;
      if (p.hardwareId !== '*' && p.hardwareId.toUpperCase() !== hwId.toUpperCase()) {
        return { status: 'hardware_mismatch', license: p, hardwareId: hwId, message: `Bound to ${p.hardwareId}, this is ${hwId}` };
      }

      const expiry = new Date(p.validUntil).getTime();
      const now = Date.now();
      if (now > expiry) {
        return { status: 'expired', license: p, hardwareId: hwId, message: `Expired on ${new Date(expiry).toLocaleDateString()}` };
      }

      const daysRemaining = Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)));
      return { status: 'active', license: p, hardwareId: hwId, daysRemaining };
    } catch {
      return { status: 'unlicensed', hardwareId: hwId, message: 'Malformed license file' };
    }
  }

  public activateLicense(tokenString: string): { success: boolean; state: LicenseState; error?: string } {
    try {
      const parsed: SignedLicenseToken = JSON.parse(tokenString.trim());
      if (!parsed.payload || !parsed.signature) {
        return { success: false, state: this.getLicenseState(), error: 'Invalid token format' };
      }
      if (!this.verifySignature(parsed)) {
        return { success: false, state: this.getLicenseState(), error: 'Cryptographic verification failed' };
      }
      fs.writeFileSync(this.licenseFile, JSON.stringify(parsed, null, 2), 'utf8');
      return { success: true, state: this.getLicenseState() };
    } catch (err: any) {
      return { success: false, state: this.getLicenseState(), error: err?.message || 'Activation failed' };
    }
  }

  public removeLicense(): void {
    if (fs.existsSync(this.licenseFile)) {
      try { fs.unlinkSync(this.licenseFile); } catch {}
    }
  }
}

export const cryptoLicenseService = new CryptoLicenseService();
