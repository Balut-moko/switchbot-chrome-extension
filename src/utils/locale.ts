import type { LanguagePreference } from '@/lib/storage';

export type Locale = 'ja' | 'en';

// モジュールレベルでキャッシュされた言語設定
let cachedPreference: LanguagePreference = 'auto';
let initialized = false;

// リスナー管理（React コンポーネントからの再レンダリング通知用）
type LocaleChangeListener = (locale: Locale) => void;
const listeners = new Set<LocaleChangeListener>();

function resolveLocale(pref: LanguagePreference): Locale {
  if (pref === 'ja' || pref === 'en') return pref;
  const lang = navigator.language;
  return lang.startsWith('ja') ? 'ja' : 'en';
}

export function getLocale(): Locale {
  return resolveLocale(cachedPreference);
}

/**
 * storage から言語設定を読み込んでキャッシュを初期化する。
 * Popup / Options の起動時に1回呼ぶ。
 */
export async function initLocale(): Promise<Locale> {
  if (initialized) return getLocale();
  const { languagePreferenceItem } = await import('@/lib/storage');
  cachedPreference = await languagePreferenceItem.getValue();
  initialized = true;
  return getLocale();
}

/**
 * 言語設定を変更して storage に保存し、リスナーに通知する。
 */
export async function setLocalePreference(pref: LanguagePreference): Promise<void> {
  const { languagePreferenceItem } = await import('@/lib/storage');
  cachedPreference = pref;
  await languagePreferenceItem.setValue(pref);
  const locale = getLocale();
  for (const listener of listeners) {
    listener(locale);
  }
}

/**
 * 言語変更リスナーを登録する。解除関数を返す。
 */
export function onLocaleChange(listener: LocaleChangeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * 現在の言語設定（auto/ja/en）を返す。
 */
export function getLocalePreference(): LanguagePreference {
  return cachedPreference;
}
