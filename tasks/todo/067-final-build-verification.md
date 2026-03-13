---
id: "067"
title: "最終ビルド検証とパック版テストを実施する"
status: "todo"
priority: "high"
phase: 5
depends_on: ["062"]
created: "2026-03-13"
updated: "2026-03-13"
---

# 最終ビルド検証とパック版テストを実施する

## Context

タスク 012（build-verify）は開発初期に完了。以降 46 タスク分の変更が加わっているため、ストア提出前に最終的なビルド検証が必要。コアライブラリのテスト追加（062）後に実施する。

## Requirements

- `bun run build` でエラー・警告がないことを確認
- `bun run zip` で zip ファイルが正常に生成されることを確認
- `bun run check`（Biome）で lint エラーがないことを確認
- `bun run test` で全ユニットテストが pass することを確認
- zip をサイドロードして手動テスト:
  - zip を展開して `chrome://extensions` から読み込み
  - ポップアップの表示・操作確認
  - 設定ページの動作確認
  - ライト/ダークテーマの切り替え
  - コンソールエラーがないことを確認

## Affected Files

- なし（検証のみ。問題が見つかった場合は別途修正）

## Acceptance Criteria

- [ ] `bun run build` がエラーなしで成功する
- [ ] `bun run zip` が有効な zip ファイルを生成する
- [ ] `bun run check` が pass する
- [ ] `bun run test` で全テストが pass する
- [ ] サイドロードした拡張機能が正常に動作する
- [ ] Service Worker・ポップアップにコンソールエラーがない
