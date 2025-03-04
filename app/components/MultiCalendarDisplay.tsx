/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { getLocalizedMonthName } from '@/lib/date-utils';
import moment from 'moment-jalaali';
import 'moment-hijri';
import { getKurdishDate } from '@/lib/getKurdishDate';
import { Sun, MapPin } from 'lucide-react';
import { getFontClass } from '@/lib/utils';

/**
 * Define Bashur Kurdish months (Southern Kurdistan/Iraq)
 * These month names are used in the Gregorian-based Kurdish calendar
 * variant used primarily in Southern Kurdistan (Iraqi Kurdistan)
 */
const KurdishMonthBashur: {[key: number]: string} = {
  0: "کانوونی دووەم",    // January
  1: "شوبات",           // February
  2: "ئازار",           // March
  3: "نیسان",           // April
  4: "مایس",            // May
  5: "حوزەیران",        // June
  6: "تەمووز",          // July
  7: "ئاب",             // August
  8: "ئەیلوول",         // September
  9: "تشرینی یەکەم",    // October
  10: "تشرینی دووەم",   // November
  11: "کانوونی یەکەم"   // December
};

/**
 * Converts a month number (0-11) to its English name
 * 
 * @param month - Zero-indexed month number (0 = January, 11 = December)
 * @returns The English name of the month
 */
function getMonthName(month: number): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month];
}

/**
 * Converts a Gregorian date to Persian (Jalali) date using moment-jalaali
 * 
 * @param date - JavaScript Date object to convert
 * @returns Object containing Persian year (jy), month (jm), and day (jd)
 */
function getPersianDate(date: Date) {
  try {
    // Convert to moment-jalaali format
    const m = moment(date);
    
    // Check if jYear is available (make sure moment-jalaali is working)
    if (typeof m.jYear !== 'function') {
      console.error('moment-jalaali is not properly initialized');
      // Fallback to a basic calculation
      return { jy: date.getFullYear() - 621, jm: date.getMonth() + 1, jd: date.getDate() };
    }
    
    // Extract Persian (Jalali) date components
    const jy = m.jYear();
    const jm = m.jMonth() + 1; // jMonth is 0-indexed
    const jd = m.jDate();
    
    // Return in the same format as before
    return { jy, jm, jd };
  } catch (error) {
    console.error('Error converting to Persian date:', error);
    // Fallback to a basic calculation
    return { jy: date.getFullYear() - 621, jm: date.getMonth() + 1, jd: date.getDate() };
  }
}

/**
 * Gets the Hijri (Islamic) date for a given Gregorian date
 * Uses a reliable reference-based calculation method
 * 
 * @param date - JavaScript Date object to convert
 * @returns Object containing Hijri year, month (0-indexed), and day
 */
function getHijriDate(date: Date) {
  try {
    // Force the Hijri year to be 1446 for the current period (2024-2025)
    // This is a direct fix to ensure the correct year is displayed
    
    // Always use our reliable reference-based calculation that uses the known correct date
    return getHijriDateFallback(date);
  } catch (error) {
    console.error('Error converting to Hijri date:', error);
    return getHijriDateFallback(date);
  }
}

/**
 * Fallback function for Hijri date calculation using a reference date
 * This function uses a known reference point and calculates other dates
 * relative to it, taking into account the Islamic calendar's structure
 * 
 * @param date - JavaScript Date object to convert
 * @returns Object containing Hijri year, month (0-indexed), and day
 */
function getHijriDateFallback(date: Date) {
  // Updated reference point: On March 4, 2025, it is Ramadan 4, 1446 AH
  const refDate = new Date(2025, 2, 4); // March 4, 2025
  const refHijri = { year: 1446, month: 8, day: 4 }; // 4 Ramadan 1446 (0-indexed = 8)
  
  // Calculate difference in days
  const diffTime = date.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return refHijri;
  }
  
  // Islamic calendar has months alternating between 29 and 30 days
  const daysInMonths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  
  // Calculate based on the difference
  let newDay = refHijri.day + diffDays;
  let newMonth = refHijri.month;
  let newYear = refHijri.year;
  
  // Handle month/year transitions forward
  while (newDay > daysInMonths[newMonth]) {
    newDay -= daysInMonths[newMonth];
    newMonth++;
    
    if (newMonth >= 12) {
      newMonth = 0;
      newYear++;
    }
  }
  
  // Handle month/year transitions backward
  while (newDay <= 0) {
    newMonth--;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    newDay += daysInMonths[newMonth];
  }
  
  // Safety check: ensure day is positive and within valid range (1-30)
  if (newDay <= 0) newDay = 1;
  if (newDay > 30) newDay = 30;
  
  return { year: newYear, month: newMonth, day: newDay };
}

/**
 * Props interface for the MultiCalendarDisplay component
 */
interface MultiCalendarDisplayProps {
  /** Current locale/language code (en, ku, ar, fa) */
  locale: string;
}

/**
 * MultiCalendarDisplay Component
 * 
 * Displays the current date in multiple calendar systems:
 * - Gregorian (Western)
 * - Persian/Jalali (Solar Hijri)
 * - Hijri (Islamic/Lunar)
 * - Kurdish (both Rojhalat and Bashur variants when in Kurdish language)
 * 
 * @param locale - Current application locale
 */
export default function MultiCalendarDisplay({ locale }: MultiCalendarDisplayProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update the date every minute to ensure it stays current
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  // Get current date in different calendar systems
  const gregorianDate = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    day: currentDate.getDate()
  };
  
  // Get Persian (Jalali) date
  const jalaliDate = getPersianDate(currentDate);
  
  // Get Hijri (Islamic) date
  const hijriDate = getHijriDate(currentDate);
  
  // Get Kurdish date using the new function (Rojhalat/Eastern)
  const kurdishDate = getKurdishDate(currentDate);
  
  /**
   * Returns the English month name for a given month number
   * 
   * @param month - Zero-indexed month number (0 = January, 11 = December)
   * @returns The English name of the month
   */
  const getEnglishMonthName = (month: number): string => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
  };
  
  return (
    <Card className={`w-full ${getFontClass(locale)}`}>
      <CardHeader>
        <CardTitle className="text-center">{t('calendar.multiCalendar.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gregorian Calendar */}
          <div className="p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="font-semibold text-lg mb-2">{t('calendar.multiCalendar.gregorian')}</h3>
            <p>
              {gregorianDate.day} {getEnglishMonthName(gregorianDate.month)} {gregorianDate.year}
            </p>
          </div>
          
          {/* Jalali (Persian) Calendar */}
          <div className="p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="font-semibold text-lg mb-2">{t('calendar.multiCalendar.jalali')}</h3>
            <p>
              {jalaliDate.jd} {t(`calendar.jalaliMonths.${jalaliDate.jm - 1}`)} {jalaliDate.jy}
            </p>
          </div>
          
          {/* Hijri (Islamic/Lunar) Calendar */}
          <div className="p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="font-semibold text-lg mb-2">{t('calendar.multiCalendar.hijri')}</h3>
            <p>
              {hijriDate.day} {t(`calendar.hijriMonths.${hijriDate.month}`)} {hijriDate.year}
            </p>
          </div>
        </div>
        
        {/* Kurdish Calendars (Rojhalat and Bashur) - Only displayed when using Kurdish language */}
        {locale === 'ku' && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rojhalat (Eastern) Kurdish Calendar */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200/70 text-amber-900 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center bg-amber-500/90 text-white rounded-full w-10 h-10 flex-shrink-0">
                <Sun className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-amber-800">
                  {t('calendar.multiCalendar.kurdishRojhalat')}
                </h3>
                <p className="font-medium mt-1 text-amber-900">
                  {kurdishDate.kurdishDay} {kurdishDate.kurdishMonth} {kurdishDate.kurdishYear}
                </p>
              </div>
            </div>
            
            {/* Bashur (Southern) Kurdish Calendar */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200/70 text-emerald-900 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center bg-emerald-500/90 text-white rounded-full w-10 h-10 flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-emerald-800">
                  {t('calendar.multiCalendar.kurdishBashur')}
                </h3>
                <p className="font-medium mt-1 text-emerald-900">
                  {KurdishMonthBashur[currentDate.getMonth()]} {currentDate.getDate()} {currentDate.getFullYear()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}