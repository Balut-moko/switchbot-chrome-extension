import { createAPI, getCredentials, registerAuthHandlers } from '@/lib/handlers/auth';
import { registerDeviceHandlers } from '@/lib/handlers/devices';
import { fetchDeviceStatusesStaggered } from '@/lib/staggered-requests';
import { cachedDevicesItem, cacheTimestampItem, deviceStatusCacheItem } from '@/lib/storage';
import { waitUntil } from '@/lib/wait-until';
import type { StoredCredentials } from '@/types/switchbot';

export default defineBackground({
  type: 'module',
  main() {
    // --- Message Handlers ---
    registerAuthHandlers();
    registerDeviceHandlers();

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
      const results = await waitUntil(fetchDeviceStatusesStaggered(api, cached));

      const statusCache = await deviceStatusCacheItem.getValue();
      for (const result of results) {
        if (result.status) {
          statusCache[result.deviceId] = result.status;
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

    if (__MOCK_MODE__) {
      console.log('[MockMode] SwitchBot Controller running in demo mode');
    }
    console.log('SwitchBot Controller background service worker started');
  },
});
