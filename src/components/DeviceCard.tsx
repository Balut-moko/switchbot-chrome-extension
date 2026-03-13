import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { Battery } from 'lucide-react';
import ACControl from '@/components/controls/ACControl';
import BotControl from '@/components/controls/BotControl';
import CurtainControl from '@/components/controls/CurtainControl';
import FallbackControl from '@/components/controls/FallbackControl';
import LightControl from '@/components/controls/LightControl';
import LockControl from '@/components/controls/LockControl';
import SensorDisplay from '@/components/controls/SensorDisplay';
import SwitchControl from '@/components/controls/SwitchControl';
import TVControl from '@/components/controls/TVControl';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { getDeviceCategory, getDeviceIcon } from '@/utils/device';
import { getCapabilities } from '@/utils/deviceCapabilities';
import { t } from '@/utils/i18n';
import { BADGE_VARIANT_CLASSES } from '@/utils/styles';

function DeviceIconDisplay({ device }: { device: Device }) {
  const Icon = getDeviceIcon(device);
  return <Icon className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-400" />;
}

function DeviceNameWithType({ device }: { device: Device }) {
  return (
    <div className="min-w-0 w-full">
      <span className="text-sm font-medium truncate block dark:text-gray-200">
        {device.deviceName}
      </span>
      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate block">
        {device.deviceType}
      </span>
    </div>
  );
}

function DeviceNameInline({ device }: { device: Device }) {
  return (
    <div className="min-w-0">
      <span className="text-sm font-medium truncate block dark:text-gray-200">
        {device.deviceName}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500 truncate block">
        {device.deviceType}
      </span>
    </div>
  );
}

interface Props {
  device: Device;
  disabled?: boolean;
  hidden?: boolean;
  reorderMode?: boolean;
  dragHandleListeners?: SyntheticListenerMap;
  dragHandleAttributes?: Record<string, unknown>;
  onToggleVisible?: (deviceId: string) => void;
  onToggleDisabled?: (deviceId: string) => void;
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

/** Eye icon for visibility toggle */
function VisibilityIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

/** Lock icon for disabled toggle */
function DisabledIcon({ disabled }: { disabled: boolean }) {
  if (disabled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

/** Toggle buttons shown during reorder mode */
function ReorderToggles({
  device,
  hidden,
  disabled,
  onToggleVisible,
  onToggleDisabled,
}: {
  device: Device;
  hidden: boolean;
  disabled: boolean;
  onToggleVisible?: (deviceId: string) => void;
  onToggleDisabled?: (deviceId: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {/* Visibility toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisible?.(device.deviceId);
        }}
        title={hidden ? t('DEVICE_HIDDEN_TOOLTIP') : t('DEVICE_VISIBLE_TOOLTIP')}
        className={`p-1 rounded transition-colors ${
          hidden
            ? 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }`}
      >
        <VisibilityIcon visible={!hidden} />
      </button>
      {/* Disabled toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleDisabled?.(device.deviceId);
        }}
        title={disabled ? t('DEVICE_DISABLED_TOOLTIP') : t('DEVICE_ENABLED_TOOLTIP')}
        className={`p-1 rounded transition-colors ${
          disabled
            ? 'text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
            : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <DisabledIcon disabled={disabled} />
      </button>
    </div>
  );
}

function BatteryBadge({ device }: { device: Device }) {
  const caps = getCapabilities(device.deviceType);
  const { status } = useDeviceStatus(device.deviceId);

  if (!caps.hasBattery || !status || !('battery' in status)) {
    return null;
  }

  return (
    <span className={BADGE_VARIANT_CLASSES.secondary}>
      <Battery className="w-3.5 h-3.5" />
      <span>{`${(status as { battery: number }).battery}%`}</span>
    </span>
  );
}

export default function DeviceCard({
  device,
  disabled = false,
  hidden = false,
  reorderMode = false,
  dragHandleListeners,
  dragHandleAttributes,
  onToggleVisible,
  onToggleDisabled,
}: Props) {
  const category = getDeviceCategory(device);
  const isSensor = category === 'sensor' || category === 'hub';

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
  const reorderDisabledClass = reorderMode ? 'pointer-events-none' : '';
  const hiddenClass = reorderMode && hidden ? 'opacity-40' : '';

  const toggles = reorderMode ? (
    <ReorderToggles
      device={device}
      hidden={hidden}
      disabled={disabled}
      onToggleVisible={onToggleVisible}
      onToggleDisabled={onToggleDisabled}
    />
  ) : null;

  if (category === 'ac') {
    return (
      <div
        data-testid={`device-card-${device.deviceId}`}
        className={`rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 overflow-hidden ${disabledClass} ${hiddenClass}`}
      >
        {reorderMode && (
          <div className="flex items-center gap-2 px-3 pt-2">
            <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
            <DeviceNameInline device={device} />
            <BatteryBadge device={device} />
            <div className="ml-auto flex-shrink-0">{toggles}</div>
          </div>
        )}
        <div className={reorderDisabledClass}>
          <ACControl device={device} disabled={disabled} />
        </div>
      </div>
    );
  }

  if (isSensor) {
    return (
      <div
        data-testid={`device-card-${device.deviceId}`}
        className={`p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 flex flex-col h-full ${hiddenClass}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {reorderMode && (
            <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
          )}
          <DeviceIconDisplay device={device} />
          <DeviceNameWithType device={device} />
          <div className="ml-auto flex-shrink-0 flex items-center gap-1">
            <BatteryBadge device={device} />
            {reorderMode && toggles}
          </div>
        </div>
        <div className={`mt-auto pt-1 ${reorderDisabledClass}`}>
          <DeviceControl device={device} disabled={disabled} />
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`device-card-${device.deviceId}`}
      className={`p-3 rounded-lg shadow-sm dark:shadow-gray-900/30 border transition-colors bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 flex flex-col h-full ${hiddenClass}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {reorderMode && (
          <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
        )}
        <DeviceIconDisplay device={device} />
        <DeviceNameWithType device={device} />
        <div className="ml-auto flex-shrink-0 flex items-center gap-1">
          <BatteryBadge device={device} />
          {reorderMode && toggles}
        </div>
      </div>
      <div
        className={`flex items-center gap-2 mt-auto pt-2 ${disabledClass} ${reorderDisabledClass}`}
      >
        <DeviceControl device={device} disabled={disabled} />
      </div>
    </div>
  );
}
