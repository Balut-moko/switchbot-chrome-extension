import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/lib/messaging';

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
        setError('Incorrect password');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Failed to unlock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full">
      <div className="text-4xl mb-4">{'\u{1F512}'}</div>
      <h2 className="text-lg font-semibold mb-1">Locked</h2>
      <p className="text-xs text-gray-500 mb-4 text-center">
        Enter your master password to access devices.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Master password"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Unlocking...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
