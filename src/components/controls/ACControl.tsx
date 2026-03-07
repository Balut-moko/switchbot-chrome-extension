import { useState } from 'react';
import { useDeviceCommand } from '@/hooks/useDeviceCommand';
import type { ACState, Device } from '@/types/switchbot';
import {
  AC_FAN_DISPLAY,
  AC_FAN_SPEEDS,
  AC_MODE_DISPLAY,
  AC_MODES,
  AC_TEMP_MAX,
  AC_TEMP_MIN,
} from '@/utils/constants';
import { getDeviceIcon } from '@/utils/device';
import { t } from '@/utils/i18n';

function DeviceIconDisplay({ device }: { device: Device }) {
  const Icon = getDeviceIcon(device);
  return <Icon className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />;
}

interface Props {
  device: Device;
  disabled?: boolean;
}

function PowerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2v8" />
      <path d="M17.66 6.34A8 8 0 1 1 6.34 6.34" />
    </svg>
  );
}

export default function ACControl({ device, disabled = false }: Props) {
  const [state, setState] = useState<ACState>({
    temperature: 24,
    mode: 1,
    fanSpeed: 1,
    power: 'off',
  });
  const { sendCommand, isPending } = useDeviceCommand(device.deviceId);

  const isOn = state.power === 'on';
  const controlsDisabled = isPending || !isOn || disabled;

  const sendSetAll = async (newState: ACState) => {
    setState(newState);
    await sendCommand({
      command: 'setAll',
      parameter: `${newState.temperature},${newState.mode},${newState.fanSpeed},${newState.power}`,
      commandType: 'command',
    });
  };

  const togglePower = () => {
    sendSetAll({ ...state, power: isOn ? 'off' : 'on' });
  };

  const adjustTemp = (delta: number) => {
    const newTemp = Math.max(AC_TEMP_MIN, Math.min(AC_TEMP_MAX, state.temperature + delta));
    if (newTemp !== state.temperature) {
      sendSetAll({ ...state, temperature: newTemp });
    }
  };

  return (
    <div
      className={`transition-colors duration-300 ${
        isOn
          ? 'bg-gradient-to-b from-blue-50/50 dark:from-blue-900/20 to-white dark:to-gray-800'
          : 'bg-gray-50 dark:bg-gray-800'
      }`}
    >
      {isOn && <div className="h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400" />}

      {/* Header + Power */}
      <div className="flex items-center justify-between p-3 pb-1">
        <div className="flex items-center gap-2 min-w-0">
          <DeviceIconDisplay device={device} />
          <div className="min-w-0">
            <span className="text-sm font-medium truncate block dark:text-gray-200">
              {device.deviceName}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate block">
              {device.deviceType}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={togglePower}
          disabled={isPending || disabled}
          aria-pressed={isOn}
          aria-label={isOn ? t('TURN_OFF') : t('TURN_ON')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            isOn
              ? 'bg-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          } ${isPending ? 'opacity-50' : ''}`}
        >
          <PowerIcon />
        </button>
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="px-3 pt-1">
          <div className="h-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
            <div className="h-full w-2/5 bg-blue-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Temperature */}
      <div
        className={`flex items-center justify-center gap-6 py-4 transition-opacity ${
          !isOn ? 'opacity-40' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => adjustTemp(-1)}
          disabled={controlsDisabled || state.temperature <= AC_TEMP_MIN}
          aria-label={t('DECREASE_TEMP')}
          className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 active:bg-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          -
        </button>
        <div className="relative text-center select-none">
          <span className="text-4xl font-bold tabular-nums tracking-tight dark:text-gray-200">
            {state.temperature}
          </span>
          <span className="absolute text-lg text-gray-400 dark:text-gray-500 ml-0.5 top-1">
            &deg;C
          </span>
        </div>
        <button
          type="button"
          onClick={() => adjustTemp(1)}
          disabled={controlsDisabled || state.temperature >= AC_TEMP_MAX}
          aria-label={t('INCREASE_TEMP')}
          className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/50 active:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>

      {/* Mode selector */}
      <div className={`px-3 pb-2 transition-opacity ${!isOn ? 'opacity-40' : ''}`}>
        <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1.5">
          {t('AC_MODE')}
        </div>
        <div className="grid grid-cols-5 gap-1" role="radiogroup" aria-label={t('AC_MODE_LABEL')}>
          {AC_MODES.map((m) => (
            /* biome-ignore lint/a11y/useSemanticElements: custom radio UI with buttons */
            <button
              type="button"
              key={m.value}
              onClick={() => sendSetAll({ ...state, mode: m.value })}
              disabled={controlsDisabled}
              role="radio"
              aria-checked={state.mode === m.value}
              className={`flex flex-col items-center gap-0.5 py-1.5 rounded-md text-xs transition-colors disabled:cursor-not-allowed ${
                state.mode === m.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-200 dark:ring-blue-800'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {(() => {
                const ModeIcon = AC_MODE_DISPLAY[m.value].icon;
                return <ModeIcon className="w-4 h-4" />;
              })()}
              <span className="text-[10px] leading-tight">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fan speed selector */}
      <div className={`px-3 pb-3 transition-opacity ${!isOn ? 'opacity-40' : ''}`}>
        <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1.5">
          {t('FAN')}
        </div>
        <div className="grid grid-cols-4 gap-1" role="radiogroup" aria-label={t('FAN_SPEED')}>
          {AC_FAN_SPEEDS.map((f) => (
            /* biome-ignore lint/a11y/useSemanticElements: custom radio UI with buttons */
            <button
              type="button"
              key={f.value}
              onClick={() => sendSetAll({ ...state, fanSpeed: f.value })}
              disabled={controlsDisabled}
              role="radio"
              aria-checked={state.fanSpeed === f.value}
              className={`flex flex-col items-center gap-0.5 py-1.5 rounded-md text-xs transition-colors disabled:cursor-not-allowed ${
                state.fanSpeed === f.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-200 dark:ring-blue-800'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {(() => {
                const FanIcon = AC_FAN_DISPLAY[f.value].icon;
                return <FanIcon className="w-4 h-4" />;
              })()}
              <span className="text-[10px] leading-tight">{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
