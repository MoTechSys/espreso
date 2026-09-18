#!/usr/bin/env node
/**
 * Smart prep — curated crops / enhancements for hero-grade photos.
 * Reads assets/source/**, writes derived variants into assets/source/derived/** (then build-images picks them up).
 *
 * Each recipe: { from, to, crop: {left, top, width, height} | 'auto', enhance }
 * Crops were chosen after pixel-level inspection of each photo (subject bbox, horizon, brightness).
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SRC = path.join(ROOT, 'assets/source');
const OUT = path.join(SRC, 'derived');

const lux = (img) => img.modulate({ brightness: 1.03, saturation: 1.08 }).linear(1.06, -6).sharpen({ sigma: 0.8, m1: 0.6, m2: 0.4 });

const recipes = [
  /* --- Hodeidah Land kiosk (576×1024 portraits) --- */
  // HERO mobile: dusk kiosk, palm frond top-right — keep full portrait, gentle warm lift
  { from: 'kiosk/kiosk-dusk-palm.jpg', to: 'hero/kiosk-portrait.jpg', crop: null, fn: lux },
  // HERO desktop: landscape crop around kiosk (sign to base), 16:9
  { from: 'kiosk/kiosk-dusk-palm.jpg', to: 'hero/kiosk-landscape.jpg', crop: { left: 0, top: 330, width: 576, height: 324 }, fn: lux },
  // Night kiosk canopy — atmospheric; crop out top dark palm half → 4:5
  { from: 'kiosk/kiosk-night-canopy.jpg', to: 'kiosk/night-glow.jpg', crop: { left: 0, top: 430, width: 576, height: 594 }, fn: (i) => i.modulate({ brightness: 1.08, saturation: 1.1 }).linear(1.05, -4) },
  // Night palm — square crop centred on kiosk for gallery
  { from: 'kiosk/kiosk-night-palm.jpg', to: 'kiosk/night-square.jpg', crop: { left: 0, top: 300, width: 576, height: 576 }, fn: (i) => i.modulate({ brightness: 1.06 }) },
  // Dusk front — the counter close-up 4:3 (sign + barista)
  { from: 'kiosk/kiosk-dusk-front.jpg', to: 'kiosk/front-counter.jpg', crop: { left: 30, top: 400, width: 516, height: 387 }, fn: lux },
  // Dusk bench — full portrait for branches card (tree canopy is beautiful)
  { from: 'kiosk/kiosk-dusk-bench.jpg', to: 'kiosk/dusk-portrait.jpg', crop: { left: 0, top: 120, width: 576, height: 820 }, fn: lux },
  // Park wide — the sky/tree/kiosk vista; 4:5 removing lower dirt path
  { from: 'kiosk/kiosk-park-wide.jpg', to: 'kiosk/park-vista.jpg', crop: { left: 0, top: 60, width: 576, height: 720 }, fn: lux },
  // Drinks basket — 960×640; crop the two cups tightly → 4:3, boost the blue/green pop
  { from: 'kiosk/drinks-basket.jpg', to: 'drinks/basket-duo.jpg', crop: { left: 120, top: 40, width: 760, height: 570 }, fn: (i) => i.modulate({ saturation: 1.15, brightness: 1.02 }).sharpen() },
  // Cart logo sign — 825×1024; portrait crop on the round sign
  { from: 'kiosk/cart-logo-sign.jpg', to: 'brand/cart-sign.jpg', crop: { left: 60, top: 180, width: 700, height: 700 }, fn: lux },
  /* --- existing IG photos: better framing --- */
  // barista (1024×768) had white bars top/bottom → crop to the photo
  { from: 'ig/barista.jpg', to: 'ig/barista-clean.jpg', crop: { left: 60, top: 40, width: 904, height: 640 }, fn: lux },
  // peach iced tea — 4:5 crop removing excess floor
  { from: 'ig/peach-iced-tea.jpg', to: 'ig/peach-portrait.jpg', crop: { left: 0, top: 0, width: 1024, height: 1280 }, fn: lux },
  // mazen interview — chest-up 1:1 for the story page
  { from: 'ig/mazen-interview.jpg', to: 'ig/mazen-square.jpg', crop: { left: 0, top: 380, width: 1080, height: 1080 }, fn: lux },
];

await mkdir(OUT, { recursive: true });
for (const r of recipes) {
  const outPath = path.join(OUT, r.to);
  await mkdir(path.dirname(outPath), { recursive: true });
  let img = sharp(path.join(SRC, r.from));
  const meta = await img.metadata();
  if (r.crop) {
    const c = { ...r.crop };
    c.width = Math.min(c.width, meta.width - c.left); c.height = Math.min(c.height, meta.height - c.top);
    img = img.extract(c);
  }
  if (r.fn) img = r.fn(img);
  await img.jpeg({ quality: 94 }).toFile(outPath);
  const m2 = await sharp(outPath).metadata();
  console.log(`✓ ${r.to.padEnd(30)} ${m2.width}×${m2.height}`);
}
