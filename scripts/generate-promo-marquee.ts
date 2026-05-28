import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

// Chrome Web Store Marquee Promo Tile
// 1400 x 560 / 24-bit PNG (no alpha)
const WIDTH = 1400;
const HEIGHT = 560;
const BRAND_RED = '#E8381E';
const ICON_SIZE = 320;

const iconSvg = readFileSync(resolve(import.meta.dirname!, '../public/icon.svg'), 'utf-8');

// アイコン本体（角丸の白背景に内包するのではなく、アイコン SVG をそのまま表示）
const iconBuffer = await sharp(Buffer.from(iconSvg)).resize(ICON_SIZE, ICON_SIZE).png().toBuffer();

// 左にアイコン、右に大きなブランド + キャッチコピーを配置
const iconLeft = 200;
const iconTop = Math.round((HEIGHT - ICON_SIZE) / 2);

const textLeft = iconLeft + ICON_SIZE + 80; // 600

const textSvg = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textLeft}" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Arial, sans-serif" font-size="80" font-weight="700" fill="white">SwitchBot</text>
  <text x="${textLeft}" y="335" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Arial, sans-serif" font-size="80" font-weight="700" fill="white">Controller</text>
  <text x="${textLeft}" y="400" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Arial, sans-serif" font-size="28" font-weight="500" fill="rgba(255,255,255,0.92)">Control your smart home from the Chrome toolbar.</text>
  <text x="${textLeft}" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Arial, sans-serif" font-size="22" font-weight="400" fill="rgba(255,255,255,0.7)">Unofficial extension</text>
</svg>
`);

const output = resolve(import.meta.dirname!, '../store-assets/promo-marquee-1400x560.png');

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 3,
    background: BRAND_RED,
  },
})
  .composite([
    { input: iconBuffer, top: iconTop, left: iconLeft },
    { input: textSvg, top: 0, left: 0 },
  ])
  // Chrome Web Store 要件: 24-bit PNG（アルファチャンネルなし）
  .flatten({ background: BRAND_RED })
  .png({ palette: false, compressionLevel: 9 })
  .removeAlpha()
  .toFile(output);

console.log(`Generated: ${output}`);
