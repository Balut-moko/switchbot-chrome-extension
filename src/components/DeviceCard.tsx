import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import ACControl from '@/components/controls/ACControl';
import BotControl from '@/components/controls/BotControl';
import CurtainControl from '@/components/controls/CurtainControl';
import FallbackControl from '@/components/controls/FallbackControl';
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
  reorderMode?: boolean;
  dragHandleListeners?: SyntheticListenerMap;
  dragHandleAttributes?: Record<string, unknown>;
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
    case 'climate':
    case 'fan':
      return <SwitchControl device={device} disabled={disabled} />;
    case 'vacuum':
    case 'camera':
    case 'hub':
      return <FallbackControl device={device} disabled={disabled} />;
    default:
      return <FallbackControl device={device} disabled={disabled} />;
  }
}

function DragHandle({
  listeners,
  attributes,
}: {
  listeners?: SyntheticListenerMap;
  attributes?: Record<string, unknown>;
}) {
  return (
    <button
      type="button"
      className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 mr-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      {...listeners}
      {...attributes}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </button>
  );
}

export default function DeviceCard({
  device,
  variant = 'controls',
  disabled = false,
  reorderMode = false,
  dragHandleListeners,
  dragHandleAttributes,
}: Props) {
  const category = getDeviceCategory(device);

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
  const reorderDisabledClass = reorderMode ? 'pointer-events-none' : '';

  if (category === 'ac') {
    return (
      <div
        className={`rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 overflow-hidden ${disabledClass}`}
      >
        {reorderMode && (
          <div className="flex items-center px-3 pt-2">
            <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
            <span className="text-sm font-medium truncate dark:text-gray-200">
              {device.deviceName}
            </span>
          </div>
        )}
        <div className={reorderDisabledClass}>
          <ACControl device={device} disabled={disabled} />
        </div>
      </div>
    );
  }

  if (variant === 'sensors') {
    return (
      <div className="p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 min-w-0">
          {reorderMode && (
            <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
          )}
          <span className="text-base flex-shrink-0">{getDeviceIcon(device)}</span>
          <span className="text-sm font-medium truncate dark:text-gray-200">
            {device.deviceName}
          </span>
        </div>
        <div className={reorderDisabledClass}>
          <DeviceControl device={device} disabled={disabled} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
      <div className="flex items-center gap-2 min-w-0">
        {reorderMode && (
          <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
        )}
        <span className="text-base flex-shrink-0">{getDeviceIcon(device)}</span>
        <span className="text-sm font-medium truncate dark:text-gray-200">{device.deviceName}</span>
      </div>
      <div className={`flex-shrink-0 ml-2 ${disabledClass} ${reorderDisabledClass}`}>
        <DeviceControl device={device} disabled={disabled} />
      </div>
    </div>
  );
}
