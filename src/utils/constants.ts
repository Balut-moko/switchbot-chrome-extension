import type { LucideIcon } from 'lucide-react';
import { Droplets, Fan, Leaf, RefreshCw, Snowflake, Sun, Tornado, Wind } from 'lucide-react';

export const SWITCHBOT_API_BASE = 'https://api.switch-bot.com/v1.1';

export const IR_COMMAND_DELAYS: Record<string, number> = {
  'Air Conditioner': 2000,
  TV: 1500,
  Light: 1000,
  'DIY Light': 1000,
  Fan: 1000,
  DEFAULT: 500,
};

export const AC_MODES = [
  { value: 1, label: 'Auto' },
  { value: 2, label: 'Cool' },
  { value: 3, label: 'Dry' },
  { value: 4, label: 'Fan' },
  { value: 5, label: 'Heat' },
] as const;

export const AC_FAN_SPEEDS = [
  { value: 1, label: 'Auto' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'High' },
] as const;

export const AC_TEMP_MIN = 16;
export const AC_TEMP_MAX = 30;

export const AC_MODE_DISPLAY: Record<number, { icon: LucideIcon; label: string }> = {
  1: { icon: RefreshCw, label: 'Auto' },
  2: { icon: Snowflake, label: 'Cool' },
  3: { icon: Droplets, label: 'Dry' },
  4: { icon: Fan, label: 'Fan' },
  5: { icon: Sun, label: 'Heat' },
};

export const AC_FAN_DISPLAY: Record<number, { icon: LucideIcon; label: string }> = {
  1: { icon: RefreshCw, label: 'Auto' },
  2: { icon: Leaf, label: 'Low' },
  3: { icon: Wind, label: 'Med' },
  4: { icon: Tornado, label: 'High' },
};

export const PBKDF2_ITERATIONS = 600_000;
export const CACHE_TTL_MS = 5 * 60 * 1000;
export const STATUS_REQUEST_INTERVAL_MS = 200;
