export async function waitUntil<T>(promise: Promise<T>): Promise<T> {
  const KEEPALIVE_INTERVAL_MS = 25_000;
  const keepAlive = setInterval(() => chrome.runtime.getPlatformInfo(), KEEPALIVE_INTERVAL_MS);
  try {
    return await promise;
  } finally {
    clearInterval(keepAlive);
  }
}
