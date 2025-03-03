/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CityTime {
  city: {
    en: string;
    ku: string;
    ar: string;
    fa: string;
  };
  country: {
    en: string;
    ku: string;
    ar: string;
    fa: string;
  };
  timeZone: string;
}

interface CityTimeDisplayProps {
  locale: string;
}

export default function CityTimeDisplay({ locale }: CityTimeDisplayProps) {
  const t = useTranslations();
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({});
  const [currentDate, setCurrentDate] = useState<{ [key: string]: string }>({});

  // Define cities with their timezones
  const cities: CityTime[] = [
    {
      city: {
        en: 'Erbil',
        ku: 'هەولێر',
        ar: 'أربيل',
        fa: 'اربیل'
      },
      country: {
        en: 'Iraq',
        ku: 'عێراق',
        ar: 'العراق',
        fa: 'عراق'
      },
      timeZone: 'Asia/Baghdad'
    },
    {
      city: {
        en: 'Mahabad',
        ku: 'مەهاباد',
        ar: 'مهاباد',
        fa: 'مهاباد'
      },
      country: {
        en: 'Iran',
        ku: 'ئێران',
        ar: 'إيران',
        fa: 'ایران'
      },
      timeZone: 'Asia/Tehran'
    },
    {
      city: {
        en: 'Van',
        ku: 'وان',
        ar: 'فان',
        fa: 'وان'
      },
      country: {
        en: 'Turkey',
        ku: 'تورکیا',
        ar: 'تركيا',
        fa: 'ترکیه'
      },
      timeZone: 'Europe/Istanbul'
    },
    {
      city: {
        en: 'Qamishli',
        ku: 'قامیشلۆ',
        ar: 'القامشلي',
        fa: 'قامشلی'
      },
      country: {
        en: 'Syria',
        ku: 'سووریا',
        ar: 'سوريا',
        fa: 'سوریه'
      },
      timeZone: 'Asia/Damascus'
    }
  ];

  // Helper function to get localized text
  const getLocalizedText = (textObj: { [key: string]: string }, isCountry: boolean = false): string => {
    if (isCountry) {
      // Map countries to their Kurdish regional names in different languages
      const regionalNames: { [key: string]: { [key: string]: string } } = {
        'Iran': {
          en: 'Rojhalat',
          ku: 'ڕۆژهەڵات',
          ar: 'روجهلات',
          fa: 'روژهلات'
        },
        'Iraq': {
          en: 'Bashur',
          ku: 'باشوور',
          ar: 'باشور',
          fa: 'باشور'
        },
        'Turkey': {
          en: 'Bakur',
          ku: 'باکوور',
          ar: 'باكور',
          fa: 'باکور'
        },
        'Syria': {
          en: 'Rojava',
          ku: 'ڕۆژئاوا',
          ar: 'روجافا',
          fa: 'روژاوا'
        }
      };
      
      const englishName = textObj.en;
      if (regionalNames[englishName]) {
        return regionalNames[englishName][locale] || regionalNames[englishName].en;
      }
    }
    return textObj[locale as keyof typeof textObj] || textObj.en;
  };

  // Update the time every second
  useEffect(() => {
    const updateTimes = () => {
      const timeObject: { [key: string]: string } = {};
      const dateObject: { [key: string]: string } = {};

      cities.forEach(city => {
        try {
          const now = new Date();
          const options: Intl.DateTimeFormatOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            timeZone: city.timeZone,
            hour12: false 
          };
          
          const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: city.timeZone
          };
          
          timeObject[city.timeZone] = new Intl.DateTimeFormat(locale, options).format(now);
          dateObject[city.timeZone] = new Intl.DateTimeFormat(locale, dateOptions).format(now);
        } catch (error) {
          console.error(`Error formatting time for ${city.timeZone}:`, error);
          timeObject[city.timeZone] = 'Error';
          dateObject[city.timeZone] = 'Error';
        }
      });

      setCurrentTimes(timeObject);
      setCurrentDate(dateObject);
    };

    // Initial update
    updateTimes();
    
    // Set up interval to update times every second
    const interval = setInterval(updateTimes, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [cities, locale]);

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
          {cities.map((city, index) => (
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
              
              {/* Time Display */}
              <div className="text-2xl font-bold my-4 font-mono">
                {currentTimes[city.timeZone] || '--:--:--'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentDate[city.timeZone] || '---'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 