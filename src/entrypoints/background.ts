import { SwitchBotAPI } from '@/lib/api';
import { decryptCredentials, encryptCredentials } from '@/lib/crypto';
import { onMessage } from '@/lib/messaging';
import {
  cachedDevicesItem,
  cacheTimestampItem,
  credentialsItem,
  deviceStatusCacheItem,
  encryptedCredentialsItem,
  irDeviceStatesItem,
  securityModeItem,
  sessionCredentialsItem,
} from '@/lib/storage';
import type { Device, StoredCredentials } from '@/types/switchbot';
import { CACHE_TTL_MS, IR_COMMAND_DELAYS } from '@/utils/constants';
import { toUnifiedDevice } from '@/utils/device';

export default defineBackground({
  type: 'module',
  main() {
    // --- Helpers ---

    async function getCredentials(): Promise<StoredCredentials> {
      const mode = await securityModeItem.getValue();

      if (mode === 'standard') {
        const creds = await credentialsItem.getValue();
        if (!creds) throw new Error('NO_CREDENTIALS');
        return creds;
      }

      const sessionCreds = await sessionCredentialsItem.getValue();
      if (sessionCreds) return sessionCreds;

      throw new Error('LOCKED');
    }

    function createAPI(creds: StoredCredentials): SwitchBotAPI {
      return new SwitchBotAPI(creds.token, creds.secret);
    }

    // IR command throttle (in-memory, acceptable to lose on SW restart)
    const lastCommandTime = new Map<string, number>();

    async function throttleIRCommand(deviceId: string, deviceType: string): Promise<void> {
      const delay = IR_COMMAND_DELAYS[deviceType] ?? IR_COMMAND_DELAYS.DEFAULT;
      const lastTime = lastCommandTime.get(deviceId) ?? 0;
      const elapsed = Date.now() - lastTime;
      if (elapsed < delay) {
        await new Promise((resolve) => setTimeout(resolve, delay - elapsed));
      }
    }

    // --- Message Handlers ---

    onMessage('getDevices', async ({ data }) => {
      const creds = await getCredentials();
      const forceRefresh = data?.forceRefresh ?? false;

      if (!forceRefresh) {
        const timestamp = await cacheTimestampItem.getValue();
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          const cached = await cachedDevicesItem.getValue();
          if (cached) return cached;
        }
      }

      const api = createAPI(creds);
      const body = await api.getDevices();

      const devices: Device[] = [
        ...body.deviceList.map(toUnifiedDevice),
        ...body.infraredRemoteList.map(toUnifiedDevice),
      ];

      await cachedDevicesItem.setValue(devices);
      await cacheTimestampItem.setValue(Date.now());

      return devices;
    });

    onMessage('getDeviceStatus', async ({ data }) => {
      const creds = await getCredentials();
      const api = createAPI(creds);
      return api.getDeviceStatus(data.deviceId);
    });

    onMessage('sendCommand', async ({ data }) => {
      const creds = await getCredentials();
      const api = createAPI(creds);

      // Throttle IR device commands
      const cached = await cachedDevicesItem.getValue();
      const device = cached?.find((d) => d.deviceId === data.deviceId);
      if (device?.isIR) {
        await throttleIRCommand(data.deviceId, device.deviceType);
      }

      await api.sendCommand(data.deviceId, data.command);
      lastCommandTime.set(data.deviceId, Date.now());

      // Update IR device state cache
      if (device?.isIR) {
        const states = await irDeviceStatesItem.getValue();
        const existing = states.find((s) => s.deviceId === data.deviceId);
        const newPower =
          data.command.command === 'turnOn'
            ? 'on'
            : data.command.command === 'turnOff'
              ? 'off'
              : (existing?.power ?? 'off');

        const updated = states.filter((s) => s.deviceId !== data.deviceId);
        updated.push({
          deviceId: data.deviceId,
          power: newPower as 'on' | 'off',
          lastUpdated: Date.now(),
          acState: existing?.acState,
        });
        await irDeviceStatesItem.setValue(updated);
      }

      return { success: true };
    });

    onMessage('saveCredentials', async ({ data }) => {
      const { credentials, mode, password } = data;

      if (mode === 'standard') {
        await credentialsItem.setValue(credentials);
        await encryptedCredentialsItem.setValue(null);
        await sessionCredentialsItem.setValue(null);
      } else {
        if (!password) throw new Error('PASSWORD_REQUIRED');
        const encrypted = await encryptCredentials(credentials, password);
        await encryptedCredentialsItem.setValue(encrypted);
        await credentialsItem.setValue(null);
        await sessionCredentialsItem.setValue(credentials);
      }

      await securityModeItem.setValue(mode);
    });

    onMessage('testConnection', async () => {
      try {
        const creds = await getCredentials();
        const api = createAPI(creds);
        const body = await api.getDevices();
        const count = body.deviceList.length + body.infraredRemoteList.length;
        return { success: true, deviceCount: count };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        };
      }
    });

    onMessage('isAuthenticated', async () => {
      const mode = await securityModeItem.getValue();
      if (mode === 'standard') {
        const creds = await credentialsItem.getValue();
        return creds !== null;
      }
      const encrypted = await encryptedCredentialsItem.getValue();
      return encrypted !== null;
    });

    onMessage('unlockWithPassword', async ({ data }) => {
      try {
        const encrypted = await encryptedCredentialsItem.getValue();
        if (!encrypted) return { success: false, error: 'NO_CREDENTIALS' };

        const creds = await decryptCredentials(encrypted, data.password);
        await sessionCredentialsItem.setValue(creds);
        return { success: true };
      } catch {
        return { success: false, error: 'WRONG_PASSWORD' };
      }
    });

    onMessage('getSecurityMode', async () => {
      return securityModeItem.getValue();
    });

    onMessage('isUnlocked', async () => {
      const mode = await securityModeItem.getValue();
      if (mode === 'standard') return true;
      const session = await sessionCredentialsItem.getValue();
      return session !== null;
    });

    // --- Periodic Refresh ---

    const ALARM_REFRESH_DEVICES = 'refreshDevices';
    const REFRESH_INTERVAL_MINUTES = 5;

    async function refreshAllDeviceStatuses(): Promise<void> {
      let creds: StoredCredentials;
      try {
        creds = await getCredentials();
      } catch {
        return;
      }

      const cached = await cachedDevicesItem.getValue();
      if (!cached || cached.length === 0) return;

      const api = createAPI(creds);
      const physicalDevices = cached.filter((d: Device) => !d.isIR);
      const statusCache = await deviceStatusCacheItem.getValue();

      for (const device of physicalDevices) {
        try {
          const status = await api.getDeviceStatus(device.deviceId);
          statusCache[device.deviceId] = status;
        } catch {
          // Individual device failure - skip
        }
      }

      await deviceStatusCacheItem.setValue(statusCache);
      await cacheTimestampItem.setValue(Date.now());
    }

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name !== ALARM_REFRESH_DEVICES) return;
      refreshAllDeviceStatuses().catch((err) => console.warn('Periodic refresh failed:', err));
    });

    chrome.alarms.get(ALARM_REFRESH_DEVICES).then((existing) => {
      if (!existing) {
        chrome.alarms.create(ALARM_REFRESH_DEVICES, {
          delayInMinutes: 1,
          periodInMinutes: REFRESH_INTERVAL_MINUTES,
        });
      }
    });

    console.log('SwitchBot Controller background service worker started');
  },
});
