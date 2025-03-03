// Define the return type for better type safety
export interface KurdishDateResult {
  gregorianDate: string;
  kurdishDate: string;
  kurdishDateLatin: string;
  kurdishYear: number;
  kurdishMonth: string;
  kurdishMonthLatin: string;
  kurdishDay: number;
}

/**
 * Enum for Kurdish Sorani months in Arabic script
 */
export enum KurdishMonthSorani {
  XAKELIWE = 'خاکەلێوە',
  GULAN = 'گوڵان',
  COZERDAN = 'جۆزەردان',
  PUSHPER = 'پووشپەڕ',
  GELAWEJ = 'گەلاوێژ',
  XERMANAN = 'خەرمانان',
  REZBER = 'ڕەزبەر',
  GELAREZAN = 'گەڵاڕێزان',
  SERMAWEZ = 'سەرماوەز',
  BEFRANBAR = 'بەفرانبار',
  REBENDAN = 'ڕێبەندان',
  RESHEME = 'ڕەشەمە'
}

/**
 * Enum for Kurdish Sorani months in Latin script
 */
export enum KurdishMonthLatin {
  XAKELIWE = 'Xakelêwe',
  GULAN = 'Gulan',
  COZERDAN = 'Cozerdan',
  PUSHPER = 'Pûşper',
  GELAWEJ = 'Gelawêj',
  XERMANAN = 'Xermanan',
  REZBER = 'Rezber',
  GELAREZAN = 'Gelarêzan',
  SERMAWEZ = 'Sermawez',
  BEFRANBAR = 'Befranbar',
  REBENDAN = 'Rêbendan',
  RESHEME = 'Reşeme'
}

/**
 * Calculates the Kurdish date from a given Gregorian date
 * @param date Optional Date object, defaults to current date if not provided
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
