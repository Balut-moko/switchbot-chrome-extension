import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwitchBotAPI } from '@/lib/api';
import type { DeviceCommand, SwitchBotApiResponse } from '@/types/switchbot';

// Mock createAuthHeaders to return simple Headers
vi.mock('@/lib/auth', () => ({
  createAuthHeaders: vi.fn().mockResolvedValue(
    new Headers({
      Authorization: 'mock-token',
      sign: 'mock-sign',
      t: '1234567890',
      nonce: 'mock-nonce',
      'Content-Type': 'application/json; charset=utf8',
    }),
  ),
}));

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function makeResponse<T>(body: T, statusCode = 100, message = 'success'): SwitchBotApiResponse<T> {
  return { statusCode, body, message };
}

function mockFetchOk<T>(data: SwitchBotApiResponse<T>) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  });
}

function mockFetchError(status: number) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve({}),
  });
}

describe('SwitchBotAPI', () => {
  let api: SwitchBotAPI;

  beforeEach(() => {
    vi.clearAllMocks();
    api = new SwitchBotAPI('test-token', 'test-secret');
  });

  describe('getDevices', () => {
    it('statusCode 100 で成功しデバイスリストを返す', async () => {
      const deviceListBody = {
        deviceList: [
          {
            deviceId: 'dev-1',
            deviceName: 'Bot',
            deviceType: 'Bot',
            hubDeviceId: 'hub-1',
            enableCloudService: true,
          },
        ],
        infraredRemoteList: [],
      };
      mockFetchOk(makeResponse(deviceListBody));

      const result = await api.getDevices();
      expect(result).toEqual(deviceListBody);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.switch-bot.com/v1.1/devices',
        expect.objectContaining({ headers: expect.any(Headers) }),
      );
    });
  });

  describe('getDeviceStatus', () => {
    it('statusCode 100 で成功しデバイスステータスを返す', async () => {
      const status = {
        deviceId: 'dev-1',
        deviceType: 'Bot',
        hubDeviceId: 'hub-1',
        power: 'on' as const,
        battery: 95,
        deviceMode: 'pressMode' as const,
      };
      mockFetchOk(makeResponse(status));

      const result = await api.getDeviceStatus('dev-1');
      expect(result).toEqual(status);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.switch-bot.com/v1.1/devices/dev-1/status',
        expect.objectContaining({ headers: expect.any(Headers) }),
      );
    });
  });

  describe('sendCommand', () => {
    it('POST メソッドで正しいボディを送信する', async () => {
      mockFetchOk(makeResponse(undefined));

      const command: DeviceCommand = {
        command: 'turnOn',
        parameter: 'default',
        commandType: 'command',
      };
      await api.sendCommand('dev-1', command);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.switch-bot.com/v1.1/devices/dev-1/commands',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(command),
          headers: expect.any(Headers),
        }),
      );
    });
  });

  describe('HTTP エラーハンドリング', () => {
    it('HTTP 401 で INVALID_CREDENTIALS をスローする', async () => {
      mockFetchError(401);
      await expect(api.getDevices()).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('HTTP 403 で FORBIDDEN をスローする', async () => {
      mockFetchError(403);
      await expect(api.getDevices()).rejects.toThrow('FORBIDDEN');
    });

    it('HTTP 429 で RATE_LIMITED をスローする', async () => {
      mockFetchError(429);
      await expect(api.getDevices()).rejects.toThrow('RATE_LIMITED');
    });
  });

  describe('API レスポンスエラーハンドリング', () => {
    it('statusCode 190 で SYSTEM_ERROR をスローする', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ statusCode: 190, body: {}, message: 'System error' }),
      });
      await expect(api.getDevices()).rejects.toThrow('SYSTEM_ERROR');
    });

    it('statusCode が 100 以外でメッセージ付きエラーをスローする', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ statusCode: 161, body: {}, message: 'Device is offline' }),
      });
      await expect(api.getDevices()).rejects.toThrow('Device is offline');
    });

    it('statusCode が 100 以外でメッセージなしの場合フォールバックエラーをスローする', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ statusCode: 152, body: {}, message: '' }),
      });
      await expect(api.getDevices()).rejects.toThrow('API_ERROR_CODE_152');
    });
  });
});
