import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

const sizes = [16, 32, 48, 128];
const svgPath = join(import.meta.dir, "..", "public", "icon.svg");
const svg = readFileSync(svgPath);

for (const size of sizes) {
	await sharp(svg)
		.resize(size, size)
		.png()
		.toFile(join(import.meta.dir, "..", "public", `icon-${size}.png`));
	console.log(`Generated icon-${size}.png`);
}
