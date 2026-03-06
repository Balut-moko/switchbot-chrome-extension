import { useEffect, useState } from 'react';
import ApiKeyForm from '@/components/options/ApiKeyForm';
import ConnectionTest from '@/components/options/ConnectionTest';
import DeviceSettings from '@/components/options/DeviceSettings';
import SecuritySettings from '@/components/options/SecuritySettings';
import { useTheme } from '@/hooks/useTheme';
import { sendMessage } from '@/lib/messaging';
import type { SecurityMode } from '@/types/switchbot';
import { t } from '@/utils/i18n';

export default function App() {
  useTheme();
  const [securityMode, setSecurityMode] = useState<SecurityMode>('standard');
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const mode = await sendMessage('getSecurityMode', undefined);
        setSecurityMode(mode);
        const auth = await sendMessage('isAuthenticated', undefined);
        setIsConfigured(auth);
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
      <div className="max-w-xl mx-auto p-6 min-h-screen bg-white dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('LOADING')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 min-h-screen bg-white dark:bg-gray-900">
      <div>
        <h1 className="text-xl font-bold dark:text-gray-200">{t('SETTINGS_TITLE')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('SETTINGS_DESCRIPTION')}</p>
      </div>

      {savedMessage && (
        <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-md text-sm">
          {savedMessage}
        </div>
      )}

      <div className="border dark:border-gray-700 rounded-lg p-4 space-y-6">
        <SecuritySettings mode={securityMode} onChange={setSecurityMode} />
        <hr className="dark:border-gray-700" />
        <ApiKeyForm securityMode={securityMode} onSaved={handleSaved} />
      </div>

      {isConfigured && (
        <div className="border dark:border-gray-700 rounded-lg p-4">
          <ConnectionTest />
        </div>
      )}

      {isConfigured && (
        <div className="border dark:border-gray-700 rounded-lg p-4">
          <DeviceSettings />
        </div>
      )}
    </div>
  );
}
