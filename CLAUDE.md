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

## Versioning
- ベータ期間中は `0.x.0` 体系（正式リリースで `1.0.0`）
- `package.json` の `version`: `"0.x.0"`（Chrome manifest の version に反映）
- `wxt.config.ts` の `manifest.version_name`: `"0.x.0-beta"`（ストア表示用）
- 実装回（タスクグループ）ごとに minor をバンプし、git tag `v0.x.0-beta` を付与

## Git Rules
- コミットは `/commit-default` スキルを使用して作成する
- コミットに `Co-Authored-By` 行を付与しない
- タスク管理コミット: `task: complete|create|block {id}-{slug}`
- 実装コミット: Conventional Commits（`feat:` / `fix:` / `chore:` 等）+ 日本語メッセージ

### Branch Strategy

GitHub Flow ベースの軽量ブランチ戦略を採用する。

#### 基本方針
- **`main` ブランチ**: 常にリリース可能な状態を維持する安定ブランチ
- **フィーチャーブランチ**: 機能実装・バグ修正は `main` から分岐したブランチで作業し、完了後にマージする
- **タスク管理コミット**（`task: create|complete|block`）は `main` への直接コミットを許可する

#### フィーチャーブランチ命名規則
- `feat/{task-id}-{slug}` — 機能追加（例: `feat/025-redesign-extension-icon`）
- `fix/{task-id}-{slug}` — バグ修正（例: `fix/022-ac-temp-centering`）
- `chore/{task-id}-{slug}` — 設定・メンテナンス（例: `chore/024-branch-strategy`）
- タスクに紐づかない場合: `feat/{short-description}`、`fix/{short-description}` 等

#### ワークフロー
1. `main` から新しいブランチを作成する
2. フィーチャーブランチで実装・コミットを行う
3. 完了後、`main` にマージする（個人開発のため PR は任意）
4. マージ後、不要になったブランチを削除する

#### Worktree との整合性
- Claude Code の Agent tool が `isolation: "worktree"` で作成するブランチ（`worktree-agent-{hash}`）は自動生成名を使用する
- worktree ブランチは作業完了後に `main` へマージし、マージ後にブランチと worktree ディレクトリを削除する
- 手動でフィーチャーブランチを使う場合も `git worktree add` で並列作業が可能（例: `git worktree add .claude/worktrees/my-feature feat/025-redesign-icon`）

#### 将来のリリースフロー（Chrome Web Store 公開後）
- リリース時に `main` から git tag `v0.x.0-beta`（または `v1.x.0`）を付与する
- ホットフィックスが必要な場合は `fix/` ブランチで対応し、速やかに `main` へマージする
- 正式リリース（v1.0.0）以降、必要に応じて `release/` ブランチの導入を検討する

## Task Management

`tasks/` ディレクトリで markdown ベースのタスク管理を運用。詳細は `tasks/GUIDE.md` を参照。

### Quick Reference
- **タスク検索**: `tasks/todo/` 内のファイルを Glob ツールで一覧 → `depends_on` の依存先が `tasks/done/` に存在するかチェック
- **完了**: `status: "done"` + Acceptance Criteria チェック → `git mv tasks/todo/{file} tasks/done/` → コミット
- **新規作成**: `tasks/todo/` と `tasks/done/` の Glob で最大IDの次の連番 → `tasks/todo/` に作成 + `tasks/GUIDE.md` のテンプレート使用
- **並列作業**: Agent tool の `isolation: "worktree"` で並列実行

## Reference Docs
- `docs/switchbot-api-v1.1-reference.md` — API 詳細
- `docs/mv3-constraints.md` — MV3 制約詳細
- `docs/wxt-and-ui-libraries.md` — WXT + UI ライブラリ設定
- `docs/existing-extensions-analysis.md` — 既存拡張の分析
- `docs/chrome-web-store-requirements.md` — ストア公開要件
