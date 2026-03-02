---
id: "002"
title: "chrome.alarms で定期ステータス更新を実装する"
status: "todo"
priority: "high"
phase: 2
depends_on: ["001"]
created: "2026-03-03"
updated: "2026-03-03"
---

# chrome.alarms で定期ステータス更新を実装する

## Context

CLAUDE.md のアーキテクチャに「chrome.alarms で定期ステータス更新（5分間隔）」と記載があるが、
`src/entrypoints/background.ts` には未実装。Service Worker の `setInterval` は SW 停止で消えるため、
`chrome.alarms` API を使う必要がある。

## Requirements

- `wxt.config.ts` の `permissions` に `"alarms"` を追加
- background.ts に `chrome.alarms.create('refreshDevices', { periodInMinutes: 5 })` を追加
- `chrome.alarms.onAlarm` リスナーで全デバイスのステータスを更新
- ステータスリクエストは Task 003 のスタガード間隔に従う（先に実装されている場合）
- 認証情報がない場合（未設定 or ロック中）は静かにスキップ

## Affected Files

- `wxt.config.ts` — `permissions` に `"alarms"` 追加
- `src/entrypoints/background.ts` — alarm 作成 + onAlarm ハンドラ追加

## Acceptance Criteria

- [ ] `wxt.config.ts` の permissions に `"alarms"` が含まれている
- [ ] ビルド後の `manifest.json` に `"alarms"` パーミッションが出力される
- [ ] 5分間隔でデバイスステータスが自動更新される
- [ ] 認証情報がない場合にエラーにならない
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

`chrome.alarms.create` は最小間隔が1分（開発時は制限緩和あり）。
SW 再起動時に alarm が重複作成されないよう注意。
