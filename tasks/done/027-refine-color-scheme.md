---
id: "027"
title: "コンポーネント間の配色を統一・整理する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# コンポーネント間の配色を統一・整理する

## Context

各コンポーネントで Tailwind のカラークラスを個別に指定しており、以下の不整合が確認されている:

1. **BotControl のトグル OFF 状態にダークモード指定が欠落** — `bg-gray-300` のみで `dark:bg-gray-600` がない（SwitchControl・LightControl は対応済み）
2. **トグルボタンの ON 状態カラーが不統一** — BotControl/SwitchControl は `bg-green-500`、LightControl は `bg-yellow-400` で、意図的な使い分けかドキュメント化されていない
3. **ホバー効果の不統一** — `hover:bg-*` と `hover:opacity-70` が混在
4. **ルート背景色が各コンポーネントで重複指定** — DeviceList・Options App・Popup App がそれぞれ `bg-white dark:bg-gray-900` を個別に指定
5. **バッジのバリアント定義が SensorDisplay にローカル定義** — 再利用可能なパターンだが他で参照できない

## Requirements

- BotControl のトグル OFF 状態に `dark:bg-gray-600` を追加する
- 全コントロールコンポーネントのホバー効果を統一する（`hover:bg-*` に統一）
- ルート背景色を `tailwind.css` の `@layer base` に移動し、コンポーネントから重複指定を除去する
- バッジのバリアントクラスを共通ユーティリティとして抽出する（`src/utils/styles.ts`）
- 各デバイスタイプのカラーセマンティクスをコード内コメントで明示する（例: green=active, gray=inactive, amber=alert）

## Affected Files

- `src/assets/tailwind.css` — `@layer base` にルート背景色・テキスト色を追加
- `src/components/controls/BotControl.tsx` — トグル OFF の dark mode 追加、ホバー効果統一
- `src/components/controls/SwitchControl.tsx` — ホバー効果統一（必要に応じて）
- `src/components/controls/LightControl.tsx` — ホバー効果統一（必要に応じて）
- `src/components/controls/TVControl.tsx` — ホバー効果統一（必要に応じて）
- `src/components/controls/SensorDisplay.tsx` — バッジバリアントを共通ユーティリティに移行
- `src/components/DeviceList.tsx` — ルート背景色の重複指定除去
- `src/components/DeviceCard.tsx` — 必要に応じて調整
- `src/utils/styles.ts` — 新規: バッジバリアント等の共通スタイル定義
- `src/entrypoints/popup/App.tsx` — ルート背景色の重複指定除去
- `src/entrypoints/options/App.tsx` — ルート背景色の重複指定除去

## Acceptance Criteria

- [x] BotControl のトグルがダークモードで正しく表示される
- [x] 全コントロールコンポーネントのホバー効果が統一されている
- [x] ルート背景色が `tailwind.css` に一元化され、コンポーネントから重複が除去されている
- [x] バッジバリアントが `src/utils/styles.ts` に定義され、SensorDisplay から参照されている
- [x] ダークモード・ライトモード両方で視覚的に一貫性がある
- [x] `bun run build` が TypeScript エラーなしで成功する

## Notes

- カラーパレット自体の変更（例: blue→indigo）は本タスクのスコープ外
- ACControl のグラデーションは意図的なデザインのため維持する
- トグル ON のカラー使い分け（green=スイッチ類、yellow=照明）はセマンティクスとして妥当なので維持し、コメントで明示する
