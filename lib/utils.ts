/**
 * General Utility Functions Module
 * 
 * This module provides common utility functions used throughout the application.
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jalaali from 'jalaali-js';  // Change the import to use the correct package
import { getKurdishDate } from './getKurdishDate';

import moment from 'moment-hijri';

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes efficiently
 * 
 * This function uses clsx to combine class names and twMerge to handle Tailwind class conflicts.
 * It's used throughout the application for dynamic class name generation.
 * 
 * @param inputs - Any number of class name values (strings, objects, arrays, etc.)
 * @returns A merged string of class names with Tailwind conflicts resolved
 * 
 * @example
 * // Basic usage
 * <div className={cn("base-class", condition && "conditional-class")}>
 * 
 * @example
 * // With Tailwind classes that would normally conflict
 * <div className={cn("p-4", props.padding && "p-6")}>
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the appropriate font class based on the locale
 * 
 * Used to apply the correct font family based on the language:
 * - Kurdish (ku): Noto Kufi Arabic
 * - Arabic (ar): Noto Kufi Arabic
 * - Persian (fa): Vazirmatn
 * - English (en): Geist Sans (default)
 * 
 * @param locale - The current locale/language
 * @returns CSS class name for the appropriate font
 * 
 * @example
 * <div className={getFontClass('ar')}>Arabic text</div>
 */
export function getFontClass(locale: string): string {
  switch (locale) {
    case 'ar':
    case 'ku':
      return 'font-notoKufi';
    case 'fa':
      return 'font-vazirmatn';
    default:
      return 'font-sans'; // Geist Sans for English
  }
}

// Kurdish month names in different scripts
const KURDISH_MONTHS = {
  ku: {
    rojhalat: [
      'خاکەلێوە', 'گوڵان', 'جۆزەردان', 'پووشپەڕ', 'گەلاوێژ', 'خەرمانان',
      'ڕەزبەر', 'گەڵاڕێزان', 'سەرماوەز', 'بەفرانبار', 'ڕێبەندان', 'ڕەشەمە'
    ],
    bashur: [
      'کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران',
      'تەممووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'
    ]
  },
  ar: {
    rojhalat: [
      'خاکەلێوە', 'گوڵان', 'جۆزەردان', 'پووشپەڕ', 'گەلاوێژ', 'خەرمانان',
      'ڕەزبەر', 'گەڵاڕێزان', 'سەرماوەز', 'بەفرانبار', 'ڕێبەندان', 'ڕەشەمە'
    ],
    bashur: [
      'کانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
      'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'کانون الأول'
    ]
  },
  fa: {
    rojhalat: [
      'خاکەلێوە', 'گوڵان', 'جۆزەردان', 'پووشپەڕ', 'گەلاوێژ', 'خەرمانان',
      'ڕەزبەر', 'گەڵاڕێزان', 'سەرماوەز', 'بەفرانبار', 'ڕێبەندان', 'ڕەشەمە'
    ],
    bashur: [
      'کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران',
      'تەممووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'
    ]
  },
  en: {
    rojhalat: [
      'Xakeliwe', 'Gulan', 'Cozerdan', 'Pushper', 'Gelawej', 'Xermanan',
      'Rezber', 'Gelarezan', 'Sermawez', 'Befranbar', 'Rebendan', 'Resheme'
    ],
    bashur: [
      'Kanuni Duwem', 'Shubat', 'Azar', 'Nisan', 'Ayar', 'Huzeyran',
      'Temmuz', 'Ab', 'Eylul', 'Teshrini Yekem', 'Teshrini Duwem', 'Kanuni Yekem'
    ]
  }
} as const;

// Add Persian month names
const PERSIAN_MONTHS = {
  fa: [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ],
  en: [
    'Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar',
    'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'
  ]
} as const;

// Arabic/Hijri month names
const HIJRI_MONTHS = {
  ar: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ],
  en: [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
    'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
  ]
} as const;

// Convert Western numerals to Kurdish/Arabic numerals
function toKurdishNumerals(num: number): string {
  const kurdishNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, d => kurdishNums[parseInt(d)]);
}

// Add type for supported locales
type Locale = 'ku' | 'ar' | 'fa' | 'en';
type Calendar = 'rojhalat' | 'bashur' | 'persian' | 'hijri';

// Add interface for Kurdish date
interface KurdishDate {
  kurdishDay: number;
  kurdishMonth: number;
  kurdishYear: number;
  kurdishMonthLatin: string;
}

interface DateFormatOptions {
  timeZone?: string;
}

function isValidLocale(locale: string): locale is Locale {
  return ['ku', 'ar', 'fa', 'en'].includes(locale);
}

// Add timezone constants
const TIMEZONE = {
  ROJHALAT: 'Asia/Tehran',
  BASHUR: 'Asia/Baghdad',
  PERSIAN: 'Asia/Tehran',
  HIJRI: 'Asia/Baghdad' // Default timezone for Hijri
} as const;

// Add result interface for better type safety
interface FormattedDateResult {
  formatted: string;
  isValid: boolean;
}

/**
 * Formats a date according to Rojhalat calendar
 * @param date - The date to format
 * @param locale - The locale to use (ku, ar, fa, en)
 * @param options - Optional timezone configuration
 * @returns Formatted date string
 */
export function formatRojhalatDate(date: Date, locale: string, options: DateFormatOptions = {}): FormattedDateResult {
  try {
    const timeZone = options.timeZone || TIMEZONE.ROJHALAT;
    const localDate = new Date(date.toLocaleString('en-US', { timeZone }));
    
    const kurdishDate = getKurdishDate(localDate);
    // console.log('Kurdish Date:', kurdishDate);
    
    if (!kurdishDate) {
      return { formatted: 'Invalid Date', isValid: false };
    }

    const safeLocale = isValidLocale(locale) ? locale : 'ku';
    
    if (locale !== 'en') {
      const kurdishDay = toKurdishNumerals(kurdishDate.kurdishDay);
      const kurdishYear = toKurdishNumerals(kurdishDate.kurdishYear);
      
      // Use the month name directly from kurdishDate
      const monthName = kurdishDate.kurdishMonth;
      
      // If kurdishDate.kurdishMonth is already the month name, use it directly
      if (typeof monthName === 'string') {
        return { 
          formatted: `${kurdishDay} ${monthName} ${kurdishYear}`,
          isValid: true 
        };
      }
      
      // Otherwise, get it from our month array
      const monthIndex = (Number(monthName) - 1) % 12;
      const monthNameFromArray = KURDISH_MONTHS[safeLocale].rojhalat[monthIndex];

      return { 
        formatted: `${kurdishDay} ${monthNameFromArray} ${kurdishYear}`,
        isValid: true 
      };
    }

    // For English locale
    return { 
      formatted: `${kurdishDate.kurdishDay} ${kurdishDate.kurdishMonthLatin} ${kurdishDate.kurdishYear}`,
      isValid: true 
    };
  } catch (error) {
    console.error('Error formatting Rojhalat date:', error);
    return { formatted: 'Invalid Date', isValid: false };
  }
}

/**
 * Formats a date according to Bashur calendar
 * @param date - The date to format
 * @param locale - The locale to use (ku, ar, fa, en)
 * @param options - Optional timezone configuration
 * @returns Formatted date string
 */
export function formatBashurDate(date: Date, locale: string, options: DateFormatOptions = {}): FormattedDateResult {
  try {
    const timeZone = options.timeZone || TIMEZONE.BASHUR;
    const localDate = new Date(date.toLocaleString('en-US', { timeZone }));
    
    const year = localDate.getFullYear();
    const month = localDate.getMonth();
    const day = localDate.getDate();
    
    if (month < 0 || month > 11) {
      return { formatted: 'Invalid Month', isValid: false };
    }

    const safeLocale = isValidLocale(locale) ? locale : 'ku';
    const monthName = KURDISH_MONTHS[safeLocale]?.bashur?.[month] || 
                     KURDISH_MONTHS.ku.bashur[month];

    if (locale !== 'en') {
      const kurdishDay = toKurdishNumerals(day);
      const kurdishYear = toKurdishNumerals(year);
      return { 
        formatted: `${kurdishDay} ${monthName} ${kurdishYear}`,
        isValid: true 
      };
    }

    return { 
      formatted: `${day} ${monthName} ${year}`,
      isValid: true 
    };
  } catch (error) {
    console.error('Error formatting Bashur date:', error);
    return { formatted: 'Invalid Date', isValid: false };
  }
}

/**
 * Formats a date according to Persian calendar
 * @param date - The date to format
 * @param locale - The locale to use (ku, ar, fa, en)
 * @param options - Optional timezone configuration
 * @returns Formatted date string
 */
export function formatPersianDate(date: Date, locale: string, options: DateFormatOptions = {}): FormattedDateResult {
  try {
    const timeZone = options.timeZone || TIMEZONE.PERSIAN;
    const localDate = new Date(date.toLocaleString('en-US', { timeZone }));
    
    const jalaliDate = jalaali.toJalaali(localDate);
    const year = jalaliDate.jy;
    const month = jalaliDate.jm - 1;
    const day = jalaliDate.jd;

    if (month < 0 || month > 11) {
      return { formatted: 'Invalid Month', isValid: false };
    }

    // Fix: Use 'fa' months for non-English locales
    const monthName = locale === 'en' ? 
      PERSIAN_MONTHS.en[month] : 
      PERSIAN_MONTHS.fa[month];

    if (locale !== 'en') {
      const persianDay = toKurdishNumerals(day);
      const persianYear = toKurdishNumerals(year);
      return { 
        formatted: `${persianDay} ${monthName} ${persianYear}`,
        isValid: true 
      };
    }

    return { 
      formatted: `${day} ${monthName} ${year}`,
      isValid: true 
    };
  } catch (error) {
    console.error('Error converting to Jalali date:', error);
    return { formatted: 'Invalid Date', isValid: false };
  }
}

// Add this function to utils.ts
function getHijriDateFallback(date: Date) {
  const refDate = new Date(2025, 2, 4);
  const refHijri = { year: 1446, month: 8, day: 4 };
  const diffTime = date.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return refHijri;
  const daysInMonths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  let newDay = refHijri.day + diffDays;
  let newMonth = refHijri.month;
  let newYear = refHijri.year;
  while (newDay > daysInMonths[newMonth]) {
    newDay -= daysInMonths[newMonth];
    newMonth++;
    if (newMonth >= 12) {
      newMonth = 0;
      newYear++;
    }
  }
  while (newDay <= 0) {
    newMonth--;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    newDay += daysInMonths[newMonth];
  }
  if (newDay <= 0) newDay = 1;
  if (newDay > 30) newDay = 30;
  return { year: newYear, month: newMonth, day: newDay };
}

/**
 * Formats a date according to Hijri calendar
 * @param date - The date to format
 * @param locale - The locale to use (ku, ar, fa, en)
 * @param options - Optional timezone configuration
 * @returns Formatted date string
 */
export function formatHijriDate(date: Date, locale: string, options: DateFormatOptions = {}): FormattedDateResult {
  try {
    const timeZone = options.timeZone || TIMEZONE.HIJRI;
    const localDate = new Date(date.toLocaleString('en-US', { timeZone }));
    
    const hijriDate = getHijriDateFallback(localDate);
    
    const day = hijriDate.day;
    const month = hijriDate.month; // Already 0-based
    const year = hijriDate.year;

    // Fix: Use 'ar' months for non-English locales
    const monthName = locale === 'en' ? 
      HIJRI_MONTHS.en[month] : 
      HIJRI_MONTHS.ar[month];

    if (locale !== 'en') {
      const hijriDay = toKurdishNumerals(day);
      const hijriYear = toKurdishNumerals(year);
      return { 
        formatted: `${hijriDay} ${monthName} ${hijriYear}`,
        isValid: true 
      };
    }

    return { 
      formatted: `${day} ${monthName} ${year}`,
      isValid: true 
    };
  } catch (error) {
    console.error('Error in formatHijriDate:', error);
    return { formatted: 'Invalid Date', isValid: false };
  }
}

/**
 * Main function to format dates according to different calendar systems
 * @param date - The date to format
 * @param locale - The locale to use (ku, ar, fa, en)
 * @param calendar - The calendar system to use (rojhalat, bashur, persian, hijri)
 * @param options - Optional timezone configuration
 * @returns Formatted date string
 */
export function formatKurdishDate(
  date: Date, 
  locale: string, 
  calendar: Calendar = 'rojhalat',
  options: DateFormatOptions = {}
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  try {
    let result: FormattedDateResult;
    switch (calendar) {
      case 'rojhalat':
        result = formatRojhalatDate(date, locale, options);
        break;
      case 'bashur':
        result = formatBashurDate(date, locale, options);
        break;
      case 'persian':
        result = formatPersianDate(date, locale, options);
        break;
      case 'hijri':
        result = formatHijriDate(date, locale, options);
        break;
      default:
        result = formatRojhalatDate(date, locale, options);
    }
    return result.formatted;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}
