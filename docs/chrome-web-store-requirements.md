# Chrome Web Store Publication Requirements

## 1. Developer Account

- **登録料**: $5 USD（一回のみ）
- **2段階認証**: 必須
- 開発者メールアドレスが必要

## 2. Submission Checklist

| 要件 | 状況 | 備考 |
|------|------|------|
| manifest_version: 3 | OK | |
| name (max 75 chars) | "SwitchBot Controller (Unofficial)" (35 chars) | OK |
| version | "0.24.0-beta" | ベータ期間中 |
| description (max 132 chars) | 109 chars | OK |
| Icons: 16, 32, 48, 128 px PNG | OK（全4サイズ作成済み） | 128x128 は 96x96 コンテンツ + 16px パディング |
| Screenshots: 1280x800 px (1-5枚) | OK（2枚作成済み） | |
| Small promo image: 440x280 px | **未作成** | 必須 |
| Privacy policy URL (HTTPS) | **未ホスト** | Markdown 作成済み、listing.md に URL 記載済み、HTTPS ホスト未 |
| Single purpose description | OK（作成済み） | |
| Permission justifications | OK（作成済み） | ダッシュボード入力 |

## 3. Icon Sizes

| Size | 用途 | 必須 |
|------|------|------|
| 16x16 | ファビコン、ツールバー | Yes |
| 32x32 | 高DPIツールバー | Recommended |
| 48x48 | chrome://extensions ページ | Yes |
| 128x128 | ストアリスト、インストールダイアログ | Yes |

## 4. Source Code Requirements

- **難読化禁止** → 審査でリジェクト
- **ミニファイは可** → ただし審査が遅くなる可能性
- **リモートコード実行禁止** → MV3 で強制
- WXT/Vite のバンドル出力は標準的な JS で問題なし

## 5. Privacy Policy

### 必要な記載事項

1. **収集するデータ**: SwitchBot API Token, API Secret Key（ユーザー入力）
2. **保存方法**: `chrome.storage.local` に保存（標準: 平文、高セキュリティ: AES-GCM 暗号化）
3. **外部通信**: `https://api.switch-bot.com/v1.1` のみ（HTTPS）
4. **データ未収集**: アナリティクス、テレメトリー、トラッキングなし
5. **データ未共有**: 開発者・第三者へのデータ送信なし
6. **データ削除方法**: 拡張ストレージクリア or アンインストール
7. **Limited Use 準拠声明**: Chrome Web Store User Data Policy への準拠を明記

### ホスティング先

- GitHub Pages（推奨: 無料、HTTPS、バージョン管理）
- 個人サイト
- GitHub リポジトリの Markdown ファイル（非推奨だが許容）

## 6. Single Purpose Description

> "Control and monitor SwitchBot smart home devices directly from the Chrome toolbar.
> The extension communicates with the SwitchBot API to send commands to and retrieve
> status from the user's registered SwitchBot devices."

## 7. Permission Justifications

| Permission | Justification |
|---|---|
| `storage` | API 認証情報の保存とデバイスデータのローカルキャッシュに使用 |
| `alarms` | デバイスステータスの定期更新に使用 |
| `host_permissions: api.switch-bot.com` | SwitchBot API v1.1 への認証済み API 呼び出しに必要 |

## 8. Brand Name Risk

「SwitchBot」の名称使用は **impersonation フラグ** のリスクあり。

対策:
- 説明文に非公式であることを明記: "This is an unofficial, third-party extension. Not affiliated with SwitchBot/Wonderlabs."
- 名称候補: "SwitchBot Controller (Unofficial)", "Smart Home Controller for SwitchBot"

## 9. Common Rejection Reasons

| リスク | 可能性 | 対策 |
|--------|--------|------|
| 過剰な権限 | 低 | 最小権限（storage + alarms + host_permissions のみ） |
| Privacy policy 未設定 | 中 | 提出前に作成 |
| 機能不全 | 中 | パック版ビルドを徹底テスト |
| アセット不足 | 中 | 全アイコン・スクリーンショット作成 |
| ブランド偽装 | 低-中 | "Unofficial" 明記 |

## 10. Review Process

| シナリオ | 所要日数 |
|----------|----------|
| 初回提出（最小権限） | 2-5 営業日 |
| 初回提出（標準） | 3-7 営業日 |
| 更新（マイナー） | 1-3 営業日 |
| 更新（新権限追加） | 3-7 営業日 |
| 手動レビュー | 最大3週間 |

### リジェクト時

1. リジェクトコード付きメール受信
2. 問題修正
3. パック版テスト
4. 再提出（回数制限なし）

### 手動レビューのトリガー

- 広範な host_permissions（`<all_urls>` 等）→ 本拡張は該当しない
- 未使用権限
- 以前のリジェクト履歴
- 大規模・難読化されたコード

## 11. Store Listing

| Field | Limit | Notes |
|-------|-------|-------|
| Name | 75 chars | "SwitchBot Controller (Unofficial)" |
| Summary (manifest description) | 132 chars | 検索結果に表示 |
| Detailed Description (store) | ~16,000 chars | リスティングページ |
| Category | ドロップダウン選択 | **Productivity** 推奨 |
| Language | 選択 | English or Japanese |

## 12. Pre-Submission Checklist

- [x] プライバシーポリシー作成（作成済み、HTTPS ホスト未）
- [x] アイコン作成（全4サイズ完了: 16, 32, 48, 128 px PNG）
- [x] スクリーンショット作成（2枚完了、1280x800 px）
- [ ] Small promo image 作成（440x280 px）
- [x] ストア詳細説明文作成
- [x] Single purpose description 作成
- [x] Permission justifications 準備
- [x] "Unofficial" 免責事項追加
- [ ] パック版ビルドの動作テスト（最終検証未）
- [ ] 開発者アカウント登録（$5 + 2段階認証）
- [x] Privacy Practices タブの回答準備（listing.md に文書化済み）
- [x] 審査用テスト手順の準備（listing.md に文書化済み）
