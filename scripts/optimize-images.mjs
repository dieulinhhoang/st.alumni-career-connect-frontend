import sharp from 'sharp';
import { readFileSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const input = path.join(publicDir, 'logovua.png');
const outputWebP = path.join(publicDir, 'logovua.webp');
const outputPng = path.join(publicDir, 'logovua-opt.png');

const before = statSync(input).size;

// WebP — chất lượng cao, nền trong suốt OK
await sharp(input).webp({ quality: 85, lossless: false }).toFile(outputWebP);

// PNG fallback — nén lại để giảm size
await sharp(input).png({ compressionLevel: 9, palette: false }).toFile(outputPng);

const afterWebP = statSync(outputWebP).size;
const afterPng = statSync(outputPng).size;

console.log(`logovua.png  : ${(before / 1024).toFixed(1)} KB`);
console.log(`logovua.webp : ${(afterWebP / 1024).toFixed(1)} KB  (↓${((1 - afterWebP/before)*100).toFixed(0)}%)`);
console.log(`logovua-opt.png : ${(afterPng / 1024).toFixed(1)} KB  (↓${((1 - afterPng/before)*100).toFixed(0)}%)`);
