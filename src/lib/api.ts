import { createAuthHeaders } from '@/lib/auth';
import type {
  DeviceCommand,
  DeviceListBody,
  DeviceStatus,
  SwitchBotApiResponse,
} from '@/types/switchbot';
import { SWITCHBOT_API_BASE } from '@/utils/constants';

export class SwitchBotAPI {
  constructor(
    private token: string,
    private secret: string,
  ) {}

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = await createAuthHeaders(this.token, this.secret);
    const response = await fetch(`${SWITCHBOT_API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('INVALID_CREDENTIALS');
      if (response.status === 403) throw new Error('FORBIDDEN');
      if (response.status === 429) throw new Error('RATE_LIMITED');
      throw new Error(`API_ERROR_${response.status}`);
    }

    const json: SwitchBotApiResponse<T> = await response.json();

    if (json.statusCode === 190) {
      throw new Error('DEVICE_ERROR');
    }
    if (json.statusCode !== 100) {
      throw new Error(json.message || `API_ERROR_CODE_${json.statusCode}`);
    }

    return json.body;
  }

  async getDevices(): Promise<DeviceListBody> {
    return this.request<DeviceListBody>('/devices');
  }

  async getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
    return this.request<DeviceStatus>(`/devices/${encodeURIComponent(deviceId)}/status`);
  }

  async sendCommand(deviceId: string, command: DeviceCommand): Promise<void> {
    await this.request(`/devices/${encodeURIComponent(deviceId)}/commands`, {
      method: 'POST',
      body: JSON.stringify(command),
    });
  }
}
