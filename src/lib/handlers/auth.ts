import { SwitchBotAPI } from '@/lib/api';
import { decryptCredentials, encryptCredentials } from '@/lib/crypto';
import { onMessage } from '@/lib/messaging';
import {
  credentialsItem,
  encryptedCredentialsItem,
  securityModeItem,
  sessionCredentialsItem,
} from '@/lib/storage';
import type { StoredCredentials } from '@/types/switchbot';

export function getCredentials(): Promise<StoredCredentials> {
  return getCredentialsInternal();
}

async function getCredentialsInternal(): Promise<StoredCredentials> {
  const mode = await securityModeItem.getValue();

  if (mode === 'standard') {
    const creds = await credentialsItem.getValue();
    if (!creds) throw new Error('NO_CREDENTIALS');
    return creds;
  }

  const sessionCreds = await sessionCredentialsItem.getValue();
  if (sessionCreds) return sessionCreds;

  throw new Error('LOCKED');
}

export function createAPI(creds: StoredCredentials): SwitchBotAPI {
  return new SwitchBotAPI(creds.token, creds.secret);
}

/**
 * 認証関連のメッセージハンドラを登録する。
 */
export function registerAuthHandlers(): void {
  onMessage('saveCredentials', async ({ data }) => {
    const { credentials, mode, password } = data;

    if (mode === 'standard') {
      await credentialsItem.setValue(credentials);
      await encryptedCredentialsItem.setValue(null);
      await sessionCredentialsItem.setValue(null);
    } else {
      if (!password) throw new Error('PASSWORD_REQUIRED');
      const encrypted = await encryptCredentials(credentials, password);
      await encryptedCredentialsItem.setValue(encrypted);
      await credentialsItem.setValue(null);
      await sessionCredentialsItem.setValue(credentials);
    }

    await securityModeItem.setValue(mode);
  });

  onMessage('testConnection', async () => {
    try {
      const creds = await getCredentials();
      const api = createAPI(creds);
      const body = await api.getDevices();
      const count = body.deviceList.length + body.infraredRemoteList.length;
      return { success: true, deviceCount: count };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });

  onMessage('isAuthenticated', async () => {
    if (__MOCK_MODE__) return true;

    const mode = await securityModeItem.getValue();
    if (mode === 'standard') {
      const creds = await credentialsItem.getValue();
      return creds !== null;
    }
    const encrypted = await encryptedCredentialsItem.getValue();
    return encrypted !== null;
  });

  onMessage('unlockWithPassword', async ({ data }) => {
    try {
      const encrypted = await encryptedCredentialsItem.getValue();
      if (!encrypted) return { success: false, error: 'NO_CREDENTIALS' };

      const creds = await decryptCredentials(encrypted, data.password);
      await sessionCredentialsItem.setValue(creds);
      return { success: true };
    } catch {
      return { success: false, error: 'WRONG_PASSWORD' };
    }
  });

  onMessage('getSecurityMode', async () => {
    return securityModeItem.getValue();
  });

  onMessage('isUnlocked', async () => {
    if (__MOCK_MODE__) return true;

    const mode = await securityModeItem.getValue();
    if (mode === 'standard') return true;
    const session = await sessionCredentialsItem.getValue();
    return session !== null;
  });

  onMessage('isMockMode', async () => {
    return __MOCK_MODE__;
  });
}
