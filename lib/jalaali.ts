/*
  Jalaali JavaScript Library v1.0.0
  Copyright (c) 2013 Behrang Noruzi Niya
  License: MIT
  Adapted and simplified for TypeScript
*/

export const jalaali = {
  // Converts a Gregorian date to Jalaali.
  toJalaali: function(gy: number, gm: number, gd: number) {
    return d2j(g2d(gy, gm, gd));
  },

  // Converts a Jalaali date to Gregorian.
  toGregorian: function(jy: number, jm: number, jd: number) {
    return d2g(j2d(jy, jm, jd));
  },

  // Is this a leap year or not?
  isLeapJalaaliYear: function(jy: number) {
    return jalCal(jy).leap === 0;
  },

  // Number of days in a given month in a Jalaali year.
  jalaaliMonthLength: function(jy: number, jm: number) {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    if (isLeapJalaaliYear(jy)) return 30;
    return 29;
  }
};

/*
  Utility helper functions
*/

// This function determines if the Jalaali (Persian) year is leap or not
function isLeapJalaaliYear(jy: number) {
  return jalCal(jy).leap === 0;
}

// Calculates Gregorian and Julian calendar dates from the Julian Day number
// (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
// calendars) to some millions years ahead of the present.
function d2g(jdn: number) {
  let j, i, gd, gm, gy;
  j = 4 * jdn + 139361631;
  j = j + Math.floor((Math.floor((4 * jdn + 183187720) / 146097) * 3) / 4) * 4 - 3908;
  i = Math.floor(((j % 1461) / 4) * 5 + 308);
  gd = Math.floor(((i % 153) / 5) + 1);
  gm = Math.floor((i / 153) % 12) + 1;
  gy = Math.floor(j / 1461) - 100100 + Math.floor((8 - gm) / 6);
  return { gy: gy, gm: gm, gd: gd };
}

// Calculates the Julian Day number from Gregorian or Julian calendar dates.
// This integer number corresponds to the noon of the date (i.e. 12 hours of
// Universal Time).
function g2d(gy: number, gm: number, gd: number) {
  let d = Math.floor((gy + Math.floor((gm - 8) / 6) + 100100) * 1461 / 4)
      + Math.floor(((153 * ((gm + 9) % 12) + 2) / 5) + gd - 34840408);
  d = d - Math.floor((Math.floor((gy + 100100 + Math.floor((gm - 8) / 6)) / 100) * 3) / 4) + 752;
  return d;
}

// Calculates the Julian Day number from a Jalaali date.
function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  const jdn = g2d(r.gy, 3, r.march) + (jm - 1) * 31 - Math.floor((jm / 7) * (jm - 7)) + jd - 1;
  return jdn;
}

// Calculates Jalaali calendar dates from the Julian Day number (jdn) for
// the period of Jalaali calendar -1 to 3177 (1178-4806 CE).
function d2j(jdn: number) {
  let gy = d2g(jdn).gy, // Calculate Gregorian year (gy).
      jy = gy - 621,
      r = jalCal(jy),
      jdn1f = g2d(r.gy, 3, r.march),
      jd, jm, k;

  // Find number of days that passed since 1 Farvardin.
  k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + Math.floor(k / 31);
      jd = (k % 31) + 1;
      return { jy: jy, jm: jm, jd: jd };
    } else {
      // The remaining months.
      k -= 186;
    }
  } else {
    // Previous Jalaali year.
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + Math.floor(k / 30);
  jd = (k % 30) + 1;
  return { jy: jy, jm: jm, jd: jd };
}

// This function determines if the Jalaali (Persian) year is leap or common
// and finds the day in March (Gregorian) of the first day of the Jalaali year.
function jalCal(jy: number) {
  // Jalaali years starting the 33-year rule.
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  
  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error('Invalid Jalaali year ' + jy);
  
  // Find the limiting years for the Jalaali year jy.
  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm)
      break;
    // Update leapJ and jp for next iteration
    leapJ = leapJ + Math.floor(jump / 33) * 8 + Math.floor(((jump % 33) + 3) / 4);
    jp = jm;
  }
  
  // Calculate number of years since last rule
  const n1 = jy - jp;
  
  // Find the number of leap years from AD 621 to the beginning
  // of the current Jalaali year in the Persian calendar.
  const leapJ2 = leapJ + Math.floor(n1 / 33) * 8 + Math.floor(((n1 % 33) + 3) / 4);
  
  // And the same in the Gregorian calendar (until the year gy).
  const leapG = Math.floor(gy / 4) - Math.floor((Math.floor(gy / 100) + 1) * 3 / 4) - 150;
  
  // Determine the Gregorian date of Farvardin the 1st.
  const march = 20 + leapJ2 - leapG;
  
  // Find how many years have passed since the last leap year.
  let n2 = n1;
  if (jump - n1 < 6)
    n2 = n1 - jump + Math.floor((jump + 4) / 33) * 33;
  
  let leap = ((((n2 + 1) % 33) - 1) % 4 === 0) ? 1 : 0;
  if (leap === 0 && n2 === 33) leap = 1;
  
  return { leap: leap, gy: gy, march: march };
} 