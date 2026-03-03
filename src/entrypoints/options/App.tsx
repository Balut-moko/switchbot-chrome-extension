import { useEffect, useState } from 'react';
import ApiKeyForm from '@/components/options/ApiKeyForm';
import ConnectionTest from '@/components/options/ConnectionTest';
import DeviceSettings from '@/components/options/DeviceSettings';
import SecuritySettings from '@/components/options/SecuritySettings';
import { sendMessage } from '@/lib/messaging';
import type { SecurityMode } from '@/types/switchbot';

export default function App() {
  const [securityMode, setSecurityMode] = useState<SecurityMode>('standard');
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const mode = await sendMessage('getSecurityMode', undefined);
        setSecurityMode(mode);
        const auth = await sendMessage('isAuthenticated', undefined);
        setIsConfigured(auth);
      } catch {
        // First time setup
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaved = () => {
    setIsConfigured(true);
    setSavedMessage('Credentials saved successfully!');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">SwitchBot Controller Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your SwitchBot API credentials to get started. You can find them in the SwitchBot
          app under Settings &gt; Developer Options.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-md text-sm">
          {savedMessage}
        </div>
      )}

      <div className="border rounded-lg p-4 space-y-6">
        <SecuritySettings mode={securityMode} onChange={setSecurityMode} />
        <hr />
        <ApiKeyForm securityMode={securityMode} onSaved={handleSaved} />
      </div>

      {isConfigured && (
        <div className="border rounded-lg p-4">
          <ConnectionTest />
        </div>
      )}

      {isConfigured && (
        <div className="border rounded-lg p-4">
          <DeviceSettings />
        </div>
      )}
    </div>
  );
}
