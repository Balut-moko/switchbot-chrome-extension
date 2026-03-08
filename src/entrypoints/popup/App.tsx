import { useCallback, useEffect, useState } from 'react';
import DeviceList from '@/components/DeviceList';
import OptionsView from '@/components/OptionsView';
import UnlockPrompt from '@/components/UnlockPrompt';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { sendMessage } from '@/lib/messaging';
import { t } from '@/utils/i18n';

type AppState = 'loading' | 'no-credentials' | 'locked' | 'ready';
type View = 'devices' | 'options';

export default function App() {
  useTheme();
  useLocale();
  const [state, setState] = useState<AppState>('loading');
  const [view, setView] = useState<View>('devices');

  const checkAuth = useCallback(async () => {
    try {
      const isAuth = await sendMessage('isAuthenticated', undefined);
      if (!isAuth) {
        setState('no-credentials');
        setView('options');
        return;
      }
      const unlocked = await sendMessage('isUnlocked', undefined);
      setState(unlocked ? 'ready' : 'locked');
    } catch {
      setState('no-credentials');
      setView('options');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleBackFromOptions = useCallback(() => {
    if (state === 'no-credentials') {
      // Re-check auth in case user just configured credentials
      checkAuth();
    } else {
      setView('devices');
    }
  }, [state, checkAuth]);

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-400">{t('LOADING')}</p>
      </div>
    );
  }

  if (state === 'locked') {
    return <UnlockPrompt onUnlock={() => setState('ready')} />;
  }

  if (view === 'options' || state === 'no-credentials') {
    return <OptionsView onBack={handleBackFromOptions} />;
  }

  return <DeviceList onOpenSettings={() => setView('options')} />;
}
