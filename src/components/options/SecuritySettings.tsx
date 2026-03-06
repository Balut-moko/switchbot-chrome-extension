import type { SecurityMode } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  mode: SecurityMode;
  onChange: (mode: SecurityMode) => void;
}

export default function SecuritySettings({ mode, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold dark:text-gray-200">{t('SECURITY_MODE')}</h2>

      <label className="flex items-start gap-3 p-3 border dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
        <input
          type="radio"
          name="securityMode"
          value="standard"
          checked={mode === 'standard'}
          onChange={() => onChange('standard')}
          className="mt-1"
        />
        <div>
          <p className="font-medium text-sm dark:text-gray-200">{t('STANDARD_MODE')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t('STANDARD_DESCRIPTION')}
          </p>
        </div>
      </label>

      <label className="flex items-start gap-3 p-3 border dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
        <input
          type="radio"
          name="securityMode"
          value="high"
          checked={mode === 'high'}
          onChange={() => onChange('high')}
          className="mt-1"
        />
        <div>
          <p className="font-medium text-sm dark:text-gray-200">{t('HIGH_SECURITY_MODE')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t('HIGH_SECURITY_DESCRIPTION')}
          </p>
        </div>
      </label>
    </div>
  );
}
