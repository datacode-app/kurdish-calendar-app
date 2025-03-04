/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Date Utilities Module
 * 
 * This module provides helper functions for formatting and manipulating dates
 * across different calendar systems and locales.
 */

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
  January: "خاکەلێوە",
  February: "گوڵان",
  March: "زەردان",
  April: "پووشپەڕ",
  May: "گەلاوێژ",
  June: "خەرمانان",
  July: "بەران",
  August: "گێزان",
  September: "ساران",
  October: "بەفران",
  November: "ڕێبەندان",
  December: "ڕەشەمە"
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

/**
 * Returns the localized month name for a given month number based on the provided locale
 * 
 * Supports localization for months in different calendar systems:
 * - Gregorian months (default)
 * - Jalali/Persian months (if prefix 'jalali' is specified)
 * - Hijri/Islamic months (if prefix 'hijri' is specified)
 * 
 * @param month - Zero-indexed month number (0-11)
 * @param locale - Locale code (e.g., 'en', 'ku', 'ar', 'fa')
 * @param prefix - Optional prefix to specify calendar system ('jalali', 'hijri') 
 * @returns Localized month name for the specified locale and calendar system
 */
export function getLocalizedMonthName(month: number, locale: string, prefix?: string): string {
  try {
    // Import the translations directly for specific locale
    const translations = require(`../public/locale/${locale}/common.json`);
    
    // Determine which set of month names to use based on the prefix
    let key = 'months';
    if (prefix === 'jalali') {
      key = 'jalaliMonths';
    } else if (prefix === 'hijri') {
      key = 'hijriMonths';
    }
    
    // Return the translated month name from the appropriate object
    return translations[key][month];
  } catch (error) {
    console.error(`Error retrieving month name for month ${month} and locale ${locale}:`, error);
    
    // Fallback to English month names if translation fails
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Return fallback month name
    return monthNames[month];
  }
}

export const getKurdishCountryName = (englishCountry: string): string => {
  return kurdishCountries[englishCountry as keyof typeof kurdishCountries] || englishCountry;
};

/**
 * Formats a date object according to the specified locale and options
 * 
 * @param date - JavaScript Date object to format
 * @param locale - Locale code for formatting (e.g., 'en', 'ku', 'ar', 'fa')
 * @param options - Intl.DateTimeFormatOptions object for controlling format
 * @returns Formatted date string according to locale and options
 */
export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    // Format the date using Intl.DateTimeFormat with provided locale and options
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    
    // Return a simple fallback format if Intl formatting fails
    return date.toDateString();
  }
}

/**
 * Adjusts a date by adding or subtracting days
 * 
 * @param date - Source date to adjust
 * @param days - Number of days to add (positive) or subtract (negative)
 * @returns New Date object with adjusted date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Checks if two dates fall on the same day
 * Compares year, month, and day without considering time
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns Boolean indicating whether dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Determines whether a year is a leap year in the Gregorian calendar
 * 
 * A leap year in the Gregorian calendar is:
 * - Divisible by 4
 * - Not divisible by 100, unless also divisible by 400
 *
 * @param year - Gregorian year to check
 * @returns Boolean indicating whether the year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

/**
 * Gets the number of days in a specific month of a given year
 * Accounts for leap years when calculating days in February
 * 
 * @param year - Gregorian year 
 * @param month - Zero-indexed month number (0-11)
 * @returns Number of days in the specified month
 */
export function getDaysInMonth(year: number, month: number): number {
  // Array of days in each month (for non-leap years)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Adjust February for leap years
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }
  
  return daysInMonth[month];
}

/**
 * Returns the first day of a month as a Date object
 * 
 * @param year - Gregorian year
 * @param month - Zero-indexed month number (0-11)
 * @returns Date object representing the first day of the specified month
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/**
 * Returns a range of dates for a given month
 * Creates an array of Date objects for each day of the specified month
 * 
 * @param year - Gregorian year
 * @param month - Zero-indexed month number (0-11)
 * @returns Array of Date objects for each day in the month
 */
export function getDatesForMonth(year: number, month: number): Date[] {
  const daysInMonth = getDaysInMonth(year, month);
  const dates: Date[] = [];
  
  // Create a Date object for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }
  
  return dates;
}

/**
 * Gets the day of the week for the first day of a month
 * Sunday is 0, Monday is 1, etc.
 * 
 * @param year - Gregorian year
 * @param month - Zero-indexed month number (0-11)
 * @returns Number representing the day of week (0-6)
 */
export function getFirstDayOfWeek(year: number, month: number): number {
  return getFirstDayOfMonth(year, month).getDay();
} 