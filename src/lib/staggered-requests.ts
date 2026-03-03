import type { SwitchBotAPI } from '@/lib/api';
import type { Device, DeviceStatus } from '@/types/switchbot';
import { STATUS_REQUEST_INTERVAL_MS } from '@/utils/constants';

export interface StaggeredStatusResult {
  deviceId: string;
  status: DeviceStatus | null;
  error: string | null;
}

export async function fetchDeviceStatusesStaggered(
  api: SwitchBotAPI,
  devices: Device[],
): Promise<StaggeredStatusResult[]> {
  const physicalDevices = devices.filter((d) => !d.isIR);
  const results: StaggeredStatusResult[] = [];

  for (let i = 0; i < physicalDevices.length; i++) {
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, STATUS_REQUEST_INTERVAL_MS));
    }
    const device = physicalDevices[i];
    try {
      const status = await api.getDeviceStatus(device.deviceId);
      results.push({ deviceId: device.deviceId, status, error: null });
    } catch (err) {
      results.push({
        deviceId: device.deviceId,
        status: null,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
  return results;
}
