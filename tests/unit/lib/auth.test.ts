import { describe, expect, it } from 'vitest';
import { createAuthHeaders } from '@/lib/auth';

const TEST_TOKEN = 'test-token-abc123';
const TEST_SECRET = 'test-secret-xyz789';

describe('createAuthHeaders', () => {
  it('必要なヘッダーキーをすべて含む', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    expect(headers.get('Authorization')).toBeDefined();
    expect(headers.get('sign')).toBeDefined();
    expect(headers.get('t')).toBeDefined();
    expect(headers.get('nonce')).toBeDefined();
    expect(headers.get('Content-Type')).toBeDefined();
  });

  it('Authorization ヘッダーがトークンと一致する', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    expect(headers.get('Authorization')).toBe(TEST_TOKEN);
  });

  it('nonce が UUID 形式である', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const nonce = headers.get('nonce');
    expect(nonce).not.toBeNull();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(nonce).toMatch(uuidRegex);
  });

  it('t が数値のタイムスタンプ文字列である', async () => {
    const before = Date.now();
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const after = Date.now();
    const t = Number(headers.get('t'));
    expect(Number.isNaN(t)).toBe(false);
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(after);
  });

  it('sign が有効な base64 文字列である', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    const sign = headers.get('sign');
    expect(sign).not.toBeNull();
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(sign).toMatch(base64Regex);
    // HMAC-SHA256 produces 32 bytes → 44 chars in base64
    expect(sign?.length).toBe(44);
  });

  it('Content-Type が application/json; charset=utf8 である', async () => {
    const headers = await createAuthHeaders(TEST_TOKEN, TEST_SECRET);
    expect(headers.get('Content-Type')).toBe('application/json; charset=utf8');
  });
});
