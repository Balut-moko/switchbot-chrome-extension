---
id: "036"
title: "コンポーネントとロジックをリファクタリングする"
status: "todo"
priority: "medium"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# コンポーネントとロジックをリファクタリングする

## Context

機能追加が進み、いくつかのファイルに責務の混在・重複パターンが発生している。主な問題点:

1. **コントロールコンポーネントのトグルパターン重複** — BotControl, SwitchControl, LightControl 等で `useDeviceStatus` + `useDeviceCommand` + 楽観的更新 + disabled 判定がほぼ同一のロジックで繰り返されている
2. **DeviceList の肥大化**（266行）— 検索、並び替えモード、テーマ切り替え、デバイスグループ化、プリファレンス適用が1コンポーネントに集中
3. **background.ts の責務混在**（241行）— 認証管理、メッセージハンドラ、IR スロットリング、定期更新が `main()` 内に密結合
4. **i18n.ts の翻訳辞書肥大化**（237行）— ERROR_MESSAGES と UI_MESSAGES が1ファイルに集約

## Requirements

### A. コントロールコンポーネントの共通化

- トグルパターン（ステータス取得 → 楽観的更新 → コマンド送信 → エラー時ロールバック）を `useDeviceToggle` カスタムフックに抽出する
- BotControl, SwitchControl, LightControl から重複ロジックを除去し、`useDeviceToggle` を使用する

### B. DeviceList のロジック分離

- ドラッグ＆ドロップの並び替えロジックを `useDeviceReordering` カスタムフックに抽出する
- デバイスのフィルタリング・ソート・プリファレンス適用ロジックを `useDeviceFiltering` カスタムフックに抽出する

### C. background.ts のモジュール分割

- メッセージハンドラを機能別モジュールに分割する（`src/lib/handlers/`）
- IR コマンドスロットリングを `src/lib/ir-throttle.ts` に抽出する

### D. i18n の分割

- `ERROR_MESSAGES` を `src/utils/translations/errors.ts` に分離
- `UI_MESSAGES` を `src/utils/translations/ui.ts` に分離
- `i18n.ts` は `t()` 関数と集約ロジックのみ保持

## Affected Files

- `src/hooks/useDeviceToggle.ts` — 新規: トグルパターンの共通フック
- `src/hooks/useDeviceReordering.ts` — 新規: 並び替えロジックフック
- `src/hooks/useDeviceFiltering.ts` — 新規: フィルタリング・ソートフック
- `src/components/controls/BotControl.tsx` — `useDeviceToggle` に移行
- `src/components/controls/SwitchControl.tsx` — `useDeviceToggle` に移行
- `src/components/controls/LightControl.tsx` — `useDeviceToggle` に移行
- `src/components/DeviceList.tsx` — ロジックを hooks に委譲して簡素化
- `src/entrypoints/background.ts` — ハンドラとスロットリングを外部モジュールに分離
- `src/lib/handlers/` — 新規ディレクトリ: 機能別メッセージハンドラ
- `src/lib/ir-throttle.ts` — 新規: IR スロットリングロジック
- `src/utils/i18n.ts` — 翻訳辞書を分離ファイルから import
- `src/utils/translations/errors.ts` — 新規: エラーメッセージ辞書
- `src/utils/translations/ui.ts` — 新規: UI メッセージ辞書

## Acceptance Criteria

- [ ] コントロールコンポーネント間でトグルロジックの重複がない
- [ ] DeviceList が 150 行以内に収まっている
- [ ] background.ts が 100 行以内に収まっている
- [ ] i18n.ts が 30 行以内に収まっている
- [ ] 全機能が既存と同一の動作を維持する（振る舞いの変更なし）
- [ ] `bun run build` が TypeScript エラーなしで成功する
- [ ] `bun run check` が lint エラーなしで成功する

## Notes

- 機能変更は行わず、コード構造の改善のみ
- 各セクション（A〜D）を独立したコミットで実施し、途中で問題が起きた場合に切り戻しやすくする
- DeviceCard のバリアント分割（AC/Sensor/Control 別コンポーネント化）は本タスクのスコープ外とし、必要に応じて別タスクとする
