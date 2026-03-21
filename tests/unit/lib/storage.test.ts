import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock @wxt-dev/storage before importing the module under test
const mockDefineItem = vi
  .fn()
  .mockImplementation((_key: string, options?: { fallback?: unknown }) => ({
    getValue: vi.fn().mockResolvedValue(options?.fallback ?? null),
    setValue: vi.fn().mockResolvedValue(undefined),
    removeValue: vi.fn().mockResolvedValue(undefined),
    fallback: options?.fallback,
  }));

vi.mock('@wxt-dev/storage', () => ({
  storage: {
    defineItem: mockDefineItem,
  },
}));

describe('storage items', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('すべての storage item が正しく定義される', async () => {
    const storageModule = await import('@/lib/storage');

    expect(storageModule.securityModeItem).toBeDefined();
    expect(storageModule.credentialsItem).toBeDefined();
    expect(storageModule.encryptedCredentialsItem).toBeDefined();
    expect(storageModule.sessionCredentialsItem).toBeDefined();
    expect(storageModule.cachedDevicesItem).toBeDefined();
    expect(storageModule.cacheTimestampItem).toBeDefined();
    expect(storageModule.irDeviceStatesItem).toBeDefined();
    expect(storageModule.devicePreferencesItem).toBeDefined();
    expect(storageModule.deviceStatusCacheItem).toBeDefined();
    expect(storageModule.themePreferenceItem).toBeDefined();
    expect(storageModule.languagePreferenceItem).toBeDefined();
  });

  it('defineItem が正しいキーとフォールバック値で呼ばれる', async () => {
    vi.resetModules();

    const freshDefineItem = vi
      .fn()
      .mockImplementation((_key: string, options?: { fallback?: unknown }) => ({
        getValue: vi.fn().mockResolvedValue(options?.fallback ?? null),
        setValue: vi.fn().mockResolvedValue(undefined),
        removeValue: vi.fn().mockResolvedValue(undefined),
        fallback: options?.fallback,
      }));

    vi.doMock('@wxt-dev/storage', () => ({
      storage: {
        defineItem: freshDefineItem,
      },
    }));

    await import('@/lib/storage');

    const calls = freshDefineItem.mock.calls;
    const callMap = new Map(
      calls.map((c: [string, { fallback?: unknown }?]) => [c[0], c[1]?.fallback]),
    );

    // 各 storage item のキーとフォールバック値を検証
    expect(callMap.get('local:securityMode')).toBe('standard');
    expect(callMap.get('local:credentials')).toBeNull();
    expect(callMap.get('local:encryptedCredentials')).toBeNull();
    expect(callMap.get('session:credentials')).toBeNull();
    expect(callMap.get('local:cachedDevices')).toBeNull();
    expect(callMap.get('local:cacheTimestamp')).toBe(0);
    expect(callMap.get('local:irDeviceStates')).toEqual([]);
    expect(callMap.get('local:devicePreferences')).toEqual({});
    expect(callMap.get('local:deviceStatusCache')).toEqual({});
    expect(callMap.get('local:themePreference')).toBe('system');
    expect(callMap.get('local:languagePreference')).toBe('auto');
  });

  it('session: プレフィックスの storage item が session storage を使用する', async () => {
    vi.resetModules();

    const sessionDefineItem = vi
      .fn()
      .mockImplementation((_key: string, options?: { fallback?: unknown }) => ({
        getValue: vi.fn().mockResolvedValue(options?.fallback ?? null),
        setValue: vi.fn().mockResolvedValue(undefined),
        removeValue: vi.fn().mockResolvedValue(undefined),
        fallback: options?.fallback,
      }));

    vi.doMock('@wxt-dev/storage', () => ({
      storage: {
        defineItem: sessionDefineItem,
      },
    }));

    await import('@/lib/storage');

    const calls = sessionDefineItem.mock.calls;
    const sessionKeys = calls
      .map((c: [string]) => c[0])
      .filter((key: string) => key.startsWith('session:'));

    expect(sessionKeys).toContain('session:credentials');
    expect(sessionKeys).toHaveLength(1);
  });
});
