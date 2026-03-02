export async function createAuthHeaders(
  token: string,
  secret: string,
): Promise<Headers> {
  const t = Date.now().toString();
  const nonce = crypto.randomUUID();
  const data = new TextEncoder().encode(token + t + nonce);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, data);
  const sign = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return new Headers({
    Authorization: token,
    sign,
    t,
    nonce,
    'Content-Type': 'application/json',
  });
}
