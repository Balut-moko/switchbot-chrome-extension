import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Battery,
  CheckCircle,
  Droplets,
  Lock,
  LockOpen,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import type { Device } from '@/types/switchbot';
import { getCapabilities } from '@/utils/deviceCapabilities';
import { t } from '@/utils/i18n';
import { BADGE_VARIANT_CLASSES, type BadgeVariant } from '@/utils/styles';

interface BadgeData {
  icon: LucideIcon;
  label?: string;
  value?: string;
  variant: BadgeVariant;
}

function SensorBadge({ icon: Icon, label, value, variant }: BadgeData) {
  return (
    <span className={BADGE_VARIANT_CLASSES[variant]}>
      <Icon className="w-3.5 h-3.5" />
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
    badges.push({ icon: Thermometer, value: `${status.temperature}°C`, variant: 'primary' });
  }
  if (caps.hasHumidity && 'humidity' in status) {
    badges.push({ icon: Droplets, value: `${status.humidity}%`, variant: 'primary' });
  }
  if (caps.hasCO2 && 'CO2' in status) {
    badges.push({ icon: Wind, label: 'CO₂', value: `${status.CO2} ppm`, variant: 'secondary' });
  }
  if (caps.hasBattery && 'battery' in status) {
    badges.push({ icon: Battery, value: `${status.battery}%`, variant: 'secondary' });
  }

  if ('moveDetected' in status) {
    badges.push(
      (status as { moveDetected: boolean }).moveDetected
        ? { icon: AlertTriangle, label: t('MOTION_DETECTED'), variant: 'alert' }
        : { icon: CheckCircle, label: t('MOTION_CLEAR'), variant: 'secondary' },
    );
  }
  if ('openState' in status) {
    const state = (status as { openState: string }).openState;
    badges.push(
      state === 'open'
        ? { icon: LockOpen, label: t('CONTACT_OPEN'), variant: 'alert' }
        : { icon: Lock, label: t('CONTACT_CLOSED'), variant: 'secondary' },
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
        <SensorBadge
          key={`${badge.icon.displayName ?? badge.icon.name}${badge.label ?? ''}${badge.value ?? ''}`}
          {...badge}
        />
      ))}
    </div>
  );
}
