/* =====================================================================
   ESPRESSO COFFEE — Content (single source of truth)
   Built from espresso-pack (brand-info.md · posts-index.md · data.json)
   + live Instagram sync (src/data/instagram-live.json)
   ===================================================================== */
import live from '../data/instagram-live.json';

export const brand = {
  handle: 'espre__sso',
  nameAr: 'إسبرسو كوفي',
  nameEn: 'ESPRESSO COFFEE',
  taglineAr: 'مصنع الرَّوَقان',
  taglineEn: 'Where the mood is brewed',
  philosophyAr: 'ذوق. مزاج. رَوَقان.',
  philosophyEn: 'Taste. Mood. Serenity.',
  instagram: 'https://www.instagram.com/espre__sso',
  bioLink: 'https://2u.pw/62eIgdM',
  followers: live.profile?.followers ?? 1408,
  posts: live.profile?.posts_count ?? 102,
  founded: 2021,
  city: { ar: 'الحديدة', en: 'Al Hudaydah' },
  country: { ar: 'اليمن', en: 'Yemen' },
  hashtags: ['#مصنع_الروقان', '#الحديدة', '#hodiedah_land', '#كافيهات_اليمن', '#شباب_يصنعون_الاثر'],
};

/* ⚠️ Fill from owner: phone / WhatsApp. Until then the UI falls back to Instagram DM. */
export const contact = {
  phone: '',
  whatsapp: '',
  email: '',
  mapsSearch: 'https://www.google.com/maps/search/?api=1&query=Espresso+Coffee+Al+Hudaydah',
};

export const hours = {
  tz: 'Asia/Aden',
  verified: false,
  /* day 0 = Sunday. close may pass midnight */
  schedule: [
    { day: 6, open: '07:00', close: '00:00' },
    { day: 0, open: '07:00', close: '00:00' },
    { day: 1, open: '07:00', close: '00:00' },
    { day: 2, open: '07:00', close: '00:00' },
    { day: 3, open: '07:00', close: '00:00' },
    { day: 4, open: '07:00', close: '01:00' },
    { day: 5, open: '15:00', close: '01:00' },
  ],
};

export const founder = {
  name: { ar: 'مازن عبده', en: 'Mazen Abdu' },
  title: { ar: 'الشريك المؤسس', en: 'Co-founder' },
  background: { ar: 'خريج تقنية معلومات — بدأ المشروع وهو طالب في الجامعة', en: 'IT graduate — started the project while still a university student' },
  handle: 'mazen_abdu_11',
  img: 'ig/mazen-interview',
  quotes: [
    { ar: 'تتوكل على الله، تعمل بالأسباب، وتنطلق.', en: 'Trust in God, do the work, and go.' },
    { ar: 'الحكاية لم تنتهِ عند نقطة اليأس.', en: 'The story did not end at the point of despair.' },
    { ar: 'بدأنا من فكرة… فإلى أين يمكن أن تصل الفكرة؟', en: 'We started from an idea… how far can an idea go?' },
  ],
  media: {
    program: { ar: 'شباب يصنعون الأثر', en: 'Youth Making Impact' },
    by: { ar: 'جمعية أيادي المستقبل الاجتماعية التنموية', en: 'Ayadi Al-Mustaqbal Social Development Association' },
    occasion: { ar: 'اليوم الدولي للشباب · 12 أغسطس', en: 'International Youth Day · 12 August' },
  },
};

export const branches = [
  {
    id: 'matraq',
    name: { ar: 'المَطراق', en: 'Al-Matraq' },
    role: { ar: 'الفرع الأصلي — حيث بدأت الحكاية', en: 'The original — where the story began' },
    address: { ar: 'شارع المطراق، الحديدة', en: 'Al-Matraq Street, Al Hudaydah' },
    desc: { ar: 'أول كوب صُبّ هنا. زبائن الحي، طقوس الصباح، وإسبريسو مضبوط على مزاج المطراق.', en: 'The first cup was poured here. Neighbourhood regulars, morning rituals, espresso dialled to the Matraq mood.' },
    img: 'ig/interior-logo-wall',
    maps: 'https://www.google.com/maps/search/?api=1&query=Espresso+Coffee+Al+Matraq+Al+Hudaydah',
    featured: true,
  },
  {
    id: 'uloom',
    name: { ar: 'جامعة العلوم', en: 'University of Science' },
    role: { ar: 'فرع الطلاب — مساحة للدراسة والروقان', en: 'The campus branch — study, sip, unwind' },
    address: { ar: 'جامعة العلوم والتكنولوجيا، الحديدة', en: 'University of Science & Technology, Al Hudaydah' },
    desc: { ar: 'يوم جامعي ❣️ — قهوة تسهر معك قبل الامتحان، وطاولات تصلح للمذاكرة والضحك.', en: 'University day ❣️ — coffee that stays up with you before the exam, tables made for study and laughter.' },
    img: 'ig/uloom-sign',
    maps: 'https://www.google.com/maps/search/?api=1&query=University+of+Science+and+Technology+Al+Hudaydah',
  },
  {
    id: 'land',
    name: { ar: 'حديقة حديدة لاند', en: 'Hodeidah Land Park' },
    role: { ar: 'الفرع الترفيهي — للعائلات والسهرات', en: 'The park branch — families & late nights' },
    address: { ar: 'حديقة حديدة لاند، الحديدة', en: 'Hodeidah Land Park, Al Hudaydah' },
    desc: { ar: 'كشك مضيء وسط الحديقة، مشروبات مثلجة، وسهرة تمتد على مزاجك. #hodiedah_land', en: 'A glowing kiosk in the park, iced drinks, and evenings that stretch as long as your mood. #hodiedah_land' },
    img: 'ig/interior-night',
    maps: 'https://www.google.com/maps/search/?api=1&query=Hodeidah+Land+Park',
  },
];

/* Menu — signature items are verified from Instagram; prices to be confirmed by owner */
export const menuCategories = [
  { id: 'signature', label: { ar: 'التوقيع', en: 'Signature' } },
  { id: 'espresso', label: { ar: 'إسبريسو', en: 'Espresso Bar' } },
  { id: 'cold', label: { ar: 'مثلّجات', en: 'Iced & Cold' } },
  { id: 'tea', label: { ar: 'شاي وموهيتو', en: 'Tea & Mojito' } },
];

export const menu = [
  { id: 'peach-iced-tea', cat: 'signature', img: 'ig/peach-iced-tea', ig: true, badge: { ar: 'الأيقوني', en: 'Iconic' },
    name: { ar: 'آيس تي خوخ', en: 'Peach Iced Tea' },
    desc: { ar: 'خطتنا الواضحة لمواجهة الحر ☀️ — شاي مثلّج بنكهة الخوخ، منعش، فاكهي، يعدّل مزاجك.', en: 'Our clear plan against the heat ☀️ — peach-infused iced tea, bright, fruity, mood-fixing.' },
    tags: ['cold', 'fruity'], price: '' },
  { id: 'mojito-espresso', cat: 'signature', img: 'ig/interior-drinks', ig: true, badge: { ar: 'الغني عن التعريف', en: 'Needs no intro' },
    name: { ar: 'موهيتو إسبريسو', en: 'Mojito Espresso' },
    desc: { ar: 'نعناع وليمون وصودا على شوت إسبريسو — تركيبة إسبرسو كوفي التي لا تُقلَّد.', en: 'Mint, lime and soda over a shot of espresso — the Espresso Coffee combination nobody copies.' },
    tags: ['cold', 'sparkling'], price: '' },
  { id: 'sound-of-coffee', cat: 'signature', img: 'ig/sound-of-coffee', ig: true, badge: { ar: 'صوت القهوة', en: 'Sound of Coffee' },
    name: { ar: 'قهوة مثلّجة', en: 'Iced Coffee' },
    desc: { ar: 'صوت القهوة… شوت إسبريسو مزدوج على ثلج، قوام نقي وقفلة داكنة.', en: 'The sound of coffee — double espresso over ice, clean body, dark finish.' },
    tags: ['cold', 'strong'], price: '' },
  { id: 'dont-lose-hope', cat: 'signature', img: 'ig/dont-lose-hope', ig: true, badge: { ar: 'لا تفقد الأمل', en: "Don't lose hope" },
    name: { ar: 'فنجان «لا تفقد الأمل»', en: '"Don\'t Lose Hope" Cup' },
    desc: { ar: 'إسبريسو يُقدَّم في فنجاننا الأيقوني — خريطة اليمن بحواف محروقة ورسالة لا تنتهي.', en: 'Espresso served in our iconic cup — a burnt-edge map of Yemen and a message that never ends.' },
    tags: ['hot', 'icon'], price: '' },

  { id: 'espresso', cat: 'espresso', img: 'stock/espresso-crema', badge: null,
    name: { ar: 'إسبريسو', en: 'Espresso' },
    desc: { ar: 'شوت مركّز، كريمة كثيفة، وشوكولاتة داكنة في القفلة.', en: 'Concentrated shot, thick crema, dark-chocolate finish.' }, tags: ['hot'], price: '' },
  { id: 'americano', cat: 'espresso', img: 'stock/portafilter', badge: null,
    name: { ar: 'أمريكانو', en: 'Americano' },
    desc: { ar: 'إسبريسو مزدوج مع ماء ساخن — نقاء بلا حليب.', en: 'Double espresso lengthened with hot water — pure, no milk.' }, tags: ['hot'], price: '' },
  { id: 'flat-white', cat: 'espresso', img: 'stock/latte-leaf', badge: null,
    name: { ar: 'فلات وايت', en: 'Flat White' },
    desc: { ar: 'رغوة حريرية، حلاوة كراميل، ريستريتو مزدوج.', en: 'Silky micro-foam, caramel sweetness, double ristretto.' }, tags: ['hot', 'milk'], price: '' },
  { id: 'cappuccino', cat: 'espresso', img: 'stock/cappuccino-heart', badge: null,
    name: { ar: 'كابتشينو', en: 'Cappuccino' },
    desc: { ar: 'رغوة خفيفة، رشة كاكاو، عبير زهري.', en: 'Airy foam, cocoa dusting, floral aroma.' }, tags: ['hot', 'milk'], price: '' },
  { id: 'spanish-latte', cat: 'espresso', img: 'stock/latte-swan', badge: { ar: 'مفضّل الضيوف', en: 'Guest favourite' },
    name: { ar: 'سبانيش لاتيه', en: 'Spanish Latte' },
    desc: { ar: 'حلاوة الحليب المكثف، قوام حريري، قاعدة قوية.', en: 'Condensed-milk sweetness, silky texture, bold base.' }, tags: ['hot', 'milk'], price: '' },

  { id: 'iced-latte', cat: 'cold', img: 'stock/espresso-flatlay', badge: null,
    name: { ar: 'آيس لاتيه', en: 'Iced Latte' },
    desc: { ar: 'إسبريسو وحليب بارد على ثلج — خفيف ومنعش.', en: 'Espresso and cold milk over ice — light and refreshing.' }, tags: ['cold', 'milk'], price: '' },
  { id: 'iced-spanish', cat: 'cold', img: 'stock/beans-macro', badge: null,
    name: { ar: 'آيس سبانيش', en: 'Iced Spanish Latte' },
    desc: { ar: 'النسخة المثلّجة من الأكثر طلباً.', en: 'The iced version of the most requested.' }, tags: ['cold', 'milk'], price: '' },
  { id: 'cold-brew', cat: 'cold', img: 'stock/hero-beans', badge: null,
    name: { ar: 'كولد برو', en: 'Cold Brew' },
    desc: { ar: 'نقع بطيء 18 ساعة — حلاوة طبيعية وحموضة ناعمة.', en: '18-hour slow steep — natural sweetness, soft acidity.' }, tags: ['cold', 'strong'], price: '' },

  { id: 'mojito-classic', cat: 'tea', img: 'ig/interior-sound-of-coffee', badge: null,
    name: { ar: 'موهيتو كلاسيك', en: 'Classic Mojito' },
    desc: { ar: 'نعناع، ليمون، صودا وثلج مجروش.', en: 'Mint, lime, soda and crushed ice.' }, tags: ['cold', 'sparkling'], price: '' },
  { id: 'iced-tea-lemon', cat: 'tea', img: 'ig/barista', badge: null,
    name: { ar: 'آيس تي ليمون', en: 'Lemon Iced Tea' },
    desc: { ar: 'شاي أسود مثلّج بالليمون الطازج.', en: 'Black tea, iced, with fresh lemon.' }, tags: ['cold'], price: '' },
  { id: 'karak', cat: 'tea', img: 'stock/espresso-crema', badge: null,
    name: { ar: 'شاي كرك', en: 'Karak Tea' },
    desc: { ar: 'شاي بالحليب والهيل على الطريقة الخليجية.', en: 'Milk tea with cardamom, Gulf style.' }, tags: ['hot', 'milk'], price: '' },
];

/* Gallery — real Instagram content (from pack + live sync) */
export const gallery = [
  { img: 'ig/peach-iced-tea', size: 'big', ig: 'https://www.instagram.com/p/Db5upBgoG4F/', likes: 24, comments: 7,
    cap: { ar: 'ايش خطتكم لمواجهة الحر؟ ☀️ خطتنا واضحة 🤎 ايس تي خوخ يعدل مزاجك', en: "What's your plan against the heat? Ours is clear — peach iced tea fixes your mood" } },
  { img: 'ig/barista', size: 'wide', ig: 'https://www.instagram.com/espre__sso', likes: 299, comments: 56,
    cap: { ar: '𝙚𝙨𝙥𝙧𝙚𝙨𝙨𝙤... 🤍✨ — الأعلى تفاعلاً على الحساب', en: '𝙚𝙨𝙥𝙧𝙚𝙨𝙨𝙤... 🤍✨ — most-loved post on the account' } },
  { img: 'ig/interior-sound-of-coffee', size: 'tall', ig: 'https://www.instagram.com/reel/DZX1k4jgJ-3/', likes: 75, comments: 5, video: true,
    cap: { ar: 'صوت القهوة — إسبريسو كوفي', en: 'The sound of coffee — Espresso Coffee' } },
  { img: 'ig/dont-lose-hope', size: '', ig: 'https://www.instagram.com/espre__sso',
    cap: { ar: 'فنجان «لا تفقد الأمل» — Don\'t lose hope', en: "The 'Don't lose hope' cup" } },
  { img: 'ig/mazen-despair', size: 'tall', ig: 'https://www.instagram.com/reel/DcEhHZUSaoB/', likes: 125, comments: 36, video: true,
    cap: { ar: 'وصلت إلى نقطة اليأس… — شباب يصنعون الأثر', en: 'I reached the point of despair… — Youth Making Impact' } },
  { img: 'ig/interior-drinks', size: '', ig: 'https://www.instagram.com/espre__sso', likes: 3, comments: 55,
    cap: { ar: 'كؤوس بشعار إسبرسو أمام الكاونتر', en: 'Espresso cups at the counter' } },
  { img: 'ig/hodeidah-land-sign', size: 'wide', ig: 'https://www.instagram.com/espre__sso', likes: 152, comments: 23, video: true,
    cap: { ar: '#hodiedah_land #espresso — فرع حديقة حديدة لاند', en: '#hodiedah_land — Hodeidah Land Park branch' } },
  { img: 'ig/uloom-sign', size: '', ig: 'https://www.instagram.com/reel/Dcs7NU9NAN5/', likes: 71, comments: 13, video: true,
    cap: { ar: 'يوم جامعي ❣️ جامعة العلوم. الحديدة 📍', en: 'University day ❣️ University of Science, Al Hudaydah 📍' } },
  { img: 'ig/interior-logo-wall', size: '', ig: 'https://www.instagram.com/espre__sso', likes: 44, comments: 11, video: true,
    cap: { ar: 'ESPRESSO COFFEE ☕️🤎 فروع حديقة حديدة لاند', en: 'ESPRESSO COFFEE ☕️🤎 Hodeidah Land branches' } },
  { img: 'ig/mazen-interview', size: 'tall', ig: 'https://www.instagram.com/reel/DcHCnHxSXID/', likes: 61, comments: 30, video: true,
    cap: { ar: 'الحكاية لم تنتهِ عند نقطة اليأس — الجزء الثاني من لقاء مازن عبده', en: 'The story did not end at despair — part two with Mazen Abdu' } },
  { img: 'ig/interior-night', size: '', ig: 'https://www.instagram.com/espre__sso', likes: 46, comments: 6, video: true,
    cap: { ar: 'الكشك ليلاً — حديدة لاند', en: 'The kiosk at night — Hodeidah Land' } },
  { img: 'ig/interior-wide', size: 'wide', ig: 'https://www.instagram.com/espre__sso', likes: 42, comments: 1, video: true,
    cap: { ar: 'داخل الفرع — الشعار، الرفوف، النباتات', en: 'Inside — the logo wall, shelves, plants' } },
];

/* Latest Instagram posts (live-synced by tools/sync-instagram.mjs) */
export const igFeed = (live.posts ?? []).map((p) => ({
  url: p.url,
  video: p.is_video,
  caption: p.caption ?? '',
  likes: p.likes,
  comments: p.comments,
  img: p.local ?? null,
}));

export const testimonials = [
  { ar: 'المكان يريّح والقهوة مضبوطة، صار مقرّنا اليومي بعد المحاضرات.', en: 'The place is calming and the coffee is dialled-in. It became our daily spot after lectures.', by: { ar: 'طالبة — فرع جامعة العلوم', en: 'Student — University branch' } },
  { ar: 'آيس تي الخوخ فعلاً يعدّل المزاج… تجربة تستاهل.', en: 'The peach iced tea really fixes the mood… worth the trip.', by: { ar: 'زائر — فرع المطراق', en: 'Guest — Al-Matraq branch' } },
  { ar: 'سهرة في حديدة لاند بدون إسبرسو كوفي ما تكمل.', en: 'A night in Hodeidah Land is not complete without Espresso Coffee.', by: { ar: 'عائلة — فرع حديدة لاند', en: 'Family — Hodeidah Land branch' } },
];
