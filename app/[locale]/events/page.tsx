import { useTranslations } from 'next-intl';
import Navigation from '../../components/Navigation';
import EventsListClient from '../../components/EventsListClient';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  
  return {
    title: t('title'),
  };
}

export default async function EventsPage({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <EventsList locale={locale} />
      </div>
    </main>
  );
}

function EventsList({ locale }: { locale: string }) {
  const t = useTranslations();
  
  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>{t('events.title')}</CardTitle>
        <CardDescription>
          {t('app.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EventsListClient locale={locale} />
      </CardContent>
    </Card>
  );
} 