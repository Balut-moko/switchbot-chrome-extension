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

export const AC_MODE_DISPLAY: Record<number, { icon: string; label: string }> = {
  1: { icon: '🔄', label: 'Auto' },
  2: { icon: '❄️', label: 'Cool' },
  3: { icon: '💧', label: 'Dry' },
  4: { icon: '🌀', label: 'Fan' },
  5: { icon: '☀️', label: 'Heat' },
};

export const AC_FAN_DISPLAY: Record<number, { icon: string; label: string }> = {
  1: { icon: '🔄', label: 'Auto' },
  2: { icon: '🍃', label: 'Low' },
  3: { icon: '💨', label: 'Med' },
  4: { icon: '🌪️', label: 'High' },
};

export const PBKDF2_ITERATIONS = 600_000;
export const CACHE_TTL_MS = 5 * 60 * 1000;
