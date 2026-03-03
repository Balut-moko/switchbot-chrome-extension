import { useState } from 'react';
import { sendMessage } from '@/lib/messaging';
import { t } from '@/utils/i18n';

export default function ConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    deviceCount?: number;
    error?: string;
  } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await sendMessage('testConnection', undefined);
      setResult(res);
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'CONNECTION_FAILED',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleTest}
        disabled={testing}
        className="w-full py-2 px-4 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </button>

      {result && (
        <div
          className={`p-3 rounded-md text-sm ${
            result.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {result.success
            ? `Connected! ${result.deviceCount} device(s) found.`
            : `Error: ${result.error ? t(result.error) : ''}`}
        </div>
      )}
    </div>
  );
}
