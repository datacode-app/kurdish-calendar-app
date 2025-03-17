/**
 * Kurdish Date Utility Module
 * 
 * This module provides functionality for converting Gregorian dates to Kurdish dates,
 * which is based on the Solar Hijri (Persian) calendar but with Kurdish month names.
 * The Kurdish New Year (Newroz) starts on March 21st of the Gregorian calendar.
 */

import moment from 'moment-jalaali';
import { jalaali } from './jalaali';

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
 * For Rojhalat calendar, we use Tehran's timezone (UTC+3:30) and Jalali calendar.
 * 
 * @param date - JavaScript Date object to convert (defaults to current date if not provided)
 * @returns Object containing both Gregorian and Kurdish date information
 */
export function getKurdishDate(date: Date = new Date()): KurdishDateResult {
  // Convert to Tehran time for Rojhalat calendar
  const tehranDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
  
  // Format the Gregorian date
  const gregorianDate = tehranDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Array of Kurdish Sorani month names in Arabic script
  const kurdishMonths: string[] = Object.values(KurdishMonthSorani);
  
  // Array of Kurdish month names in Latin script
  const kurdishMonthsLatin: string[] = Object.values(KurdishMonthLatin);
  
  // Use moment-jalaali for accurate Persian calendar conversion
  const m = moment(tehranDate);
  const jy = m.jYear();
  const jm = m.jMonth() + 1;
  const jd = m.jDate();
  
  // Calculate Kurdish year (2724 at 1403 Jalali)
  const JALALI_KURDISH_OFFSET = 1321; // 2724 - 1403
  const kurdishYear = jy + JALALI_KURDISH_OFFSET;
  
  // Map Jalali month to Kurdish month (they use the same month system)
  const monthIndex = jm - 1; // Convert to 0-based index
  const day = jd;
  
  // Construct and return the result object with all date components
  return {
    gregorianDate,
    kurdishDate: `${day}ی ${kurdishMonths[monthIndex]}ی ${kurdishYear}`,
    kurdishDateLatin: `${day} ${kurdishMonthsLatin[monthIndex]} ${kurdishYear}`,
    kurdishYear,
    kurdishMonth: kurdishMonths[monthIndex],
    kurdishMonthLatin: kurdishMonthsLatin[monthIndex],
    kurdishDay: day
  };
}
