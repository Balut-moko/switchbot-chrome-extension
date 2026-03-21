import { describe, expect, it } from 'vitest';
import { createAuthHeaders } from '@/lib/auth';

const TEST_TOKEN = 'test-token-abc123';
const TEST_SECRET = 'test-secret-xyz789';

describe('createAuthHeaders', () => {
  it('必要なヘッダーをすべて含む', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);

    expect(headers.get('Authorization')).toBe(TEST_TOKEN);
    expect(headers.get('sign')).toBeTruthy();
    expect(headers.get('t')).toBeTruthy();
    expect(headers.get('nonce')).toBeTruthy();
    expect(headers.get('Content-Type')).toBe('application/json; charset=utf8');
  });

  it('t がミリ秒タイムスタンプである', async () => {
    const before = Date.now();
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const after = Date.now();

    const t = Number(headers.get('t'));
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(after);
  });

  it('nonce が UUID 形式である', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const nonce = headers.get('nonce');

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(nonce).toBeTruthy();
    expect(nonce).toMatch(uuidRegex);
  });

  it('sign が base64 文字列である', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const sign = headers.get('sign');

    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(sign).toBeTruthy();
    expect(sign).toMatch(base64Regex);
  });

  it('呼び出しごとに異なる nonce を生成する', async () => {
    const headers1 = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const headers2 = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);

    expect(headers1.get('nonce')).not.toBe(headers2.get('nonce'));
  });

  it('HMAC-SHA256 署名が正しく生成される', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const t = headers.get('t') as string;
    const nonce = headers.get('nonce') as string;
    const sign = headers.get('sign') as string;

    // 同じパラメータで独立に署名を再計算して検証
    const data = new TextEncoder().encode(`${TEST_TOKEN}${t}${nonce}`);
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(TEST_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const expectedSign = btoa(String.fromCharCode(...new Uint8Array(signature)));

    expect(sign).toBe(expectedSign);
  });
});
