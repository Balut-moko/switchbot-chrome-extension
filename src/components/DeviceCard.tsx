import ACControl from '@/components/controls/ACControl';
import BotControl from '@/components/controls/BotControl';
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
  disabled?: boolean;
}

function DeviceControl({ device, disabled = false }: { device: Device; disabled?: boolean }) {
  const category = getDeviceCategory(device);

  switch (category) {
    case 'bot':
      return <BotControl device={device} disabled={disabled} />;
    case 'switch':
      return <SwitchControl device={device} disabled={disabled} />;
    case 'sensor':
      return <SensorDisplay device={device} />;
    case 'curtain':
      return <CurtainControl device={device} disabled={disabled} />;
    case 'tv':
      return <TVControl device={device} disabled={disabled} />;
    case 'lock':
      return <LockControl device={device} disabled={disabled} />;
    case 'light':
      return <LightControl device={device} disabled={disabled} />;
    default:
      return <span className="text-xs text-gray-400 dark:text-gray-500">{device.deviceType}</span>;
  }
}

export default function DeviceCard({ device, variant = 'controls', disabled = false }: Props) {
  const category = getDeviceCategory(device);

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';

  if (category === 'ac') {
    return (
      <div
        className={`rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 overflow-hidden ${disabledClass}`}
      >
        <ACControl device={device} disabled={disabled} />
      </div>
    );
  }

  if (variant === 'sensors') {
    return (
      <div className="p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{getDeviceIcon(device)}</span>
          <span className="text-sm font-medium truncate dark:text-gray-200">
            {device.deviceName}
          </span>
        </div>
        <DeviceControl device={device} disabled={disabled} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base flex-shrink-0">{getDeviceIcon(device)}</span>
        <span className="text-sm font-medium truncate dark:text-gray-200">{device.deviceName}</span>
      </div>
      <div className={`flex-shrink-0 ml-2 ${disabledClass}`}>
        <DeviceControl device={device} disabled={disabled} />
      </div>
    </div>
  );
}
