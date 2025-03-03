'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
        // Sort holidays by date (newest first)
        const sortedHolidays = Array.isArray(data) 
          ? [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          : [...(data.holidays || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
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
    <div className="space-y-4">
      {holidays.map((holiday, index) => (
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
                    {format(new Date(holiday.date), "MMMM d, yyyy")}
                  </time>
                </div>
                
                {holiday.country && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {holiday.country}
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
  );
} 