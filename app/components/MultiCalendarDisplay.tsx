"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import moment from "moment-jalaali";
import "moment-hijri";
import { getKurdishDate } from "@/lib/getKurdishDate";
import { Sun, MapPin } from "lucide-react";
import { formatBashurDate, formatHijriDate, formatKurdishDate, formatPersianDate, formatRojhalatDate, getFontClass } from "@/lib/utils";

// Utility: Get English month name (moved outside component)
function getEnglishMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
}

// Utility: Convert Gregorian date to Persian (Jalali) using moment-jalaali
function getPersianDate(date: Date) {
  try {
    const m = moment(date);
    if (typeof m.jYear !== "function") {
      console.error("moment-jalaali is not properly initialized");
      return {
        jy: date.getFullYear() - 621,
        jm: date.getMonth() + 1,
        jd: date.getDate(),
      };
    }
    const jy = m.jYear();
    const jm = m.jMonth() + 1;
    const jd = m.jDate();
    return { jy, jm, jd };
  } catch (error) {
    console.error("Error converting to Persian date:", error);
    return {
      jy: date.getFullYear() - 621,
      jm: date.getMonth() + 1,
      jd: date.getDate(),
    };
  }
}

// Utility: Get Hijri date using fallback calculation
function getHijriDate(date: Date) {
  try {
    return getHijriDateFallback(date);
  } catch (error) {
    console.error("Error converting to Hijri date:", error);
    return getHijriDateFallback(date);
  }
}

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

// Define Bashur Kurdish months (Southern Kurdistan/Iraq)
const KurdishMonthBashur: { [key: number]: string } = {
  0: "کانوونی دووەم",
  1: "شوبات",
  2: "ئازار",
  3: "نیسان",
  4: "مایس",
  5: "حوزەیران",
  6: "تەمووز",
  7: "ئاب",
  8: "ئەیلوول",
  9: "تشرینی یەکەم",
  10: "تشرینی دووەم",
  11: "کانوونی یەکەم",
};
const KurdishMonthBashurLatin: { [key: number]: string } = {
  0: "Kanûnî Dûwem",
  1: "Shubat",
  2: "Adar",
  3: "Nîsan",
  4: "Meyis",
  5: "Huzeyran",
  6: "Temmûz",
  7: "Ab", // Ab (ئاب) is the Kurdish name for August
  8: "Eylûl", // Eylûl (ئەیلوول) is the Kurdish name for September
  9: "Tîrmeh", // Tîrmeh (تشرینی یەکەم) is the Kurdish name for October
  10: "Kanûnî Yekem",
  11: "Kanûnî Dûwem",
};

interface MultiCalendarDisplayProps {
  /** Current locale/language code (en, ku, ar, fa) */
  locale: string;
}

export default function MultiCalendarDisplay({
  locale,
}: MultiCalendarDisplayProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update current date every minute.
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute derived calendar values only when currentDate changes.
  const { gregorianDate, jalaliDate, hijriDate, kurdishDate } = useMemo(
    () => ({
      gregorianDate: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
      },
      jalaliDate: getPersianDate(currentDate),
      hijriDate: getHijriDate(currentDate),
      kurdishDate: getKurdishDate(currentDate),
    }),
    [currentDate]
  );

  return (
    <Card className={`w-full ${getFontClass(locale)}`}>
      <CardHeader>
        <CardTitle className="text-center">
          {t("calendar.multiCalendar.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* {locale === 'ku' && ( */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Rojhalat (Eastern) Kurdish Calendar */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200/70 text-amber-900 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-center bg-amber-500/90 text-white rounded-full w-10 h-10 flex-shrink-0">
              <Sun className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-amber-800">
                {t("calendar.multiCalendar.kurdishRojhalat")}
              </h3>
              <p className="font-medium mt-1 text-amber-900">
                {/* {kurdishDate.kurdishDay}{" "}
                {locale === "en"
                  ? kurdishDate.kurdishMonthLatin
                  : kurdishDate.kurdishMonth}{" "}
                {kurdishDate.kurdishYear} */}
                {
                  formatRojhalatDate(currentDate, locale).formatted
                }
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
                {t("calendar.multiCalendar.kurdishBashur")}
              </h3>
              <p className="font-medium mt-1 text-emerald-900">
                {
                  formatBashurDate(currentDate, locale).formatted
                }
                {/* {locale === "en"
                  ? KurdishMonthBashurLatin[gregorianDate.month]
                  : KurdishMonthBashur[gregorianDate.month]}{" "}
                {gregorianDate.day} {gregorianDate.year} */}
              </p>
            </div>
          </div>
        </div>
        {/* )} */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gregorian Calendar */}
          <div className="p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="font-semibold text-lg mb-2">
              {t("calendar.multiCalendar.gregorian")}
            </h3>
            <p>
              {gregorianDate.day} {getEnglishMonthName(gregorianDate.month)}{" "}
              {gregorianDate.year}
            </p>
          </div>
          {/* Jalali (Persian) Calendar */}
          <div className="p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="font-semibold text-lg mb-2">
              {t("calendar.multiCalendar.jalali")}
            </h3>
            <p>
              {
                formatPersianDate(currentDate, locale).formatted
              }
                {/* {jalaliDate.jd} {t(`calendar.jalaliMonths.${jalaliDate.jm - 1}`)}{" "}
                {jalaliDate.jy} */}
            </p>
          </div>
          {/* Hijri (Islamic/Lunar) Calendar */}
          <div className="p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="font-semibold text-lg mb-2">
              {t("calendar.multiCalendar.hijri")}
            </h3>
            <p>
              {
                formatHijriDate(currentDate, locale).formatted
              }
              {/* {hijriDate.day} {t(`calendar.hijriMonths.${hijriDate.month}`)}{" "}
              {hijriDate.year} */}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
