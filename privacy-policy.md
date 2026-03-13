# Privacy Policy — SwitchBot Controller (Unofficial)

**Last Updated: 2026-03-04**

> **Disclaimer**: This is an unofficial Chrome extension. It is not affiliated with, endorsed by, or connected to SwitchBot or Wonderlabs, Inc.

---

## 1. Data Collection

This extension collects **only** the following data, which is manually entered by the user:

- **SwitchBot API Token** — Required for API authentication
- **SwitchBot API Secret Key** — Required for API request signing

No other personal information, browsing history, analytics, telemetry, or tracking data is collected.

## 2. Data Storage

All data is stored **locally on your device** using Chrome's built-in storage APIs:

- **`chrome.storage.local`** — Stores API credentials and cached device data
  - **Standard mode**: Credentials are stored in plain text
  - **High Security mode**: Credentials are encrypted using PBKDF2 (600,000 iterations) key derivation and AES-GCM encryption, protected by a user-defined master password
- **`chrome.storage.session`** — Temporarily caches decrypted keys for the current browser session. This data is automatically cleared when the browser is closed.

No data is stored on external servers or cloud services.

## 3. External Communications

This extension communicates **exclusively** with the following endpoint:

- `https://api.switch-bot.com/v1.1` — SwitchBot's official API (HTTPS only)

All API requests are authenticated using HMAC-SHA256 signatures. No other external network requests are made.

## 4. Data Sharing

This extension does **not** share, sell, transfer, or transmit any user data to:

- The extension developer(s)
- Third-party services or companies
- Analytics or advertising platforms
- Any other external parties

## 5. Data Deletion

You can delete all stored data at any time by either:

- Clearing the extension's storage via Chrome's extension settings (chrome://extensions → SwitchBot Controller → Details → Clear data)
- Uninstalling the extension

## 6. Security

This extension implements the following security measures:

- All API communication uses HTTPS
- API request signing uses HMAC-SHA256 via the Web Crypto API
- Optional High Security mode encrypts stored credentials with AES-GCM (256-bit key derived via PBKDF2 with 600,000 iterations)
- No remote code execution (enforced by Manifest V3)
- Minimal permissions: only `storage`, `alarms`, and `host_permissions` for `api.switch-bot.com`

## 7. Third-Party Services

This extension interacts only with the SwitchBot API (`api.switch-bot.com`). No other third-party services, SDKs, or libraries that transmit user data are used.

## 8. Chrome Web Store Limited Use Policy Compliance

This extension's use of Chrome storage APIs adheres to the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data/), including the Limited Use requirements:

- User data is used solely to provide the extension's core functionality (controlling SwitchBot devices)
- User data is not transferred to third parties
- User data is not used for purposes unrelated to the extension's single purpose
- User data is not used for creditworthiness determination, lending, or advertising

## 9. Changes to This Policy

If this privacy policy is updated, the changes will be reflected in the "Last Updated" date at the top of this document. Continued use of the extension after changes constitutes acceptance of the updated policy.

## 10. Contact

For questions or concerns about this privacy policy, please open an issue on the [GitHub repository](https://github.com/Balut-moko/switchbot-chrome-extension).

---
---

# プライバシーポリシー — SwitchBot Controller（非公式）

**最終更新日: 2026-03-04**

> **免責事項**: これは非公式の Chrome 拡張機能です。SwitchBot および Wonderlabs, Inc. とは一切関係ありません。

---

## 1. データの収集

本拡張機能は、ユーザーが手動で入力する以下のデータ**のみ**を収集します:

- **SwitchBot API トークン** — API 認証に必要
- **SwitchBot API シークレットキー** — API リクエスト署名に必要

その他の個人情報、閲覧履歴、アナリティクス、テレメトリー、トラッキングデータは一切収集しません。

## 2. データの保存

すべてのデータは Chrome の組み込みストレージ API を使用して、**ユーザーのデバイス上にローカル保存**されます:

- **`chrome.storage.local`** — API 認証情報とキャッシュされたデバイスデータを保存
  - **標準モード**: 認証情報は平文で保存
  - **高セキュリティモード**: 認証情報は PBKDF2（600,000 回反復）による鍵導出と AES-GCM 暗号化で保護（ユーザー定義のマスターパスワードを使用）
- **`chrome.storage.session`** — 現在のブラウザセッション中、復号済みキーを一時的にキャッシュ。ブラウザを閉じると自動的に消去されます。

外部サーバーやクラウドサービスにデータは保存されません。

## 3. 外部通信

本拡張機能は以下のエンドポイント**のみ**と通信します:

- `https://api.switch-bot.com/v1.1` — SwitchBot 公式 API（HTTPS のみ）

すべての API リクエストは HMAC-SHA256 署名で認証されます。その他の外部ネットワークリクエストは行いません。

## 4. データの共有

本拡張機能は、以下を含むいかなる相手にもユーザーデータを共有、販売、転送、送信**しません**:

- 拡張機能の開発者
- サードパーティのサービスや企業
- アナリティクスや広告プラットフォーム
- その他の外部関係者

## 5. データの削除

保存されたすべてのデータは、以下のいずれかの方法でいつでも削除できます:

- Chrome の拡張機能設定からストレージをクリア（chrome://extensions → SwitchBot Controller → 詳細 → データを消去）
- 拡張機能のアンインストール

## 6. セキュリティ

本拡張機能は以下のセキュリティ対策を実施しています:

- すべての API 通信は HTTPS を使用
- API リクエスト署名は Web Crypto API による HMAC-SHA256 を使用
- オプションの高セキュリティモードでは、保存された認証情報を AES-GCM（PBKDF2 で 600,000 回反復により導出された 256 ビットキー）で暗号化
- リモートコード実行なし（Manifest V3 により強制）
- 最小権限: `storage`、`alarms`、`api.switch-bot.com` への `host_permissions` のみ

## 7. サードパーティサービス

本拡張機能は SwitchBot API（`api.switch-bot.com`）とのみ連携します。ユーザーデータを送信するその他のサードパーティサービス、SDK、ライブラリは使用していません。

## 8. Chrome Web Store Limited Use Policy 準拠

本拡張機能の Chrome ストレージ API の使用は、[Chrome Web Store ユーザーデータポリシー](https://developer.chrome.com/docs/webstore/program-policies/user-data/)（Limited Use 要件を含む）に準拠しています:

- ユーザーデータは拡張機能のコア機能（SwitchBot デバイスの制御）の提供にのみ使用
- ユーザーデータは第三者に転送されない
- ユーザーデータは拡張機能の単一目的に関係のない目的には使用されない
- ユーザーデータは信用力の判定、融資、広告には使用されない

## 9. ポリシーの変更

本プライバシーポリシーが更新された場合、変更内容は本文書冒頭の「最終更新日」に反映されます。変更後も拡張機能を継続使用した場合、更新されたポリシーに同意したものとみなします。

## 10. お問い合わせ

本プライバシーポリシーに関するご質問やご懸念がありましたら、[GitHub リポジトリ](https://github.com/Balut-moko/switchbot-chrome-extension)で Issue を作成してください。
