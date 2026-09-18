/* =====================================================================
   Responsive <picture> from the build manifest (AVIF → WebP → JPG)
   ===================================================================== */
import manifest from '../data/images.json';

const BASE = '/img/';

export function imgMeta(id) { return manifest[id]; }

/**
 * picture(id, { alt, sizes, cls, eager, ratio, pos })
 * returns HTML string
 */
export function picture(id, o = {}) {
  const m = manifest[id];
  if (!m) return `<div class="pic ${o.cls ?? ''}" style="aspect-ratio:${o.ratio ?? '1'}"></div>`;
  const ws = m.widths;
  const set = (ext) => ws.map((w) => `${BASE}${id}-${w}.${ext} ${w}w`).join(', ');
  const largest = ws.at(-1);
  const sizes = o.sizes ?? '(min-width: 64em) 33vw, (min-width: 48em) 50vw, 100vw';
  const loading = o.eager ? 'eager' : 'lazy';
  const fp = o.eager ? 'fetchpriority="high"' : '';
  const style = `--ph:${m.color};--lqip:url(${m.lqip});${o.ratio ? `aspect-ratio:${o.ratio};` : ''}${o.pos ? `--pos:${o.pos};` : ''}`;
  return `<div class="pic ${o.cls ?? ''}" style="${style}">
  <picture>
    <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
    <img src="${BASE}${id}-${largest}.jpg" srcset="${set('jpg')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(o.alt ?? '')}" loading="${loading}" decoding="async" ${fp} data-lqip ${o.pos ? `style="object-position:${o.pos}"` : ''}>
  </picture>
</div>`;
}

/**
 * Art-directed hero: portrait source on phones, landscape on wide screens.
 * hero(portraitId, landscapeId, { pos })
 */
export function hero(portraitId, landscapeId, o = {}) {
  const P = manifest[portraitId], Lm = manifest[landscapeId ?? portraitId];
  if (!P) return '';
  const set = (m, id, ext) => m.widths.map((w) => `${BASE}${id}-${w}.${ext} ${w}w`).join(', ');
  const bp = '(min-width: 48em)';
  const style = `--ph:${P.color};--lqip:url(${P.lqip});${o.pos ? `--pos:${o.pos};` : ''}`;
  return `<div class="pic" style="${style}">
  <picture>
    ${Lm && landscapeId ? `<source media="${bp}" type="image/avif" srcset="${set(Lm, landscapeId, 'avif')}" sizes="100vw">
    <source media="${bp}" type="image/webp" srcset="${set(Lm, landscapeId, 'webp')}" sizes="100vw">
    <source media="${bp}" srcset="${set(Lm, landscapeId, 'jpg')}" sizes="100vw">` : ''}
    <source type="image/avif" srcset="${set(P, portraitId, 'avif')}" sizes="100vw">
    <source type="image/webp" srcset="${set(P, portraitId, 'webp')}" sizes="100vw">
    <img src="${BASE}${portraitId}-${P.widths.at(-1)}.jpg" srcset="${set(P, portraitId, 'jpg')}" sizes="100vw" width="${P.w}" height="${P.h}" alt="" loading="eager" fetchpriority="high" decoding="async" data-lqip ${o.pos ? `style="object-position:${o.pos}"` : ''}>
  </picture>
</div>`;
}

export function src(id, w) {
  const m = manifest[id];
  if (!m) return '';
  const pick = m.widths.find((x) => x >= (w ?? 1280)) ?? m.widths.at(-1);
  return `${BASE}${id}-${pick}.jpg`;
}

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Mark images loaded (fade-in from LQIP) */
export function watchImages(root = document) {
  root.querySelectorAll('.pic img[data-lqip]').forEach((img) => {
    const done = () => { img.classList.add('is-loaded'); img.closest('.pic')?.classList.add('is-loaded'); };
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}
