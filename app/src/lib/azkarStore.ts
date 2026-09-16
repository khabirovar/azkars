import type { AzkarEntry, TimeOfDay } from "../types/azkar";

let cache: Promise<AzkarEntry[]> | null = null;

function loadAll(): Promise<AzkarEntry[]> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}azkar.json`)
      .then((res) => res.json())
      .catch((err) => {
        // Don't poison the cache with a rejected promise forever — clear it so
        // the next call (e.g. after the user's connection recovers) retries.
        cache = null;
        throw err;
      });
  }
  return cache;
}

export async function getByTimeOfDay(timeOfDay: TimeOfDay): Promise<AzkarEntry[]> {
  const all = await loadAll();
  return all.filter((e) => e.timeOfDay === timeOfDay).sort((a, b) => a.order - b.order);
}
