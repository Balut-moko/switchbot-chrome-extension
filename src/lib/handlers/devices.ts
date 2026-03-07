import { recordCommandTime, throttleIRCommand } from '@/lib/ir-throttle';
import { onMessage } from '@/lib/messaging';
import { cachedDevicesItem, cacheTimestampItem, irDeviceStatesItem } from '@/lib/storage';
import type { Device, DeviceStatus } from '@/types/switchbot';
import { CACHE_TTL_MS } from '@/utils/constants';
import { toUnifiedDevice } from '@/utils/device';
import { createAPI, getCredentials } from './auth';

/**
 * モックデータを動的 import で取得する。
 * __MOCK_MODE__ が false の場合は呼ばれないため、
 * 本番ビルドでは tree-shaking により除外される。
 */
async function loadMockData() {
  const { MOCK_DEVICES, MOCK_STATUSES } = await import('@/lib/mock-data');
  return { devices: MOCK_DEVICES, statuses: MOCK_STATUSES };
}

/**
 * デバイス操作関連のメッセージハンドラを登録する。
 */
export function registerDeviceHandlers(): void {
  onMessage('getDevices', async ({ data }) => {
    if (__MOCK_MODE__) {
      const mock = await loadMockData();
      return mock.devices;
    }

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
    if (__MOCK_MODE__) {
      const mock = await loadMockData();
      return (mock.statuses[data.deviceId] ?? {
        deviceId: data.deviceId,
        deviceType: 'Unknown',
        hubDeviceId: '',
      }) as DeviceStatus;
    }

    const creds = await getCredentials();
    const api = createAPI(creds);
    return api.getDeviceStatus(data.deviceId);
  });

  onMessage('sendCommand', async ({ data }) => {
    if (__MOCK_MODE__) {
      console.log('[MockMode] sendCommand:', data.deviceId, data.command);
      return { success: true };
    }

    const creds = await getCredentials();
    const api = createAPI(creds);

    // Throttle IR device commands
    const cached = await cachedDevicesItem.getValue();
    const device = cached?.find((d) => d.deviceId === data.deviceId);
    if (device?.isIR) {
      await throttleIRCommand(data.deviceId, device.deviceType);
    }

    await api.sendCommand(data.deviceId, data.command);
    recordCommandTime(data.deviceId);

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
}
