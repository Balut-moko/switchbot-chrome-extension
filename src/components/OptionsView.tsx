import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import ApiKeyForm from '@/components/options/ApiKeyForm';
import Changelog from '@/components/options/Changelog';
import ConnectionTest from '@/components/options/ConnectionTest';
import DeviceSettings from '@/components/options/DeviceSettings';
import LanguageSettings from '@/components/options/LanguageSettings';
import SecuritySettings from '@/components/options/SecuritySettings';
import { useLocale } from '@/hooks/useLocale';
import { sendMessage } from '@/lib/messaging';
import type { SecurityMode } from '@/types/switchbot';
import { t } from '@/utils/i18n';

interface Props {
  onBack: () => void;
}

export default function OptionsView({ onBack }: Props) {
  const { locale, preference, setPreference } = useLocale();
  const [securityMode, setSecurityMode] = useState<SecurityMode>('standard');
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [apiOpen, setApiOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const mode = await sendMessage('getSecurityMode', undefined);
        setSecurityMode(mode);
        const auth = await sendMessage('isAuthenticated', undefined);
        setIsConfigured(auth);
        setApiOpen(!auth);
      } catch {
        // First time setup
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaved = () => {
    setIsConfigured(true);
    setSavedMessage(t('CREDENTIALS_SAVED'));
    setTimeout(() => setSavedMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t('BACK')}
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h1 className="text-base font-bold dark:text-gray-200">{t('SETTINGS_TITLE')}</h1>
        </div>
        <div className="flex items-center justify-center flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('LOADING')}</p>
        </div>
      </div>
    );
  }

  return (
    <div key={locale} className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={t('BACK')}
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-base font-bold dark:text-gray-200">{t('SETTINGS_TITLE')}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('SETTINGS_DESCRIPTION')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {savedMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-md text-sm">
            {savedMessage}
          </div>
        )}

        {isConfigured && (
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <DeviceSettings />
          </div>
        )}

        <div className="border dark:border-gray-700 rounded-lg p-4">
          <LanguageSettings preference={preference} onChange={setPreference} />
        </div>

        <div className="border dark:border-gray-700 rounded-lg">
          <button
            type="button"
            onClick={() => setApiOpen((prev) => !prev)}
            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold dark:text-gray-200">{t('API_SETTINGS')}</h2>
              {!apiOpen && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isConfigured
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {isConfigured ? t('API_CONFIGURED') : t('API_NOT_CONFIGURED')}
                </span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                apiOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              role="img"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-200 ease-in-out"
            style={{ gridTemplateRows: apiOpen ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="px-4 pb-4 space-y-6">
                <SecuritySettings
                  mode={securityMode}
                  onChange={setSecurityMode}
                  password={password}
                  passwordConfirm={passwordConfirm}
                  onPasswordChange={setPassword}
                  onPasswordConfirmChange={setPasswordConfirm}
                />
                <hr className="dark:border-gray-700" />
                <ApiKeyForm
                  securityMode={securityMode}
                  isConfigured={isConfigured}
                  password={password}
                  passwordConfirm={passwordConfirm}
                  onSaved={handleSaved}
                />
                <hr className="dark:border-gray-700" />
                <ConnectionTest />
              </div>
            </div>
          </div>
        </div>

        <Changelog />
      </div>
    </div>
  );
}
