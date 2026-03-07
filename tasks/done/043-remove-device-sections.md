---
id: "043"
title: "デバイスカテゴリセクションを廃止してフラットリストにする"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-08"
updated: "2026-03-08"
---

# デバイスカテゴリセクションを廃止してフラットリストにする

## Context

現在デバイスリストは "Controls" と "Sensors" の 2 セクションに分かれており、各セクションが折りたたみ可能（DeviceSection.tsx）。ドラッグ＆ドロップもセクション内のみに制限されている。

セクション分割を廃止し、全デバイスをフラットな単一リストで表示する。これによりユーザーが自由に全デバイスの順序を入れ替えられるようになり、044（ダッシュボードグリッドレイアウト）への準備になる。

## Requirements

- DeviceList.tsx から DeviceSection コンポーネントの使用を廃止し、全デバイスをフラットリストで描画する
- ドラッグ＆ドロップを全デバイス横断で動作させる（セクション制約の撤廃）
- `useDeviceReordering.ts` からグループ制約を除去し、フラットリスト前提のロジックに変更する
- DeviceCard の `variant` prop を見直す: controls/sensors の区別がなくなるため、カテゴリベースで自動判定する
- AC カードは引き続き特別扱い（フルワイド、専用 UI）

## Affected Files

- `src/components/DeviceList.tsx` — DeviceSection 廃止、SortableContext で全デバイスをフラットに描画
- `src/hooks/useDeviceReordering.ts` — グループ制約の撤廃、フラットリスト前提のロジックに変更
- `src/hooks/useDeviceFiltering.ts` — `grouped` の廃止または popup 向けインタフェース変更
- `src/components/DeviceCard.tsx` — `variant` prop の見直し（category ベースの自動判定）
- `src/components/DeviceSection.tsx` — popup からの使用廃止（未使用なら削除可）
- `src/utils/device.ts` — `groupDevices` の popup 向け使用が不要に（Options で使用有無を確認）

## Acceptance Criteria

- [x] 全デバイスが単一のフラットリストで表示される（Controls/Sensors セクションヘッダーがない）
- [x] ドラッグ＆ドロップでデバイスタイプを問わず自由に並び替えられる
- [x] AC カードが引き続き正しく表示・動作する
- [x] センサーデバイスのカードが正しく表示される
- [x] 検索フィルタリングが引き続き動作する
- [x] ダークモードで正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- Options ページが `groupDevicesForOptions` を使用している場合、`device.ts` の関数は削除せず残す
- デフォルトソート（プリファレンスなし時）は `sortDevicesByCategory` の順序を維持する
