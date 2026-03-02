import { PBKDF2_ITERATIONS } from '@/utils/constants';
import type { StoredCredentials, EncryptedCredentials } from '@/types/switchbot';

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export async function encryptCredentials(
  credentials: StoredCredentials,
  password: string,
): Promise<EncryptedCredentials> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const plaintext = new TextEncoder().encode(JSON.stringify(credentials));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext,
  );

  return {
    ciphertext: toBase64(ciphertext),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

export async function decryptCredentials(
  encrypted: EncryptedCredentials,
  password: string,
): Promise<StoredCredentials> {
  const salt = fromBase64(encrypted.salt);
  const iv = fromBase64(encrypted.iv);
  const ciphertext = fromBase64(encrypted.ciphertext);
  const key = await deriveKey(password, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );

  return JSON.parse(new TextDecoder().decode(plaintext));
}
