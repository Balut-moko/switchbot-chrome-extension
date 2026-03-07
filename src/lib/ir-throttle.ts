import { IR_COMMAND_DELAYS } from '@/utils/constants';

// IR command throttle (in-memory, acceptable to lose on SW restart)
const lastCommandTime = new Map<string, number>();

/**
 * IR デバイスのコマンド送信間隔を制御する。
 * デバイスタイプに応じた遅延を適用する。
 */
export async function throttleIRCommand(deviceId: string, deviceType: string): Promise<void> {
  const delay = IR_COMMAND_DELAYS[deviceType] ?? IR_COMMAND_DELAYS.DEFAULT;
  const lastTime = lastCommandTime.get(deviceId) ?? 0;
  const elapsed = Date.now() - lastTime;
  if (elapsed < delay) {
    await new Promise((resolve) => setTimeout(resolve, delay - elapsed));
  }
}

/**
 * コマンド送信後にタイムスタンプを記録する。
 */
export function recordCommandTime(deviceId: string): void {
  lastCommandTime.set(deviceId, Date.now());
}
