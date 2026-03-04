import { useEffect, useState } from 'react';
import DeviceList from '@/components/DeviceList';
import UnlockPrompt from '@/components/UnlockPrompt';
import { useTheme } from '@/hooks/useTheme';
import { sendMessage } from '@/lib/messaging';

type AppState = 'loading' | 'no-credentials' | 'locked' | 'ready';

export default function App() {
  useTheme();
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
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (state === 'no-credentials') {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full text-center bg-white dark:bg-gray-900">
        <div className="text-4xl mb-4">{'\u{1F527}'}</div>
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Setup Required</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Configure your SwitchBot API credentials to get started.
        </p>
        <button
          type="button"
          onClick={() => browser.runtime.openOptionsPage()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Open Settings
        </button>
      </div>
    );
  }

  if (state === 'locked') {
    return <UnlockPrompt onUnlock={() => setState('ready')} />;
  }

  return <DeviceList />;
}
