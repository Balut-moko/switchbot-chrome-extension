---
id: "028"
title: "API レスポンスの全デバイスタイプを正しく表示する"
status: "todo"
priority: "high"
depends_on: []
created: "2026-03-07"
updated: "2026-03-07"
---

# API レスポンスの全デバイスタイプを正しく表示する

## Context

SwitchBot API v1.1 は 40 種以上の物理デバイスと 15 種以上の IR デバイスを返すが、現在の実装では一部のデバイスタイプしか適切にカテゴリ分け・表示されない。未対応デバイスは `default` 分岐に入り、デバイスタイプ名がテキストで表示されるだけで、ステータスもアイコンも表示されない。

### 主な問題

1. **カテゴリ未登録**: Relay Switch 系、Hub 系（Hub 2 以外）、Keypad 系、Humidifier 系、Air Purifier 系、Fan 系、Robot Vacuum 系、Camera 系、Garage Door Opener 等が `device.ts` の分類 Set に含まれていない
2. **Plug Mini (EU)** が `SWITCH_TYPES` に未登録で 'other' に分類される
3. **Lock 派生型**: Smart Lock Ultra、Lock Lite が `LOCK_TYPES` に未登録
4. **アイコン未定義**: 上記デバイスの `DEVICE_ICONS` エントリがない
5. **capabilities 未定義**: `deviceCapabilities.ts` に上記デバイスのエントリがない
6. **IR デバイス**: Streamer、Set Top Box、DVD、Projector、Speaker、Water Heater 等に対応する UI がない

## Requirements

### Phase A: デバイス分類の網羅（最優先）

- `src/utils/device.ts` の各分類 Set（`SWITCH_TYPES`, `SENSOR_TYPES`, `CURTAIN_TYPES`, `LOCK_TYPES` 等）に API リファレンスの全デバイスタイプを追加する
- 新しいカテゴリが必要な場合は追加する（例: `HUB_TYPES`, `VACUUM_TYPES` 等）
- `DEVICE_ICONS` に全デバイスタイプのアイコン（絵文字）を追加する
- `Plug Mini (EU)` を `SWITCH_TYPES` に追加する
- `Smart Lock Ultra`, `Lock Lite` を `LOCK_TYPES` に追加する

### Phase B: capabilities 定義の補完

- `src/utils/deviceCapabilities.ts` に不足デバイスタイプの capabilities を追加する
- 各デバイスの API ドキュメントに基づいて `canToggle`, `hasBattery` 等を正しく設定する

### Phase C: フォールバック UI の改善

- `DeviceCard.tsx` の `default` 分岐を改善し、未知のデバイスでもステータス情報があれば表示する
- IR デバイスの未対応タイプ（DVD、Projector 等）に汎用リモコン UI（電源ボタンのみ）を提供する

## Affected Files

- `src/utils/device.ts` — デバイス分類 Set の拡充、`DEVICE_ICONS` の追加
- `src/utils/deviceCapabilities.ts` — 不足デバイスの capabilities 追加
- `src/components/DeviceCard.tsx` — default 分岐のフォールバック UI 改善
- `src/types/switchbot.ts` — 必要に応じて Status 型の追加
- `docs/switchbot-api-v1.1-reference.md` — 参照用（変更なし）

## Acceptance Criteria

- [ ] API リファレンスに記載されている全物理デバイスタイプが適切なカテゴリに分類される
- [ ] 全デバイスタイプに対応するアイコンが `DEVICE_ICONS` に定義されている
- [ ] `Plug Mini (EU)` がスイッチとして正しく表示される
- [ ] `Smart Lock Ultra`, `Lock Lite` がロックとして正しく表示される
- [ ] 未知のデバイスタイプでもステータス情報がある場合は表示される
- [ ] 未対応 IR デバイスに汎用リモコン UI（電源ボタン）が表示される
- [ ] `bun run build` が TypeScript エラーなしで成功する

## Notes

- `docs/switchbot-api-v1.1-reference.md` に全デバイスタイプとステータスフィールドの詳細あり
- Robot Vacuum や Camera 等のフル機能 UI は本タスクのスコープ外。カテゴリ分類とアイコン表示、基本ステータスの表示までを対象とする
- 全デバイスタイプの専用コントロール UI 作成は別タスクとして切り出す
