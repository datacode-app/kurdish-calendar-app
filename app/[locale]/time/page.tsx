import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import CityTime from '@/components/CityTime';
import { getKurdishDate } from '@/lib/getKurdishDate';
import { kurdistanCities } from '@/lib/cities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from "../../../app/components/Navigation";
import { Calendar } from 'lucide-react';

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
  
  const getModernLinkText = () => {
    switch (locale) {
      case 'ku':
        return 'بینینی دیزاینی نوێ';
      case 'ar':
        return 'عرض التصميم الحديث';
      case 'fa':
        return 'مشاهده طراحی مدرن';
      default:
        return 'View Modern Design';
    }
  };
  
  const getKurdishCitiesLinkText = () => {
    switch (locale) {
      case 'ku':
        return 'شارەکانی کوردستان';
      case 'ar':
        return 'المدن الكردية';
      case 'fa':
        return 'شهرهای کردستان';
      case 'tr':
        return 'Kürt Şehirleri';
      default:
        return 'Kurdish Cities';
    }
  };
  
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kurdistanCities.map((city) => (
                <div key={city.id} className="flex flex-col space-y-4">
                  <CityTime city={city} locale={locale} />
                  <div className="text-xs text-muted-foreground text-center">
                    {locale === 'ku' ? 'کاتی کوردی' : 'Kurdish Date'}:
                    <div className={`font-medium mt-1 ${holidayInfo.isHoliday ? 'text-red-500 dark:text-red-400' : ''}`}>
                      {city.timezone === 'Asia/Tehran' 
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