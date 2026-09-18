/* =====================================================================
   App runtime — shared across all pages
   header · drawer · status · links · reveal · lightbox · quick bar · glow
   ===================================================================== */
import { brand, contact, hours, gallery } from './content.js';
import { lang, t, L, switchLang, applyStatic, fmtNum } from './i18n.js';
import { icons } from './icons.js';
import { watchImages, src, esc } from './images.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- Contact helpers ---------- */
const digits = (s) => (s ?? '').replace(/\D/g, '');
export const hasWa = () => digits(contact.whatsapp).length > 6;
export const hasPhone = () => digits(contact.phone).length > 6;
export const waLink = (msg = t('misc.wa_msg')) => hasWa() ? `https://wa.me/${digits(contact.whatsapp)}?text=${encodeURIComponent(msg)}` : `https://ig.me/m/${brand.handle}`;
export const callLink = () => (hasPhone() ? `tel:${contact.phone}` : brand.instagram);

function wireLinks() {
  $$('[data-link="wa"]').forEach((a) => {
    a.href = waLink(a.dataset.msg ? `${t('misc.wa_item')}${a.dataset.msg}` : undefined);
    a.target = '_blank'; a.rel = 'noopener';
    if (!hasWa()) { const s = $('[data-label]', a) ?? $('span', a); if (s) s.textContent = t('cta.message'); const i = $('svg', a); if (i) i.outerHTML = icons.instagram; }
  });
  $$('[data-link="call"]').forEach((a) => {
    a.href = callLink();
    if (!hasPhone()) { a.target = '_blank'; a.rel = 'noopener'; const s = $('span', a); if (s) s.textContent = 'Instagram'; const i = $('svg', a); if (i) i.outerHTML = icons.instagram; }
  });
  $$('[data-link="maps"]').forEach((a) => { a.href = contact.mapsSearch; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-link="ig"]').forEach((a) => { a.href = brand.instagram; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-icon]').forEach((el) => { el.innerHTML = icons[el.dataset.icon] ?? ''; });
  $$('[data-stat]').forEach((el) => { el.textContent = fmtNum(el.dataset.stat === 'branches' ? 3 : brand[el.dataset.stat]); });
}

/* ---------- Open/closed status ---------- */
function nowInTz() {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: hours.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const g = (k) => parts.find((p) => p.type === k)?.value;
    let h = parseInt(g('hour'), 10); if (h === 24) h = 0;
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: h * 60 + parseInt(g('minute'), 10) };
  } catch { const d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
}
const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
export const fmtTime = (s) => {
  const [h, m] = s.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: '2-digit' });
};
export function openState() {
  const { day, min } = nowInTz();
  const today = hours.schedule.find((s) => s.day === day);
  const prev = hours.schedule.find((s) => s.day === (day + 6) % 7);
  if (prev) { const c = toMin(prev.close); if (c < toMin(prev.open) && min < c) return { open: true, until: prev.close }; }
  if (!today) return { open: false };
  const o = toMin(today.open), c = toMin(today.close);
  const overnight = c <= o;
  if (min >= o && (overnight || min < c)) return { open: true, until: today.close };
  return { open: false, next: today.open, today, day };
}
function renderStatus() {
  const st = openState();
  $$('[data-status]').forEach((el) => {
    const dot = $('.status__dot', el), txt = $('[data-status-text]', el);
    if (dot) dot.classList.toggle('is-closed', !st.open);
    if (txt) txt.textContent = st.open ? `${t('status.open')} · ${t('status.closes')} ${fmtTime(st.until)}` : `${t('status.closed')}${st.next ? ` · ${t('status.opens')} ${fmtTime(st.next)}` : ''}`;
  });
}
export function renderHours(el) {
  if (!el) return;
  const { day } = nowInTz();
  const order = [6, 0, 1, 2, 3, 4, 5];
  el.innerHTML = order.map((d) => {
    const s = hours.schedule.find((x) => x.day === d);
    return `<li class="${d === day ? 'is-today' : ''}"><span class="d" data-today="${t('status.today')}">${t('days')[d]}</span><span class="t num">${s ? `${fmtTime(s.open)} – ${fmtTime(s.close)}` : '—'}</span></li>`;
  }).join('');
}

/* ---------- Header ---------- */
function header() {
  const h = $('.header'); if (!h) return;
  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    h.classList.toggle('is-scrolled', y > 24);
    h.classList.toggle('is-hidden', y > 400 && y > last && !document.body.classList.contains('drawer-open'));
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const page = document.body.dataset.page;
  $$('.nav a, .drawer a').forEach((a) => { if (a.dataset.page === page) a.setAttribute('aria-current', 'page'); });

  const burger = $('.burger'), drawer = $('.drawer');
  burger?.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    drawer?.classList.toggle('is-open', open);
    document.body.classList.toggle('drawer-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.drawer a').forEach((a, i) => { a.style.setProperty('--i', i); a.addEventListener('click', () => burger?.click()); });
  $$('[data-lang-toggle]').forEach((b) => { b.textContent = t('lang_switch'); b.addEventListener('click', switchLang); });
}

/* ---------- Scroll reveal ---------- */
function reveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
}

/* ---------- Lightbox ---------- */
let lbItems = [], lbIdx = 0;
function lightbox() {
  const lb = $('.lightbox'); if (!lb) return;
  const img = $('img', lb), cap = $('.lightbox__cap p', lb), igA = $('.lightbox__cap a', lb);
  const show = (i) => {
    lbIdx = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIdx];
    img.src = it.src; img.alt = it.alt ?? '';
    cap.textContent = it.alt ?? '';
    if (it.href) { igA.href = it.href; igA.hidden = false; } else igA.hidden = true;
  };
  const open = (items, i) => { lbItems = items; show(i); lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; $('.lightbox__close', lb).focus(); };
  const close = () => { lb.classList.remove('is-open'); document.body.style.overflow = ''; };
  $('.lightbox__close', lb).addEventListener('click', close);
  $('.lightbox__prev', lb).addEventListener('click', () => show(lbIdx - 1));
  $('.lightbox__next', lb).addEventListener('click', () => show(lbIdx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => { if (!lb.classList.contains('is-open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(lbIdx + (lang === 'ar' ? 1 : -1)); if (e.key === 'ArrowRight') show(lbIdx + (lang === 'ar' ? -1 : 1)); });
  let x0 = 0; lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(lbIdx + (dx > 0 ? -1 : 1)); });

  document.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-lb]'); if (!tile) return;
    e.preventDefault();
    const group = tile.dataset.lb;
    const tiles = $$(`[data-lb="${group}"]`);
    const items = tiles.map((tt) => ({ src: tt.dataset.src, alt: tt.dataset.alt, href: tt.dataset.href }));
    open(items, tiles.indexOf(tile));
  });
}

/* ---------- Cursor glow (desktop) ---------- */
function glow() {
  if (!matchMedia('(hover:hover) and (min-width:64em)').matches) return;
  const g = document.createElement('div'); g.className = 'glow'; document.body.appendChild(g);
  let raf; addEventListener('pointermove', (e) => { g.classList.add('is-on'); cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { g.style.left = `${e.clientX}px`; g.style.top = `${e.clientY}px`; }); }, { passive: true });
}

/* ---------- Preloader ---------- */
function loader() {
  const l = $('.loader'); if (!l) return;
  const done = () => { l.classList.add('is-done'); setTimeout(() => l.remove(), 800); };
  if (sessionStorage.getItem('espresso_seen')) { l.remove(); return; }
  sessionStorage.setItem('espresso_seen', '1');
  addEventListener('load', () => setTimeout(done, 500));
  setTimeout(done, 2800);
}

/* ---------- Page transition ---------- */
function transitions() {
  const veil = document.createElement('div'); veil.className = 'veil'; document.body.appendChild(veil);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || a.target === '_blank' || u.pathname === location.pathname || a.hasAttribute('download') || e.metaKey || e.ctrlKey) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault(); veil.classList.add('is-out');
    setTimeout(() => { location.href = u.href; }, 480);
  });
}

/* ---------- Counter animation ---------- */
function counters() {
  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count); if (!target) return;
    const io = new IntersectionObserver((es) => { if (!es[0].isIntersecting) return; io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (now) => { const p = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - p, 3); el.textContent = fmtNum(Math.round(target * e)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

/* ---------- Gallery tile helper (shared by home + gallery pages) ---------- */
export function tileHTML(item, group, picHTML) {
  const stats = (item.likes || item.comments) ? `<div class="tile__stats">${item.likes ? `<span>${icons.heart}${fmtNum(item.likes)}</span>` : ''}${item.comments ? `<span>${icons.comment}${fmtNum(item.comments)}</span>` : ''}</div>` : '';
  return `<a href="${item.ig ?? '#'}" class="tile tile--${item.size ?? ''} ${item.video ? 'is-video' : ''} reveal reveal--scale" data-lb="${group}" data-src="${src(item.img, 1280)}" data-alt="${esc(L(item.cap) ?? '')}" data-href="${item.ig ?? ''}" aria-label="${esc(L(item.cap) ?? '')}">
    ${picHTML}
    <span class="tile__ig">${item.video ? icons.play : icons.instagram}</span>
    <div class="tile__over"><p>${esc(L(item.cap) ?? '')}</p>${stats}</div>
  </a>`;
}

/* ---------- Boot ---------- */
export function boot(pageInit) {
  applyStatic();
  document.title = t(`title.${document.body.dataset.page ?? 'home'}`);
  const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
  header(); loader(); transitions(); glow();
  pageInit?.();
  wireLinks(); renderStatus(); setInterval(renderStatus, 60_000);
  renderHours($('[data-hours]'));
  reveal(); lightbox(); counters(); watchImages();
  if ($('.quick')) document.body.classList.add('has-quick');
}

export { $, $$, lang, t, L, fmtNum, icons, gallery };
