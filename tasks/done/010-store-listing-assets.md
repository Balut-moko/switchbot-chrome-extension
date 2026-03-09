---
id: "010"
title: "Chrome Web Store 掲載用アセットを作成する"
status: "done"
priority: "low"
phase: 5
depends_on: ["008", "054"]
created: "2026-03-03"
updated: "2026-03-10"
---

# Chrome Web Store 掲載用アセットを作成する

## Context

Chrome Web Store に公開するにはスクリーンショットやプロモーション画像が必要。
タスク054で構築済みの Playwright テスト環境を活用し、モックモードでビルドした拡張機能のスクリーンショットを自動撮影する。

## Requirements

- モックモードでビルド（`MOCK_MODE=true bun run build`）してモックデータ入りの拡張機能を生成する
- Playwright の `tests/e2e/screenshots.spec.ts` を拡充して以下のスクリーンショットを撮影:
  - Popup UI（デバイス一覧表示状態）: 1280x800 にリサイズ
  - Settings 画面（API設定画面）: 1280x800 にリサイズ
- 撮影したスクリーンショットを `store-assets/` に保存する
- `store-assets/` を `.gitignore` に追加する（生成物のため Git 管理しない）

## Affected Files

- `tests/e2e/screenshots.spec.ts` — スクリーンショット撮影テストを拡充
- `.gitignore` — `store-assets/` を追加

## Acceptance Criteria

- [x] モックモードビルドが成功する
- [x] Playwright テストで Popup のスクリーンショットが `store-assets/` に生成される
- [x] Playwright テストで Settings 画面のスクリーンショットが `store-assets/` に生成される
- [x] `bun run build` が TypeScript エラーなしで成功する
- [x] `bun run check` で Biome エラーがない

## Notes

`docs/chrome-web-store-requirements.md` にアセット要件の詳細あり。
スクリーンショットはモックモードで撮影するため、実デバイスは不要。
