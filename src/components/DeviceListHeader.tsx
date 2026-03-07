import { Monitor, Moon, RefreshCw, Search, Settings, Sun } from 'lucide-react';
import type { ThemePreference } from '@/lib/storage';
import { t } from '@/utils/i18n';

const iconBtnClass =
  'p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

interface Props {
  theme: ThemePreference;
  mockMode: boolean;
  loading: boolean;
  reorderMode: boolean;
  searchOpen: boolean;
  onCycleTheme: () => void;
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
  onCycleTheme,
  onRefresh,
  onToggleReorder,
  onToggleSearch,
}: Props) {
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

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
            <button
              type="button"
              onClick={onCycleTheme}
              className={iconBtnClass}
              title={`Theme: ${theme}`}
            >
              <ThemeIcon className="w-4.5 h-4.5" />
            </button>
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
          className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
            reorderMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={reorderMode ? t('REORDER_MODE_DONE') : t('REORDER_MODE')}
        >
          {reorderMode ? t('REORDER_MODE_DONE') : t('REORDER_MODE')}
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
