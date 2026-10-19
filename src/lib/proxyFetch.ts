// Generic client-side CORS proxy fetcher with fallback + caching.
// Steam's APIs do not send Access-Control-Allow-Origin headers, so direct
// browser fetches are blocked. We route requests through public CORS proxies
// with automatic failover and remember the last working proxy.

interface ProxyDef {
  build: (url: string) => string;
  // Extracts the raw target response text from the proxy's response text.
  unwrap?: (text: string) => string;
}

const PROXIES: ProxyDef[] = [
  { build: (url) => `https://proxy.cors.dev/${url}` },
  { build: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` },
  {
    build: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    unwrap: (text) => {
      const outer = JSON.parse(text) as { contents?: string };
      return outer.contents ?? text;
    },
  },
  { build: (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}` },
];

let lastWorkingIndex = 0;

const memoryCache = new Map<string, { data: unknown; expires: number }>();

function readPersistentCache(key: string): { data: unknown; expires: number } | null {
  try {
    const raw = sessionStorage.getItem(`sf_cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.expires === "number") return parsed;
    return null;
  } catch {
    return null;
  }
}

function writePersistentCache(key: string, entry: { data: unknown; expires: number }) {
  try {
    sessionStorage.setItem(`sf_cache_${key}`, JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches a URL (that otherwise would be blocked by CORS) through a chain of
 * public proxies, trying the last-known-good one first. Results are cached
 * in memory and sessionStorage for `ttlMs` milliseconds.
 */
export async function proxyFetchJson<T>(targetUrl: string, ttlMs = 5 * 60 * 1000): Promise<T> {
  const cacheKey = targetUrl;
  const now = Date.now();

  const mem = memoryCache.get(cacheKey);
  if (mem && mem.expires > now) return mem.data as T;

  const persisted = readPersistentCache(cacheKey);
  if (persisted && persisted.expires > now) {
    memoryCache.set(cacheKey, persisted);
    return persisted.data as T;
  }

  const order = [lastWorkingIndex, ...PROXIES.map((_, i) => i).filter((i) => i !== lastWorkingIndex)];

  let lastError: unknown = null;
  for (const idx of order) {
    const proxy = PROXIES[idx];
    try {
      const res = await fetchWithTimeout(proxy.build(targetUrl), 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rawText = await res.text();
      const text = proxy.unwrap ? proxy.unwrap(rawText) : rawText;
      const data = JSON.parse(text) as T;
      lastWorkingIndex = idx;
      const entry = { data, expires: now + ttlMs };
      memoryCache.set(cacheKey, entry);
      writePersistentCache(cacheKey, entry);
      return data;
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Toutes les tentatives ont échoué");
}

export function clearSteamCache() {
  memoryCache.clear();
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("sf_cache_"))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}
