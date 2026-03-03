# SwitchBot Chrome Extension

SwitchBot デバイスをブラウザから操作する Chrome 拡張機能（Manifest V3）。

## Tech Stack
- **Runtime**: Node.js 24.x LTS / **Package Manager**: Bun
- **Build**: WXT v0.20+ (Vite-based) / React 18 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS v3（v4は WXT 互換性問題あり）
- **API**: SwitchBot API v1.1 (HMAC-SHA256, Web Crypto API)

## Commands
- `bun install` / `bun run dev` / `bun run build` / `bun run zip`

## Architecture
- **Popup 型** UI（新規タブ置換ではない）
- **Service Worker** で API 通信（CORS 回避 + popup 非活性時の動作）
- **chrome.storage.local** にデバイスキャッシュ
- **chrome.storage.session** に復号済みキーキャッシュ
- **chrome.alarms** で定期ステータス更新（5分間隔）
- **High Security Mode**: Master password → PBKDF2(600K) → AES-GCM でトークン暗号化

## WXT Rules
- エントリーポイントは `src/entrypoints/` に配置
- manifest.json は `wxt.config.ts` から自動生成（直接編集しない）
- Background の `main()` は async 不可
- shadcn/ui 使用時は tsconfig path alias のワークアラウンドが必要

## Implementation Rules
- SW はアイドル30秒で停止 → グローバル変数に状態を持たない
- nonce は `crypto.randomUUID()` を使用（タイムスタンプベース不可）
- API 署名: `HMAC-SHA256(secret, token + t + nonce)` → base64
- API 成功判定: `statusCode: 100`（HTTP ステータスではない）
- IR デバイスはステータス取得不可 → UI 内部で状態管理
- ステータスリクエストはスタガード（200ms+ 間隔）
- 長時間処理は `waitUntil` パターン（25秒ごとに `getPlatformInfo` 呼び出し）

## Git Rules
- コミットは `/commit-default` スキルを使用して作成する
- コミットに `Co-Authored-By` 行を付与しない
- タスク管理コミット: `task: complete|create|block {id}-{slug}`
- 実装コミット: Conventional Commits（`feat:` / `fix:` / `chore:` 等）+ 日本語メッセージ

## Task Management

`tasks/` ディレクトリで markdown ベースのタスク管理を運用。詳細は `tasks/GUIDE.md` を参照。

### Quick Reference
- **タスク検索**: `grep -l 'status: "todo"' tasks/[0-9]*.md` → `depends_on` チェック
- **完了**: `status: "done"` + Acceptance Criteria チェック → コミット
- **新規作成**: 最大IDの次の連番 + `tasks/GUIDE.md` のテンプレート使用
- **並列作業**: Agent tool の `isolation: "worktree"` で並列実行

## Reference Docs
- `docs/switchbot-api-v1.1-reference.md` — API 詳細
- `docs/mv3-constraints.md` — MV3 制約詳細
- `docs/wxt-and-ui-libraries.md` — WXT + UI ライブラリ設定
- `docs/existing-extensions-analysis.md` — 既存拡張の分析
- `docs/chrome-web-store-requirements.md` — ストア公開要件
