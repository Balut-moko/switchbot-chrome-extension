---
id: "004"
title: "waitUntil パターンで SW の長時間処理を維持する"
status: "done"
priority: "medium"
phase: 2
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# waitUntil パターンで SW の長時間処理を維持する

## Context

CLAUDE.md に「長時間処理は waitUntil パターン（25秒ごとに getPlatformInfo 呼び出し）」と
記載があるが未実装。Service Worker はアイドル30秒で停止されるため、複数デバイスの一括
ステータス更新のような処理中に SW が kill される可能性がある。

## Requirements

- `waitUntil` ヘルパー関数を作成: 渡された Promise が完了するまで25秒間隔で `chrome.runtime.getPlatformInfo()` を呼び出し、SW のアイドルタイマーをリセットする
- Task 002 の定期更新処理や、`getDevices`（forceRefresh時）など時間がかかる処理に適用
- 処理完了後は keepalive を停止

## Affected Files

- `src/entrypoints/background.ts` — `waitUntil` ヘルパーの定義と使用
- 参考: `docs/mv3-constraints.md` — waitUntil パターンの詳細

## Acceptance Criteria

- [x] `waitUntil` ヘルパーが実装されている
- [x] 長時間処理（一括ステータス更新等）で keepalive が有効になっている
- [x] 処理完了後に keepalive interval が適切にクリアされている
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

`docs/mv3-constraints.md` に詳細な実装パターンが記載されている。
5分で30台のデバイスステータスを200ms間隔で取得 = 最大6秒程度なので、
通常は30秒以内に収まるが、ネットワーク遅延を考慮して安全策として実装する。
