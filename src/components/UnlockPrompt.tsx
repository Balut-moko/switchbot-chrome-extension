import { Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sendMessage } from '@/lib/messaging';
import { t } from '@/utils/i18n';

interface Props {
  onUnlock: () => void;
}

export default function UnlockPrompt({ onUnlock }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const result = await sendMessage('unlockWithPassword', { password });
      if (result.success) {
        onUnlock();
      } else {
        setError('WRONG_PASSWORD');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('FAILED_TO_UNLOCK');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full">
      <div className="mb-4">
        <Lock className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 className="text-lg font-semibold mb-1 dark:text-gray-200">{t('UI_LOCKED')}</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
        {t('UNLOCK_DESCRIPTION')}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('MASTER_PASSWORD_PLACEHOLDER')}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-600 dark:text-red-300">{t(error)}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('UNLOCKING') : t('UNLOCK')}
        </button>
      </form>
    </div>
  );
}
