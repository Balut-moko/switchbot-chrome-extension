import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { getCapabilities } from '@/utils/deviceCapabilities';
import { t } from '@/utils/i18n';

type BadgeVariant = 'primary' | 'secondary' | 'alert';

interface BadgeData {
  icon: string;
  label?: string;
  value?: string;
  variant: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary:
    'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  secondary:
    'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  alert:
    'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

function SensorBadge({ icon, label, value, variant }: BadgeData) {
  return (
    <span className={VARIANT_CLASSES[variant]}>
      <span>{icon}</span>
      {label && <span>{label}</span>}
      {value && <span>{value}</span>}
    </span>
  );
}

function buildBadges(
  status: Record<string, unknown>,
  caps: ReturnType<typeof getCapabilities>,
): BadgeData[] {
  const badges: BadgeData[] = [];

  if (caps.hasTemperature && 'temperature' in status) {
    badges.push({ icon: '🌡', value: `${status.temperature}°C`, variant: 'primary' });
  }
  if (caps.hasHumidity && 'humidity' in status) {
    badges.push({ icon: '💧', value: `${status.humidity}%`, variant: 'primary' });
  }
  if (caps.hasCO2 && 'CO2' in status) {
    badges.push({ icon: '🌫️', label: 'CO₂', value: `${status.CO2} ppm`, variant: 'secondary' });
  }
  if (caps.hasBattery && 'battery' in status) {
    badges.push({ icon: '🔋', value: `${status.battery}%`, variant: 'secondary' });
  }

  if ('moveDetected' in status) {
    badges.push(
      (status as { moveDetected: boolean }).moveDetected
        ? { icon: '⚠️', label: t('MOTION_DETECTED'), variant: 'alert' }
        : { icon: '✅', label: t('MOTION_CLEAR'), variant: 'secondary' },
    );
  }
  if ('openState' in status) {
    const state = (status as { openState: string }).openState;
    badges.push(
      state === 'open'
        ? { icon: '🔓', label: t('CONTACT_OPEN'), variant: 'alert' }
        : { icon: '🔒', label: t('CONTACT_CLOSED'), variant: 'secondary' },
    );
  }

  return badges;
}

interface Props {
  device: Device;
}

export default function SensorDisplay({ device }: Props) {
  const { status, loading } = useDeviceStatus(device.deviceId);
  const caps = getCapabilities(device.deviceType);

  if (loading) {
    return (
      <div className="flex gap-1 mt-1">
        {[1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-5 w-10 rounded bg-gray-100 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!status) {
    return (
      <div className="mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">--</span>
      </div>
    );
  }

  const badges = buildBadges(status as Record<string, unknown>, caps);

  if (badges.length === 0) {
    return (
      <div className="mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">--</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {badges.map((badge) => (
        <SensorBadge key={`${badge.icon}${badge.label ?? ''}${badge.value ?? ''}`} {...badge} />
      ))}
    </div>
  );
}
