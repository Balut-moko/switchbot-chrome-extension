import { describe, expect, it } from 'vitest';
import {
  cachedDevicesItem,
  cacheTimestampItem,
  credentialsItem,
  devicePreferencesItem,
  deviceStatusCacheItem,
  encryptedCredentialsItem,
  irDeviceStatesItem,
  languagePreferenceItem,
  securityModeItem,
  sessionCredentialsItem,
  themePreferenceItem,
} from '@/lib/storage';

describe('storage exports', () => {
  it('securityModeItem がエクスポートされている', () => {
    expect(securityModeItem).toBeDefined();
  });

  it('credentialsItem がエクスポートされている', () => {
    expect(credentialsItem).toBeDefined();
  });

  it('encryptedCredentialsItem がエクスポートされている', () => {
    expect(encryptedCredentialsItem).toBeDefined();
  });

  it('sessionCredentialsItem がエクスポートされている', () => {
    expect(sessionCredentialsItem).toBeDefined();
  });

  it('cachedDevicesItem がエクスポートされている', () => {
    expect(cachedDevicesItem).toBeDefined();
  });

  it('cacheTimestampItem がエクスポートされている', () => {
    expect(cacheTimestampItem).toBeDefined();
  });

  it('irDeviceStatesItem がエクスポートされている', () => {
    expect(irDeviceStatesItem).toBeDefined();
  });

  it('devicePreferencesItem がエクスポートされている', () => {
    expect(devicePreferencesItem).toBeDefined();
  });

  it('deviceStatusCacheItem がエクスポートされている', () => {
    expect(deviceStatusCacheItem).toBeDefined();
  });

  it('themePreferenceItem がエクスポートされている', () => {
    expect(themePreferenceItem).toBeDefined();
  });

  it('languagePreferenceItem がエクスポートされている', () => {
    expect(languagePreferenceItem).toBeDefined();
  });
});
