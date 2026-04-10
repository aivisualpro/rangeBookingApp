/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Lightweight SSE broadcast hub.
 * 
 * API routes call `broadcast(channel, data)` to push events.
 * Clients subscribe via GET /api/sse?channel=xxx.
 * 
 * Channels used:
 *  - "notifications" → new notification created
 *  - "companies"     → company list changed (new registration, update)
 */

type Listener = (data: string) => void;

const channels = new Map<string, Set<Listener>>();

export function subscribe(channel: string, listener: Listener) {
  if (!channels.has(channel)) channels.set(channel, new Set());
  channels.get(channel)!.add(listener);
  return () => {
    channels.get(channel)?.delete(listener);
    if (channels.get(channel)?.size === 0) channels.delete(channel);
  };
}

export function broadcast(channel: string, data: any) {
  const listeners = channels.get(channel);
  if (!listeners) return;
  const payload = JSON.stringify(data);
  for (const listener of listeners) {
    try { listener(payload); } catch {}
  }
}
