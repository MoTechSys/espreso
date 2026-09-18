/* =====================================================================
   Motion runtime — parallax · magnetic buttons · tilt · progress · steam
   All passive listeners, rAF-throttled, disabled under prefers-reduced-motion.
   ===================================================================== */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

export function initMotion() {
  if (reduce) return;
  parallax(); progress(); steam(); quickBar(); words();
  if (fine) { magnetic(); tilt(); }
}

/* Hero parallax via CSS var (no layout thrash) */
function parallax() {
  const hero = document.querySelector('.hero'); if (!hero) return;
  let raf;
  const tick = () => { const y = Math.min(scrollY, innerHeight); hero.style.setProperty('--py', y.toFixed(1)); raf = 0; };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick();
}

/* Scroll progress bar */
function progress() {
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  let raf;
  const tick = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', (h > 0 ? scrollY / h : 0).toFixed(4)); raf = 0; };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick();
}

/* Ambient steam particles in hero */
function steam() {
  const hero = document.querySelector('.hero'); if (!hero) return;
  const wrap = document.createElement('div'); wrap.className = 'steam'; wrap.setAttribute('aria-hidden', 'true');
  const n = innerWidth < 768 ? 10 : 18;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.setProperty('--x', `${Math.random() * 100}%`);
    p.style.setProperty('--d', `${10 + Math.random() * 12}s`);
    p.style.setProperty('--delay', `${-Math.random() * 20}s`);
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`);
    p.style.width = p.style.height = `${3 + Math.random() * 5}px`;
    wrap.appendChild(p);
  }
  hero.appendChild(wrap);
}

/* Show sticky quick bar only after the hero scrolls out */
function quickBar() {
  const q = document.querySelector('.quick'); if (!q) return;
  const hero = document.querySelector('.hero');
  if (!hero || !('IntersectionObserver' in window)) { q.classList.add('is-on'); return; }
  new IntersectionObserver((es) => q.classList.toggle('is-on', !es[0].isIntersecting || es[0].intersectionRatio < 0.35), { threshold: [0, 0.35] }).observe(hero);
}

/* Word-by-word reveal on .lede inside .reveal--words (safe: keeps HTML plain text only) */
function words() {
  $$('.reveal--words').forEach((el) => {
    if (el.dataset.split) return; el.dataset.split = '1';
    const text = el.textContent.trim().split(/\s+/);
    el.innerHTML = text.map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');
  });
}

/* Magnetic buttons */
function magnetic() {
  $$('.btn--gold, .btn--ghost').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      b.style.setProperty('--mx', (dx * 0.18).toFixed(1)); b.style.setProperty('--my', (dy * 0.25).toFixed(1));
      b.style.setProperty('--px', `${((e.clientX - r.left) / r.width) * 100}%`); b.style.setProperty('--py2', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', 0); b.style.setProperty('--my', 0); });
  });
}

/* 3D tilt on glass cards */
function tilt() {
  $$('.dish, .branch, .pillar, .quote').forEach((c) => {
    c.classList.add('tilt');
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', ((px - 0.5) * 6).toFixed(2)); c.style.setProperty('--rx', ((0.5 - py) * 6).toFixed(2));
      c.style.setProperty('--px', `${px * 100}%`); c.style.setProperty('--py2', `${py * 100}%`);
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', 0); c.style.setProperty('--ry', 0); });
  });
}
