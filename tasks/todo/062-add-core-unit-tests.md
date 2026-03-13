---
id: "062"
title: "コアライブラリのユニットテストを追加する"
status: "todo"
priority: "high"
phase: 5
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# コアライブラリのユニットテストを追加する

## Context

現在ユニットテストは `tests/unit/utils/device.test.ts` のみ。API クライアント、認証、暗号化、ストレージといったコアライブラリがテストされていない。ストア公開前にビジネスロジックの信頼性を確保する。

## Requirements

- **`src/lib/auth.ts` のテスト** (`tests/unit/lib/auth.test.ts`):
  - `createAuthHeaders()` が正しい Headers を返す（Authorization, sign, t, nonce, Content-Type）
  - HMAC-SHA256 署名が正しく生成される
  - nonce が UUID 形式である

- **`src/lib/crypto.ts` のテスト** (`tests/unit/lib/crypto.test.ts`):
  - `encryptCredentials()` → `decryptCredentials()` のラウンドトリップ
  - 異なるパスワードでの復号失敗
  - salt, iv, ciphertext が base64 文字列である

- **`src/lib/api.ts` のテスト** (`tests/unit/lib/api.test.ts`):
  - `getDevices()` の成功レスポンス（statusCode: 100）
  - HTTP 401/403/429 のエラーハンドリング
  - API statusCode 190（SYSTEM_ERROR）のハンドリング
  - `sendCommand()` の POST リクエスト検証

- **`src/lib/storage.ts` のテスト** (`tests/unit/lib/storage.test.ts`):
  - 各 storage item の fallback 値の検証
  - `@wxt-dev/storage` のモック

## Affected Files

- `tests/unit/lib/auth.test.ts` — 新規作成
- `tests/unit/lib/crypto.test.ts` — 新規作成
- `tests/unit/lib/api.test.ts` — 新規作成
- `tests/unit/lib/storage.test.ts` — 新規作成
- `tests/setup.ts` — 必要に応じてモック追加

## Acceptance Criteria

- [ ] `bun run test` で全テストが pass する
- [ ] auth, crypto, api, storage の4ファイルのテストが存在する
- [ ] 暗号化のラウンドトリップテストが含まれている
- [ ] API エラーハンドリングのテストが含まれている
- [ ] `bun run build` が TypeScript エラーなしで成功する
