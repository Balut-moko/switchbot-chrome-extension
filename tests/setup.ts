import '@testing-library/jest-dom/vitest';

// Mock chrome.storage API for unit tests
const storageData: Record<string, unknown> = {};

const storageMock = {
  get: vi.fn((keys: string | string[]) => {
    if (typeof keys === 'string') {
      return Promise.resolve({ [keys]: storageData[keys] });
    }
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      result[key] = storageData[key];
    }
    return Promise.resolve(result);
  }),
  set: vi.fn((items: Record<string, unknown>) => {
    Object.assign(storageData, items);
    return Promise.resolve();
  }),
  remove: vi.fn((keys: string | string[]) => {
    const keyList = typeof keys === 'string' ? [keys] : keys;
    for (const key of keyList) {
      delete storageData[key];
    }
    return Promise.resolve();
  }),
};

globalThis.chrome = {
  storage: {
    local: storageMock,
    session: storageMock,
  },
  runtime: {
    id: 'test-extension-id',
    getURL: (path: string) => `chrome-extension://test-extension-id/${path}`,
  },
} as unknown as typeof chrome;
