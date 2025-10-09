/**
 * generate-icons.mjs
 * - Reads public/icons/icon-src.svg and rasterizes to:
 *    public/icons/icon-192x192.png
 *    public/icons/icon-512x512.png
 *
 * Usage:
 *   1. Install sharp (dev dependency): npm install --save-dev sharp
 *   2. Run: node scripts\generate-icons.mjs
 *
 * This script is small and cross-platform; on Windows run the command above
 * in your VS Code integrated terminal.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const projectRoot = path.resolve('.');
const iconsDir = path.join(projectRoot, 'public', 'icons');
const svgPath = path.join(iconsDir, 'icon-src.svg');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
  }
}

async function generate() {
  if (!fs.existsSync(svgPath)) {
    console.error('SVG source not found at', svgPath);
    process.exit(1);
  }

  await ensureDir(iconsDir);

  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { size: 192, out: path.join(iconsDir, 'icon-192x192.png') },
    { size: 512, out: path.join(iconsDir, 'icon-512x512.png') },
  ];

  for (const t of targets) {
    try {
      await sharp(svgBuffer)
        .resize(t.size, t.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 90 })
        .toFile(t.out);
      console.log(`Wrote ${t.out}`);
    } catch (err) {
      console.error('Failed to generate', t.out, err);
    }
  }

  console.log('Icon generation complete.');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});