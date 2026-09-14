import crypto from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  status: number;
  body: any;
  createdAt: number;
}

const cache = new Map<string, CacheEntry | 'pending'>();
const listeners = new Map<string, Array<() => void>>();
const TTL_MS = 15 * 60 * 1000;

function cleanExpired(): void {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (v !== 'pending' && now - v.createdAt > TTL_MS) cache.delete(k);
  }
}

setInterval(cleanExpired, 5 * 60 * 1000);

export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const method = req.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return next();

  const rawKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string | undefined;
  const key = rawKey?.trim() || crypto
    .createHash('sha256')
    .update(`${method}:${req.originalUrl || req.url}:${JSON.stringify(req.body || {})}`)
    .digest('hex');

  const existing = cache.get(key);
  if (existing && existing !== 'pending') {
    res.setHeader('Idempotent-Replayed', 'true');
    res.setHeader('Idempotency-Key', key);
    res.status(existing.status).json(existing.body);
    return;
  }

  if (existing === 'pending') {
    const waiter = () => {
      const resolved = cache.get(key);
      if (resolved && resolved !== 'pending') {
        res.setHeader('Idempotent-Replayed', 'true');
        res.setHeader('Idempotency-Key', key);
        res.status(resolved.status).json(resolved.body);
      } else {
        next();
      }
    };
    if (!listeners.has(key)) listeners.set(key, []);
    listeners.get(key)!.push(waiter);
    return;
  }

  cache.set(key, 'pending');
  const originalJson = res.json.bind(res);

  res.json = function (body: any): Response {
    if (res.statusCode < 500) {
      cache.set(key, { status: res.statusCode, body, createdAt: Date.now() });
    } else {
      cache.delete(key);
    }
    const queue = listeners.get(key);
    if (queue) {
      listeners.delete(key);
      queue.forEach((cb) => cb());
    }
    res.setHeader('Idempotency-Key', key);
    return originalJson(body);
  };

  next();
}
