# WXT Framework & UI Libraries Research

## WXT Framework (v0.20+)

**公式サイト**: https://wxt.dev/
**GitHub**: https://github.com/wxt-dev/wxt

### Overview
Vite ベースのブラウザ拡張フレームワーク。2025年時点で Plasmo, CRXJS を超えるコミュニティ採用率。

### React Setup

```ts
// wxt.config.ts
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});
```

### Project Structure

```
project/
├── .output/           # ビルド成果物（隠しディレクトリ）
├── .wxt/              # 生成された TypeScript 設定
├── assets/            # CSS, 画像（Vite で処理）
├── components/        # Auto-import される UI コンポーネント
├── hooks/             # Auto-import される React hooks
├── entrypoints/       # 拡張機能エントリーポイント（核心）
│   ├── popup/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── style.css
│   ├── options/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   └── App.tsx
│   └── background.ts  # Service Worker
├── modules/           # ローカル WXT モジュール
├── public/            # そのままコピー（アイコン等）
│   └── icons/
├── utils/             # Auto-import されるユーティリティ
├── wxt.config.ts      # メイン設定
├── tailwind.config.ts
└── tsconfig.json
```

`srcDir: 'src'` を設定すれば `src/` ディレクトリ構成も可能。

### Manifest 自動生成

manifest.json は手動作成不要。`wxt.config.ts` で設定:

```ts
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'alarms'],
    host_permissions: ['https://api.switch-bot.com/*'],
  },
});
```

- ファイルベースのエントリーポイントが manifest に自動マッピング
- `public/icons/` の PNG アイコンは自動検出
- `name`, `version` は `package.json` から取得

### Background (Service Worker)

```ts
// entrypoints/background.ts
export default defineBackground({
  type: 'module',
  main() {
    // ここにロジックを書く
    // main() は async 不可
    // ランタイムコードは main() 内に限定
    chrome.alarms.onAlarm.addListener(async (alarm) => {
      // ...
    });
  },
});
```

### Storage (@wxt-dev/storage)

組み込みの型安全ストレージラッパー:

```ts
import { storage } from 'wxt/storage';

export const apiToken = storage.defineItem<string>('local:apiToken');
export const deviceCache = storage.defineItem<Device[]>('local:devices', {
  fallback: [],
});
export const decryptedKey = storage.defineItem<string>('session:decryptedKey');
```

React 用カスタム hook が必要:

```tsx
function useStorageItem<T>(item: WxtStorageItem<T>) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    item.getValue().then((v) => { setValue(v); setLoading(false); });
    const unwatch = item.watch((newValue) => setValue(newValue));
    return () => { unwatch.then(fn => fn()); };
  }, []);

  return { value, set: (v: T) => item.setValue(v), loading };
}
```

### HMR Support

| エントリーポイント | HMR | 挙動 |
|---|---|---|
| Popup / Options | Full HMR | 即時更新 |
| Background | なし | 拡張全体リロード（popup が閉じる） |
| Content Script (JS) | なし | 個別リロード |

### Build & Output

- Dev: `.output/chrome-mv3-dev/` → Chrome に読み込んで開発
- Production: `.output/chrome-mv3/`
- Zip: `wxt zip` でストア提出用 zip 生成

### Known Gotchas

1. **Tailwind CSS v4 互換性問題** → v3 を使用すること
2. **shadcn/ui CLI の tsconfig 競合** → WXT は独自の tsconfig を生成するため、ワークアラウンドが必要
3. **Background の main() は async 不可**
4. **Background 保存時に popup が閉じる**（開発時）
5. **出力ディレクトリが `.output/`**（ドットプレフィックス）
6. **PNG アイコンのみ自動検出**（SVG は手動で manifest に追加）
7. **ハッシュモードルーティング必須**（拡張ページは `chrome-extension://{id}/popup.html` から読み込まれるため）

### Tailwind CSS Integration

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

```js
// tailwind.config.js
content: [
  "./entrypoints/**/*.{html,js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}"
]
```

---

## UI Libraries Comparison

### Evaluation Summary

| | shadcn/ui | Radix UI | Headless UI | Tailwind Only |
|---|---|---|---|---|
| Bundle size | Small-Medium | Small | Medium (tree-shaking 問題) | 最小 |
| 必要コンポーネント | 全て揃う | 全て揃う | Slider/Tooltip なし | 自作必須 |
| スタイリング工数 | なし（プリスタイル） | 高い（全手動） | 中程度 | 全手動 |
| アクセシビリティ | Excellent (Radix) | Excellent | Good | 自力実装 |
| WXT セットアップ | 中程度（workaround） | 簡単 | 簡単 | 最も簡単 |
| 開発速度 | 最速 | 遅い | 中程度 | 最も遅い |

### 推奨: shadcn/ui

理由:
1. **Toggle, Slider, Dropdown, Tooltip** が全て必要 → Headless UI は Slider/Tooltip なしで不適
2. **Bundle size は許容範囲** → 5-8 コンポーネントで 30-60 kB gzipped（拡張機能はローカルバンドルなのでネットワーク遅延なし）
3. **Tailwind CSS ネイティブ** → プリスタイル済みで即使用可能
4. **コード所有権** → コンポーネントがプロジェクトにコピーされるため自由にカスタマイズ可能
5. **Radix UI ベース** → アクセシビリティが自動的に担保

### shadcn/ui + WXT セットアップ

WXT の tsconfig 自動生成と shadcn/ui CLI の path alias 要件が競合する。
参考テンプレート: `imtiger/wxt-react-shadcn-tailwindcss-chrome-extension`

### SwitchBot Extension で使うコンポーネント候補

| コンポーネント | 用途 |
|---|---|
| Switch | デバイス ON/OFF トグル |
| Slider | カーテンポジション、エアコン温度、明るさ |
| Select | エアコンモード、風量選択 |
| Button | コマンド送信 |
| Dialog | 確認ダイアログ |
| Tooltip | デバイス状態詳細 |
| Input | API キー入力 |
| Tabs | Options ページのセクション分け |
| Card | デバイスカード |
| Badge | デバイス状態表示 |
