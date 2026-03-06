import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { getCapabilities } from '@/utils/deviceCapabilities';
import { t } from '@/utils/i18n';

interface Props {
  device: Device;
}

export default function SensorDisplay({ device }: Props) {
  const { status, loading } = useDeviceStatus(device.deviceId);
  const caps = getCapabilities(device.deviceType);

  if (loading) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">{t('LOADING')}</span>;
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
  if (caps.hasCO2 && 'CO2' in status) {
    parts.push(`CO\u2082 ${(status as { CO2: number }).CO2} ppm`);
  }
  if (caps.hasBattery && 'battery' in status) {
    parts.push(`\u{1F50B} ${(status as { battery: number }).battery}%`);
  }

  if ('moveDetected' in status) {
    parts.push(
      (status as { moveDetected: boolean }).moveDetected ? t('MOTION_DETECTED') : t('MOTION_CLEAR'),
    );
  }
  if ('openState' in status) {
    const state = (status as { openState: string }).openState;
    parts.push(state === 'open' ? t('CONTACT_OPEN') : t('CONTACT_CLOSED'));
  }

  return (
    <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
      {parts.join(' | ') || '--'}
    </span>
  );
}
