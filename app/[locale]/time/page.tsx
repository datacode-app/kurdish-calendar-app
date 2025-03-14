import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import CityTime from '@/components/CityTime';
import { kurdistanCities } from '@/lib/cities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from "../../../app/components/Navigation";

export default async function TimePage({ 
  params 
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('time');
  
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
                <div key={city.id} className="flex flex-col">
                  <CityTime city={city} locale={locale} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 