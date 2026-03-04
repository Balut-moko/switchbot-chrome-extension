import ACControl from '@/components/controls/ACControl';
import CurtainControl from '@/components/controls/CurtainControl';
import LightControl from '@/components/controls/LightControl';
import LockControl from '@/components/controls/LockControl';
import SensorDisplay from '@/components/controls/SensorDisplay';
import SwitchControl from '@/components/controls/SwitchControl';
import TVControl from '@/components/controls/TVControl';
import type { Device } from '@/types/switchbot';
import { getDeviceCategory, getDeviceIcon } from '@/utils/device';

interface Props {
  device: Device;
  variant?: 'controls' | 'sensors';
}

function DeviceControl({ device }: Props) {
  const category = getDeviceCategory(device);

  switch (category) {
    case 'switch':
      return <SwitchControl device={device} />;
    case 'sensor':
      return <SensorDisplay device={device} />;
    case 'curtain':
      return <CurtainControl device={device} />;
    case 'tv':
      return <TVControl device={device} />;
    case 'lock':
      return <LockControl device={device} />;
    case 'light':
      return <LightControl device={device} />;
    default:
      return <span className="text-xs text-gray-400 dark:text-gray-500">{device.deviceType}</span>;
  }
}

export default function DeviceCard({ device, variant = 'controls' }: Props) {
  const category = getDeviceCategory(device);

  if (category === 'ac') {
    return (
      <div className="rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 overflow-hidden">
        <ACControl device={device} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors ${
        variant === 'sensors'
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base flex-shrink-0">{getDeviceIcon(device)}</span>
        <span className="text-sm font-medium truncate dark:text-gray-200">{device.deviceName}</span>
      </div>
      <div className="flex-shrink-0 ml-2">
        <DeviceControl device={device} />
      </div>
    </div>
  );
}
