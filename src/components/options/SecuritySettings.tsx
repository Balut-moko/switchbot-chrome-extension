import { useState } from 'react';
import type { SecurityMode } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  mode: SecurityMode;
  onChange: (mode: SecurityMode) => void;
  password: string;
  passwordConfirm: string;
  onPasswordChange: (password: string) => void;
  onPasswordConfirmChange: (passwordConfirm: string) => void;
}

export default function SecuritySettings({
  mode,
  onChange,
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
}: Props) {
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const isHighSecurity = mode === 'high';

  const handlePasswordConfirmBlur = () => {
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError('VALIDATION_PASSWORDS_MISMATCH');
    } else {
      setPasswordError(null);
    }
  };

  const handleModeChange = (newMode: SecurityMode) => {
    if (newMode !== mode) {
      onPasswordChange('');
      onPasswordConfirmChange('');
      setPasswordError(null);
    }
    onChange(newMode);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold dark:text-gray-200">{t('SECURITY_MODE')}</h2>

      <label className="flex items-start gap-3 p-3 border dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
        <input
          type="radio"
          name="securityMode"
          value="standard"
          checked={mode === 'standard'}
          onChange={() => handleModeChange('standard')}
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
          onChange={() => handleModeChange('high')}
          className="mt-1"
        />
        <div>
          <p className="font-medium text-sm dark:text-gray-200">{t('HIGH_SECURITY_MODE')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t('HIGH_SECURITY_DESCRIPTION')}
          </p>
        </div>
      </label>

      {isHighSecurity && (
        <div className="space-y-3 pt-2">
          <div>
            <label
              htmlFor="master-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t('MASTER_PASSWORD_LABEL')}
            </label>
            <input
              id="master-password"
              type="password"
              value={password}
              onChange={(e) => {
                onPasswordChange(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('MASTER_PASSWORD_CREATE')}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t('CONFIRM_PASSWORD')}
            </label>
            <input
              id="confirm-password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                onPasswordConfirmChange(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              onBlur={handlePasswordConfirmBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('CONFIRM_PASSWORD_PLACEHOLDER')}
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-600 dark:text-red-300">{t(passwordError)}</p>
          )}
        </div>
      )}
    </div>
  );
}
