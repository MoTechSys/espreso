import '../styles/main.css';
import { boot, $, $$, lang, t, L, fmtNum, icons, tileHTML } from './app.js';
import { brand, menu, menuCategories, branches, gallery, igFeed, testimonials, founder } from './content.js';
import { picture, hero, src, esc, watchImages } from './images.js';
import { initMotion } from './motion.js';
import { waLink } from './app.js';

const page = document.body.dataset.page;

/* ---------- shared renderers ---------- */
const tagList = (tags) => `<div class="dish__tags">${(tags ?? []).map((x) => `<span>${t(`misc.tags.${x}`)}</span>`).join('')}</div>`;

function dishCard(d, i = 0) {
  return `<article class="dish glass glass--hover reveal" style="--d:${i % 6}">
    <div class="dish__pic">${picture(d.img, { alt: L(d.name), sizes: '(min-width: 64em) 30vw, (min-width: 40em) 45vw, 80vw', ratio: '4 / 3' })}
      ${d.badge ? `<span class="badge ${d.ig ? 'badge--ig' : ''} dish__badge">${d.ig ? icons.instagram : ''}${L(d.badge)}</span>` : ''}
    </div>
    <div class="dish__body">
      <div class="dish__row"><h3>${L(d.name)}</h3><span class="dish__price">${d.price || t('misc.price_soon')}</span></div>
      <p>${L(d.desc)}</p>
      <div class="dish__foot">${tagList(d.tags)}<a class="btn btn--ghost btn--sm" data-link="wa" data-msg="${esc(L(d.name))}"><span data-icon="whatsapp"></span><span data-label>${t('cta.order')}</span></a></div>
    </div>
  </article>`;
}

function branchCard(b, i, featured = false) {
  return `<article id="${b.id}" class="branch glass glass--hover reveal ${featured && b.featured ? 'branch--featured' : ''}" style="--d:${i}">
    <div class="branch__pic pic-wrap" style="position:relative">${picture(b.img, { alt: L(b.name), sizes: '(min-width: 64em) 33vw, 100vw', ratio: '4 / 3' })}<span class="branch__num">0${i + 1}</span></div>
    <div class="branch__body">
      <span class="branch__role">${L(b.role)}</span>
      <h3>${L(b.name)}</h3>
      <p>${L(b.desc)}</p>
      <span class="branch__row">${icons.pin}<span>${L(b.address)}</span></span>
      <div class="branch__actions">
        <a href="${b.maps}" target="_blank" rel="noopener" class="btn btn--gold btn--sm">${icons.pin}<span>${t('cta.directions')}</span></a>
        <a class="btn btn--ghost btn--sm" data-link="wa" data-msg="${esc(L(b.name))}"><span data-icon="whatsapp"></span><span data-label>${t('cta.order')}</span></a>
      </div>
    </div>
  </article>`;
}

function heroTitle(el, lines) {
  if (!el) return;
  el.innerHTML = lines.map((l, i) => `<span class="line"><span style="--i:${i}" class="${i === lines.length - 1 ? 'text-gold' : ''}">${l}</span></span>`).join('');
}

function setHero(sel, id, pos, landscapeId) {
  const el = $(sel); if (!el) return;
  el.innerHTML = hero(id, landscapeId, { pos });
}

function splits() {
  $$('[data-pic]').forEach((el) => {
    const tag = el.dataset[`tag${lang === 'ar' ? 'Ar' : 'En'}`];
    el.innerHTML = `${picture(el.dataset.pic, { alt: el.dataset[`${lang}Alt`] ?? '', sizes: '(min-width: 60em) 45vw, 100vw', ratio: el.dataset.ratio })}<span class="split__frame"></span>${tag ? `<span class="badge badge--dark split__tag">${tag}</span>` : ''}`;
  });
  $$('[data-band]').forEach((el) => { el.insertAdjacentHTML('afterbegin', picture(el.dataset.band, { alt: '', sizes: '100vw' })); });
}

function marquee() {
  const el = $('[data-marquee]'); if (!el) return;
  const words = lang === 'ar'
    ? ['مصنع الرَّوَقان', 'ذوق', 'مزاج', 'رَوَقان', 'آيس تي خوخ', 'موهيتو إسبريسو', 'صوت القهوة', 'لا تفقد الأمل', 'الحديدة']
    : ['Where the mood is brewed', 'Taste', 'Mood', 'Serenity', 'Peach Iced Tea', 'Mojito Espresso', 'Sound of Coffee', "Don't lose hope", 'Al Hudaydah'];
  const item = words.map((w) => `<span class="marquee__item">${w}<i></i></span>`).join('');
  el.innerHTML = item + item;
}

/* ---------- pages ---------- */
const pages = {
  home() {
    setHero('[data-hero-media]', 'derived/kiosk/night-glow', '50% 45%', 'kiosk/kiosk-night-canopy');
    heroTitle($('[data-hero-title]'), lang === 'ar' ? ['صوت القهوة', 'يبدأ من هنا.'] : ['The sound of coffee', 'starts here.']);
    marquee(); splits();
    const sig = $('[data-signature]'); if (sig) sig.innerHTML = menu.filter((m) => m.cat === 'signature').map(dishCard).join('');
    const br = $('[data-branches]'); if (br) br.innerHTML = branches.map((b, i) => branchCard(b, i)).join('');
    const g = $('[data-gallery-home]'); if (g) g.innerHTML = gallery.slice(0, 8).map((it, i) => tileHTML(it, 'home', picture(it.img, { alt: L(it.cap), sizes: '(min-width: 64em) 33vw, 50vw', pos: it.pos }))).join('');
    const ts = $('[data-testimonials]'); if (ts) ts.innerHTML = testimonials.map((x, i) => `<figure class="glass pillar reveal" style="--d:${i}"><span class="pillar__icon">${icons.star}</span><blockquote style="margin-top:1rem;font-family:var(--f-display);font-size:var(--fs-md);color:var(--c-bone)">${L(x)}</blockquote><figcaption style="margin-top:.8rem;color:var(--c-gold);font-size:var(--fs-xs)">${L(x.by)}</figcaption></figure>`).join('');
  },

  menu() {
    setHero('[data-hero-media]', 'derived/ig/barista-clean', '50% 30%');
    heroTitle($('[data-hero-title]'), lang === 'ar' ? ['قائمة', 'إسبرسو كوفي'] : ['The Espresso', 'Coffee menu']);
    const tabs = $('[data-tabs]'), grid = $('[data-menu-grid]'); if (!tabs || !grid) return;
    const cats = [{ id: 'all', label: { ar: t('cta.all'), en: t('cta.all') } }, ...menuCategories];
    tabs.innerHTML = cats.map((c, i) => `<button type="button" role="tab" class="tab" aria-selected="${i === 0}" data-cat="${c.id}">${L(c.label)}</button>`).join('');
    const render = (cat) => {
      grid.innerHTML = menu.filter((m) => cat === 'all' || m.cat === cat).map(dishCard).join('');
      $$('.dish', grid).forEach((d, i) => setTimeout(() => d.classList.add('is-in'), 40 * i));
      $$('[data-link="wa"]', grid).forEach((a) => { a.href = waLink(`${t('misc.wa_item')}${a.dataset.msg}`); a.target = '_blank'; });
      $$('[data-icon]', grid).forEach((el) => { el.innerHTML = icons[el.dataset.icon]; });
      watchImages(grid);
    };
    tabs.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (!b) return; $$('.tab', tabs).forEach((x) => x.setAttribute('aria-selected', x === b)); render(b.dataset.cat); });
    render('all');
    const hot = $('[data-menu-list]'); if (hot) hot.innerHTML = menu.filter((m) => m.cat !== 'signature').map((m) => `<li><span class="n">${L(m.name)}<small>${L(m.desc)}</small></span><span class="p">${m.price || t('misc.price_soon')}</span></li>`).join('');
  },

  story() {
    setHero('[data-hero-media]', 'ig/mazen-interview', '50% 20%', 'derived/ig/mazen-square');
    heroTitle($('[data-hero-title]'), lang === 'ar' ? ['بدأنا من فكرة…', 'فإلى أين تصل الفكرة؟'] : ['We started from an idea…', 'how far can it go?']);
    splits();
    const q = $('[data-quotes]'); if (q) q.innerHTML = founder.quotes.map((x, i) => `<blockquote class="quote glass reveal" style="--d:${i}"><p class="quote__text" style="font-size:var(--fs-lg)">${L(x)}</p><footer class="quote__by">— ${L(founder.name)}</footer></blockquote>`).join('');
    const g = $('[data-gallery-story]'); if (g) g.innerHTML = gallery.filter((x) => /mazen|interview|despair/.test(x.img)).map((it) => tileHTML(it, 'story', picture(it.img, { alt: L(it.cap), sizes: '33vw' }))).join('');
  },

  branches() {
    setHero('[data-hero-media]', 'derived/kiosk/dusk-portrait', '50% 55%', 'derived/hero/kiosk-landscape');
    heroTitle($('[data-hero-title]'), lang === 'ar' ? ['ثلاثة أمزجة،', 'مدينة واحدة.'] : ['Three moods,', 'one city.']);
    const el = $('[data-branches]'); if (el) el.innerHTML = branches.map((b, i) => branchCard(b, i, true)).join('');
  },

  gallery() {
    setHero('[data-hero-media]', 'derived/kiosk/park-vista', '50% 60%', 'kiosk/kiosk-park-wide');
    heroTitle($('[data-hero-title]'), lang === 'ar' ? ['الأجواء', 'كما هي.'] : ['The ambience,', 'as it is.']);
    const g = $('[data-gallery-all]'); if (g) g.innerHTML = gallery.map((it) => tileHTML(it, 'all', picture(it.img, { alt: L(it.cap), sizes: '(min-width: 64em) 33vw, 50vw', pos: it.pos }))).join('');
    const f = $('[data-igfeed]'); if (f) {
      f.innerHTML = igFeed.filter((p) => p.img).map((p) => `<a href="${p.url}" target="_blank" rel="noopener" class="tile ${p.video ? 'is-video' : ''} reveal reveal--scale" aria-label="${esc(p.caption.split('\n')[0])}">${picture(p.img, { alt: p.caption.split('\n')[0], sizes: '(min-width: 48em) 16vw, 33vw', ratio: '1' })}<div class="tile__over"><p>${esc(p.caption.split('\n')[0])}</p><div class="tile__stats">${p.likes ? `<span>${icons.heart}${fmtNum(p.likes)}</span>` : ''}${p.comments ? `<span>${icons.comment}${fmtNum(p.comments)}</span>` : ''}</div></div></a>`).join('');
    }
  },

  contact() {
    setHero('[data-hero-media]', 'derived/kiosk/night-square', '50% 50%', 'kiosk/kiosk-night-palm');
    heroTitle($('[data-hero-title]'), lang === 'ar' ? ['نسمعك،', 'ونسكب لك.'] : ['We hear you,', 'we pour for you.']);
    const el = $('[data-branches-compact]'); if (el) el.innerHTML = branches.map((b, i) => `<li class="glass pillar reveal" style="--d:${i}"><span class="pillar__icon">${icons.pin}</span><h3>${L(b.name)}</h3><p>${L(b.address)}</p><a href="${b.maps}" target="_blank" rel="noopener" class="btn btn--link" style="margin-top:.8rem">${t('cta.directions')} ${icons.arrow}</a></li>`).join('');
  },

  404() {
    const p = $('[data-404-pic]'); if (p) p.innerHTML = picture('ig/dont-lose-hope', { alt: "Don't lose hope", eager: true, sizes: '18rem', ratio: '1' });
  },
};

boot(pages[page]);
initMotion();
