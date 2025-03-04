/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
  Globe,
  MapPin,
  Sun,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// Define Bashur Kurdish months (Southern Kurdistan/Iraq)
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

// Rojhalat Kurdish months are already defined in the getKurdishDate.ts file as KurdishMonthSorani

export default function CalendarClient({ locale }: CalendarProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Holiday[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Holiday[]>([]);
  const [showEventSheet, setShowEventSheet] = useState(false);
  
  // Kurdish calendar style toggle - Set default to Bashur (false) for Kurdish language
  const [useRojhalatMonths, setUseRojhalatMonths] = useState(false);

  // Add Kurdish date state
  const [kurdishDate, setKurdishDate] = useState(getKurdishDate(currentDate));

  // Update Kurdish date when currentDate changes
  useEffect(() => {
    if (locale === 'ku') {
      setKurdishDate(getKurdishDate(currentDate));
    }
  }, [currentDate, locale]);

  useEffect(() => {
    fetch("/data/holidays.json")
      .then((response) => response.json())
      .then((data) => {
        const holidaysArray = Array.isArray(data) ? data : data.holidays || [];
        setHolidays(holidaysArray);
      })
      .catch((error) => console.error("Error loading holidays:", error));
  }, []);

  useEffect(() => {
    const monthEvents = holidays.filter((holiday) =>
      isSameMonth(new Date(holiday.date), currentDate)
    );
    setCurrentMonthEvents(monthEvents);

    const dateEvents = holidays.filter((holiday) =>
      isSameDay(new Date(holiday.date), selectedDate)
    );
    setSelectedDateEvents(dateEvents);
  }, [selectedDate, currentDate, holidays]);

  const getLocalizedText = (
    textObj: { [key: string]: string } | undefined,
    defaultText: string = ""
  ): string => {
    if (!textObj) return defaultText;
    return textObj[locale as keyof typeof textObj] || textObj.en || defaultText;
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    if (window.innerWidth < 768) {
      setShowEventSheet(true);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Helper function to get the appropriate Kurdish month name based on the toggle state
  const getKurdishMonthName = (date: Date) => {
    const gregorianMonth = date.getMonth();
    if (useRojhalatMonths) {
      // Use the Rojhalat/Eastern Kurdish months (from KurdishDate function)
      const kurdishDate = getKurdishDate(date);
      return kurdishDate.kurdishMonth;
    } else {
      // Use the Bashur/Southern Kurdish months
      return KurdishMonthBashur[gregorianMonth];
    }
  };

  // This function gets the day number based on calendar style
  const getKurdishDayNumber = (date: Date) => {
    if (useRojhalatMonths) {
      // For Rojhalat: Use Persian/Solar Hijri day from getKurdishDate function
      const kurdishDate = getKurdishDate(date);
      return kurdishDate.kurdishDay;
    } else {
      // For Bashur: Use Gregorian day as-is
      return date.getDate();
    }
  };

  // For Kurdish language, always get a fresh Kurdish date for the provided date
  // This ensures the date is always correct even when the selected day changes
  const formatDate = (date: Date, formatStr: string) => {
    if (locale === 'ku') {
      // Get Kurdish date specifically for this date (not reusing state)
      const specificKurdishDate = getKurdishDate(date);
      
      if (formatStr === 'MMMM yyyy') {
        if (useRojhalatMonths) {
          // For Rojhalat: use the original Kurdish year as calculated in getKurdishDate
          return `${specificKurdishDate.kurdishMonth} ${specificKurdishDate.kurdishYear}`;
        } else {
          return `${KurdishMonthBashur[date.getMonth()]} ${date.getFullYear()}`;
        }
      }
      
      if (formatStr === 'MMMM d, yyyy') {
        if (useRojhalatMonths) {
          // For Rojhalat: use the original Kurdish year as calculated in getKurdishDate
          return `${specificKurdishDate.kurdishMonth} ${specificKurdishDate.kurdishDay}, ${specificKurdishDate.kurdishYear}`;
        } else {
          return `${KurdishMonthBashur[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }
      }
      
      if (formatStr === 'MMM d') {
        if (useRojhalatMonths) {
          return `${specificKurdishDate.kurdishMonth} ${specificKurdishDate.kurdishDay}`;
        } else {
          return `${KurdishMonthBashur[date.getMonth()]} ${date.getDate()}`;
        }
      }
    }
    
    // For Gregorian calendar, always use English month names regardless of locale
    const formatted = format(date, formatStr);
    
    // Only localize day names, not month names
    if (locale !== 'en') {
      // Only translate day names, not month names
      if (formatStr === 'EEEE' || formatStr === 'EEE') {
        return getLocalizedDayName(formatted, locale);
      }
      
      // For formats involving months, keep month names in English
      if (formatStr === 'MMMM yyyy') {
        return formatted; // Keep English month
      }
      if (formatStr === 'MMMM d, yyyy') {
        return formatted; // Keep English month
      }
      if (formatStr === 'MMM d') {
        return formatted; // Keep English month
      }
    }
    
    return formatted;
  };

  // Calendar badge to show on top right of calendar cells
  const CalendarBadge = ({ isRojhalat }: { isRojhalat: boolean }) => (
    <div className={`absolute top-1 right-1 flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-bold ${
      isRojhalat 
        ? "bg-amber-500/90 text-amber-50" 
        : "bg-emerald-500/90 text-emerald-50"
    }`}>
      {isRojhalat ? "ڕ" : "ب"}
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between py-4 px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={prevMonth}
        className="hover:bg-accent rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex flex-col items-center">
        {/* Calendar Type Indicator - Only visible for Kurdish */}
        {locale === 'ku' && (
          <div className={`relative mb-1.5 text-xs font-medium rounded-md px-2.5 py-0.5 ${
            useRojhalatMonths 
              ? "bg-amber-100 text-amber-800 border border-amber-200" 
              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}>
            {useRojhalatMonths ? "ساڵنامەی ڕۆژهەڵات" : "ساڵنامەی باشوور"}
          </div>
        )}
        
        <h2 className="text-xl font-semibold relative">
          {formatDate(currentDate, "MMMM yyyy")}
          
          {/* Info tooltip */}
          {locale === 'ku' && (
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
        
        {/* Kurdistan Region Month Style Toggle - Only show when Kurdish language is selected */}
        {locale === 'ku' && (
          <div className="mt-3 relative">
            <div className="flex items-center bg-background shadow-sm border border-muted rounded-full p-0.5 relative z-10 transition-all duration-300 min-w-[180px]">
              {/* Toggle Background */}
              <div 
                className={`absolute inset-y-0.5 rounded-full transition-all duration-300 ease-in-out bg-gradient-to-r ${
                  useRojhalatMonths 
                    ? "from-amber-500/90 to-amber-600/80 left-0.5 right-[calc(50%-0.5rem)]" 
                    : "from-emerald-500/90 to-emerald-600/80 left-[calc(50%-0.5rem)] right-0.5"
                }`}
              />
              
              {/* Rojhalat Option */}
              <button
                onClick={() => setUseRojhalatMonths(true)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 z-10 flex-1 ${
                  useRojhalatMonths 
                    ? "text-white font-medium" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span className="text-xs">ڕۆژهەڵات</span>
              </button>
              
              {/* Bashur Option */}
              <button
                onClick={() => setUseRojhalatMonths(false)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 z-10 flex-1 ${
                  !useRojhalatMonths 
                    ? "text-white font-medium" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">باشوور</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextMonth}
        className="hover:bg-accent rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );

  const renderDays = () => {
    const dateFormat = "EEEE";
    const shortDateFormat = "EEE";
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(startDate, i);
      const isWeekend = i === 0 || i === 6; // Sunday or Saturday
      
      // Get the full and abbreviated day names
      const fullDayName = formatDate(currentDay, dateFormat);
      
      // For mobile, we need to ensure we get the first character or first few characters of the localized day name
      let shortDayName;
      if (locale !== 'en') {
        // Get the full localized day name and take the first character or first few characters
        const localizedDay = getLocalizedDayName(format(currentDay, dateFormat), locale);
        shortDayName = localizedDay.substring(0, locale === 'ku' || locale === 'ar' || locale === 'fa' ? 2 : 1);
      } else {
        shortDayName = formatDate(currentDay, shortDateFormat);
      }
      
      days.push(
        <div
          key={i}
          className="text-center py-2 sm:py-3"
        >
          <span className="hidden md:inline text-sm font-medium text-muted-foreground">
            {fullDayName}
          </span>
          <span 
            className={`md:hidden inline-flex items-center justify-center h-8 w-8 text-xs font-semibold rounded-full 
              ${isWeekend ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-foreground'}`}
            title={fullDayName} // Add full name as tooltip
          >
            {shortDayName}
          </span>
        </div>
      );
    }

    return <div className="grid grid-cols-7 border-b border-muted/30 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        
        // Format the day - now use our adjusted method for Kurdish days
        if (locale === 'ku') {
          formattedDate = useRojhalatMonths 
            ? getKurdishDate(cloneDay).kurdishDay.toString() 
            : cloneDay.getDate().toString();
        } else {
          formattedDate = format(cloneDay, "d");
        }

        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelectedDay = isSameDay(day, selectedDate);
        const isTodayDay = isToday(day);
        const hasEvents = Array.isArray(holidays) && 
          holidays.some((holiday) => isSameDay(new Date(holiday.date), day));

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-12 sm:h-16 border-0 flex items-center justify-center",
              !isCurrentMonth && "text-muted-foreground bg-muted/20",
              isCurrentMonth && "bg-background hover:bg-accent/20 hover:text-accent-foreground",
              isSelectedDay && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
              isTodayDay && !isSelectedDay && "border-primary text-accent-foreground font-semibold",
              "cursor-pointer select-none"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            {/* Show calendar badge only for Kurdish */}
            {locale === 'ku' && isCurrentMonth && (
              <CalendarBadge isRojhalat={useRojhalatMonths} />
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
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                isSelectedDay ? "bg-primary-foreground" : "bg-primary"
              }`}></span>
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
  };

  const EventList = ({
    events,
    title,
  }: {
    events: Holiday[];
    title: string;
  }) => (
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
            {events?.map((event, index) => (
              <li key={index}>
                <article className="bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden rounded-md">
                  <div className="p-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-base tracking-tight">
                            {getLocalizedText(event.event)}
                          </h4>
                          {event.country && (
                            <div className="flex items-center mt-1.5">
                              <span className="inline-block w-2 h-2 rounded-full bg-primary/70 mr-2" aria-hidden="true"></span>
                              <p className="text-sm text-muted-foreground">
                                {locale === 'ku' ? getKurdishCountryName(event.country) : event.country}
                              </p>
                            </div>
                          )}
                        </div>
                        <time dateTime={event.date} className={`text-sm font-medium px-2.5 py-1 rounded-md relative ${
                          locale === 'ku' ? (
                            useRojhalatMonths 
                              ? "bg-amber-100 text-amber-800 border border-amber-200/50" 
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200/50"
                          ) : "bg-primary/10 text-primary"
                        }`}>
                          {/* Calendar type indicator for Kurdish */}
                          {locale === 'ku' && (
                            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] border shadow-sm ${
                              useRojhalatMonths 
                                ? "bg-amber-500 text-white border-amber-400" 
                                : "bg-emerald-500 text-white border-emerald-400"
                            }`}>
                              {useRojhalatMonths ? "ڕ" : "ب"}
                            </span>
                          )}
                          
                          {/* Always calculate a fresh date for each event to ensure it's correct */}
                          {locale === 'ku' 
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
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );

  // Create a dual calendar display component
  const DualKurdishCalendarDisplay = () => {
    // Get current date in both calendar systems
    const today = new Date();
    const rojhalatDate = getKurdishDate(today);
    
    // Format the current date for display
    const formattedKurdishDay = format(today, "EEEE");
    const localizedKurdishDay = getLocalizedDayName(formattedKurdishDay, locale);
    
    return (
      <div className="mb-6 overflow-hidden">
        <Card className="border shadow-sm overflow-hidden relative bg-gradient-to-r from-background to-muted/20">
          <CardContent className="p-0">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-primary"></div>
              <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-primary"></div>
            </div>
            
            <div className="relative p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              {/* Current Day Info */}
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 rounded-lg p-2.5 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">
                    {format(today, "d MMMM yyyy")}
                  </h3>
                  <p className="text-muted-foreground">
                    {localizedKurdishDay}
                  </p>
                </div>
              </div>

              {/* Kurdish Calendar Systems */}
              <div className="w-full sm:w-auto flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Rojhalat Date */}
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/70 text-amber-900 px-3 py-2 rounded-lg">
                    <div className="flex items-center justify-center bg-amber-500/90 text-white rounded-full w-7 h-7">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-700">ڕۆژهەڵات</p>
                      <p className="font-semibold">{rojhalatDate.kurdishDay} {rojhalatDate.kurdishMonth} {rojhalatDate.kurdishYear}</p>
                    </div>
                  </div>

                  {/* Bashur Date */}
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-900 px-3 py-2 rounded-lg">
                    <div className="flex items-center justify-center bg-emerald-500/90 text-white rounded-full w-7 h-7">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700">باشوور</p>
                      <p className="font-semibold">{KurdishMonthBashur[today.getMonth()]} {today.getDate()} {today.getFullYear()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto">
      {/* Add dual calendar display for Kurdish language only */}
      {locale === 'ku' && <DualKurdishCalendarDisplay />}
      
      <Card className="border shadow-sm">
        <CardContent className="p-0 pb-4">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </CardContent>
      </Card>

      {/* The rest of the calendar UI... */}
      
      {/* Mobile view */}
      <div className="block md:hidden mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t("events.eventsOfTheDay")}
          </h2>
          {locale === 'ku' && (
            <div className={`inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
              useRojhalatMonths 
                ? "bg-amber-100 text-amber-800 border border-amber-200" 
                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
            }`}>
              <span className="mr-1">{useRojhalatMonths ? "ڕ" : "ب"}</span>
              {formatDate(selectedDate, "MMM d")}
            </div>
          )}
        </div>
        <EventList events={selectedDateEvents} title="" />
      </div>

      {/* Desktop/Tablet view */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 lg:col-span-2">
          <EventList events={currentMonthEvents} title={t("events.eventsThisMonth")} />
        </div>
        <div className="col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t("events.eventsOfTheDay")}
            </h2>
            {locale === 'ku' && (
              <div className={`inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
                useRojhalatMonths 
                  ? "bg-amber-100 text-amber-800 border border-amber-200" 
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
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
