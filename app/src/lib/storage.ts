import { getTg } from "./telegram";

// Per-azkar progress, persisted via Telegram CloudStorage (synced across the
// user's devices) with a transparent localStorage fallback for local dev/testing
// or older Telegram clients without CloudStorage (Bot API < 6.9).

function countKey(id: string): string {
  return `azkar:${id}:count`;
}
function totalKey(id: string): string {
  return `azkar:${id}:total`;
}

// The official telegram-web-app.js always defines window.Telegram.WebApp, even
// outside a real Telegram client (e.g. plain browser during dev) — but there it
// reports a stub "version 6.0" where methods like CloudStorage.getItem/setItem
// *throw* WebAppMethodUnsupported synchronously instead of just being absent.
// So `tg?.CloudStorage` existing is not enough; every call must be guarded.

function cloudGetItem(key: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      const tg = getTg();
      if (!tg?.CloudStorage) throw new Error("CloudStorage unavailable");
      tg.CloudStorage.getItem(key, (err, value) => {
        resolve(err ? localStorage.getItem(key) ?? "" : value ?? "");
      });
    } catch {
      resolve(localStorage.getItem(key) ?? "");
    }
  });
}

function cloudSetItem(key: string, value: string): void {
  localStorage.setItem(key, value); // always keep a local copy as a safety net
  try {
    getTg()?.CloudStorage?.setItem(key, value);
  } catch {
    // CloudStorage unsupported on this client — localStorage above already covers it.
  }
}

export interface AzkarProgress {
  count: number;
  total: number;
}

export async function loadProgress(id: string): Promise<AzkarProgress> {
  const [count, total] = await Promise.all([cloudGetItem(countKey(id)), cloudGetItem(totalKey(id))]);
  return { count: Number(count) || 0, total: Number(total) || 0 };
}

export function saveCount(id: string, count: number): void {
  cloudSetItem(countKey(id), String(count));
}

export function saveTotal(id: string, total: number): void {
  cloudSetItem(totalKey(id), String(total));
}
