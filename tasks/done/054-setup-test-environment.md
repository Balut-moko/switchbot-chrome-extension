---
id: "054"
title: "Vitest + Playwright テスト環境を構築する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-10"
updated: "2026-03-10"
---

# Vitest + Playwright テスト環境を構築する

## Context

タスク010（ストアアセット作成）とタスク012（ビルド検証・E2E確認）を実行するために、テストフレームワークが必要。Vitest（ユニットテスト）と Playwright（E2E テスト・スクリーンショット撮影）を導入する。

## Requirements

- Vitest でユニットテスト環境を構築する（happy-dom 環境、パスエイリアス対応）
- Playwright で E2E テスト環境を構築する（Chrome 拡張読み込み対応）
- ビルド出力検証テスト（manifest.json パーミッション、必須ファイル確認）
- スクリーンショット撮影テスト（ストアアセット用）
- 初期ユニットテスト（src/utils/device.ts の純粋関数）

## Affected Files

- `package.json` — devDependencies + scripts 追加
- `vitest.config.ts` — 新規作成
- `playwright.config.ts` — 新規作成
- `tests/setup.ts` — 新規作成
- `tests/tsconfig.json` — 新規作成
- `tests/unit/utils/device.test.ts` — 新規作成
- `tests/e2e/fixtures.ts` — 新規作成
- `tests/e2e/build-verification.spec.ts` — 新規作成
- `tests/e2e/popup.spec.ts` — 新規作成
- `tests/e2e/screenshots.spec.ts` — 新規作成
- `biome.json` — tests/** を includes に追加
- `.gitignore` — テスト出力ディレクトリを追加

## Acceptance Criteria

- [x] `bun run test` で Vitest ユニットテストが全件パスする
- [x] `bunx playwright test tests/e2e/build-verification.spec.ts` でビルド検証テストがパスする
- [x] `bun run check` で Biome エラーがない
- [x] `bun run build` が TypeScript エラーなしで成功する
