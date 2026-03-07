import { useCallback, useEffect, useState } from 'react';
import type { LanguagePreference } from '@/lib/storage';
import {
  getLocale,
  getLocalePreference,
  initLocale,
  type Locale,
  onLocaleChange,
  setLocalePreference,
} from '@/utils/locale';

/**
 * 言語設定を管理する React hook。
 * - 起動時に storage から読み込み
 * - 変更時にリアルタイムで全コンポーネントに通知
 * - `locale` が変わると再レンダリングが走り、`t()` の結果が更新される
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getLocale);
  const [preference, setPreferenceState] = useState<LanguagePreference>(getLocalePreference);

  useEffect(() => {
    // storage からキャッシュを初期化
    initLocale().then((resolved) => {
      setLocaleState(resolved);
      setPreferenceState(getLocalePreference());
    });
  }, []);

  useEffect(() => {
    // 他の場所（Options/Popup）からの変更通知を受信
    return onLocaleChange((newLocale) => {
      setLocaleState(newLocale);
      setPreferenceState(getLocalePreference());
    });
  }, []);

  const setPreference = useCallback(async (pref: LanguagePreference) => {
    setPreferenceState(pref);
    await setLocalePreference(pref);
  }, []);

  return { locale, preference, setPreference };
}
