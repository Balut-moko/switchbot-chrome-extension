import { useState } from 'react';
import { sendMessage } from '@/lib/messaging';
import type { SecurityMode } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  securityMode: SecurityMode;
  isConfigured: boolean;
  onSaved: () => void;
}

export default function ApiKeyForm({ securityMode, isConfigured, onSaved }: Props) {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHighSecurity = securityMode === 'high';

  const hasTokenInput = token.trim().length > 0;
  const hasSecretInput = secret.trim().length > 0;

  const handleSave = async () => {
    // 保存済みで両方空の場合は何もしない（既存の値を維持）
    if (isConfigured && !hasTokenInput && !hasSecretInput) {
      return;
    }
    // 新規設定時、または片方だけ入力された場合は両方必須
    if (!isConfigured && (!hasTokenInput || !hasSecretInput)) {
      setError('VALIDATION_TOKEN_SECRET_REQUIRED');
      return;
    }
    if (hasTokenInput !== hasSecretInput) {
      setError('VALIDATION_TOKEN_SECRET_REQUIRED');
      return;
    }
    if (isHighSecurity && !password) {
      setError('VALIDATION_MASTER_PASSWORD_REQUIRED');
      return;
    }
    if (isHighSecurity && password !== passwordConfirm) {
      setError('VALIDATION_PASSWORDS_MISMATCH');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await sendMessage('saveCredentials', {
        credentials: { token: token.trim(), secret: secret.trim() },
        mode: securityMode,
        password: isHighSecurity ? password : undefined,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'FAILED_TO_SAVE');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold dark:text-gray-200">{t('API_CREDENTIALS')}</h2>

      <div>
        <label
          htmlFor="api-token"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('API_TOKEN')}
        </label>
        <div className="relative">
          <input
            id="api-token"
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isConfigured ? '••••••••••••' : t('API_TOKEN_PLACEHOLDER')}
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showToken ? t('HIDE') : t('SHOW')}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="api-secret"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('API_SECRET')}
        </label>
        <div className="relative">
          <input
            id="api-secret"
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isConfigured ? '••••••••••••' : t('API_SECRET_PLACEHOLDER')}
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showSecret ? t('HIDE') : t('SHOW')}
          </button>
        </div>
      </div>

      {isConfigured && !hasTokenInput && !hasSecretInput && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('CREDENTIALS_ALREADY_SAVED_HINT')}
        </p>
      )}

      {isHighSecurity && (
        <>
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
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('CONFIRM_PASSWORD_PLACEHOLDER')}
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-300">{t(error)}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? t('SAVING') : t('SAVE_CREDENTIALS')}
      </button>
    </div>
  );
}
