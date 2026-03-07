import { useState } from 'react';
import { changelog } from '@/data/changelog';
import { t } from '@/utils/i18n';
import { getLocale } from '@/utils/locale';

export default function Changelog() {
  const [open, setOpen] = useState(false);
  const locale = getLocale();
  const currentVersion = changelog[0]?.version ?? '';

  return (
    <div className="border dark:border-gray-700 rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold dark:text-gray-200">{t('CHANGELOG_TITLE')}</h2>
          {!open && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              v{currentVersion}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
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
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-4">
            {changelog.map((entry, idx) => (
              <div key={entry.version}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold dark:text-gray-200">v{entry.version}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{entry.date}</span>
                  {idx === 0 && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      {t('CHANGELOG_LATEST')}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {entry.changes[locale].map((change) => (
                    <li key={change} className="text-sm text-gray-600 dark:text-gray-400">
                      {change}
                    </li>
                  ))}
                </ul>
                {idx < changelog.length - 1 && <hr className="mt-3 dark:border-gray-700" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
