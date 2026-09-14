export const IDEMPOTENCY_HEADER = 'idempotency-key';
export const IDEMPOTENT_REPLAYED_HEADER = 'idempotent-replayed';

export function createIdempotencyKey(prefix = 'req'): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `idem_${prefix}_${Date.now()}_${rand}`;
}
