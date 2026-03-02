import type { SecurityMode } from '@/types/switchbot';

interface Props {
  mode: SecurityMode;
  onChange: (mode: SecurityMode) => void;
}

export default function SecuritySettings({ mode, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Security Mode</h2>

      <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
        <input
          type="radio"
          name="securityMode"
          value="standard"
          checked={mode === 'standard'}
          onChange={() => onChange('standard')}
          className="mt-1"
        />
        <div>
          <p className="font-medium text-sm">Standard (Recommended)</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Credentials are stored in the browser. Quick access to your devices.
          </p>
        </div>
      </label>

      <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
        <input
          type="radio"
          name="securityMode"
          value="high"
          checked={mode === 'high'}
          onChange={() => onChange('high')}
          className="mt-1"
        />
        <div>
          <p className="font-medium text-sm">High Security</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Encrypted with a master password. You'll need to enter it once
            per browser session.
          </p>
        </div>
      </label>
    </div>
  );
}
