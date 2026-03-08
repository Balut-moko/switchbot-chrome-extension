import { ArrowUpDown, Check, Monitor, Moon, RefreshCw, Search, Settings, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ThemePreference } from '@/lib/storage';
import { t } from '@/utils/i18n';

const iconBtnClass =
  'p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

const themeOptions: { value: ThemePreference; icon: typeof Sun; labelKey: string }[] = [
  { value: 'light', icon: Sun, labelKey: 'THEME_LIGHT' },
  { value: 'dark', icon: Moon, labelKey: 'THEME_DARK' },
  { value: 'system', icon: Monitor, labelKey: 'THEME_SYSTEM' },
];

interface Props {
  theme: ThemePreference;
  mockMode: boolean;
  loading: boolean;
  reorderMode: boolean;
  searchOpen: boolean;
  onSetTheme: (theme: ThemePreference) => void;
  onRefresh: () => void;
  onToggleReorder: () => void;
  onToggleSearch: () => void;
}

export default function DeviceListHeader({
  theme,
  mockMode,
  loading,
  reorderMode,
  searchOpen,
  onSetTheme,
  onRefresh,
  onToggleReorder,
  onToggleSearch,
}: Props) {
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const [themePopoverOpen, setThemePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!themePopoverOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setThemePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [themePopoverOpen]);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-bold dark:text-gray-200">SwitchBot</h1>
        {mockMode && (
          <span className="px-1.5 py-0.5 text-[10px] font-semibold leading-none rounded bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            Demo Mode
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!reorderMode && (
          <>
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setThemePopoverOpen((prev) => !prev)}
                className={iconBtnClass}
                title={`Theme: ${theme}`}
              >
                <ThemeIcon className="w-4.5 h-4.5" />
              </button>
              {themePopoverOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 min-w-[140px]">
                  {themeOptions.map(({ value, icon: Icon, labelKey }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        onSetTheme(value);
                        setThemePopoverOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                        theme === value
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{t(labelKey)}</span>
                      {theme === value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className={`${iconBtnClass} ${loading ? 'animate-spin' : ''}`}
              title={t('REFRESH')}
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={onToggleSearch}
              data-search-toggle
              className={`${iconBtnClass} ${searchOpen ? 'text-blue-500 dark:text-blue-400' : ''}`}
              title={t('SEARCH')}
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={onToggleReorder}
          className={`${iconBtnClass} ${reorderMode ? 'text-blue-500 dark:text-blue-400' : ''}`}
          title={reorderMode ? t('REORDER_MODE_DONE') : t('REORDER_MODE')}
        >
          <ArrowUpDown className="w-4.5 h-4.5" />
        </button>
        {!reorderMode && (
          <button
            type="button"
            onClick={() => browser.runtime.openOptionsPage()}
            className={iconBtnClass}
            title={t('SETTINGS')}
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}
