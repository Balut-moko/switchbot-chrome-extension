---
id: "042"
title: "カラーパレットを整理・簡素化する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-08"
updated: "2026-03-08"
---

# カラーパレットを整理・簡素化する

## Context

現在 popup とコントロールで使用しているカラーが多い: green（ON: スイッチ）、yellow（ON: ライト、ロック操作中）、blue（primary、AC、センサー）、amber（Demo Mode バッジ、alert バッジ）、red（エラー、ロック施錠）、cyan（AC グラデーション）、gray（OFF、補助テキスト）。

カラーの種類が多すぎて視覚的にまとまりがない。セマンティックカラーを整理・統合し、ユーザビリティを維持しつつカラー数を削減する。

## Requirements

- 統合方針:
  - **green + yellow → green に統一**: ON 状態をデバイスタイプによらず green に統一（ライトの ON も green）
  - **cyan 削除**: AC グラデーションの `to-cyan-400` を blue 系に変更
  - **amber は維持**: alert/warning 用途として残す
  - **red は維持**: エラー・危険操作は red のまま
- 最終パレット目標: **blue**（primary/active）、**green**（ON/成功）、**red**（エラー/危険）、**gray**（OFF/補助）、**amber**（警告）の5色
- `src/utils/styles.ts` のカラーセマンティクスコメントも更新する

## Affected Files

- `src/utils/styles.ts` — カラーセマンティクスコメント更新
- `src/components/controls/LightControl.tsx` — `bg-yellow-400` → `bg-green-500` に変更
- `src/components/controls/ACControl.tsx` — `to-cyan-400` → blue 系に変更
- `src/components/controls/LockControl.tsx` — `bg-yellow-500`（操作中）の色見直し
- `src/components/DeviceListHeader.tsx` — Demo Mode バッジの amber 見直し（必要に応じて）
- `src/components/controls/SensorDisplay.tsx` — alert バッジの amber（維持）

## Acceptance Criteria

- [x] ON 状態の色が green に統一されている（ライト含む）
- [x] cyan が使用されていない（blue 系に統合）
- [x] 使用するカラーが 5 色以内（blue, green, red, gray, amber）に収まっている
- [x] ダークモードで正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- ロックの操作中状態（yellow-500）は blue（pending/loading）に統合する案もある
- Options ページ（`src/entrypoints/options/App.tsx`）のカラーも対象に含める
- 変更後はライト/ダークモード両方で視認性を確認すること
