import { Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import DeviceList from '@/components/DeviceList';
import UnlockPrompt from '@/components/UnlockPrompt';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { sendMessage } from '@/lib/messaging';
import { t } from '@/utils/i18n';

type AppState = 'loading' | 'no-credentials' | 'locked' | 'ready';

export default function App() {
  useTheme();
  useLocale();
  const [state, setState] = useState<AppState>('loading');

  useEffect(() => {
    async function checkAuth() {
      try {
        const isAuth = await sendMessage('isAuthenticated', undefined);
        if (!isAuth) {
          setState('no-credentials');
          return;
        }
        const unlocked = await sendMessage('isUnlocked', undefined);
        setState(unlocked ? 'ready' : 'locked');
      } catch {
        setState('no-credentials');
      }
    }
    checkAuth();
  }, []);

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
        <p className="text-sm text-gray-400">{t('LOADING')}</p>
      </div>
    );
  }

  if (state === 'no-credentials') {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full text-center bg-white dark:bg-gray-900">
        <div className="mb-4">
          <Wrench className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">{t('SETUP_REQUIRED')}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('SETUP_DESCRIPTION')}</p>
        <button
          type="button"
          onClick={() => browser.runtime.openOptionsPage()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          {t('OPEN_SETTINGS')}
        </button>
      </div>
    );
  }

  if (state === 'locked') {
    return <UnlockPrompt onUnlock={() => setState('ready')} />;
  }

  return <DeviceList />;
}
