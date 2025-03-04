/**
 * Kurdish Date Utility Module
 * 
 * This module provides functionality for converting Gregorian dates to Kurdish dates,
 * which is based on the Solar Hijri (Persian) calendar but with Kurdish month names.
 * The Kurdish New Year (Newroz) starts on March 21st of the Gregorian calendar.
 */

/**
 * Return type for Kurdish date calculations
 * Contains both the formatted date strings and individual components
 */
export interface KurdishDateResult {
  /** Formatted Gregorian date string */
  gregorianDate: string;
  /** Formatted Kurdish date string in Arabic script */
  kurdishDate: string;
  /** Formatted Kurdish date string in Latin script */
  kurdishDateLatin: string;
  /** Kurdish year (typically Gregorian year + 700) */
  kurdishYear: number;
  /** Kurdish month name in Arabic script */
  kurdishMonth: string;
  /** Kurdish month name in Latin script */
  kurdishMonthLatin: string;
  /** Kurdish day of month */
  kurdishDay: number;
}

/**
 * Kurdish month names in Arabic script (Sorani dialect)
 * Used in Eastern Kurdistan (Rojhelat) and follows the Persian calendar structure
 */
export enum KurdishMonthSorani {
  /** First month: equivalent to late March and most of April */
  XAKELIWE = 'خاکەلێوە',
  /** Second month: equivalent to late April and most of May */
  GULAN = 'گوڵان',
  /** Third month: equivalent to late May and most of June */
  COZERDAN = 'جۆزەردان',
  /** Fourth month: equivalent to late June and most of July */
  PUSHPER = 'پووشپەڕ',
  /** Fifth month: equivalent to late July and most of August */
  GELAWEJ = 'گەلاوێژ',
  /** Sixth month: equivalent to late August and most of September */
  XERMANAN = 'خەرمانان',
  /** Seventh month: equivalent to late September and most of October */
  REZBER = 'ڕەزبەر',
  /** Eighth month: equivalent to late October and most of November */
  GELAREZAN = 'گەڵاڕێزان',
  /** Ninth month: equivalent to late November and most of December */
  SERMAWEZ = 'سەرماوەز',
  /** Tenth month: equivalent to late December and most of January */
  BEFRANBAR = 'بەفرانبار',
  /** Eleventh month: equivalent to late January and most of February */
  REBENDAN = 'ڕێبەندان',
  /** Twelfth month: equivalent to late February and most of March */
  RESHEME = 'ڕەشەمە'
}

/**
 * Kurdish month names in Latin script
 * Transliteration of the Sorani Kurdish month names using Latin alphabet
 */
export enum KurdishMonthLatin {
  /** First month in Latin script */
  XAKELIWE = 'Xakelêwe',
  /** Second month in Latin script */
  GULAN = 'Gulan',
  /** Third month in Latin script */
  COZERDAN = 'Cozerdan',
  /** Fourth month in Latin script */
  PUSHPER = 'Pûşper',
  /** Fifth month in Latin script */
  GELAWEJ = 'Gelawêj',
  /** Sixth month in Latin script */
  XERMANAN = 'Xermanan',
  /** Seventh month in Latin script */
  REZBER = 'Rezber',
  /** Eighth month in Latin script */
  GELAREZAN = 'Gelarêzan',
  /** Ninth month in Latin script */
  SERMAWEZ = 'Sermawez',
  /** Tenth month in Latin script */
  BEFRANBAR = 'Befranbar',
  /** Eleventh month in Latin script */
  REBENDAN = 'Rêbendan',
  /** Twelfth month in Latin script */
  RESHEME = 'Reşeme'
}

/**
 * Calculates the Kurdish date from a given Gregorian date
 * 
 * This function converts a Gregorian date to the corresponding Kurdish date,
 * taking into account that the Kurdish New Year (Newroz) begins on March 21.
 * The Kurdish calendar is based on the Solar Hijri calendar, with years typically
 * being 700 years ahead of the Gregorian calendar (e.g., 2024 CE = 2724 Kurdish Era).
 * 
 * The conversion algorithm handles the offset between calendar systems and 
 * returns both formatted strings and individual date components.
 * 
 * @param date - JavaScript Date object to convert (defaults to current date if not provided)
 * @returns Object containing both Gregorian and Kurdish date information
 */
export function getKurdishDate(date: Date = new Date()): KurdishDateResult {
  // Format the Gregorian date
  const gregorianDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Array of Kurdish Sorani month names in Arabic script
  const kurdishMonths: string[] = Object.values(KurdishMonthSorani);
  
  // Array of Kurdish month names in Latin script
  const kurdishMonthsLatin: string[] = Object.values(KurdishMonthLatin);
  
  // Extract Gregorian date components
  const gregorianYear: number = date.getFullYear();
  const gregorianMonth: number = date.getMonth(); // 0-based (0 = January)
  const gregorianDay: number = date.getDate();
  
  // Variables to hold calculated Kurdish date components
  let kurdishYear: number;
  let monthIndex: number;
  let day: number;
  
  // Calculate Kurdish date based on Gregorian date
  // Kurdish New Year starts on March 21 (Newroz)
  if (gregorianMonth > 2 || (gregorianMonth === 2 && gregorianDay >= 21)) {
    // After March 21 - in the current Kurdish year
    kurdishYear = gregorianYear + 700;
    
    // Calculate month index and day based on Gregorian date
    if (gregorianMonth === 2 && gregorianDay >= 21) { // March 21-31
      monthIndex = 0;
      day = gregorianDay - 20; // Starts from March 21
    } else if (gregorianMonth === 3) { // April
      if (gregorianDay <= 20) {
        monthIndex = 0;
        day = gregorianDay + 11; // March has 31 days
      } else {
        monthIndex = 1;
        day = gregorianDay - 20;
      }
    } else if (gregorianMonth === 4) { // May
      if (gregorianDay <= 21) {
        monthIndex = 1;
        day = gregorianDay + 10; // April has 30 days
      } else {
        monthIndex = 2;
        day = gregorianDay - 21;
      }
    } else if (gregorianMonth === 5) { // June
      if (gregorianDay <= 21) {
        monthIndex = 2;
        day = gregorianDay + 10; // May has 31 days
      } else {
        monthIndex = 3;
        day = gregorianDay - 21;
      }
    } else if (gregorianMonth === 6) { // July
      if (gregorianDay <= 22) {
        monthIndex = 3;
        day = gregorianDay + 9; // June has 30 days
      } else {
        monthIndex = 4;
        day = gregorianDay - 22;
      }
    } else if (gregorianMonth === 7) { // August
      if (gregorianDay <= 22) {
        monthIndex = 4;
        day = gregorianDay + 9; // July has 31 days
      } else {
        monthIndex = 5;
        day = gregorianDay - 22;
      }
    } else if (gregorianMonth === 8) { // September
      if (gregorianDay <= 22) {
        monthIndex = 5;
        day = gregorianDay + 9; // August has 31 days
      } else {
        monthIndex = 6;
        day = gregorianDay - 22;
      }
    } else if (gregorianMonth === 9) { // October
      if (gregorianDay <= 22) {
        monthIndex = 6;
        day = gregorianDay + 8; // September has 30 days
      } else {
        monthIndex = 7;
        day = gregorianDay - 22;
      }
    } else if (gregorianMonth === 10) { // November
      if (gregorianDay <= 21) {
        monthIndex = 7;
        day = gregorianDay + 9; // October has 31 days
      } else {
        monthIndex = 8;
        day = gregorianDay - 21;
      }
    } else if (gregorianMonth === 11) { // December
      if (gregorianDay <= 21) {
        monthIndex = 8;
        day = gregorianDay + 9; // November has 30 days
      } else {
        monthIndex = 9;
        day = gregorianDay - 21;
      }
    } else {
      // This should never happen as we're already handling all months
      // after March, but TypeScript needs all paths to be covered
      monthIndex = 0;
      day = 1;
    }
  } else {
    // Before March 21 - still in the previous Kurdish year
    kurdishYear = gregorianYear + 699;
    
    if (gregorianMonth === 0) { // January
      if (gregorianDay <= 20) {
        monthIndex = 9;
        day = gregorianDay + 11; // December has 31 days
      } else {
        monthIndex = 10;
        day = gregorianDay - 20;
      }
    } else if (gregorianMonth === 1) { // February
      if (gregorianDay <= 19) {
        monthIndex = 10;
        day = gregorianDay + 11; // January has 31 days
      } else {
        monthIndex = 11;
        day = gregorianDay - 19;
      }
    } else { // March before the 21st
      monthIndex = 11;
      day = gregorianDay + 9; // February has 28/29 days
    }
  }
  
  // Construct and return the result object with all date components
  return {
    gregorianDate,
    kurdishDate: `${day} ${kurdishMonths[monthIndex]} ${kurdishYear}`,
    kurdishDateLatin: `${day} ${kurdishMonthsLatin[monthIndex]} ${kurdishYear}`,
    kurdishYear,
    kurdishMonth: kurdishMonths[monthIndex],
    kurdishMonthLatin: kurdishMonthsLatin[monthIndex],
    kurdishDay: day
  };
}
