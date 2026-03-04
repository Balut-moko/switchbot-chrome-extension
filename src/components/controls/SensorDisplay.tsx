import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { getCapabilities } from '@/utils/deviceCapabilities';

interface Props {
  device: Device;
}

export default function SensorDisplay({ device }: Props) {
  const { status, loading } = useDeviceStatus(device.deviceId);
  const caps = getCapabilities(device.deviceType);

  if (loading) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">Loading...</span>;
  }

  if (!status) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">--</span>;
  }

  const parts: string[] = [];

  if (caps.hasTemperature && 'temperature' in status) {
    parts.push(`${(status as { temperature: number }).temperature}\u00B0C`);
  }
  if (caps.hasHumidity && 'humidity' in status) {
    parts.push(`${(status as { humidity: number }).humidity}%`);
  }
  if (caps.hasBattery && 'battery' in status) {
    parts.push(`\u{1F50B} ${(status as { battery: number }).battery}%`);
  }

  if ('moveDetected' in status) {
    parts.push((status as { moveDetected: boolean }).moveDetected ? 'Motion!' : 'Clear');
  }
  if ('openState' in status) {
    const state = (status as { openState: string }).openState;
    parts.push(state === 'open' ? 'Open' : 'Closed');
  }

  return (
    <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
      {parts.join(' | ') || '--'}
    </span>
  );
}
