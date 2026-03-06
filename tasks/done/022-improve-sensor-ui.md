---
id: "022"
title: "センサー類のUIをリッチなカードレイアウトに改善する"
status: "done"
priority: "medium"
depends_on: []
created: "2026-03-06"
updated: "2026-03-07"
---

# センサー類のUIをリッチなカードレイアウトに改善する

## Context

現在のセンサーカード（Meter, Hub 2, Motion Sensor, Contact Sensor 等）は、全データを `22.5°C | 55% | 🔋 87%` のようにパイプ区切りのフラットなテキスト1行で表示している。情報の視認性が低く、温度・湿度・CO2・バッテリーなどの区別がつきにくい。

カード拡張型レイアウトに変更し、デバイス名の下にアイコン付きバッジで各読み取り値を視覚的に表示する。温度・湿度は青バッジ（primary）、バッテリー・CO2はグレーバッジ（secondary）、アラート状態（Motion! / Open）はアンバーバッジ（alert）で色分けする。

## Requirements

- SensorDisplay をフラットテキストからバッジベースのレンダリングに変更する
- DeviceCard のセンサーカードを2行レイアウト（名前行 + バッジ行）に変更する
- variant ごとの色分け: primary（温度・湿度）、secondary（バッテリー・CO2・Clear・Closed）、alert（Motion!・Open）
- ダークモード対応
- Loading 時にスケルトンバッジを表示
- コントロール系デバイスのレイアウトに影響を与えない

## Affected Files

- `src/components/controls/SensorDisplay.tsx` — バッジベースレンダリングに全面書き換え。SensorBadge サブコンポーネント + buildBadges ヘルパーを追加
- `src/components/DeviceCard.tsx` — sensor variant の条件分岐で flex-col カラムレイアウト追加

## Acceptance Criteria

- [x] 温度・湿度がアイコン付き青バッジで表示される
- [x] CO2・バッテリーがグレーバッジで表示される
- [x] Motion Sensor / Contact Sensor の状態が適切なバッジで表示される
- [x] ダークモードで正しく表示される
- [x] Loading 時にスケルトンバッジが表示される
- [x] コントロール系デバイスのレイアウトに影響がない
- [x] `bun run build` が TypeScript エラーなしで成功する
