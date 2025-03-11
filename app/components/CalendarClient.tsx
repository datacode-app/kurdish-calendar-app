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
import { getLocalizedDayName, getLocalizedMonthName, getKurdishCountryName } from "@/lib/date-utils";
import { getKurdishDate, KurdishMonthSorani } from "@/lib/getKurdishDate";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
}

interface CalendarProps {
  locale: string;
}

// --- Component Start ---

export default function CalendarClient({ locale }: CalendarProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showEventSheet, setShowEventSheet] = useState(false);
  // Toggle for Kurdish calendar style (default Bashur)
  const [useRojhalatMonths, setUseRojhalatMonths] = useState(false);

  // Memoize the Kurdish date for the currentDate when locale is Kurdish
  const kurdishDate = useMemo(() => {
    return locale === "ku" ? getKurdishDate(currentDate) : null;
  }, [currentDate, locale]);

  // Fetch holidays only once on mount
  useEffect(() => {
    fetch("/data/holidays.json")
      .then((response) => response.json())
      .then((data) => {
        const holidaysArray = Array.isArray(data) ? data : data.holidays || [];
        setHolidays(holidaysArray);
      })
      .catch((error) => console.error("Error loading holidays:", error));
  }, []);

  // Memoize filtered events for the current month and selected day
  const currentMonthEvents = useMemo(() => {
    return holidays.filter((holiday) =>
      isSameMonth(new Date(holiday.date), currentDate)
    );
  }, [holidays, currentDate]);

  const selectedDateEvents = useMemo(() => {
    return holidays.filter((holiday) =>
      isSameDay(new Date(holiday.date), selectedDate)
    );
  }, [holidays, selectedDate]);

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
    setSelectedDate(day);
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

  const getKurdishMonthName = useCallback(
    (date: Date) => {
      if (useRojhalatMonths) {
        return getKurdishDate(date).kurdishMonth;
      } else {
        return KurdishMonthBashur[date.getMonth()];
      }
    },
    [useRojhalatMonths]
  );

  const getKurdishDayNumber = useCallback(
    (date: Date) => {
      return useRojhalatMonths ? getKurdishDate(date).kurdishDay : date.getDate();
    },
    [useRojhalatMonths]
  );

  const formatDate = useCallback(
    (date: Date, formatStr: string) => {
      if (locale === "ku") {
        const specificKurdishDate = getKurdishDate(date);
        if (formatStr === "MMMM yyyy") {
          return useRojhalatMonths
            ? `${specificKurdishDate.kurdishMonth} ${specificKurdishDate.kurdishYear}`
            : `${KurdishMonthBashur[date.getMonth()]} ${date.getFullYear()}`;
        }
        if (formatStr === "MMMM d, yyyy") {
          return useRojhalatMonths
            ? `${specificKurdishDate.kurdishMonth} ${specificKurdishDate.kurdishDay}, ${specificKurdishDate.kurdishYear}`
            : `${KurdishMonthBashur[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }
        if (formatStr === "MMM d") {
          return useRojhalatMonths
            ? `${specificKurdishDate.kurdishMonth} ${specificKurdishDate.kurdishDay}`
            : `${KurdishMonthBashur[date.getMonth()]} ${date.getDate()}`;
        }
      }
      const formatted = format(date, formatStr);
      if (locale !== "en") {
        if (formatStr === "EEEE" || formatStr === "EEE") {
          return getLocalizedDayName(formatted, locale);
        }
        if (
          formatStr === "MMMM yyyy" ||
          formatStr === "MMMM d, yyyy" ||
          formatStr === "MMM d"
        ) {
          return formatted;
        }
      }
      return formatted;
    },
    [locale, useRojhalatMonths, getLocalizedText]
  );

  // Memoize rendered days header
  const renderedDays = useMemo(() => {
    const dateFormat = "EEEE";
    const shortDateFormat = "EEE";
    const days = [];
    const startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(startDate, i);
      const isWeekend = i === 0 || i === 6;
      const fullDayName = formatDate(currentDay, dateFormat);
      const shortDayName =
        locale !== "en"
          ? getLocalizedDayName(format(currentDay, dateFormat), locale).substring(
              0,
              locale === "ku" || locale === "ar" || locale === "fa" ? 2 : 1
            )
          : formatDate(currentDay, shortDateFormat);
      days.push(
        <div key={i} className="text-center py-2 sm:py-3">
          <span className="hidden md:inline text-sm font-medium text-muted-foreground">
            {fullDayName}
          </span>
          <span
            className={cn(
              "md:hidden inline-flex items-center justify-center h-8 w-8 text-xs font-semibold rounded-full",
              isWeekend ? "bg-primary/20 text-primary" : "bg-muted/30 text-foreground"
            )}
            title={fullDayName}
          >
            {shortDayName}
          </span>
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-muted/30 mb-1">{days}</div>;
  }, [currentDate, locale, formatDate]);

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
        const formattedDate =
          locale === "ku"
            ? useRojhalatMonths
              ? getKurdishDate(cloneDay).kurdishDay.toString()
              : cloneDay.getDate().toString()
            : format(cloneDay, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelectedDay = isSameDay(day, selectedDate);
        const isTodayDay = isToday(day);
        const hasEvents = holidays.some((holiday) =>
          isSameDay(new Date(holiday.date), day)
        );
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-12 sm:h-16 flex items-center justify-center",
              !isCurrentMonth && "text-muted-foreground bg-muted/20",
              isCurrentMonth && "bg-background hover:bg-accent/20 hover:text-accent-foreground",
              isSelectedDay && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
              isTodayDay && !isSelectedDay && "border-primary text-accent-foreground font-semibold",
              "cursor-pointer select-none"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            {locale === "ku" && isCurrentMonth && (
              <div className="absolute top-1 right-1">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-bold",
                    useRojhalatMonths
                      ? "bg-amber-500/90 text-amber-50"
                      : "bg-emerald-500/90 text-emerald-50"
                  )}
                >
                  {useRojhalatMonths ? "ڕ" : "ب"}
                </div>
              </div>
            )}
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                isSelectedDay && "bg-primary text-primary-foreground",
                isTodayDay && !isSelectedDay && "border border-primary"
              )}
            >
              {formattedDate}
            </span>
            {hasEvents && (
              <span
                className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                  isSelectedDay ? "bg-primary-foreground" : "bg-primary"
                )}
              ></span>
            )}
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
  }, [currentDate, selectedDate, holidays, locale, useRojhalatMonths, onDateClick]);

  // Memoized Calendar Badge component
  const CalendarBadge = useCallback(
    ({ isRojhalat }: { isRojhalat: boolean }) => (
      <div
        className={cn(
          "absolute top-1 right-1 flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-bold",
          isRojhalat ? "bg-amber-500/90 text-amber-50" : "bg-emerald-500/90 text-emerald-50"
        )}
      >
        {isRojhalat ? "ڕ" : "ب"}
      </div>
    ),
    []
  );

  const renderHeader = useCallback(() => (
    <div className="flex items-center justify-between py-4 px-6">
      <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-accent rounded-full">
        <ChevronLeft className="h-5 w-5" />
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
          {formatDate(currentDate, "MMMM yyyy")}
          {locale === "ku" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/80 hover:bg-muted hover:text-accent-foreground transition-colors">
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px] text-center">
                  {useRojhalatMonths
                    ? "ساڵنامەی کوردی ڕۆژهەڵات وەک ساڵنامەی فارسی/هەتاوی دەژمێردرێت"
                    : "ساڵنامەی کوردی باشوور وەک ساڵنامەی زایینی دەژمێردرێت"}
                </TooltipContent>
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
              <button
                onClick={() => setUseRojhalatMonths(true)}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 z-10 flex-1",
                  useRojhalatMonths
                    ? "text-white font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="h-3.5 w-3.5" />
                <span className="text-xs">{t(`calendar.Rojhalat`)}</span>
              </button>
              <button
                onClick={() => setUseRojhalatMonths(false)}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 z-10 flex-1",
                  !useRojhalatMonths
                    ? "text-white font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{t(`calendar.Bashur`)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-accent rounded-full">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  ), [prevMonth, nextMonth, currentDate, locale, useRojhalatMonths, formatDate]);

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
                          {locale === "ku"
                            ? useRojhalatMonths
                              ? `${getKurdishDate(new Date(event.date)).kurdishMonth} ${getKurdishDate(new Date(event.date)).kurdishDay}`
                              : `${KurdishMonthBashur[new Date(event.date).getMonth()]} ${new Date(event.date).getDate()}`
                            : formatDate(new Date(event.date), "MMM d")}
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
    [t, getLocalizedText, locale, useRojhalatMonths, formatDate]
  );

  const DualKurdishCalendarDisplay = useMemo(() => {
    const today = new Date();
    const rojhalatDate = getKurdishDate(today);
    const formattedKurdishDay = format(today, "EEEE");
    const localizedKurdishDay = getLocalizedDayName(formattedKurdishDay, locale);
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
              <div className="w-full sm:w-auto flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/70 text-amber-900 px-3 py-2 rounded-lg">
                    <div className="flex items-center justify-center bg-amber-500/90 text-white rounded-full w-7 h-7">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-700">ڕۆژهەڵات</p>
                      <p className="font-semibold">
                        {rojhalatDate.kurdishDay} {rojhalatDate.kurdishMonth} {rojhalatDate.kurdishYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-900 px-3 py-2 rounded-lg">
                    <div className="flex items-center justify-center bg-emerald-500/90 text-white rounded-full w-7 h-7">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700">باشوور</p>
                      <p className="font-semibold">
                        {KurdishMonthBashur[today.getMonth()]} {today.getDate()} {today.getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }, [locale]);

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
      {/* Mobile View */}
      <div className="block md:hidden mt-6">
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
              <span className="mr-1">{useRojhalatMonths ? "ڕ" : "ب"}</span>
              {formatDate(selectedDate, "MMM d")}
            </div>
          )}
        </div>
        <EventList events={selectedDateEvents} title="" />
      </div>
      {/* Desktop/Tablet View */}
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
                <span className="mr-1">{useRojhalatMonths ? "ڕ" : "ب"}</span>
                {formatDate(selectedDate, "MMM d")}
              </div>
            )}
          </div>
          <EventList events={selectedDateEvents} title="" />
        </div>
      </div>
      {/* Mobile Events Sheet */}
      <div className="block md:hidden fixed bottom-4 right-4 z-10">
        <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
          <SheetTrigger asChild>
            <Button className="rounded-full shadow-md" size="icon">
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>{t("events.eventsThisMonth")}</SheetTitle>
            </SheetHeader>
            <EventList events={currentMonthEvents} title="" />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
