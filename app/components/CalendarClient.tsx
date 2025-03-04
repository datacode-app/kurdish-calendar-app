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

  return (
    <section className="flex flex-col md:flex-row gap-6" aria-label="Kurdish Calendar">
      <Card className="flex-1 overflow-hidden shadow-md border-muted/50">
        <CardHeader className="pb-4 bg-card">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl tracking-tight">{t("nav.calendar")}</CardTitle>
            <Button
              onClick={() => setCurrentDate(new Date())}
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-full border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label={t("calendar.today")}
            >
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium">{t("calendar.today")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-card shadow-sm" role="navigation" aria-label="Calendar navigation">
            {renderHeader()}
          </div>
          <div className="bg-muted/10" role="row">
            {renderDays()}
          </div>
          <div className="border-t border-muted/30" role="grid" aria-label="Calendar dates">
            {renderCells()}
          </div>
        </CardContent>
      </Card>

      {/* Desktop and Tablet Events Panel */}
      <aside className="hidden md:flex flex-col gap-6 w-full md:w-80 lg:w-96" aria-label="Calendar events">
        <Card className="shadow-md border-muted/50">
          <CardHeader className="pb-3 bg-card">
            <CardTitle className="text-lg tracking-tight">{formatDate(selectedDate, "MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <EventList
              events={selectedDateEvents}
              title={t("events.todayEvents")}
            />
          </CardContent>
        </Card>

        <Card className="shadow-md border-muted/50">
          <CardHeader className="pb-3 bg-card">
            <CardTitle className="text-lg tracking-tight">{formatDate(currentDate, "MMMM yyyy")}</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <EventList
              events={currentMonthEvents}
              title={t("events.monthEvents")}
            />
          </CardContent>
        </Card>
      </aside>

      {/* Mobile Event Sheet */}
      <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl border-t-0 shadow-2xl" role="dialog" aria-label="Event details">
          <SheetHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <div>
                <SheetTitle className="text-xl tracking-tight">{formatDate(selectedDate, "MMMM d, yyyy")}</SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(selectedDate, "EEEE")}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEventSheet(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close event details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </SheetHeader>
          <div className="mt-6 space-y-8 pb-8">
            <div className="bg-muted/10 p-5 rounded-lg border border-muted/30">
              <EventList
                events={selectedDateEvents}
                title={t("events.todayEvents")}
              />
            </div>
            
            <div className="bg-muted/10 p-5 rounded-lg border border-muted/30">
              <EventList
                events={currentMonthEvents}
                title={t("events.monthEvents")}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
