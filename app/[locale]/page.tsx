import Navigation from '../components/Navigation';
import Calendar from '../components/Calendar';
import CityTimeDisplay from '../components/CityTimeDisplay';
import Quotes from '../components/Quotes';
import MultiCalendarDisplay from '../components/MultiCalendarDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'app' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen">
      <Navigation />
       {/* Multi-Calendar Display Section */}
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
       <section className="py-4">
          <MultiCalendarDisplay locale={locale} />
        </section>
           {/* City Times Section */}
        <div className="mx-auto">
          <CityTimeDisplay locale={locale} />
        </div>
        {/* Calendar Section */}
        <Card className="mx-auto">
          <CardContent className="p-4 md:p-6">
            <Calendar locale={locale} />
          </CardContent>
        </Card>
        
       
        
        {/* Quotes Section */}
        <section className="py-4">
          <Quotes locale={locale} />
        </section>
        
     
      </div>
    </main>
  );
} 