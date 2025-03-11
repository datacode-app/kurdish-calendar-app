/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define types outside component
type LocalizedText = {
  en: string;
  ku: string;
  ar: string;
  fa: string;
};

interface CityTime {
  city: LocalizedText;
  country: LocalizedText;
  timeZone: string;
}

// Define constants outside component
const CITIES: readonly CityTime[] = [
  {
    city: { en: 'Erbil', ku: 'هەولێر', ar: 'أربيل', fa: 'اربیل' },
    country: { en: 'Iraq', ku: 'عێراق', ar: 'العراق', fa: 'عراق' },
    timeZone: 'Asia/Baghdad',
  },
  {
    city: { en: 'Mahabad', ku: 'مەهاباد', ar: 'مهاباد', fa: 'مهاباد' },
    country: { en: 'Iran', ku: 'ئێران', ar: 'إيران', fa: 'ایران' },
    timeZone: 'Asia/Tehran',
  },
  {
    city: { en: 'Van', ku: 'وان', ar: 'فان', fa: 'وان' },
    country: { en: 'Turkey', ku: 'تورکیا', ar: 'تركيا', fa: 'ترکیه' },
    timeZone: 'Europe/Istanbul',
  },
  {
    city: { en: 'Qamishli', ku: 'قامیشلۆ', ar: 'القامشلي', fa: 'قامشلی' },
    country: { en: 'Syria', ku: 'سووریا', ar: 'سوريا', fa: 'سوریه' },
    timeZone: 'Asia/Damascus',
  },
] as const;

// Define regional names as a static lookup object
const REGIONAL_NAMES: Readonly<Record<string, LocalizedText>> = {
  Iran: { en: 'Rojhalat', ku: 'ڕۆژهەڵات', ar: 'روجهلات', fa: 'روژهلات' },
  Iraq: { en: 'Bashur', ku: 'باشوور', ar: 'باشور', fa: 'باشور' },
  Turkey: { en: 'Bakur', ku: 'باکوور', ar: 'باكور', fa: 'باکور' },
  Syria: { en: 'Rojava', ku: 'ڕۆژئاوا', ar: 'روجافا', fa: 'روژاوا' },
};

interface CityTimeDisplayProps {
  locale: string;
}

interface TimeData {
  time: string;
  date: string;
}

export default function CityTimeDisplay({ locale }: CityTimeDisplayProps) {
  const t = useTranslations();
  
  // Use more efficient state structure with individual city data
  const [cityData, setCityData] = useState<Record<string, TimeData>>({});

  // Memoize formatters to prevent recreation
  const formatters = useMemo(() => {
    const options = CITIES.reduce<Record<string, { 
      timeFormatter: Intl.DateTimeFormat; 
      dateFormatter: Intl.DateTimeFormat;
    }>>((acc, { timeZone }) => {
      acc[timeZone] = {
        timeFormatter: new Intl.DateTimeFormat(locale, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone,
          hour12: false,
        }),
        dateFormatter: new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone,
        }),
      };
      return acc;
    }, {});
    
    return options;
  }, [locale]);

  // Memoize text localization function
  const getLocalizedText = useCallback(
    (textObj: LocalizedText, isCountry = false): string => {
      if (isCountry && REGIONAL_NAMES[textObj.en]) {
        return REGIONAL_NAMES[textObj.en][locale as keyof LocalizedText] || 
               REGIONAL_NAMES[textObj.en].en;
      }
      return textObj[locale as keyof LocalizedText] || textObj.en;
    },
    [locale]
  );

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      // Use functional state update to avoid closure issues
      setCityData(prevData => {
        const newData: Record<string, TimeData> = {};
        
        CITIES.forEach(({ timeZone }) => {
          const { timeFormatter, dateFormatter } = formatters[timeZone];
          newData[timeZone] = {
            time: timeFormatter.format(now),
            date: dateFormatter.format(now)
          };
        });
        
        return newData;
      });
    };

    // Run update immediately
    updateTimes();
    
    // Set interval for updates
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [formatters]);

  // Extract city card to a separate memoized component
  const CityCard = useCallback(({ city, index }: { city: CityTime; index: number }) => {
    const data = cityData[city.timeZone] || { time: '--:--:--', date: '---' };
    
    return (
      <div
        key={index}
        className="border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
      >
        <div className="text-lg font-semibold">
          {getLocalizedText(city.city)}
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {getLocalizedText(city.country, true)}
        </div>
        <div className="text-2xl font-bold my-4 font-mono">
          {data.time}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {data.date}
        </div>
      </div>
    );
  }, [cityData, getLocalizedText]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{t('time.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CITIES.map((city, index) => (
            <CityCard key={city.timeZone} city={city} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}