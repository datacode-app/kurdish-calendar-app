export const kurdishDays = {
  Sunday: "یەکشەممە",
  Monday: "دووشەممە",
  Tuesday: "سێشەممە",
  Wednesday: "چوارشەممە",
  Thursday: "پێنجشەممە",
  Friday: "هەینی",
  Saturday: "شەممە"
};

export const arabicDays = {
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت"
};

export const persianDays = {
  Sunday: "یکشنبه",
  Monday: "دوشنبه",
  Tuesday: "سه‌شنبه",
  Wednesday: "چهارشنبه",
  Thursday: "پنجشنبه",
  Friday: "جمعه",
  Saturday: "شنبه"
};

export const kurdishMonths = {
  January: "کانوونی دووەم",
  February: "شوبات",
  March: "ئازار",
  April: "نیسان",
  May: "ئایار",
  June: "حوزەیران",
  July: "تەمموز",
  August: "ئاب",
  September: "ئەیلوول",
  October: "تشرینی یەکەم",
  November: "تشرینی دووەم",
  December: "کانوونی یەکەم"
};

export const arabicMonths = {
  January: "يناير",
  February: "فبراير",
  March: "مارس",
  April: "أبريل",
  May: "مايو",
  June: "يونيو",
  July: "يوليو",
  August: "أغسطس",
  September: "سبتمبر",
  October: "أكتوبر",
  November: "نوفمبر",
  December: "ديسمبر"
};

export const persianMonths = {
  January: "فروردین",
  February: "اردیبهشت",
  March: "خرداد",
  April: "تیر",
  May: "مرداد",
  June: "شهریور",
  July: "مهر",
  August: "آبان",
  September: "آذر",
  October: "دی",
  November: "بهمن",
  December: "اسفند"
};

export const kurdishCountries = {
  "Iran": "ڕۆژهەڵات",
  "Iraq": "باشوور",
  "Syria": "ڕۆژئاوا",
  "Turkey": "باکوور",
  "Kurdistan": "کوردستان",
  "Afghanistan": "ئەفغانستان",
  "Armenia": "ئەرمەنستان",
  "Azerbaijan": "ئازەربایجان",
  "Georgia": "گورجستان",
  "Lebanon": "لوبنان",
  "Palestine": "فەلەستین",
  "Israel": "ئیسرائیل",
  "Jordan": "ئوردن",
  "Saudi Arabia": "عەرەبستانی سعودی",
  "Kuwait": "کوەیت",
  "Bahrain": "بەحرەین",
  "Qatar": "قەتەر",
  "UAE": "ئیمارات",
  "Oman": "عومان",
  "Yemen": "یەمەن"
};

export const getLocalizedDayName = (englishDay: string, locale: string): string => {
  switch (locale) {
    case 'ku':
      return kurdishDays[englishDay as keyof typeof kurdishDays] || englishDay;
    case 'ar':
      return arabicDays[englishDay as keyof typeof arabicDays] || englishDay;
    case 'fa':
      return persianDays[englishDay as keyof typeof persianDays] || englishDay;
    default:
      return englishDay;
  }
};

export const getLocalizedMonthName = (englishMonth: string, locale: string): string => {
  switch (locale) {
    case 'ku':
      return kurdishMonths[englishMonth as keyof typeof kurdishMonths] || englishMonth;
    case 'ar':
      return arabicMonths[englishMonth as keyof typeof arabicMonths] || englishMonth;
    case 'fa':
      return persianMonths[englishMonth as keyof typeof persianMonths] || englishMonth;
    default:
      return englishMonth;
  }
};

export const getKurdishCountryName = (englishCountry: string): string => {
  return kurdishCountries[englishCountry as keyof typeof kurdishCountries] || englishCountry;
}; 