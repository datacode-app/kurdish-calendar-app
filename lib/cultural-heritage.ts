import type { CulturalHeritageEntry } from './webmcp';

export const CULTURAL_HERITAGE: CulturalHeritageEntry[] = [
  {
    id: 'nawroz',
    title: { en: 'Nawroz', ku: 'نەورۆز', ar: 'نوروز', fa: 'نوروز' },
    summary: {
      en: 'A spring new year celebration shared across Kurdish communities and carried by families around the world.',
      ku: 'جەژنی ساڵی نوێی بەهارە کە لە کۆمەڵگە کوردییەکاندا هاوبەشە و خێزانەکان لە جیهاندا دەیپارێزن.',
      ar: 'احتفال ربيعي بالسنة الجديدة تشترك فيه المجتمعات الكردية وتحمله العائلات حول العالم.',
      fa: 'جشن سال نوی بهاری که در جوامع کرد مشترک است و خانواده‌ها آن را در سراسر جهان حفظ می‌کنند.',
    },
    regions: ['all-regions', 'diaspora'],
    themes: ['new-year', 'spring', 'music', 'dance', 'family-memory'],
    preservationPrompts: {
      en: ['Record how your family celebrates Nawroz.', 'Document a song, food, garment, or local custom with permission.'],
      ku: ['تۆمار بکە خێزانەکەت چۆن نەورۆز دەگێڕێت.', 'بە ڕەزامەندی گۆرانی، خواردن، جلوبەرگ یان نەریتێکی ناوخۆیی تۆمار بکە.'],
      ar: ['سجل كيف تحتفل عائلتك بنوروز.', 'وثّق أغنية أو طعاماً أو زياً أو عادة محلية بعد أخذ الإذن.'],
      fa: ['ثبت کنید خانواده‌تان نوروز را چگونه جشن می‌گیرد.', 'با اجازه، یک ترانه، خوراک، پوشاک یا رسم محلی را مستند کنید.'],
    },
    sources: [
      { label: 'UNESCO Intangible Cultural Heritage — Nawrouz', url: 'https://ich.unesco.org/en/RL/00282' },
      { label: 'Kurdish Calendar event data', url: 'https://github.com/datacode-app/kurdish-calendar-app/blob/production/public/data/holidays.json' },
    ],
  },
  {
    id: 'kurdish-clothing-day',
    title: { en: 'Kurdish Clothing Day', ku: 'ڕۆژی جلوبەرگی کوردی', ar: 'يوم الزي الكردي', fa: 'روز پوشش کردی' },
    summary: {
      en: 'A calendar occasion for sharing regional garments, names, craft knowledge, and the memories attached to them.',
      ku: 'بۆنەیەکی ساڵنامەیی بۆ هاوبەشکردنی جلوبەرگی ناوچەیی، ناوەکان، زانیاری دەستی و بیرەوەرییە پەیوەستەکان.',
      ar: 'مناسبة تقويمية لمشاركة الأزياء الإقليمية وأسمائها ومعارف صناعتها والذكريات المرتبطة بها.',
      fa: 'مناسبتی تقویمی برای به‌اشتراک‌گذاری پوشاک منطقه‌ای، نام‌ها، دانش ساخت و خاطرات وابسته به آن‌ها.',
    },
    regions: ['bashur', 'bakur', 'rojhelat', 'rojava', 'diaspora'],
    themes: ['clothing', 'craft', 'family-memory'],
    preservationPrompts: {
      en: ['Photograph a garment only with the owner’s permission.', 'Record its local name, region, maker, and family story.'],
      ku: ['تەنها بە ڕەزامەندی خاوەنەکە وێنەی جلوبەرگێک بگرە.', 'ناوی ناوخۆیی، ناوچە، دروستکەر و چیرۆکی خێزانی تۆمار بکە.'],
      ar: ['صوّر الزي بعد موافقة صاحبه فقط.', 'سجل اسمه المحلي ومنطقته وصانعه وقصته العائلية.'],
      fa: ['فقط با اجازه صاحب لباس از آن عکس بگیرید.', 'نام محلی، منطقه، سازنده و داستان خانوادگی آن را ثبت کنید.'],
    },
    sources: [
      { label: 'Kurdish Calendar event data', url: 'https://github.com/datacode-app/kurdish-calendar-app/blob/production/public/data/holidays.json' },
    ],
  },
  {
    id: 'kurdish-language-memory',
    title: { en: 'Kurdish language memory', ku: 'بیرەوەری زمانی کوردی', ar: 'ذاكرة اللغة الكردية', fa: 'حافظه زبان کردی' },
    summary: {
      en: 'A preservation practice for recording words, sayings, songs, and pronunciation across Kurdish varieties and generations.',
      ku: 'ڕێگایەک بۆ پاراستنی وشە، پەند، گۆرانی و شێوازی دەربڕین لە نێوان شێوەزار و نەوە کوردییەکاندا.',
      ar: 'ممارسة لحفظ الكلمات والأمثال والأغاني والنطق عبر التنوعات الكردية والأجيال.',
      fa: 'روشی برای حفظ واژه‌ها، مثل‌ها، ترانه‌ها و تلفظ در گونه‌های کردی و نسل‌ها.',
    },
    regions: ['all-regions', 'diaspora'],
    themes: ['language', 'oral-history', 'song', 'family-memory'],
    preservationPrompts: {
      en: ['Ask an elder for a word or saying they want younger generations to remember.', 'Record the variety, place, meaning, and preferred spelling with consent.'],
      ku: ['لە کەسێکی بەتەمەن بپرسە کام وشە یان پەندە دەیەوێت نەوەی نوێ بیپارێزێت.', 'بە ڕەزامەندی شێوەزار، شوێن، واتا و نووسینی پەسەندکراو تۆمار بکە.'],
      ar: ['اسأل شخصاً كبيراً عن كلمة أو مثل يريد أن تتذكره الأجيال الجديدة.', 'سجل التنوع اللغوي والمكان والمعنى والتهجئة المفضلة بعد الموافقة.'],
      fa: ['از یک بزرگ‌تر واژه یا گفته‌ای را بپرسید که می‌خواهد نسل جوان به یاد بسپارد.', 'با رضایت، گونه زبانی، مکان، معنا و املای ترجیحی را ثبت کنید.'],
    },
    sources: [
      { label: 'UNESCO — International Mother Language Day', url: 'https://www.unesco.org/en/days/mother-language' },
      { label: 'UNESCO Convention for the Safeguarding of Intangible Cultural Heritage', url: 'https://ich.unesco.org/en/convention' },
    ],
  },
  {
    id: 'diaspora-family-archive',
    title: { en: 'Diaspora family archive', ku: 'ئەرشیفی خێزانی دیاسپۆرا', ar: 'أرشيف العائلة في المهجر', fa: 'آرشیو خانوادگی دیاسپورا' },
    summary: {
      en: 'A consent-first kit for connecting Kurdish family memories, places, dates, and language across countries.',
      ku: 'کیتێکی ڕەزامەندی-پێشەوە بۆ پەیوەستکردنی بیرەوەری، شوێن، بەروار و زمانی خێزانە کوردییەکان لە وڵاتانی جیاوازدا.',
      ar: 'حزمة تبدأ بالموافقة لربط ذكريات العائلات الكردية وأماكنها وتواريخها ولغتها عبر البلدان.',
      fa: 'بسته‌ای رضایت‌محور برای پیوند خاطرات، مکان‌ها، تاریخ‌ها و زبان خانواده‌های کرد در کشورهای مختلف.',
    },
    regions: ['diaspora'],
    themes: ['migration', 'oral-history', 'family-memory', 'language'],
    preservationPrompts: {
      en: ['Choose what must remain private before recording.', 'Capture who may access the memory and how the contributor wants to be credited.'],
      ku: ['پێش تۆمارکردن دیاری بکە چی دەبێت تایبەت بمێنێتەوە.', 'تۆمار بکە کێ مافی دەستگەیشتنی هەیە و بەشداربوو چۆن دەیەوێت ناوی ببرێت.'],
      ar: ['حدد ما يجب أن يبقى خاصاً قبل التسجيل.', 'سجل من يمكنه الوصول وكيف يريد المساهم أن يُنسب العمل إليه.'],
      fa: ['پیش از ضبط مشخص کنید چه چیزی باید خصوصی بماند.', 'ثبت کنید چه کسی دسترسی دارد و مشارکت‌کننده چگونه می‌خواهد نامش ذکر شود.'],
    },
    sources: [
      { label: 'UNESCO Convention for the Safeguarding of Intangible Cultural Heritage', url: 'https://ich.unesco.org/en/convention' },
    ],
  },
];
