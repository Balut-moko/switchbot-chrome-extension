import { useEffect, useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { DeviceCommand, DeviceStatus } from '@/types/switchbot';

interface UseDeviceToggleOptions {
  deviceId: string;
  /** ステータス取得を有効にするか（IR デバイスは false） */
  enableStatus?: boolean;
  /** ステータスから power 状態を抽出する関数 */
  extractPower?: (status: DeviceStatus) => boolean;
  /** コマンド送信時の追加オプション */
  commandOptions?: Partial<DeviceCommand>;
}

interface UseDeviceToggleResult {
  isOn: boolean;
  isPending: boolean;
  status: DeviceStatus | null;
  toggle: () => Promise<void>;
  sendCommand: (command: DeviceCommand) => Promise<{ success: boolean; message?: string }>;
}

const defaultExtractPower = (status: DeviceStatus): boolean => {
  return 'power' in status && (status as { power: string }).power === 'on';
};

/**
 * デバイスのトグル操作を共通化するカスタムフック。
 * ステータス取得 → 楽観的更新 → コマンド送信 → エラー時ロールバック のパターンを提供する。
 */
export function useDeviceToggle({
  deviceId,
  enableStatus = true,
  extractPower = defaultExtractPower,
  commandOptions,
}: UseDeviceToggleOptions): UseDeviceToggleResult {
  const [isOn, setIsOn] = useState(false);
  const { sendCommand, isPending } = useDeviceCommand(deviceId);
  const { status } = useDeviceStatus(deviceId, enableStatus);

  useEffect(() => {
    if (status) {
      setIsOn(extractPower(status));
    }
  }, [status, extractPower]);

  const toggle = async () => {
    const newState = !isOn;
    setIsOn(newState);
    try {
      await sendCommand({
        command: newState ? 'turnOn' : 'turnOff',
        parameter: 'default',
        ...commandOptions,
      });
    } catch {
      setIsOn(!newState);
    }
  };

  return { isOn, isPending, status, toggle, sendCommand };
}
