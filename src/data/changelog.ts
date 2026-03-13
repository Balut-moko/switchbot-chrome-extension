import type { Locale } from '@/utils/locale';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: Record<Locale, string[]>;
}

export const changelog: ChangelogEntry[] = [
  {
    version: '0.23.0-beta',
    date: '2026-03-13',
    changes: {
      ja: [
        'エアコンカードを全幅表示にしてグリッドレイアウトのバランスを改善',
        'バッテリー残量の表示位置をカードヘッダー右上に統一',
        'デバイスごとのスクリーンショットをライト/ダーク両モードで自動撮影',
      ],
      en: [
        'Improve grid layout balance by making AC card full-width',
        'Unify battery level display position to card header top-right',
        'Add automated per-device screenshots in both light/dark modes',
      ],
    },
  },
  {
    version: '0.22.0-beta',
    date: '2026-03-12',
    changes: {
      ja: ['モックモード Playwright 実行時の window/document 未定義エラーを修正'],
      en: ['Fix window/document undefined error in mock mode Playwright execution'],
    },
  },
  {
    version: '0.21.0-beta',
    date: '2026-03-10',
    changes: {
      ja: [
        'ストアアセット用スクリーンショット自動撮影を追加',
        'ビルド検証・zip生成・Popup UIのE2Eテストを拡充',
      ],
      en: [
        'Add automated screenshot capture for store assets',
        'Expand E2E tests for build verification, zip generation, and popup UI',
      ],
    },
  },
  {
    version: '0.20.0-beta',
    date: '2026-03-10',
    changes: {
      ja: ['設定画面の並び替えUIを削除し、ポップアップの並び替えモードに一本化'],
      en: ['Remove device reorder UI from settings and consolidate into popup reorder mode'],
    },
  },
  {
    version: '0.19.0-beta',
    date: '2026-03-10',
    changes: {
      ja: ['Vitest + Playwright テスト環境を構築'],
      en: ['Set up Vitest + Playwright test environment'],
    },
  },
  {
    version: '0.18.0-beta',
    date: '2026-03-10',
    changes: {
      ja: ['エアコンカードを他のデバイスと同じ1列幅にコンパクト化'],
      en: ['Compact AC card to single-column width matching other device cards'],
    },
  },
  {
    version: '0.17.0-beta',
    date: '2026-03-09',
    changes: {
      ja: [
        'オプション画面をポップアップ内の画面切り替えで表示',
        'バージョンバンプ時のチェンジログ更新手順をドキュメント化',
      ],
      en: [
        'Show options page inline within popup via view switching',
        'Documented changelog update procedure for version bumps',
      ],
    },
  },
  {
    version: '0.13.0-beta',
    date: '2026-03-08',
    changes: {
      ja: [
        'デバイスカテゴリセクションを廃止してフラットリストに変更',
        'チェンジログ表示機能を追加',
      ],
      en: ['Replaced device category sections with a flat list', 'Added changelog display feature'],
    },
  },
  {
    version: '0.12.0-beta',
    date: '2026-03-04',
    changes: {
      ja: ['デバイス並び替え機能を追加', 'デバイス検索機能を追加', 'IR リモコン操作の改善'],
      en: [
        'Added device reorder feature',
        'Added device search feature',
        'Improved IR remote control',
      ],
    },
  },
  {
    version: '0.11.0-beta',
    date: '2026-02-25',
    changes: {
      ja: [
        'ロック・解錠デバイスの操作対応',
        'ボット（押すだけ）デバイスの操作対応',
        'エアコン操作 UI の改善',
      ],
      en: [
        'Added lock/unlock device control',
        'Added bot (press) device control',
        'Improved AC control UI',
      ],
    },
  },
  {
    version: '0.10.0-beta',
    date: '2026-02-18',
    changes: {
      ja: [
        '高セキュリティモード（マスターパスワード暗号化）を追加',
        'ダークモード対応',
        '言語設定（日本語/英語）を追加',
      ],
      en: [
        'Added high security mode (master password encryption)',
        'Added dark mode support',
        'Added language settings (Japanese/English)',
      ],
    },
  },
];
