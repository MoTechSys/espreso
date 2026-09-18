#!/usr/bin/env node
/**
 * Image pipeline — assets/source/** → public/img/** (AVIF + WebP + JPG fallback)
 * Generates responsive widths, LQIP placeholders, and a manifest consumed by src/js/images.js
 *
 *   node tools/build-images.mjs          # build all
 *   node tools/build-images.mjs --force  # rebuild even if up-to-date
 */
import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SRC = path.join(ROOT, 'assets/source');
const OUT = path.join(ROOT, 'public/img');
const MANIFEST = path.join(ROOT, 'src/data/images.json');
const WIDTHS = [400, 640, 960, 1280, 1600];
const FORCE = process.argv.includes('--force');

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) yield p;
  }
}

async function build(file) {
  const rel = path.relative(SRC, file);
  const id = rel.replace(/\.[^.]+$/, '').replace(/-1080$/, '').replaceAll(path.sep, '/');
  const outDir = path.join(OUT, path.dirname(id));
  await mkdir(outDir, { recursive: true });
  const base = path.basename(id);

  const img = sharp(file);
  const meta = await img.metadata();
  const srcStat = await stat(file);

  // Skip if already built and source unchanged
  const probe = path.join(outDir, `${base}-${Math.min(meta.width, WIDTHS[0])}.avif`);
  if (!FORCE && existsSync(probe) && (await stat(probe)).mtimeMs > srcStat.mtimeMs) {
    return manifestEntry(id, meta, null);
  }

  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.includes(meta.width) && meta.width < WIDTHS.at(-1)) widths.push(meta.width);

  // LQIP: 16px wide blurred base64
  const lqipBuf = await img.clone().resize(16).blur(1).webp({ quality: 40 }).toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`;

  // dominant color
  const { dominant } = await img.clone().stats();
  const color = `#${[dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;

  await Promise.all(
    widths.flatMap((w) => {
      const r = img.clone().resize({ width: w, withoutEnlargement: true });
      return [
        r.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(outDir, `${base}-${w}.avif`)),
        r.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(outDir, `${base}-${w}.webp`)),
        r.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(outDir, `${base}-${w}.jpg`)),
      ];
    })
  );
  return manifestEntry(id, meta, { widths, lqip, color });
}

const prev = existsSync(MANIFEST) ? JSON.parse(await (await import('node:fs/promises')).readFile(MANIFEST, 'utf8')) : {};
function manifestEntry(id, meta, fresh) {
  const widths = fresh?.widths ?? prev[id]?.widths ?? WIDTHS.filter((w) => w <= meta.width);
  return [
    id,
    {
      w: meta.width,
      h: meta.height,
      widths,
      lqip: fresh?.lqip ?? prev[id]?.lqip ?? '',
      color: fresh?.color ?? prev[id]?.color ?? '#141210',
    },
  ];
}

const manifest = {};
let n = 0;
for await (const f of walk(SRC)) {
  const [id, entry] = await build(f);
  manifest[id] = entry;
  n++;
  process.stdout.write(`\r✓ ${n} ${id.padEnd(40)}`);
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\n${n} images → ${path.relative(ROOT, OUT)} · manifest → ${path.relative(ROOT, MANIFEST)}`);
