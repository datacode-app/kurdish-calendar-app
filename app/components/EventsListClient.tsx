'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
// import { format } from 'date-fns';
import { Calendar as CalendarIcon, Star, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {  getKurdishCountryName } from '@/lib/date-utils';
import { getFontClass } from '@/lib/utils';

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
  isHoliday: boolean;
}

export default function EventsListClient({ locale }: { locale: string }) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch holidays data once on mount.
  useEffect(() => {
    fetch('/data/holidays.json')
      .then(response => response.json())
      .then(data => {
        const sortedHolidays = Array.isArray(data)
          ? [...data].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
          : [...(data.holidays || [])].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        setHolidays(sortedHolidays);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading holidays:', error);
        setLoading(false);
      });
  }, []);

  // Memoize helper to get localized text.
  const getLocalizedText = useCallback(
    (
      textObj: { [key: string]: string } | undefined,
      defaultText: string = ''
    ): string => {
      if (!textObj) return defaultText;
      return textObj[locale] || textObj.en || defaultText;
    },
    [locale]
  );

  // Memoize date formatting function.
  const formatLocalizedDate = useCallback(
    (date: Date, formatStr: string, includeDay: boolean = true): string => {
      try {
        let options: Intl.DateTimeFormatOptions = { year: 'numeric' };
        if (includeDay) options.day = 'numeric';
        if (formatStr.includes('MMMM')) {
          options.month = 'long';
        } else if (formatStr.includes('MMM')) {
          options.month = 'short';
        } else if (formatStr.includes('MM')) {
          options.month = 'numeric';
        }
        return new Intl.DateTimeFormat(locale, options).format(date);
      } catch (error) {
        console.error('Error formatting date:', error);
        return date.toLocaleDateString(locale);
      }
    },
    [locale]
  );

  // Group holidays by month and year using useMemo.
  const groupedHolidays = useMemo(() => {
    return holidays.reduce((groups: Record<string, Holiday[]>, holiday) => {
      const holidayDate = new Date(holiday.date);
      const monthYear = formatLocalizedDate(holidayDate, 'MMMM yyyy', false);
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(holiday);
      return groups;
    }, {} as Record<string, Holiday[]>);
  }, [holidays, formatLocalizedDate]);

  // Sorted month-year keys.
  const sortedMonthYears = useMemo(() => {
    return Object.keys(groupedHolidays).sort((a, b) => {
      const firstHolidayA = groupedHolidays[a][0];
      const firstHolidayB = groupedHolidays[b][0];
      return new Date(firstHolidayA.date).getTime() - new Date(firstHolidayB.date).getTime();
    });
  }, [groupedHolidays]);

  if (loading) {
    return (
      <div className="px-4 py-5 sm:p-6 text-center">
        <div className="animate-pulse flex flex-col space-y-4 items-center">
          <div className="rounded-full bg-muted h-12 w-12"></div>
          <div className="space-y-4 py-1 w-full max-w-md">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 ${getFontClass(locale)}`}>
      {sortedMonthYears.map(monthYear => (
        <div key={monthYear} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b pb-2">
            {monthYear}
          </h2>
          <div className="space-y-4">
            {groupedHolidays[monthYear].map((holiday, index) => (
              <Card 
                key={index} 
                className={`overflow-hidden hover:shadow-md transition-shadow group
                  ${holiday.isHoliday 
                    ? 'bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-800/30 hover:bg-red-100/80 dark:hover:bg-red-950/30'
                    : 'bg-card border-border hover:bg-accent/50'
                  }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="relative">
                      <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full 
                        ${holiday.isHoliday
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-2 ring-red-200 dark:ring-red-800/30'
                          : 'bg-primary/10 text-primary'
                        } transition-all duration-200 ease-in-out group-hover:scale-105`}>
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      {holiday.isHoliday && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                          <Star className="w-5 h-5 text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base font-medium break-words
                            ${holiday.isHoliday
                              ? 'text-red-700 dark:text-red-400'
                              : 'text-foreground'
                            }`}>
                            {getLocalizedText(holiday.event)}
                          </h3>
                          {holiday.isHoliday && (
                            <Gift className="w-4 h-4 text-red-500 dark:text-red-400" />
                          )}
                        </div>
                        <time className={`text-sm whitespace-nowrap
                          ${holiday.isHoliday 
                            ? 'text-red-600/80 dark:text-red-400/80' 
                            : 'text-muted-foreground'}`}>
                          {formatLocalizedDate(new Date(holiday.date), 'MMMM d, yyyy', true)}
                        </time>
                      </div>
                      {holiday.country && (
                        <div className="mt-1">
                          <Badge variant={holiday.isHoliday ? "destructive" : "outline"} className="text-xs">
                            {locale === 'ku'
                              ? getKurdishCountryName(holiday.country)
                              : holiday.country}
                          </Badge>
                          {holiday.region && (
                            <Badge variant={holiday.isHoliday ? "destructive" : "outline"} className="text-xs ml-2">
                              {holiday.region}
                            </Badge>
                          )}
                        </div>
                      )}
                      {holiday.note && getLocalizedText(holiday.note) && (
                        <p className={`mt-2 text-sm break-words
                          ${holiday.isHoliday 
                            ? 'text-red-600/80 dark:text-red-400/80' 
                            : 'text-muted-foreground'}`}>
                          {getLocalizedText(holiday.note)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
