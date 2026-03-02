---
id: "006"
title: "Popup でデバイス表示設定を適用する"
status: "todo"
priority: "medium"
phase: 4
depends_on: ["005"]
created: "2026-03-03"
updated: "2026-03-03"
---

# Popup でデバイス表示設定を適用する

## Context

Task 005 で Options ページからデバイスの表示/非表示・並び順を設定可能になる。
Popup の DeviceList でその設定を読み取り、表示に反映する必要がある。

## Requirements

- `DeviceList.tsx` で `devicePreferencesItem` を WXT の `useStorageItem` で購読
- `visible: false` のデバイスをフィルタリング
- `order` フィールドで並び替え（設定されていないデバイスはデフォルト順）
- 検索フィルタと表示設定フィルタを両方適用

## Affected Files

- `src/components/DeviceList.tsx` — preferences の読み取り・フィルタ・ソート適用
- `src/lib/storage.ts` — 変更なし（既存の `devicePreferencesItem` を使用）

## Acceptance Criteria

- [ ] Options で非表示にしたデバイスが Popup に表示されない
- [ ] Options で設定した並び順が Popup に反映される
- [ ] 設定がないデバイスはデフォルト順で表示される
- [ ] 検索フィルタと表示設定フィルタが共存する
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

WXT の storage は `useStorageItem` hook でリアクティブに購読可能。
`@wxt-dev/storage` の API を確認のこと。
