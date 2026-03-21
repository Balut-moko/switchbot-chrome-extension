import { describe, expect, it } from 'vitest';
import { decryptCredentials, encryptCredentials } from '@/lib/crypto';
import type { EncryptedCredentials, StoredCredentials } from '@/types/switchbot';

const TEST_CREDENTIALS: StoredCredentials = {
  token: 'my-token-12345',
  secret: 'my-secret-67890',
};

const TEST_PASSWORD = 'strong-master-password';

describe('encryptCredentials', () => {
  it('salt, iv, ciphertext が base64 文字列である', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);

    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(encrypted.salt).toMatch(base64Regex);
    expect(encrypted.iv).toMatch(base64Regex);
    expect(encrypted.ciphertext).toMatch(base64Regex);
  });

  it('暗号化のたびに異なる salt と iv を生成する', async () => {
    const encrypted1 = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    const encrypted2 = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);

    expect(encrypted1.salt).not.toBe(encrypted2.salt);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
  });
});

describe('decryptCredentials', () => {
  it('暗号化→復号のラウンドトリップで元のデータを復元する', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);
    const decrypted = await decryptCredentials(encrypted, TEST_PASSWORD);

    expect(decrypted).toEqual(TEST_CREDENTIALS);
  });

  it('異なるパスワードでの復号に失敗する', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);

    await expect(decryptCredentials(encrypted, 'wrong-password')).rejects.toThrow();
  });

  it('改竄された ciphertext での復号に失敗する', async () => {
    const encrypted = await encryptCredentials(TEST_CREDENTIALS, TEST_PASSWORD);

    const tampered: EncryptedCredentials = {
      ...encrypted,
      ciphertext: `${encrypted.ciphertext.slice(0, -4)}AAAA`,
    };

    await expect(decryptCredentials(tampered, TEST_PASSWORD)).rejects.toThrow();
  });

  it('空の credentials もラウンドトリップできる', async () => {
    const emptyCredentials: StoredCredentials = { token: '', secret: '' };
    const encrypted = await encryptCredentials(emptyCredentials, TEST_PASSWORD);
    const decrypted = await decryptCredentials(encrypted, TEST_PASSWORD);

    expect(decrypted).toEqual(emptyCredentials);
  });
});
