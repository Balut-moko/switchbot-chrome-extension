---
id: "003"
title: "ステータスリクエストの200ms+スタガード間隔を実装する"
status: "todo"
priority: "high"
phase: 2
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# ステータスリクエストの200ms+スタガード間隔を実装する

## Context

CLAUDE.md の Implementation Rules に「ステータスリクエストはスタガード（200ms+ 間隔）」と
記載があるが未実装。複数デバイスのステータスを一度に取得する際、API にバースト的にリクエスト
すると 429 (Rate Limited) になるリスクがある。

## Requirements

- 複数デバイスのステータスを取得する際、各リクエスト間に200ms以上の間隔を設ける
- `background.ts` の `getDeviceStatus` ハンドラまたは一括更新処理に適用
- IR デバイス（`isIR: true`）はステータス取得不可なのでスキップ
- 遅延ユーティリティ関数を作成（`sleep` or `staggeredRequests`）

## Affected Files

- `src/entrypoints/background.ts` — スタガードロジックの追加
- `src/utils/constants.ts` — `STATUS_REQUEST_INTERVAL_MS = 200` 定数追加（必要に応じて）

## Acceptance Criteria

- [ ] 複数デバイスのステータス取得時、各リクエスト間に200ms以上の間隔がある
- [ ] IR デバイスのステータス取得をスキップしている
- [ ] 単一デバイスのステータス取得には遅延が入らない
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

Task 002 (alarms) の定期更新と組み合わせて動作する想定。
SwitchBot API の公式レート制限は docs/switchbot-api-v1.1-reference.md を参照。
