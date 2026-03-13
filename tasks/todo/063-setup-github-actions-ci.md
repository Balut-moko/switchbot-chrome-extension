---
id: "063"
title: "GitHub Actions CI パイプラインを構築する"
status: "todo"
priority: "high"
phase: 5
depends_on: []
created: "2026-03-13"
updated: "2026-03-13"
---

# GitHub Actions CI パイプラインを構築する

## Context

CI/CD パイプラインが未構築（`.github/workflows/` なし）。ローカルの lefthook pre-commit フック（Biome check）のみ。GitHub 公開に合わせて、push/PR 時に自動でリント・テスト・ビルドを実行するパイプラインを構築する。

## Requirements

- `.github/workflows/ci.yml` を作成
- **トリガー**: `push` to `main`, `pull_request` to `main`
- **ジョブ構成**:
  1. `lint`: `bun run check`（Biome による lint + format チェック）
  2. `test`: `bun run test`（Vitest ユニットテスト）
  3. `build`: `bun run build`（WXT ビルド）
- **環境**: Node.js 24.x + Bun（`oven-sh/setup-bun` アクション使用）
- **キャッシュ**: `node_modules/` のキャッシュ設定

## Affected Files

- `.github/workflows/ci.yml` — 新規作成

## Acceptance Criteria

- [ ] `.github/workflows/ci.yml` が存在する
- [ ] lint, test, build の3ジョブが定義されている
- [ ] push to main と PR で実行されるトリガー設定がある
- [ ] Node.js 24.x と Bun のセットアップが含まれている
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- E2E テスト（Playwright）は Chrome 拡張機能のロードが必要なため CI では実行しない。ユニットテストのみ。
- GitHub push 後に実際に Actions が正常実行されることを確認する（タスク 064 後）。
