import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getKurdishDate } from '@/lib/getKurdishDate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navigation from "@/app/components/Navigation";
import { Calendar } from 'lucide-react';
import AnalogClock, { ClockSize } from '@/app/components/AnalogClock';

interface Holiday {
  date: string;
  event: {
    en: string;
    ku: string;
    ar: string;
    fa: string;
  };
  note: {
    en: string;
    ku: string;
    ar: string;
    fa: string;
  };
  quote: {
    celebrity: string;
    quote: {
      en: string;
      ku: string;
      ar: string;
      fa: string;
    };
  };
}

interface HolidaysData {
  holidays: Holiday[];
}

const regions = [
  {
    name: 'rojhalat',
    timezone: 'Asia/Tehran',
    title: {
      en: 'Rojhalat',
      ku: 'روژهالات',
      ar: 'روژهالات',
      fa: 'روژهالات'
    }
  },
  {
    name: 'bashur',
    timezone: 'Asia/Baghdad',
    title: {
      en: 'Bashur',
      ku: 'باشوور',
      ar: 'باشور',
      fa: 'باشور'
    }
  },
  {
    name: 'bakur',
    timezone: 'Europe/Istanbul',
    title: {
      en: 'Bakur',
      ku: 'باکوور',
      ar: 'باكور',
      fa: 'باکور'
    }
  },
  {
    name: 'rojava',
    timezone: 'Asia/Damascus',
    title: {
      en: 'Rojava',
      ku: 'روژیوا',
      ar: 'روژیوا',
      fa: 'روژیوا'
    }
  }
];

// Function to check if a date is a holiday
async function isHoliday(date: Date): Promise<{ isHoliday: boolean; eventName?: { [key: string]: string } }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/data/holidays.json`);
    const data: HolidaysData = await response.json();
    
    const dateStr = date.toISOString().split('T')[0];
    const holiday = data.holidays.find((h: Holiday) => h.date === dateStr);
    
    if (holiday) {
      return { isHoliday: true, eventName: holiday.event };
    }
    
    return { isHoliday: false };
  } catch (error) {
    console.error('Error checking holiday:', error);
    return { isHoliday: false };
  }
}

export default async function TimePage({ 
  params 
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('time');
  const today = new Date();
  const holidayInfo = await isHoliday(today);
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <CardTitle className="text-center md:text-left text-3xl font-bold">
                  {t('title')}
                </CardTitle>
                <CardDescription className="text-center md:text-left">
                  {t('subtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.map((region) => (
                <div key={region.name} className="flex flex-col items-center space-y-4 p-6 bg-white/5 dark:bg-gray-800/5 rounded-2xl backdrop-blur-sm border border-white/10 dark:border-gray-700/10">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-kurdish">
                    {region.title[locale as keyof typeof region.title] || region.title.en}
                  </h3>
                  
                  <AnalogClock timezone={region.timezone} size={'lg' as ClockSize} />
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-kurdish">
                    <div className={`font-medium ${holidayInfo.isHoliday ? 'text-red-500 dark:text-red-400' : ''}`}>
                      {region.timezone === 'Asia/Tehran' 
                        ? (locale === 'ku' ? getKurdishDate(new Date()).kurdishDate : getKurdishDate(new Date()).kurdishDateLatin)
                        : locale === 'ku' 
                          ? `${new Date().getDate()} ئازار ${new Date().getFullYear()}`
                          : `${new Date().getDate()} Azar ${new Date().getFullYear()}`
                      }
                    </div>
                    {holidayInfo.isHoliday && (
                      <div className="mt-1 flex items-center justify-center gap-1 text-red-500 dark:text-red-400">
                        <Calendar className="h-3 w-3" />
                        <span>{holidayInfo.eventName?.[locale as keyof typeof holidayInfo.eventName] || holidayInfo.eventName?.en}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 