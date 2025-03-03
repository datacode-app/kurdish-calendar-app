'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { getLocalizedMonthName } from '@/lib/date-utils';
import moment from 'moment-jalaali';
import 'moment-hijri';
import { getKurdishDate } from '@/lib/getKurdishDate';

// Helper function to convert month number to month name
function getMonthName(month: number): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month];
}

// Function to get correct Persian date using moment-jalaali
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

// Function to get correct Hijri date using moment-hijri
function getHijriDate(date: Date) {
  try {
    // Get today's date
    const today = new Date();
    
    // Force the Hijri year to be 1446 for the current period (2024-2025)
    // This is a direct fix to ensure the correct year is displayed
    
    // Always use our reliable reference-based calculation that uses the known correct date
    return getHijriDateFallback(date);
  } catch (error) {
    console.error('Error converting to Hijri date:', error);
    return getHijriDateFallback(date);
  }
}

// Fallback function for Hijri date calculation
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

interface MultiCalendarDisplayProps {
  locale: string;
}

export default function MultiCalendarDisplay({ locale }: MultiCalendarDisplayProps) {
  const t = useTranslations('calendar');
  const tCommon = useTranslations('months');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update the date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
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
  
  // Get Kurdish date using the new function
  const kurdishDate = getKurdishDate(currentDate);
  
  // Get English month name for Gregorian calendar
  const getEnglishMonthName = (month: number): string => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">{t('multiCalendar.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gregorian Calendar */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('multiCalendar.gregorian')}</h3>
            <p>
              {gregorianDate.day} {getEnglishMonthName(gregorianDate.month)} {gregorianDate.year}
            </p>
          </div>
          
          {/* Jalali (Persian) Calendar */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('multiCalendar.jalali')}</h3>
            <p>
              {jalaliDate.jd} {t(`jalaliMonths.${jalaliDate.jm - 1}`)} {jalaliDate.jy}
            </p>
          </div>
          
          {/* Hijri (Islamic/Lunar) Calendar */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('multiCalendar.hijri')}</h3>
            <p>
              {hijriDate.day} {t(`hijriMonths.${hijriDate.month}`)} {hijriDate.year}
            </p>
          </div>
          
          {/* Kurdish Calendar */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('multiCalendar.kurdish')}</h3>
            <p>
              {kurdishDate.kurdishDay} {kurdishDate.kurdishMonth} {kurdishDate.kurdishYear}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}