import { useCallback, useEffect, useState } from 'react';
import { type ThemePreference, themePreferenceItem } from '@/lib/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>('system');

  const getEffective = useCallback((pref: ThemePreference) => {
    if (pref !== 'system') return pref;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const applyTheme = useCallback(
    (pref: ThemePreference) => {
      const effective = getEffective(pref);
      document.documentElement.classList.toggle('dark', effective === 'dark');
    },
    [getEffective],
  );

  useEffect(() => {
    themePreferenceItem.getValue().then((pref) => {
      setThemeState(pref);
      applyTheme(pref);
    });
  }, [applyTheme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    async (pref: ThemePreference) => {
      setThemeState(pref);
      applyTheme(pref);
      await themePreferenceItem.setValue(pref);
    },
    [applyTheme],
  );

  return { theme, setTheme };
}
