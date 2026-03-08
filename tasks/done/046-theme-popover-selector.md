---
id: "046"
title: "テーマ切り替えをポップオーバー選択式に変更する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-08"
updated: "2026-03-09"
---

# テーマ切り替えをポップオーバー選択式に変更する

## Context

現在テーマ切り替えはボタンクリックで light→dark→system を順にサイクルする方式。どのモードに切り替わるか分かりにくく、意図しないモードを経由する必要がある。

ボタン押下でポップオーバーを表示し、アイコン付きの3択（ライト/ダーク/システム）から直接選択できるようにする。

## Requirements

- テーマボタンクリックでポップオーバー（小さなパネル）を表示する
- ポップオーバーに以下の3つの選択肢をアイコン付きで表示する:
  - Sun アイコン + 「ライト」
  - Moon アイコン + 「ダーク」
  - Monitor アイコン + 「システム」
- 現在選択中のテーマにチェックマークまたはハイライトを付ける
- 選択するとポップオーバーが閉じてテーマが即座に反映される
- ポップオーバー外をクリックしたら閉じる
- `onCycleTheme` を `onSetTheme(theme: ThemePreference)` に変更する

## Affected Files

- `src/components/DeviceListHeader.tsx` — テーマボタンのクリックハンドラ変更、ポップオーバーコンポーネントの追加
- `src/components/DeviceList.tsx` — `cycleTheme` を `setTheme` に変更（直接渡す）

## Acceptance Criteria

- [x] テーマボタンクリックでアイコン付きの3択ポップオーバーが表示される
- [x] 選択中のテーマがハイライトされている
- [x] 選択肢をクリックするとテーマが即座に切り替わり、ポップオーバーが閉じる
- [x] ポップオーバー外クリックで閉じる
- [x] ダークモードでポップオーバーが正しく表示される
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- ポップオーバーの実装: `useState` + `useRef` + クリック外検知（`useEffect` で `mousedown` リスン）でシンプルに実装可能
- shadcn/ui の Popover は使えるが、このケースでは独自実装の方が軽量
- ポップオーバーの位置: ボタンの下に表示（`absolute right-0 top-full mt-1`）
- i18n キーの追加が必要: `THEME_LIGHT`, `THEME_DARK`, `THEME_SYSTEM`（または既存キーを流用）
