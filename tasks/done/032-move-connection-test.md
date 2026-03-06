---
id: "032"
title: "接続テストを API 設定セクション内に移動する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# 接続テストを API 設定セクション内に移動する

## Context

現在 Options ページの `ConnectionTest` コンポーネントは API 設定の折りたたみセクションの外側（上部）に独立したカードとして配置されている。API 認証情報の設定と接続テストは密接に関連する操作のため、API 設定セクション内にまとめた方が自然な操作フローになる。

現在のレイアウト:
1. 接続テスト（独立カード）
2. デバイス表示設定（独立カード）
3. API 設定（折りたたみ: セキュリティモード + 認証情報フォーム）

改善後のレイアウト:
1. デバイス表示設定（独立カード）
2. API 設定（折りたたみ: セキュリティモード + 認証情報フォーム + **接続テスト**）

## Requirements

- `ConnectionTest` を API 設定の折りたたみセクション内（`ApiKeyForm` の下）に移動する
- 折りたたみセクション外の `ConnectionTest` カードを削除する
- API 未設定時（`isConfigured === false`）でも折りたたみ内に接続テストボタンを表示する（ただし認証情報入力後のみ有効）
- 既存のスタイル・ダークモード対応を維持する

## Affected Files

- `src/entrypoints/options/App.tsx` — `ConnectionTest` の配置を折りたたみセクション内に移動

## Acceptance Criteria

- [x] 接続テストが API 設定の折りたたみセクション内に表示される
- [x] 認証情報フォームの下に接続テストが配置されている
- [x] API 設定を折りたたむと接続テストも隠れる
- [x] ダークモードで正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する
