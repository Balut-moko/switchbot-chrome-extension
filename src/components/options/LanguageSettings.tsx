import type { LanguagePreference } from '@/lib/storage';
import { t } from '@/utils/i18n';

interface Props {
  preference: LanguagePreference;
  onChange: (pref: LanguagePreference) => void;
}

const OPTIONS: { value: LanguagePreference; labelKey: string }[] = [
  { value: 'auto', labelKey: 'LANGUAGE_AUTO' },
  { value: 'ja', labelKey: 'LANGUAGE_JA' },
  { value: 'en', labelKey: 'LANGUAGE_EN' },
];

export default function LanguageSettings({ preference, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold dark:text-gray-200">{t('LANGUAGE_SETTING')}</h2>

      {OPTIONS.map(({ value, labelKey }) => (
        <label
          key={value}
          className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="radio"
            name="languagePreference"
            value={value}
            checked={preference === value}
            onChange={() => onChange(value)}
          />
          <span className="font-medium text-sm dark:text-gray-200">{t(labelKey)}</span>
        </label>
      ))}
    </div>
  );
}
