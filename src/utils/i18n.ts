import { ERROR_MESSAGES } from '@/utils/translations/errors';
import { UI_MESSAGES } from '@/utils/translations/ui';
import { getLocale } from './locale';

export function t(key: string, params?: Record<string, string | number>): string {
  const locale = getLocale();
  if (key.startsWith('API_ERROR_')) {
    const status = key.replace('API_ERROR_', '');
    return locale === 'ja'
      ? `API エラーが発生しました (${status})`
      : `API error occurred (${status})`;
  }
  const msg =
    ERROR_MESSAGES[key]?.[locale] ??
    UI_MESSAGES[key]?.[locale] ??
    ERROR_MESSAGES[key]?.en ??
    UI_MESSAGES[key]?.en ??
    key;
  if (!params) return msg;
  return Object.entries(params).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), msg);
}
