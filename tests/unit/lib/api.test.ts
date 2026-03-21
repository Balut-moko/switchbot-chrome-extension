import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SwitchBotAPI } from '@/lib/api';
import type { DeviceCommand, DeviceListBody, SwitchBotApiResponse } from '@/types/switchbot';
import { SWITCHBOT_API_BASE } from '@/utils/constants';

const TEST_TOKEN = 'test-token';
const TEST_SECRET = 'test-secret';

function mockFetchResponse<T>(body: SwitchBotApiResponse<T>, status = 200) {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

function mockFetchError(status: number) {
  return vi.fn().mockResolvedValue(new Response(null, { status }));
}

describe('SwitchBotAPI', () => {
  let api: SwitchBotAPI;

  beforeEach(() => {
    api = new SwitchBotAPI(TEST_TOKEN, TEST_SECRET);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDevices', () => {
    it('成功レスポンス（statusCode: 100）でデバイスリストを返す', async () => {
      const deviceList: DeviceListBody = {
        deviceList: [
          {
            deviceId: 'dev-1',
            deviceName: 'My Bot',
            deviceType: 'Bot',
            hubDeviceId: 'hub-1',
            enableCloudService: true,
          },
        ],
        infraredRemoteList: [
          {
            deviceId: 'ir-1',
            deviceName: 'My AC',
            remoteType: 'Air Conditioner',
            hubDeviceId: 'hub-1',
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        mockFetchResponse({
          statusCode: 100,
          body: deviceList,
          message: 'success',
        }),
      );

      const result = await api.getDevices();
      expect(result).toEqual(deviceList);
      expect(fetch).toHaveBeenCalledWith(
        `${SWITCHBOT_API_BASE}/devices`,
        expect.objectContaining({ headers: expect.any(Headers) }),
      );
    });
  });

  describe('sendCommand', () => {
    it('POST リクエストでコマンドを送信する', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetchResponse({
          statusCode: 100,
          body: {},
          message: 'success',
        }),
      );

      const command: DeviceCommand = {
        command: 'turnOn',
        parameter: 'default',
        commandType: 'command',
      };

      await api.sendCommand('dev-1', command);

      expect(fetch).toHaveBeenCalledWith(
        `${SWITCHBOT_API_BASE}/devices/dev-1/commands`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(command),
          headers: expect.any(Headers),
        }),
      );
    });
  });

  describe('HTTP エラーハンドリング', () => {
    it('401 で INVALID_CREDENTIALS エラーを投げる', async () => {
      vi.stubGlobal('fetch', mockFetchError(401));
      await expect(api.getDevices()).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('403 で FORBIDDEN エラーを投げる', async () => {
      vi.stubGlobal('fetch', mockFetchError(403));
      await expect(api.getDevices()).rejects.toThrow('FORBIDDEN');
    });

    it('429 で RATE_LIMITED エラーを投げる', async () => {
      vi.stubGlobal('fetch', mockFetchError(429));
      await expect(api.getDevices()).rejects.toThrow('RATE_LIMITED');
    });

    it('500 で API_ERROR_500 エラーを投げる', async () => {
      vi.stubGlobal('fetch', mockFetchError(500));
      await expect(api.getDevices()).rejects.toThrow('API_ERROR_500');
    });
  });

  describe('API statusCode エラーハンドリング', () => {
    it('statusCode 190 で SYSTEM_ERROR を投げる', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetchResponse({
          statusCode: 190,
          body: {},
          message: 'System error',
        }),
      );

      await expect(api.getDevices()).rejects.toThrow('SYSTEM_ERROR');
    });

    it('statusCode が 100 以外で message を含むエラーを投げる', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetchResponse({
          statusCode: 150,
          body: {},
          message: 'Something went wrong',
        }),
      );

      await expect(api.getDevices()).rejects.toThrow('Something went wrong');
    });

    it('statusCode が 100 以外で message が空の場合コードベースのエラーを投げる', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetchResponse({
          statusCode: 150,
          body: {},
          message: '',
        }),
      );

      await expect(api.getDevices()).rejects.toThrow('API_ERROR_CODE_150');
    });
  });

  describe('getDeviceStatus', () => {
    it('デバイスIDをURLエンコードしてリクエストする', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetchResponse({
          statusCode: 100,
          body: {
            deviceId: 'dev-1',
            deviceType: 'Bot',
            hubDeviceId: 'hub-1',
            power: 'on',
            battery: 100,
            deviceMode: 'pressMode',
          },
          message: 'success',
        }),
      );

      await api.getDeviceStatus('dev-1');

      expect(fetch).toHaveBeenCalledWith(
        `${SWITCHBOT_API_BASE}/devices/dev-1/status`,
        expect.objectContaining({ headers: expect.any(Headers) }),
      );
    });
  });
});
