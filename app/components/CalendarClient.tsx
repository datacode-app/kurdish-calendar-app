/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

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
}

interface CalendarProps {
  locale: string;
}

export default function CalendarClient({ locale }: CalendarProps) {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentEvents, setCurrentEvents] = useState<Holiday[]>([]);
  const [showEventSheet, setShowEventSheet] = useState(false);

  useEffect(() => {
    // Fetch holidays data
    fetch('/data/holidays.json')
      .then(response => response.json())
      .then(data => {
        setHolidays(data.holidays);
      })
      .catch(error => console.error('Error loading holidays:', error));
  }, []);

  useEffect(() => {
    // Filter events for the selected date
    const events = holidays.filter(holiday => 
      isSameDay(new Date(holiday.date), selectedDate)
    );
    setCurrentEvents(events);
  }, [selectedDate, holidays]);

  // Helper function to get localized text based on locale
  const getLocalizedText = (textObj: { [key: string]: string } | undefined, defaultText: string = ''): string => {
    if (!textObj) return defaultText;
    // Use the current locale if available, otherwise fall back to English
    return textObj[locale as keyof typeof textObj] || textObj.en || defaultText;
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    // On mobile, show the event sheet when a date is clicked
    if (window.innerWidth < 1024) {
      setShowEventSheet(true);
    }
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between py-3 md:py-4 px-3 md:px-6 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevMonth}
          className="hover:bg-background-100"
        >
          <ChevronLeft className="h-4 md:h-5 w-4 md:w-5" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="text-base md:text-lg font-medium">
          {format(currentDate, dateFormat)}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="hover:bg-background-100"
        >
          <ChevronRight className="h-4 md:h-5 w-4 md:w-5" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEE";
    
    const startDate = startOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      const dayName = format(addDays(startDate, i), dateFormat);
      const dayKey = dayName.toLowerCase();
      
      // Get abbreviated day name for mobile
      const shortDayName = format(addDays(startDate, i), "E");
      const shortDayKey = shortDayName.toLowerCase();
      
      days.push(
        <div className="text-center py-2 font-medium text-sm text-muted-foreground" key={i}>
          <span className="hidden md:inline">
            {t(`days.${dayKey.substring(0, dayKey.length > 9 ? 9 : dayKey.length)}`)}
          </span>
          <span className="md:hidden">
            {t(`days.${shortDayKey}`)}
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
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Check if there's a holiday on this day
        const dayHolidays = holidays.filter(holiday => isSameDay(new Date(holiday.date), day));
        const hasHoliday = dayHolidays.length > 0;

        days.push(
          <div
            className={`min-h-[50px] md:min-h-[80px] p-1 md:p-2 border ${
              !isSameMonth(day, monthStart)
                ? "bg-muted/50 text-muted-foreground"
                : ""
            } ${
              isSameDay(day, selectedDate)
                ? "bg-primary/10 border-primary/20"
                : ""
            } ${
              hasHoliday
                ? "border-l-4 border-l-red-500"
                : ""
            } relative group cursor-pointer transition-colors hover:bg-muted/30`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between">
              <span
                className={`text-sm w-6 h-6 md:w-7 md:h-7 flex items-center justify-center ${
                  isSameDay(day, new Date())
                    ? "bg-primary text-primary-foreground rounded-full"
                    : isSameMonth(day, monthStart)
                    ? ""
                    : "text-muted-foreground"
                }`}
              >
                {formattedDate}
              </span>
              {hasHoliday && (
                <span className="text-[10px] md:text-xs text-red-500 font-medium">
                  <span className="hidden md:inline">{t('events.holiday')}</span>
                  <span className="md:hidden">•</span>
                </span>
              )}
            </div>
            
            {hasHoliday && (
              <div className="mt-1 space-y-1">
                {/* Only show on larger screens */}
                <div className="hidden md:block">
                  {dayHolidays.slice(0, 1).map((holiday, index) => (
                    <HoverCard key={index} openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="text-xs truncate text-muted-foreground">
                          {getLocalizedText(holiday.event)}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div>
                          <h4 className="text-sm font-semibold">{getLocalizedText(holiday.event)}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(holiday.date), "MMMM d, yyyy")}
                          </p>
                          {holiday.note && getLocalizedText(holiday.note) && (
                            <p className="mt-2 text-xs">
                              {getLocalizedText(holiday.note)}
                            </p>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                  
                  {dayHolidays.length > 1 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayHolidays.length - 1} {t('events.more')}
                    </div>
                  )}
                </div>
                
                {/* Just indicate events on mobile */}
                <div className="md:hidden">
                  {dayHolidays.length > 0 && (
                    <div className="flex justify-center">
                      <div className="bg-red-500/10 rounded-full w-1.5 h-1.5"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div>{rows}</div>;
  };

  const renderEvents = () => {
    if (currentEvents.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          {t('events.noEvents')}
        </div>
      );
    }

    return (
      <div className="divide-y">
        {currentEvents.map((event, index) => (
          <div key={index} className="p-4">
            <h3 className="text-lg font-medium">{getLocalizedText(event.event)}</h3>
            <p className="text-sm text-muted-foreground">{format(new Date(event.date), "MMMM d, yyyy")}</p>
            {event.note && getLocalizedText(event.note) && (
              <p className="mt-2 text-sm">
                <span className="font-medium">{t('events.note')}:</span> {getLocalizedText(event.note)}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMobileEventSheet = () => {
    return (
      <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="text-lg">{t('events.title')}</SheetTitle>
            <SheetDescription>
              {format(selectedDate, "MMMM d, yyyy")}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto max-h-[calc(85vh-100px)]">
            {renderEvents()}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{t('nav.calendar')}</CardTitle>
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
                className="h-8 gap-1"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{t('calendar.today')}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </CardContent>
        </Card>
        
        {/* Only visible on desktop */}
        <Card className="w-full lg:w-1/3 hidden lg:block">
          <CardHeader>
            <CardTitle>{t('events.title')}</CardTitle>
            <CardDescription>
              {format(selectedDate, "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {renderEvents()}
          </CardContent>
        </Card>
      </div>
      
      {/* Mobile event sheet */}
      {renderMobileEventSheet()}
      
      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          onClick={() => setShowEventSheet(true)}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
} 