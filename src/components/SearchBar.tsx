import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { t } from '@/utils/i18n';

interface Props {
  onSearch: (query: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({ onSearch, onBlur, autoFocus }: Props) {
  const [value, setValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, onSearch]);

  const handleBlur = () => {
    if (!value && onBlur) {
      onBlur();
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={t('SEARCH_PLACEHOLDER')}
        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );
}
