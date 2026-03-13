import { describe, expect, it } from 'vitest';
import { decryptCredentials, encryptCredentials } from '@/lib/crypto';
import type { StoredCredentials } from '@/types/switchbot';

const TEST_CREDENTIALS: StoredCredentials = {
  token: 'my-switchbot-token',
  secret: 'my-switchbot-secret',
};

const TEST_PASSWORD = 'strong-master-password-123';

describe('encryptCredentials / decryptCredentials', () => {
  it('暗号化→復号のラウンドトリップで元の資格情報を取得できる', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    const decrypted = await decryptCredentials(encrypted, TEST_PASSWORD);
    expect(decrypted).toEqual(TEST_CREDENTIALS);
  });

  it('間違ったパスワードで復号するとエラーが発生する', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    await expect(decryptCredentials(encrypted, 'wrong-password')).rejects.toThrow();
  });

  it('暗号化出力に ciphertext, iv, salt が base64 文字列として含まれる', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(encrypted.ciphertext).toMatch(base64Regex);
    expect(encrypted.iv).toMatch(base64Regex);
    expect(encrypted.salt).toMatch(base64Regex);
  });

  it('同じデータの異なる暗号化で異なる ciphertext を生成する（ランダム salt/iv）', async () => {
    const encrypted1 = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    const encrypted2 = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
    expect(encrypted1.salt).not.toBe(encrypted2.salt);
  });
});
