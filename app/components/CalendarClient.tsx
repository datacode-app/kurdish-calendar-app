/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Holiday {
  date: string;
  event: string;
  note?: string;
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

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
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
      <div className="flex items-center justify-between py-4 px-6 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevMonth}
          className="hover:bg-background-100"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="text-lg font-medium">
          {format(currentDate, dateFormat)}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="hover:bg-background-100"
        >
          <ChevronRight className="h-5 w-5" />
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
      days.push(
        <div className="text-center py-2 font-medium text-sm text-muted-foreground" key={i}>
          {t(`days.${dayKey.substring(0, dayKey.length > 9 ? 9 : dayKey.length)}`)}
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
            className={`min-h-[80px] p-2 border ${
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
                className={`text-sm w-7 h-7 flex items-center justify-center ${
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
                <span className="text-xs text-red-500 font-medium">
                  {t('events.holiday')}
                </span>
              )}
            </div>
            
            {hasHoliday && (
              <div className="mt-1 space-y-1">
                {dayHolidays.slice(0, 1).map((holiday, index) => (
                  <HoverCard key={index} openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="text-xs truncate text-muted-foreground">
                        {holiday.event}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div>
                        <h4 className="text-sm font-semibold">{holiday.event}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(holiday.date), "MMMM d, yyyy")}
                        </p>
                        {holiday.note && (
                          <p className="mt-2 text-xs">
                            {holiday.note}
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
            <h3 className="text-lg font-medium">{event.event}</h3>
            <p className="text-sm text-muted-foreground">{format(new Date(event.date), "MMMM d, yyyy")}</p>
            {event.note && (
              <p className="mt-2 text-sm">
                <span className="font-medium">{t('events.note')}:</span> {event.note}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
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
      
      <Card className="w-full lg:w-1/3">
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
  );
} 