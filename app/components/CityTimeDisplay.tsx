/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getKurdishDate, KurdishMonthSorani, KurdishMonthLatin } from '@/lib/getKurdishDate';

type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Kurdish months for Rojhalat (Persian calendar) in Kurdish script
const ROJHALAT_MONTHS_KU: Record<MonthNumber, string> = {
  1: KurdishMonthSorani.XAKELIWE,
  2: KurdishMonthSorani.GULAN,
  3: KurdishMonthSorani.COZERDAN,
  4: KurdishMonthSorani.PUSHPER,
  5: KurdishMonthSorani.GELAWEJ,
  6: KurdishMonthSorani.XERMANAN,
  7: KurdishMonthSorani.REZBER,
  8: KurdishMonthSorani.GELAREZAN,
  9: KurdishMonthSorani.SERMAWEZ,
  10: KurdishMonthSorani.BEFRANBAR,
  11: KurdishMonthSorani.REBENDAN,
  12: KurdishMonthSorani.RESHEME
};

// Kurdish months for Rojhalat (Persian calendar) in Latin script
const ROJHALAT_MONTHS_EN: Record<MonthNumber, string> = {
  1: KurdishMonthLatin.XAKELIWE,
  2: KurdishMonthLatin.GULAN,
  3: KurdishMonthLatin.COZERDAN,
  4: KurdishMonthLatin.PUSHPER,
  5: KurdishMonthLatin.GELAWEJ,
  6: KurdishMonthLatin.XERMANAN,
  7: KurdishMonthLatin.REZBER,
  8: KurdishMonthLatin.GELAREZAN,
  9: KurdishMonthLatin.SERMAWEZ,
  10: KurdishMonthLatin.BEFRANBAR,
  11: KurdishMonthLatin.REBENDAN,
  12: KurdishMonthLatin.RESHEME
};

// Kurdish months for other regions (Gregorian-based) in Kurdish script
const BASHUR_MONTHS_KU: Record<MonthNumber, string> = {
  1: 'کانوونی دووەم',
  2: 'شوبات',
  3: 'ئازار',
  4: 'نیسان',
  5: 'مایس',
  6: 'حوزەیران',
  7: 'تەمووز',
  8: 'ئاب',
  9: 'ئەیلوول',
  10: 'تشرینی یەکەم',
  11: 'تشرینی دووەم',
  12: 'کانوونی یەکەم'
};

// Kurdish months for other regions (Gregorian-based) in Latin script
const BASHUR_MONTHS_EN: Record<MonthNumber, string> = {
  1: 'Kanûnî Dûem',
  2: 'Şûbat',
  3: 'Azar',
  4: 'Nîsan',
  5: 'Mayis',
  6: 'Huzeyran',
  7: 'Temûz',
  8: 'Ab',
  9: 'Eylûl',
  10: 'Çirîyê Yekem',
  11: 'Çirîyê Dûem',
  12: 'Kanûnî Yekem'
};

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
  selectedCity?: {
    name: {
      en: string;
      ku: string;
      ar: string;
      fa: string;
    };
    timezone: string;
    id: string;
  };
}

interface TimeData {
  time: string;
  date: string;
  kurdishDate?: string;
}

export default function CityTimeDisplay({ locale, selectedCity }: CityTimeDisplayProps) {
  const t = useTranslations();
  
  const [cityData, setCityData] = useState<Record<string, TimeData>>({});

  // Function to format Kurdish date based on region
  const formatKurdishDate = useCallback((date: Date, isRojhalat: boolean) => {
    if (isRojhalat) {
      const persianDate = getKurdishDate(date);
      return locale === 'ku' ? persianDate.kurdishDate : persianDate.kurdishDateLatin;
    } else {
      const month = ((date.getMonth() + 1) as MonthNumber);
      const monthName = locale === 'ku' ? BASHUR_MONTHS_KU[month] : BASHUR_MONTHS_EN[month];
      return `${monthName} ${date.getDate()} ${date.getFullYear()}`;
    }
  }, [locale]);

  // Memoize formatters to prevent recreation
  const formatters = useMemo(() => {
    const timeZones = selectedCity ? [selectedCity.timezone] : CITIES.map(city => city.timeZone);
    
    const options = timeZones.reduce<Record<string, { 
      timeFormatter: Intl.DateTimeFormat; 
      dateFormatter: Intl.DateTimeFormat;
    }>>((acc, timeZone) => {
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
  }, [locale, selectedCity]);

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
      
      setCityData(prevData => {
        const newData: Record<string, TimeData> = {};
        
        if (selectedCity) {
          const { timeFormatter, dateFormatter } = formatters[selectedCity.timezone];
          const isRojhalat = selectedCity.timezone === 'Asia/Tehran';
          
          newData[selectedCity.timezone] = {
            time: timeFormatter.format(now),
            date: dateFormatter.format(now),
            kurdishDate: locale === 'ku' ? formatKurdishDate(now, isRojhalat) : undefined
          };
        } else {
          CITIES.forEach((city) => {
            const { timeFormatter, dateFormatter } = formatters[city.timeZone];
            const isRojhalat = city.country.en === 'Iran';
            
            newData[city.timeZone] = {
              time: timeFormatter.format(now),
              date: dateFormatter.format(now),
              kurdishDate: locale === 'ku' ? formatKurdishDate(now, isRojhalat) : undefined
            };
          });
        }
        
        return newData;
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [formatters, formatKurdishDate, locale, selectedCity]);

  const CityCard = useCallback(({ city, index }: { city: CityTime; index: number }) => {
    const data = cityData[city.timeZone] || { time: '--:--:--', date: '---' };
    const isRojhalat = city.country.en === 'Iran';
    
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
          {formatKurdishDate(new Date(), isRojhalat)}
        </div>
      </div>
    );
  }, [cityData, getLocalizedText, formatKurdishDate]);

  if (selectedCity) {
    const data = cityData[selectedCity.timezone] || { time: '--:--:--', date: '---' };
    const isRojhalat = selectedCity.timezone === 'Asia/Tehran';
    
    return (
      <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
        <div className="text-2xl font-bold my-4 font-mono">
          {data.time}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatKurdishDate(new Date(), isRojhalat)}
        </div>
      </div>
    );
  }

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