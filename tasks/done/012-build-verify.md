---
id: "012"
title: "ビルド検証と E2E 動作確認を実施する"
status: "done"
priority: "high"
phase: 5
depends_on: ["002", "003", "005", "006", "007", "054"]
created: "2026-03-03"
updated: "2026-03-10"
---

# ビルド検証と E2E 動作確認を実施する

## Context

タスク054で構築済みの Playwright テスト環境を活用し、ビルド検証と E2E テストを自動化する。
既存の `tests/e2e/build-verification.spec.ts` がビルド出力検証を既にカバーしている。
追加で zip 生成検証と、Popup UI の基本動作テストを拡充する。

## Requirements

- `bun run build` が警告なしで成功する（既存テストでカバー済み）
- ビルド出力の `manifest.json` に必要な permissions がすべて含まれている（既存テストでカバー済み）
- `bun run zip` で配布用 zip が生成されることを検証するテストを追加
- `tests/e2e/build-verification.spec.ts` に zip 生成検証を追加
- `tests/e2e/popup.spec.ts` を拡充して Popup の基本的な UI 要素の存在確認テストを追加

## Affected Files

- `tests/e2e/build-verification.spec.ts` — zip 生成検証テストを追加
- `tests/e2e/popup.spec.ts` — Popup UI の基本テストを拡充

## Acceptance Criteria

- [x] `bun run build` がエラー・警告なしで成功する
- [x] `bunx playwright test tests/e2e/build-verification.spec.ts` で全テストがパスする（zip 検証含む）
- [x] `bunx playwright test tests/e2e/popup.spec.ts` で Popup UI テストがパスする
- [x] `bun run check` で Biome エラーがない
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

手動でのブラウザ検証（サイドロード、機能動作確認、高セキュリティモード）は自動化の範囲外とし、別途手動で実施する。
