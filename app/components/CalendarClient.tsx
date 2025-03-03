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

export default function CalendarClient({ locale }: CalendarProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Holiday[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Holiday[]>([]);
  const [showEventSheet, setShowEventSheet] = useState(false);

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

  const formatDate = (date: Date, formatStr: string) => {
    const formatted = format(date, formatStr);
    
    if (locale !== 'en') {
      if (formatStr === 'EEEE' || formatStr === 'EEE') {
        return getLocalizedDayName(formatted, locale);
      }
      if (formatStr === 'MMMM yyyy') {
        const [month, year] = formatted.split(' ');
        return `${getLocalizedMonthName(month, locale)} ${year}`;
      }
      if (formatStr === 'MMMM d, yyyy') {
        const [month, rest] = formatted.split(' ');
        return `${getLocalizedMonthName(month, locale)} ${rest}`;
      }
      if (formatStr === 'MMM d') {
        const [month, day] = formatted.split(' ');
        return `${getLocalizedMonthName(month, locale)} ${day}`;
      }
    }
    
    return formatted;
  };

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
      <h2 className="text-xl font-semibold">
        {formatDate(currentDate, "MMMM yyyy")}
      </h2>
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
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center py-3 text-sm font-medium text-muted-foreground"
        >
          <span className="hidden md:inline">
            {formatDate(addDays(startDate, i), dateFormat)}
          </span>
          <span className="md:hidden">
            {formatDate(addDays(startDate, i), "EEE")}
          </span>
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
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
        const hasEvents =
          Array.isArray(holidays) &&
          holidays.some((holiday) => isSameDay(new Date(holiday.date), day));

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-24 p-1 transition-colors hover:bg-accent/50 cursor-pointer",
              !isSameMonth(day, monthStart) &&
                "text-muted-foreground bg-muted/30",
              isSameDay(day, selectedDate) && "bg-accent"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                isToday(day) &&
                  "bg-primary text-primary-foreground font-semibold",
                hasEvents && !isToday(day) && "text-destructive font-medium",
                isSameDay(day, selectedDate) && !isToday(day) && "font-medium"
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          key={day.toString()}
          className="grid grid-cols-7 divide-x divide-y"
        >
          {days}
        </div>
      );
      days = [];
    }
    return <div className="divide-y">{rows}</div>;
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
          <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">{t("events.noEvents")}</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {events.map((event, index) => (
              <Card key={index} className="bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="p-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-base tracking-tight">
                          {getLocalizedText(event.event)}
                        </h4>
                        {event.country && (
                          <div className="flex items-center mt-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary/70 mr-2"></span>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'ku' ? getKurdishCountryName(event.country) : event.country}
                            </p>
                          </div>
                        )}
                      </div>
                      <time className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                        {formatDate(new Date(event.date), "MMM d")}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="flex-1 overflow-hidden shadow-md border-muted/50">
        <CardHeader className="pb-4 bg-card">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl tracking-tight">{t("nav.calendar")}</CardTitle>
            <Button
              onClick={() => setCurrentDate(new Date())}
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-full border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{t("calendar.today")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-card shadow-sm">
            {renderHeader()}
          </div>
          <div className="bg-muted/10">
            {renderDays()}
          </div>
          <div className="border-t border-muted/30">
            {renderCells()}
          </div>
        </CardContent>
      </Card>

      {/* Desktop and Tablet Events Panel */}
      <div className="hidden md:flex flex-col gap-6 w-full md:w-80 lg:w-96">
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
      </div>

      {/* Mobile Event Sheet */}
      <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl border-t-0 shadow-2xl">
          <SheetHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl tracking-tight">{formatDate(selectedDate, "MMMM d, yyyy")}</SheetTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEventSheet(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}
