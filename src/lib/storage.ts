import { storage } from '@wxt-dev/storage';
import type {
  Device,
  DeviceStatus,
  EncryptedCredentials,
  IRDeviceState,
  SecurityMode,
  StoredCredentials,
} from '@/types/switchbot';

export const securityModeItem = storage.defineItem<SecurityMode>('local:securityMode', {
  fallback: 'standard',
});

export const credentialsItem = storage.defineItem<StoredCredentials | null>('local:credentials', {
  fallback: null,
});

export const encryptedCredentialsItem = storage.defineItem<EncryptedCredentials | null>(
  'local:encryptedCredentials',
  { fallback: null },
);

export const sessionCredentialsItem = storage.defineItem<StoredCredentials | null>(
  'session:credentials',
  { fallback: null },
);

export const cachedDevicesItem = storage.defineItem<Device[] | null>('local:cachedDevices', {
  fallback: null,
});

export const cacheTimestampItem = storage.defineItem<number>('local:cacheTimestamp', {
  fallback: 0,
});

export const irDeviceStatesItem = storage.defineItem<IRDeviceState[]>('local:irDeviceStates', {
  fallback: [],
});

export const devicePreferencesItem = storage.defineItem<
  Record<string, { visible: boolean; order: number }>
>('local:devicePreferences', { fallback: {} });

export const deviceStatusCacheItem = storage.defineItem<Record<string, DeviceStatus>>(
  'local:deviceStatusCache',
  { fallback: {} },
);

export type ThemePreference = 'light' | 'dark' | 'system';

export const themePreferenceItem = storage.defineItem<ThemePreference>('local:themePreference', {
  fallback: 'system',
});
