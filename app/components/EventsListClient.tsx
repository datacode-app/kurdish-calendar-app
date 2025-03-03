'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getLocalizedMonthName, getKurdishCountryName } from '@/lib/date-utils';

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

export default function EventsListClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch holidays data
    fetch('/data/holidays.json')
      .then(response => response.json())
      .then(data => {
        // Sort holidays by date (oldest first - chronological order)
        const sortedHolidays = Array.isArray(data) 
          ? [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          : [...(data.holidays || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setHolidays(sortedHolidays);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading holidays:', error);
        setLoading(false);
      });
  }, []);

  // Helper function to get localized text based on locale
  const getLocalizedText = (textObj: { [key: string]: string } | undefined, defaultText: string = ''): string => {
    if (!textObj) return defaultText;
    // Use the current locale if available, otherwise fall back to English
    return textObj[locale as keyof typeof textObj] || textObj.en || defaultText;
  };

  // Format date with localized month names
  const formatLocalizedDate = (date: Date, formatStr: string): string => {
    const formatted = format(date, formatStr);
    
    if (locale !== 'en' && formatStr.includes('MMMM')) {
      if (formatStr === 'MMMM yyyy') {
        const [month, year] = formatted.split(' ');
        return `${getLocalizedMonthName(month, locale)} ${year}`;
      }
      
      if (formatStr === 'MMMM d, yyyy') {
        const parts = formatted.split(' ');
        const month = parts[0];
        return `${getLocalizedMonthName(month, locale)} ${parts.slice(1).join(' ')}`;
      }
    }
    
    return formatted;
  };

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

  // Group holidays by month and year for better organization
  const groupedHolidays: { [key: string]: Holiday[] } = {};
  holidays.forEach(holiday => {
    const date = new Date(holiday.date);
    const monthYear = formatLocalizedDate(date, 'MMMM yyyy');
    if (!groupedHolidays[monthYear]) {
      groupedHolidays[monthYear] = [];
    }
    groupedHolidays[monthYear].push(holiday);
  });

  // Get sorted month-year keys (chronological order)
  const sortedMonthYears = Object.keys(groupedHolidays).sort((a, b) => {
    // Extract the year from the localized month-year string
    const yearA = parseInt(a.split(' ').pop() || '0');
    const yearB = parseInt(b.split(' ').pop() || '0');
    
    if (yearA !== yearB) {
      return yearA - yearB;
    }
    
    // If years are the same, we need to sort by month
    // Get the original dates from the first holiday in each group
    const firstHolidayA = groupedHolidays[a][0];
    const firstHolidayB = groupedHolidays[b][0];
    
    return new Date(firstHolidayA.date).getTime() - new Date(firstHolidayB.date).getTime();
  });

  return (
    <div className="space-y-8">
      {sortedMonthYears.map(monthYear => (
        <div key={monthYear} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b pb-2">{monthYear}</h2>
          
          <div className="space-y-4">
            {groupedHolidays[monthYear].map((holiday, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                      <CalendarIcon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-base font-medium text-foreground break-words">
                          {getLocalizedText(holiday.event)}
                        </h3>
                        <time className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatLocalizedDate(new Date(holiday.date), "MMMM d, yyyy")}
                        </time>
                      </div>
                      
                      {holiday.country && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {locale === 'ku' ? getKurdishCountryName(holiday.country) : holiday.country}
                          </Badge>
                          {holiday.region && (
                            <Badge variant="outline" className="text-xs ml-2">
                              {holiday.region}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {holiday.note && getLocalizedText(holiday.note) && (
                        <p className="mt-2 text-sm text-muted-foreground break-words">
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