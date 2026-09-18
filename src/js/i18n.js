/* =====================================================================
   i18n — Arabic (default, RTL) · English (LTR)
   ===================================================================== */
export const dict = {
  ar: {
    dir: 'rtl',
    lang_switch: 'EN',
    nav: { home: 'الرئيسية', menu: 'القائمة', story: 'حكايتنا', branches: 'الفروع', gallery: 'الأجواء', contact: 'تواصل' },
    status: { open: 'مفتوح الآن', closed: 'مغلق الآن', opens: 'يفتح', closes: 'يغلق', today: 'اليوم' },
    days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    cta: { menu: 'اكتشف القائمة', order: 'اطلب الآن', whatsapp: 'اطلب عبر واتساب', message: 'راسلنا', directions: 'الاتجاهات', call: 'اتصال', follow: 'تابعنا على إنستغرام', open_ig: 'افتح على إنستغرام', more: 'المزيد', all: 'الكل', visit: 'زورنا', story: 'اقرأ حكايتنا', branches: 'اكتشف الفروع' },
    stats: { branches: 'فروع', followers: 'متابع', posts: 'منشور', since: 'منذ' },
    misc: { price_soon: 'السعر في الفرع', indicative: 'المواعيد تقريبية — تأكد من الفرع الأقرب.', from_ig: 'من إنستغرام', hours: 'مواعيد العمل', rights: 'جميع الحقوق محفوظة', made: 'صُنع بحب في الحديدة', wa_msg: 'أهلاً إسبرسو كوفي، حابب أطلب ☕', wa_item: 'أهلاً إسبرسو كوفي، حابب أطلب: ', latest: 'آخر المنشورات', tags: { cold: 'بارد', hot: 'حار', fruity: 'فاكهي', sparkling: 'فوّار', strong: 'قوي', milk: 'حليب', icon: 'أيقوني' } },
    title: { home: 'إسبرسو كوفي | Espresso Coffee — مصنع الرَّوَقان · الحديدة', menu: 'القائمة — إسبرسو كوفي', story: 'حكايتنا — إسبرسو كوفي', branches: 'الفروع — إسبرسو كوفي', gallery: 'الأجواء — إسبرسو كوفي', contact: 'تواصل — إسبرسو كوفي', 404: 'لا تفقد الأمل — إسبرسو كوفي' },
  },
  en: {
    dir: 'ltr',
    lang_switch: 'عربي',
    nav: { home: 'Home', menu: 'Menu', story: 'Story', branches: 'Branches', gallery: 'Gallery', contact: 'Contact' },
    status: { open: 'Open now', closed: 'Closed', opens: 'Opens', closes: 'Closes', today: 'Today' },
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    cta: { menu: 'Explore the menu', order: 'Order now', whatsapp: 'Order on WhatsApp', message: 'Message us', directions: 'Directions', call: 'Call', follow: 'Follow on Instagram', open_ig: 'Open on Instagram', more: 'More', all: 'All', visit: 'Visit us', story: 'Read our story', branches: 'Discover branches' },
    stats: { branches: 'Branches', followers: 'Followers', posts: 'Posts', since: 'Since' },
    misc: { price_soon: 'Price in store', indicative: 'Hours are indicative — confirm with your nearest branch.', from_ig: 'From Instagram', hours: 'Opening hours', rights: 'All rights reserved', made: 'Made with love in Al Hudaydah', wa_msg: "Hi Espresso Coffee, I'd like to order ☕", wa_item: "Hi Espresso Coffee, I'd like to order: ", latest: 'Latest posts', tags: { cold: 'Cold', hot: 'Hot', fruity: 'Fruity', sparkling: 'Sparkling', strong: 'Strong', milk: 'Milk', icon: 'Icon' } },
    title: { home: 'Espresso Coffee | إسبرسو كوفي — Where the mood is brewed · Al Hudaydah', menu: 'Menu — Espresso Coffee', story: 'Our Story — Espresso Coffee', branches: 'Branches — Espresso Coffee', gallery: 'Gallery — Espresso Coffee', contact: 'Contact — Espresso Coffee', 404: "Don't lose hope — Espresso Coffee" },
  },
};

const KEY = 'espresso_lang';

export function detectLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'ar' || q === 'en') { localStorage.setItem(KEY, q); return q; }
  const s = localStorage.getItem(KEY);
  if (s === 'ar' || s === 'en') return s;
  return 'ar';
}

export let lang = detectLang();
export const other = () => (lang === 'ar' ? 'en' : 'ar');
export const L = (obj) => (obj && typeof obj === 'object' && (lang in obj) ? obj[lang] : obj);

/** t('cta.order') */
export function t(path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), dict[lang]) ?? path.split('.').reduce((o, k) => (o ? o[k] : undefined), dict.ar) ?? path;
}

export function switchLang() {
  const n = other();
  localStorage.setItem(KEY, n);
  const u = new URL(location.href);
  u.searchParams.set('lang', n);
  location.href = u.toString();
}

/** Apply data-i18n="cta.order" and data-i18n-attr="aria-label:cta.order" */
export function applyStatic(root = document) {
  document.documentElement.lang = lang;
  document.documentElement.dir = dict[lang].dir;
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((pair) => { const [attr, key] = pair.split(':'); el.setAttribute(attr.trim(), t(key.trim())); });
  });
  root.querySelectorAll('[data-ar][data-en]').forEach((el) => { el.textContent = el.dataset[lang]; });
  root.querySelectorAll('[data-ar-html][data-en-html]').forEach((el) => { el.innerHTML = el.dataset[`${lang}Html`]; });
}

export const fmtNum = (n) => Number(n ?? 0).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
