import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const WIDTH = 440;
const HEIGHT = 280;
const BRAND_RED = '#E8381E';

const iconSvg = readFileSync(resolve(import.meta.dirname!, '../public/icon.svg'), 'utf-8');

// Resize icon to 96x96
const iconBuffer = await sharp(Buffer.from(iconSvg)).resize(96, 96).png().toBuffer();

// Text overlay as SVG
const textSvg = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <text x="220" y="155" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="white">SwitchBot</text>
  <text x="220" y="188" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="white">Controller</text>
  <text x="220" y="218" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="rgba(255,255,255,0.8)">(Unofficial)</text>
</svg>
`);

const output = resolve(import.meta.dirname!, '../store-assets/promo-small-440x280.png');

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: BRAND_RED,
  },
})
  .composite([
    { input: iconBuffer, top: 40, left: Math.round((WIDTH - 96) / 2) },
    { input: textSvg, top: 0, left: 0 },
  ])
  .png()
  .toFile(output);

console.log(`Generated: ${output}`);
