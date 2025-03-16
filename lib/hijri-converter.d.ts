declare module 'hijri-converter' {
  interface HijriDate {
    hy: number;  // Hijri year
    hm: number;  // Hijri month
    hd: number;  // Hijri day
  }

  interface GregorianDate {
    gy: number;  // Gregorian year
    gm: number;  // Gregorian month
    gd: number;  // Gregorian day
  }

  export function gregorianToHijri(gy: number, gm: number, gd: number): HijriDate;
  export function hijriToGregorian(hy: number, hm: number, hd: number): GregorianDate;
} 