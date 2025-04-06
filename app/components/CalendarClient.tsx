/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sun,
  MapPin,
  Info,
  Clock,
  Gift,
  Star,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getLocalizedDayName, getLocalizedMonthName, getKurdishCountryName, formatDate } from "@/lib/date-utils";
import { getKurdishDate, KurdishMonthSorani } from "@/lib/getKurdishDate";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRojhalatDate, formatBashurDate } from "@/lib/utils";

// --- Static declarations moved outside the component ---

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

const getFontClass = (locale: string): string => {
  switch (locale) {
    case "ar":
    case "ku":
      return "font-notoKufi";
    case "fa":
      return "font-vazirmatn";
    default:
      return "";
  }
};

interface Holiday {
  date: string;
  isHoliday: boolean;
  event: {
    en: string;
    ku: string;
    ar: string;
    fa: string;
  };
  note?: {
    en: string;
    ku: string;
    ar: string;
    fa: string;
  };
  country?: string;
  region?: string;
  quote?: {
    celebrity: string;
    quote: {
      en: string;
      ku: string;
      ar: string;
      fa: string;
    };
  };
}

interface CalendarProps {
  locale: string;
}

// Custom arrow components that won't be affected by RTL
const LeftArrow = () => (
  <span style={{ display: 'inline-block' }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

const RightArrow = () => (
  <span style={{ display: 'inline-block' }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

// --- Component Start ---

export default function CalendarClient({ locale }: CalendarProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showEventSheet, setShowEventSheet] = useState(false);
  // Toggle for Kurdish calendar style (default Bashur)
  const [useRojhalatMonths, setUseRojhalatMonths] = useState(false);

  // Add new state for month events sheet
  const [showMonthEventsSheet, setShowMonthEventsSheet] = useState(false);

  // Function to normalize dates for comparison, with special handling for Kurdish locale
  const getAdjustedDateForComparison = useCallback((date: Date, dateString?: string): Date => {
    // Create a clean date without time component
    const cleanDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    
    // If in Kurdish locale, add one day to the holiday date for proper comparison
    // This direct adjustment compensates for the calendar calculation differences
    if (locale === "ku" && dateString) {
      cleanDate.setDate(cleanDate.getDate() + 1);
    }
    
    return cleanDate;
  }, [locale]);

  // Fetch holidays only once on mount
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${baseUrl}/data/holidays.json`)
      .then((response) => response.json())
      .then((data) => {
        const holidaysArray = Array.isArray(data) ? data : data.holidays || [];

        setHolidays(holidaysArray);
      })
      .catch((error) => console.error("Error loading holidays:", error));
  }, []);

  // Memoize filtered events for the current month and selected day
  const currentMonthEvents = useMemo(() => {
    return holidays.filter((holiday) => {
      const adjustedDate = getAdjustedDateForComparison(new Date(holiday.date), holiday.date);
      return isSameMonth(adjustedDate, currentDate);
    });
  }, [holidays, currentDate, getAdjustedDateForComparison]);

  const selectedDateEvents = useMemo(() => {
    return holidays.filter((holiday) => {
      const adjustedDate = getAdjustedDateForComparison(new Date(holiday.date), holiday.date);
      return isSameDay(adjustedDate, selectedDate);
    });
  }, [holidays, selectedDate, getAdjustedDateForComparison]);

  // Wrap helper functions in useCallback to avoid recreations
  const getLocalizedText = useCallback(
    (
      textObj: { [key: string]: string } | undefined,
      defaultText: string = ""
    ): string => {
      if (!textObj) return defaultText;
      return textObj[locale as keyof typeof textObj] || textObj.en || defaultText;
    },
    [locale]
  );

  const onDateClick = useCallback((day: Date) => {
    // Create a clean date object to avoid timezone issues
    const cleanDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    setSelectedDate(cleanDate);
    if (window.innerWidth < 768) {
      setShowEventSheet(true);
    }
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const getFormattedDate = useCallback(
    (date: Date) => {
      if (useRojhalatMonths) {
        return formatRojhalatDate(date, locale).formatted;
      } else {
        return formatBashurDate(date, locale).formatted;
      }
    },
    [useRojhalatMonths, locale]
  );

  // Add this helper function at the top of your component
  const formatMonthYear = useCallback((date: Date, locale: string) => {
    try {
      if (locale === 'ku') {
        return getFormattedDate(date);
      }
      
      // For non-Kurdish locales, use a safe fallback
      const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch (error) {
      console.error('Error formatting month/year:', error);
      // Fallback to basic English format
      return format(date, 'MMMM yyyy');
    }
  }, [getFormattedDate]);

  // Memoize rendered days header
  const renderedDays = useMemo(() => {
    const days = [];
    const startDate = startOfWeek(currentDate);

    // Day names in different languages
    const dayNames = {
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ku: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
      ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      fa: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
    };

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(startDate, i);
      const isWeekend = i === 0 || i === 6;

      // Get full and short day names based on locale
      const getDayName = () => {
        const fullName = dayNames[locale as keyof typeof dayNames]?.[i] || dayNames.en[i];
        const shortName = fullName.substring(0, locale === 'en' ? 3 : 2);
        return { fullName, shortName };
      };

      const { fullName, shortName } = getDayName();

      days.push(
        <div key={i} className="text-center py-2 sm:py-3">
          <span className="hidden md:inline text-sm font-medium text-muted-foreground">
            {fullName}
          </span>
          <span
            className={cn(
              "md:hidden inline-flex items-center justify-center h-8 w-8 text-xs font-semibold rounded-full",
              isWeekend ? "bg-primary/20 text-primary" : "bg-muted/30 text-foreground"
            )}
            title={fullName}
          >
            {shortName}
          </span>
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-muted/30 mb-1">{days}</div>;
  }, [currentDate, locale]);

  const isHolidayDate = useCallback(
    (date: Date) => {
      return holidays.some(
        (holiday) => {
          const adjustedDate = getAdjustedDateForComparison(new Date(holiday.date), holiday.date);
          return isSameDay(adjustedDate, date) && holiday.isHoliday;
        }
      );
    },
    [holidays, getAdjustedDateForComparison]
  );

  // Memoize calendar cells rendering
  const renderedCells = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = locale === "ku"
          ? getFormattedDate(cloneDay).split(' ')[0]
          : format(cloneDay, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelectedDay = isSameDay(day, selectedDate);
        const isTodayDay = isToday(day);
        const isHoliday = isHolidayDate(day);

        const hasEvents = holidays.some((holiday) => {
          const adjustedDate = getAdjustedDateForComparison(new Date(holiday.date), holiday.date);
          return isSameDay(adjustedDate, day);
        });
        
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative p-1 text-center focus-within:z-10",
              i === 0 ? "pl-1" : "",
              i === days.length - 1 ? "pr-1" : ""
            )}
          >
            <button
              type="button"
              onClick={() => onDateClick(cloneDay)}
              className={cn(
                "w-full h-full flex flex-col items-center justify-center rounded-lg p-2 sm:p-3",
                "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary",
                isSelectedDay
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground",
                !isCurrentMonth && "text-muted-foreground",
                isTodayDay && !isSelectedDay && "border-2 border-primary",
                isHoliday && !isSelectedDay && "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-200 font-medium border border-rose-200 dark:border-rose-800/50",
                hasEvents && !isSelectedDay && !isHoliday && "bg-accent"
              )}
            >
              <time
                dateTime={format(day, "yyyy-MM-dd")}
                className={cn(
                  "flex items-center justify-center font-semibold text-sm sm:text-base",
                  isSelectedDay && "text-primary-foreground"
                )}
              >
                {formattedDate}
              </time>
            </button>
          </div>
        );
        day = addDays(day, 1);

    
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-px">
          {days}
        </div>
      );

  
      days = [];
    }
    return <div className="flex flex-col gap-px">{rows}</div>;
  }, [currentDate, selectedDate, holidays, locale, useRojhalatMonths, onDateClick, getFormattedDate, getAdjustedDateForComparison]);

  // Memoized Calendar Badge component
  // const CalendarBadge = useCallback(
  //   ({ isRojhalat }: { isRojhalat: boolean }) => (
  //     <div
  //       className={cn(
  //         "absolute top-1 right-1 flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-bold",
  //         isRojhalat ? "bg-amber-500/90 text-amber-50" : "bg-emerald-500/90 text-emerald-50"
  //       )}
  //     >
  //       {isRojhalat ? "ڕ" : "ب"}
  //     </div>
  //   ),
  //   []
  // );

  // Update the renderHeader function
  const renderHeader = useCallback(() => (
    <div className="flex items-center justify-between py-4 px-6" dir="ltr">
      <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-accent rounded-full">
        <LeftArrow />
      </Button>
      <div className="flex flex-col items-center">
        {locale === "ku" && (
          <div
            className={cn(
              "relative mb-1.5 text-xs font-medium rounded-md px-2.5 py-0.5",
              useRojhalatMonths
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
            )}
          >
            {useRojhalatMonths ? "ساڵنامەی ڕۆژهەڵات" : "ساڵنامەی باشوور"}
          </div>
        )}
        <h2 className="text-xl font-semibold relative">
          {formatMonthYear(currentDate, locale)}
          {locale === "ku" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/80 hover:bg-muted hover:text-accent-foreground transition-colors">
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                {/* <TooltipContent side="top" className="max-w-[250px] text-center">
                  {useRojhalatMonths
                    ? "ساڵنامەی کوردی ڕۆژهەڵات وەک ساڵنامەی فارسی/هەتاوی دەژمێردرێت"
                    : "ساڵنامەی کوردی باشوور وەک ساڵنامەی زایینی دەژمێردرێت"}
                </TooltipContent> */}
              </Tooltip>
            </TooltipProvider>
          )}
        </h2>
        {locale === "ku" && (
          <div className="mt-3 relative">
            <div className="flex items-center bg-background shadow-sm border border-muted rounded-full p-0.5 relative z-10 transition-all duration-300 min-w-[180px]">
              <div
                className={cn(
                  "absolute inset-y-0.5 rounded-full transition-all duration-300 ease-in-out bg-gradient-to-r",
                  useRojhalatMonths
                    ? "from-amber-500/90 to-amber-600/80 left-0.5 right-[calc(50%-0.5rem)]"
                    : "from-emerald-500/90 to-emerald-600/80 left-[calc(50%-0.5rem)] right-0.5"
                )}
              />
            </div>
          </div>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-accent rounded-full">
        <RightArrow />
      </Button>
    </div>
  ), [prevMonth, nextMonth, currentDate, locale, useRojhalatMonths, formatMonthYear]);

  // Update the sheet title formatting
  const formatSheetDate = useCallback((date: Date, locale: string) => {
    try {
      // Create a new Date instance to avoid any mutation issues
      const clonedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (locale === 'ku') {
        if (useRojhalatMonths) {
          const kurdishDate = getKurdishDate(clonedDate);
          return `${kurdishDate.kurdishDay}ی ${kurdishDate.kurdishMonth}`;
        } else {
          // Use formatted approach for Bashur to ensure consistency
          const formatted = formatBashurDate(clonedDate, locale);
          return formatted.formatted;
        }
      }
      
      // For non-Kurdish locales, use a safe fallback
      return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ar', { 
        day: 'numeric',
        month: 'long'
      }).format(clonedDate);
    } catch (error) {
      console.error('Error formatting sheet date:', error);
      // Fallback to basic format
      return format(date, 'd MMMM');
    }
  }, [useRojhalatMonths]);

  const EventList = useCallback(
    ({ events, title }: { events: Holiday[]; title: string }) => (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-lg">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-2" aria-hidden="true" />
            <p className="text-muted-foreground">{t("events.noEvents")}</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-3" role="list" aria-label={title}>
              {events.map((event, index) => (
                <li key={index}>
                  <article className="bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden rounded-md">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-base tracking-tight">
                            {getLocalizedText(event.event)}
                          </h4>
                          {event.country && (
                            <div className="flex items-center mt-1.5">
                              <span className="inline-block w-2 h-2 rounded-full bg-primary/70 mr-2" aria-hidden="true"></span>
                              <p className="text-sm text-muted-foreground">
                                {locale === "ku"
                                  ? getKurdishCountryName(event.country)
                                  : event.country}
                              </p>
                            </div>
                          )}
                        </div>
                        <time
                          dateTime={event.date}
                          className={cn(
                            "text-sm font-medium px-2.5 py-1 rounded-md relative",
                            locale === "ku"
                              ? useRojhalatMonths
                                ? "bg-amber-100 text-amber-800 border border-amber-200/50"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200/50"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {formatSheetDate(new Date(event.date), locale)}
                        </time>
                      </div>
                      {event.note && getLocalizedText(event.note) && (
                        <div className="mt-2 pt-2 border-t border-dashed border-muted">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getLocalizedText(event.note)}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </div>
    ),
    [t, getLocalizedText, locale, useRojhalatMonths, formatSheetDate]
  );

  const DualKurdishCalendarDisplay = useMemo(() => {
    const today = new Date();
    const formattedKurdishDay = format(today, "EEEE");
    const localizedKurdishDay = getLocalizedDayName(formattedKurdishDay, locale);
    


    // Get formatted dates using the utility functions
    const rojhalatFormatted = formatRojhalatDate(today, locale).formatted;
    const bashurFormatted = formatBashurDate(today, locale).formatted;

    return (
      <div className="mb-6 overflow-hidden">
        <Card className="border shadow-sm overflow-hidden relative bg-gradient-to-r from-background to-muted/20">
          <CardContent className="p-0">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-primary"></div>
              <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-primary"></div>
            </div>
            <div className="relative p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 rounded-lg p-2.5 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">
                    {format(today, "d MMMM yyyy")}
                  </h3>
                  <p className="text-muted-foreground">{localizedKurdishDay}</p>
                </div>
              </div>
              {/**if You want to how card near calendar for rojhalat and bushur uncomment the following code */}
              
              {/* <div className="w-full sm:w-auto flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/70 text-amber-900 px-3 py-2 rounded-lg">
                    <div className="flex items-center justify-center bg-amber-500/90 text-white rounded-full w-7 h-7">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-700">ڕۆژهەڵات</p>
                      <p className="font-semibold">{rojhalatFormatted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-900 px-3 py-2 rounded-lg">
                    <div className="flex items-center justify-center bg-emerald-500/90 text-white rounded-full w-7 h-7">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700">باشوور</p>
                      <p className="font-semibold">{bashurFormatted}</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }, [locale]);

  // Make sure the Sheet modal has a stable direction for RTL languages
  const SheetModal = useMemo(() => (
    <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-0">
        <div className="px-6">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  selectedDateEvents.some(e => {
                  
                    return e.isHoliday
                  })
                    ? "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                    : "bg-primary/10 text-primary"
                )}>
                  {selectedDateEvents.some(e => e.isHoliday) ? (
                    <Gift className="h-6 w-6" />
                  ) : (
                    <CalendarDays className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <SheetTitle className="text-2xl">
                    {formatSheetDate(selectedDate, locale)}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedDateEvents.length > 0
                      ? t('events.foundEvents', { count: selectedDateEvents.length })
                      : t('events.noEvents')}
                  </p>
                </div>
              </div>
              {locale === "ku" && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5",
                    useRojhalatMonths
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  )}
                >
                  {useRojhalatMonths ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  <span>{useRojhalatMonths ? "ڕۆژهەڵات" : "باشوور"}</span>
                </div>
              )}
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="h-full mt-6 pb-8">
          <div className="px-6">
            {selectedDateEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium text-lg mb-2">{t('events.noEventsTitle')}</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">
                  {t('events.noEventsDesc')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event, index) => (
                  <div
                    key={index}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border transition-all duration-200",
                      event.isHoliday
                        ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/30"
                        : "bg-card border-border/50"
                    )}
                  >
                    {event.isHoliday && (
                      <div className="absolute right-4 top-4">
                        <Star className="h-5 w-5 text-rose-500 dark:text-rose-400 fill-current" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className={cn(
                        "font-medium text-lg mb-2",
                        event.isHoliday ? "text-rose-900 dark:text-rose-100" : "text-foreground"
                      )}>
                        {getLocalizedText(event.event)}
                      </h3>
                      {event.country && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            event.isHoliday ? "bg-rose-500" : "bg-primary"
                          )} />
                          <span className={cn(
                            "text-sm",
                            event.isHoliday ? "text-rose-700 dark:text-rose-300" : "text-muted-foreground"
                          )}>
                            {locale === "ku" ? getKurdishCountryName(event.country) : event.country}
                          </span>
                        </div>
                      )}
                      {event.note && getLocalizedText(event.note) && (
                        <div className={cn(
                          "mt-3 pt-3 border-t text-sm",
                          event.isHoliday
                            ? "border-rose-200/50 dark:border-rose-800/30 text-rose-700 dark:text-rose-300"
                            : "border-border/50 text-muted-foreground"
                        )}>
                          {getLocalizedText(event.note)}
                        </div>
                      )}
                      {event.quote && (
                        <div className={cn(
                          "mt-4 pt-4 border-t",
                          event.isHoliday
                            ? "border-rose-200/50 dark:border-rose-800/30"
                            : "border-border/50"
                        )}>
                          <blockquote className={cn(
                            "text-sm italic",
                            event.isHoliday
                              ? "text-rose-700 dark:text-rose-300"
                              : "text-muted-foreground"
                          )}>
                            &ldquo;{getLocalizedText(event.quote.quote)}&rdquo;
                            <footer className="mt-2 font-medium text-xs">
                              — {event.quote.celebrity}
                            </footer>
                          </blockquote>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  ), [showEventSheet, setShowEventSheet, selectedDateEvents, locale, selectedDate, useRojhalatMonths, formatSheetDate, t]);

  // Floating Button for Month Events
  const FloatingButton = useMemo(() => (
    <div className="fixed bottom-4 right-4 z-10 md:hidden">
      <Sheet open={showMonthEventsSheet} onOpenChange={setShowMonthEventsSheet}>
        <SheetTrigger asChild>
          <Button 
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground" 
            size="icon"
            variant="default"
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-0">
          <div className="px-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-2xl">
                      {locale === "ku"
                        ? useRojhalatMonths
                          ? getKurdishDate(currentDate).kurdishMonth
                          : KurdishMonthBashur[currentDate.getMonth()]
                        : new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {currentMonthEvents.length > 0
                        ? t('events.foundEventsMonth', { count: currentMonthEvents.length })
                        : t('events.noEvents')}
                    </p>
                  </div>
                </div>
                {locale === "ku" && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5",
                      useRojhalatMonths
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    )}
                  >
                    {useRojhalatMonths ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5" />
                    )}
                    <span>{useRojhalatMonths ? "ڕۆژهەڵات" : "باشوور"}</span>
                  </div>
                )}
              </div>
            </SheetHeader>
          </div>

          <ScrollArea className="h-full mt-6 pb-8">
            <div className="px-6">
              {currentMonthEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">{t('events.noEventsTitle')}</h3>
                  <p className="text-muted-foreground text-sm max-w-[250px]">
                    {t('events.noEventsDesc')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentMonthEvents.map((event, index) => (
                    <div
                      key={index}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border transition-all duration-200",
                        event.isHoliday
                          ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/30"
                          : "bg-card border-border/50"
                      )}
                    >
                      <div className="absolute right-4 top-4 flex items-center gap-2">
                        {event.isHoliday && (
                          <Star className="h-5 w-5 text-rose-500 dark:text-rose-400 fill-current" />
                        )}
                        <div className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          event.isHoliday
                            ? "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                            : "bg-primary/10 text-primary"
                        )}>
                          {formatSheetDate(new Date(event.date), locale)}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className={cn(
                          "font-medium text-lg mb-2 pr-20",
                          event.isHoliday ? "text-rose-900 dark:text-rose-100" : "text-foreground"
                        )}>
                          {getLocalizedText(event.event)}
                        </h3>
                        {event.country && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              event.isHoliday ? "bg-rose-500" : "bg-primary"
                            )} />
                            <span className={cn(
                              "text-sm",
                              event.isHoliday ? "text-rose-700 dark:text-rose-300" : "text-muted-foreground"
                            )}>
                              {locale === "ku" ? getKurdishCountryName(event.country) : event.country}
                            </span>
                          </div>
                        )}
                        {event.note && getLocalizedText(event.note) && (
                          <div className={cn(
                            "mt-3 pt-3 border-t text-sm",
                            event.isHoliday
                              ? "border-rose-200/50 dark:border-rose-800/30 text-rose-700 dark:text-rose-300"
                              : "border-border/50 text-muted-foreground"
                          )}>
                            {getLocalizedText(event.note)}
                          </div>
                        )}
                        {event.quote && (
                          <div className={cn(
                            "mt-4 pt-4 border-t",
                            event.isHoliday
                              ? "border-rose-200/50 dark:border-rose-800/30"
                              : "border-border/50"
                          )}>
                            <blockquote className={cn(
                              "text-sm italic",
                              event.isHoliday
                                ? "text-rose-700 dark:text-rose-300"
                                : "text-muted-foreground"
                            )}>
                              &ldquo;{getLocalizedText(event.quote.quote)}&rdquo;
                              <footer className="mt-2 font-medium text-xs">
                                — {event.quote.celebrity}
                              </footer>
                            </blockquote>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  ), [showMonthEventsSheet, setShowMonthEventsSheet, currentMonthEvents, locale, currentDate, useRojhalatMonths, formatSheetDate, t]);

  return (
    <div className={`w-full space-y-6 ${getFontClass(locale)}`}>
      {locale === "ku" && DualKurdishCalendarDisplay}
      <Card className="border shadow-sm">
        <CardContent className="p-0 pb-4">
          {renderHeader()}
       
          {renderedDays}
     
          {renderedCells}
     
        </CardContent>
      </Card>
      {SheetModal}
      {FloatingButton}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 lg:col-span-2">
          <EventList events={currentMonthEvents} title={t("events.eventsThisMonth")} />
        </div>
        <div className="col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("events.eventsOfTheDay")}</h2>
            {locale === "ku" && (
              <div
                className={cn(
                  "inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5",
                  useRojhalatMonths
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                )}
              >
                {locale === "ku"
                  ? useRojhalatMonths ? formatRojhalatDate(selectedDate,locale).formatted : formatBashurDate(selectedDate,locale).formatted
                  : format(selectedDate, "MMM d")
                }
              </div>
            )}
          </div>
          <EventList events={selectedDateEvents} title="" />
        </div>
      </div>
    </div>
  );
}
