import { defineExtensionMessaging } from '@webext-core/messaging';
import type {
  Device,
  DeviceCommand,
  DeviceStatus,
  SecurityMode,
  StoredCredentials,
} from '@/types/switchbot';

interface ProtocolMap {
  getDevices(data: { forceRefresh?: boolean }): Device[];
  getDeviceStatus(data: { deviceId: string }): DeviceStatus;
  sendCommand(data: { deviceId: string; command: DeviceCommand }): {
    success: boolean;
    message?: string;
  };

  saveCredentials(data: {
    credentials: StoredCredentials;
    mode: SecurityMode;
    password?: string;
  }): void;
  testConnection(data?: undefined): {
    success: boolean;
    deviceCount?: number;
    error?: string;
  };
  isAuthenticated(data?: undefined): boolean;

  unlockWithPassword(data: { password: string }): {
    success: boolean;
    error?: string;
  };
  getSecurityMode(data?: undefined): SecurityMode;
  isUnlocked(data?: undefined): boolean;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
