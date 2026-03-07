---
id: "044"
title: "Popup をダッシュボード風グリッドレイアウトに変更する"
status: "todo"
priority: "medium"
depends_on: ["043"]
created: "2026-03-08"
updated: "2026-03-08"
---

# Popup をダッシュボード風グリッドレイアウトに変更する

## Context

現在の popup は幅 360px の縦一列リストレイアウト。デバイスが多い場合にスクロール量が増え、一覧性が低い。

popup の幅を 500-600px に拡大し、デバイスを 2 列グリッドで配置するダッシュボード風レイアウトに変更する。043（セクション廃止）完了後のフラットリストが前提。

## Requirements

- `src/entrypoints/popup/style.css` の `body` 幅を 500-600px に変更する（max-height も調整を検討）
- デバイスリスト部分を CSS Grid の 2 列レイアウト（`grid-cols-2`）に変更する
- AC カードは `col-span-2` でフル幅を維持する
- 各デバイスカードをタイル形状に調整（横長→縦スタック: アイコン→デバイス名→コントロール）
- センサーカードもグリッドの 1 セルに収まるようコンパクト化する
- ドラッグ＆ドロップがグリッドレイアウトで正しく動作する
  - dnd-kit の `rectSortingStrategy` への切り替えを検討

## Affected Files

- `src/entrypoints/popup/style.css` — popup 幅・高さの変更
- `src/components/DeviceList.tsx` — リスト部分を `grid grid-cols-2 gap-2` に変更
- `src/components/DeviceCard.tsx` — タイル型レイアウトへの変更、AC カードに `col-span-2` 追加
- `src/components/controls/ACControl.tsx` — グリッド内でのレイアウト確認・調整
- `src/components/controls/SensorDisplay.tsx` — コンパクトなグリッドセル表示に調整
- `src/components/controls/SwitchControl.tsx` — タイル内での配置調整
- `src/components/controls/BotControl.tsx` — タイル内での配置調整
- `src/components/controls/LightControl.tsx` — タイル内での配置調整

## Acceptance Criteria

- [ ] popup の幅が 500-600px になっている
- [ ] デバイスが 2 列グリッドで表示される
- [ ] AC カードがフル幅（2 列スパン）で表示される
- [ ] 各デバイスカードがグリッドセル内に収まるコンパクトなレイアウトになっている
- [ ] ドラッグ＆ドロップがグリッドレイアウトで正しく動作する
- [ ] 検索フィルタリングが引き続き動作する
- [ ] ダークモードで正しく表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- dnd-kit のグリッド対応: `verticalListSortingStrategy` → `rectSortingStrategy` に変更が必要
- popup の max-height はブラウザの制限（Chrome 拡張のポップアップは画面高さの約 2/3 が上限）も考慮する
- タイル型カードのデザイン案: 上部にアイコン+名前、下部にコントロール
- レスポンシブは不要（popup は固定幅）
